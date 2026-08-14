import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { calculateDestinationMatches } from './src/services/recommendationEngine.ts';
import { CURATED_DESTINATIONS } from './src/data/curatedDestinations.ts';
import { QUIZ_STEPS } from './src/data/quizQuestions.ts';
import { QuizAnswers, RecommendationResponse, ProgressEvent } from './src/types.ts';

dotenv.config();

// Single source of truth for the model id, so both endpoints and the startup
// banner always refer to the same value.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

// The newest Flash model is the most in demand and regularly answers 503 on the
// free tier. Falling back down the family keeps the feature alive instead of
// silently dropping every user to canned copy whenever Google is busy.
// Note: gemini-2.5-flash is deliberately absent — it now 404s for new API keys.
const MODEL_CHAIN = Array.from(
  new Set([GEMINI_MODEL, 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'])
);

/**
 * Our own AbortController firing. DOMException.ABORT_ERR is code 20, which is
 * emphatically not an HTTP status — reporting it as one made a plain timeout
 * look like a permanently broken model.
 */
function isAbort(err: any): boolean {
  return err?.name === 'AbortError' || err?.name === 'TimeoutError';
}

/** Google is momentarily busy, we are over quota, or we ran out of patience. */
function isTransient(err: any): boolean {
  if (isAbort(err)) return true;
  const status = err?.status ?? err?.code;
  return status === 503 || status === 429 || status === 500;
}

function statusOf(err: any): string {
  if (isAbort(err)) return 'timeout';
  return String(err?.status ?? err?.code ?? 'inconnu');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A model that answers 503 usually keeps doing so for a while; parking it stops
// every later request from re-paying failed attempts. A model that answers 404
// or 403 is misconfigured for this key, so it is parked far longer.
const BUSY_COOLDOWN_MS = 5 * 60 * 1000;
const BROKEN_COOLDOWN_MS = 60 * 60 * 1000;
const benchedUntil = new Map<string, number>();

function isBenched(model: string): boolean {
  const until = benchedUntil.get(model);
  if (until === undefined) return false;
  if (Date.now() >= until) {
    benchedUntil.delete(model);
    return false;
  }
  return true;
}

/**
 * Runs a Gemini call with a hard time budget, one retry on transient failures,
 * then the next model in the chain. Without this a single 503 left the caller
 * hanging on the loading screen with no explanation.
 *
 * Rejects with an error carrying `.model`, so callers can report which model
 * actually failed rather than the one they asked for.
 */
async function generateWithFallback(
  ai: GoogleGenAI,
  request: { contents: string; config: Record<string, any> },
  // Observed enrichment latency is 12-14 s, so 20 s tripped on slower runs and
  // wrongly benched a healthy model. 45 s still bounds the wait.
  timeoutMs = 45000,
  /** Lets the caller stream honest progress while models are being tried. */
  report?: { onStart?: (model: string) => void; onFallback?: (from: string, to: string, status: string) => void }
): Promise<{ text: string | undefined; model: string }> {
  let lastError: any;
  let lastModel = MODEL_CHAIN[0];

  // Prefer models that are not currently benched, but keep them as a last
  // resort so a fully benched chain still gets one honest attempt.
  const candidates = [
    ...MODEL_CHAIN.filter((m) => !isBenched(m)),
    ...MODEL_CHAIN.filter(isBenched),
  ];

  for (const [index, model] of candidates.entries()) {
    let transient = false;

    if (index === 0) report?.onStart?.(model);
    else report?.onFallback?.(candidates[index - 1], model, statusOf(lastError));

    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await ai.models.generateContent({
          model,
          contents: request.contents,
          config: { ...request.config, abortSignal: controller.signal },
        });
        benchedUntil.delete(model);
        return { text: response.text, model };
      } catch (err: any) {
        lastError = err;
        lastModel = model;
        transient = isTransient(err);
        if (!transient) break; // misconfigured for this key: move to the next model
        if (attempt === 0) await sleep(800);
      } finally {
        clearTimeout(timer);
      }
    }

    benchedUntil.set(model, Date.now() + (transient ? BUSY_COOLDOWN_MS : BROKEN_COOLDOWN_MS));
    console.warn(
      `[gemini] "${model}" failed (HTTP ${statusOf(lastError)}), benched ` +
        `${(transient ? BUSY_COOLDOWN_MS : BROKEN_COOLDOWN_MS) / 60000} min. Trying the next model.`
    );
  }

  if (lastError) lastError.model = lastModel;
  throw lastError;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  // Hosts (Cloud Run, Render, Fly…) inject the port they expect the app to
  // bind to. Hardcoding 3000 makes every one of them fail its health check.
  const PORT = Number(process.env.PORT) || 3000;

  // Serve static public assets
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  app.use(express.static(publicDir));

  app.use(express.json({ limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Main Recommendations Endpoint.
  //
  // Streams NDJSON progress events as the work actually happens, then a final
  // `result` line. The loading screen advances on these events only, so what
  // the traveller watches is the real pipeline rather than a timed carousel.
  app.post('/api/recommendations', async (req, res) => {
    const send = (event: ProgressEvent) => {
      res.write(JSON.stringify(event) + '\n');
    };

    try {
      const answers: QuizAnswers = req.body;
      if (!answers) {
        return res.status(400).json({ error: 'Quiz answers required' });
      }

      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();

      // Step 1: Algorithmic match from curated database
      send({ phase: 'scoring', poolSize: CURATED_DESTINATIONS.length, criteria: QUIZ_STEPS.length });
      const baseRecommendations = calculateDestinationMatches(answers);
      send({
        phase: 'scored',
        kept: baseRecommendations.topDestinations.length,
        topName: baseRecommendations.topDestinations[0]?.name ?? '',
      });

      // Step 2: Enrich with Gemini AI if API key is present
      const ai = getGeminiClient();
      if (!ai) {
        send({ phase: 'ai_skipped' });
        send({ phase: 'result', payload: baseRecommendations });
        return res.end();
      }

      try {
        const top3Names = baseRecommendations.topDestinations.map(d => `${d.name} (${d.country})`).join(', ');

        const prompt = `
En tant qu'expert mondial en récits de voyage et conseiller personnalisé d'exception, analyse les réponses de ce voyageur au grand quiz :
- Compagnons : ${answers.companion}
- Durée : ${answers.duration}
- Rythme : ${answers.pace}
- Climat souhaité : ${answers.climate}
- Décors naturels préférés : ${answers.landscapes.join(', ')}
- Intérêts culturels majeurs : ${answers.culturalInterests.join(', ')}
- Type d'hébergement : ${answers.accommodationStyle}
- Importance de la cuisine : ${answers.foodImportance}/5 (Saveurs : ${answers.foodFlavors.join(', ')})
- Activités favorites : ${answers.favoriteActivities.join(', ')} (Effort physique : ${answers.physicalIntensity}/5)
- Budget : ${answers.budgetTier}
- Temps de vol max : ${answers.flightMax}
- Saison envisagée : ${answers.travelSeason}
- Ambiance / Vibe recherchée : ${answers.tripVibe}
- Souhaits particuliers & notes libres : "${answers.additionalNotes || 'Aucune'}"

Les 3 meilleures destinations sélectionnées sont : ${top3Names}.

Fournis pour chacune de ces 3 destinations et pour le profil du voyageur :
1. "userProfileSummary": Un titre d'archétype captivant en français (ex: "L'Esthète Épicurien & Curieux de Nature") et une description poétique et bienveillante en 2 phrases expliquant sa vision du voyage.
2. Pour chaque destination (dans le même ordre) :
   - "whyPerfect": Une explication sur mesure (2 à 3 phrases percutantes) qui fait expressément référence aux préférences personnelles du voyageur et explique pourquoi ce lieu coche toutes ses envies.
   - "customInsiderSecret": Un secret d'initié ou un conseil confidentiel méconnu des touristes standards.
   - "customHighlight": Une expérience phare unique spécialement adaptée à son profil.
`;

        const aiResponse = await generateWithFallback(ai, {
          contents: prompt,
          config: {
            systemInstruction: 'Tu es un conseiller en voyage haute couture et écrivain passionné de géographie humaine. Rédige en français soigné, évocateur, chaleureux et précis.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                userProfileSummary: {
                  type: Type.OBJECT,
                  properties: {
                    archetypeTitle: { type: Type.STRING },
                    archetypeDesc: { type: Type.STRING },
                    dominantTraits: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['archetypeTitle', 'archetypeDesc'],
                },
                destinationsEnrichment: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      destinationId: { type: Type.STRING },
                      whyPerfect: { type: Type.STRING },
                      customInsiderSecret: { type: Type.STRING },
                      customHighlight: { type: Type.STRING },
                    },
                    required: ['whyPerfect', 'customInsiderSecret'],
                  },
                },
              },
              required: ['userProfileSummary', 'destinationsEnrichment'],
            },
          },
        }, 45000, {
          onStart: (model) => send({ phase: 'ai_start', model }),
          onFallback: (from, to, status) => send({ phase: 'ai_fallback', from, to, status }),
        });

        const rawText = aiResponse.text;
        if (rawText) {
          console.log(`[gemini] Enrichment served by "${aiResponse.model}".`);
          const parsed = JSON.parse(rawText);
          if (parsed.userProfileSummary) {
            baseRecommendations.userProfileSummary = {
              archetypeTitle: parsed.userProfileSummary.archetypeTitle || baseRecommendations.userProfileSummary.archetypeTitle,
              archetypeDesc: parsed.userProfileSummary.archetypeDesc || baseRecommendations.userProfileSummary.archetypeDesc,
              dominantTraits: parsed.userProfileSummary.dominantTraits || baseRecommendations.userProfileSummary.dominantTraits,
            };
          }

          if (Array.isArray(parsed.destinationsEnrichment)) {
            parsed.destinationsEnrichment.forEach((enrich: any, idx: number) => {
              if (baseRecommendations.topDestinations[idx]) {
                if (enrich.whyPerfect) {
                  baseRecommendations.topDestinations[idx].whyPerfect = enrich.whyPerfect;
                }
                if (enrich.customInsiderSecret) {
                  baseRecommendations.topDestinations[idx].practicalTips.insiderSecret = enrich.customInsiderSecret;
                }
                if (enrich.customHighlight) {
                  baseRecommendations.topDestinations[idx].highlights[0] = enrich.customHighlight;
                }
              }
            });
          }
          baseRecommendations.generatedWithAi = true;
          send({ phase: 'ai_done', model: aiResponse.model });
        }
      } catch (aiErr: any) {
        send({ phase: 'ai_failed', status: statusOf(aiErr) });
        // Loud on purpose: the response still succeeds with curated copy, so a
        // wrong model id or an expired key would otherwise fail invisibly and
        // the site would quietly serve canned text forever.
        console.error(
          `[gemini] Enrichment FAILED — every model in the chain refused ` +
            `(last: "${aiErr?.model ?? GEMINI_MODEL}", HTTP ${statusOf(aiErr)}). ` +
            `Serving curated copy instead.`,
          aiErr
        );
      }

      send({ phase: 'result', payload: baseRecommendations });
      return res.end();
    } catch (err: any) {
      console.error('Error generating recommendations:', err);
      // Headers are already out once streaming has begun, so the only honest
      // move left is to close the stream and let the client fall back locally.
      if (res.headersSent) return res.end();
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  // Destination AI Guide Chat
  app.post('/api/destination-chat', async (req, res) => {
    try {
      const { destinationName, country, message, history, userAnswers } = req.body;
      if (!destinationName || !message) {
        return res.status(400).json({ error: 'Missing destination or message' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          reply: `[Mode hors-ligne] Pour ${destinationName} (${country}), voici une recommandation essentielle : n’hésitez pas à explorer les quartiers moins touristiques tôt le matin, à déguster les spécialités dans les marchés de rue locaux et à privilégier les transports en commun ou vélos pour une immersion authentique.`,
        });
      }

      const contextPrompt = `
Tu es un guide de voyage local passionné, bienveillant et expert de la destination : ${destinationName} (${country}).
Le voyageur s'intéresse à cette destination selon ses préférences : ${JSON.stringify(userAnswers || {})}.
Historique récent de la conversation :
${(history || []).map((h: any) => `${h.sender === 'user' ? 'Voyageur' : 'Guide'}: ${h.text}`).join('\n')}

Question du voyageur : "${message}"

Réponds en français avec style, précision, enthousiasme et conseils très concrets (quartiers précis, adresses typiques, astuces de saison, budget ou sécurité si pertinent). Garde une réponse concise, claire et bien structurée (2-3 paragraphes max).
`;

      const response = await generateWithFallback(ai, {
        contents: contextPrompt,
        config: {
          systemInstruction: `Tu es un guide local natif et passionné de ${destinationName}. Ton ton est chaleureux, authentique, précis et inspirant.`,
          temperature: 0.7,
        },
      });

      const reply = response.text || `C'est une excellente question sur ${destinationName} ! Je vous conseille d'en profiter pleinement en visitant les sites emblématiques au lever du soleil.`;
      res.json({ reply });
    } catch (err: any) {
      // Never leave the chat hanging: answer with something useful instead of a 500.
      console.error(`[gemini] Destination chat FAILED for "${req.body?.destinationName}".`, err);
      res.json({
        reply: `Le guide IA est momentanément indisponible (surcharge côté Gemini). En attendant, pour ${req.body?.destinationName ?? 'cette destination'} : privilégiez les quartiers hors des circuits touristiques en début de matinée, et fiez-vous aux marchés locaux pour manger.`,
      });
    }
  });

  // Serve the build when started via `npm start`. The --production flag is
  // used rather than a NODE_ENV prefix because the prefix form is not valid on
  // Windows, and not every host sets NODE_ENV for us — getting this wrong
  // silently boots a Vite dev server in production.
  const isProduction =
    process.env.NODE_ENV === 'production' || process.argv.includes('--production');

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlobeMatch server running on http://0.0.0.0:${PORT}`);
    console.log(
      process.env.GEMINI_API_KEY
        ? `[gemini] Key detected, model "${GEMINI_MODEL}" (override with GEMINI_MODEL).`
        : '[gemini] No GEMINI_API_KEY — serving curated recommendations only.'
    );
  });
}

startServer();
