<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# GlobeMatch — Quiz Voyage Sur Mesure

Quiz de 17 étapes qui calcule 3 destinations idéales à partir d'une base curatée
de 20 fiches, puis fait rédiger les textes personnalisés par Gemini.

View your app in AI Studio: https://ai.studio/apps/a71fb19b-e126-4141-890f-093ecab96528

## Lancer en local

**Prérequis :** Node.js

1. Installer les dépendances : `npm install`
2. Créer un fichier `.env` à la racine (⚠️ `.env`, **pas** `.env.local` — le
   serveur appelle `dotenv.config()` sans argument) :
   ```
   GEMINI_API_KEY=votre_clé
   ```
   La clé se récupère gratuitement sur https://aistudio.google.com/apikey.
   Sans clé, le site fonctionne quand même : il sert les textes curatés et
   l'affiche honnêtement (« Base curatée » au lieu de « Analyse IA »).
3. Lancer : `npm run dev` → http://localhost:3000

Variable optionnelle : `GEMINI_MODEL` pour changer le modèle en tête de la
chaîne de repli (défaut `gemini-3.7-flash`).

## Déployer

Le site **n'est pas statique** : un serveur Express est indispensable, car la
clé Gemini doit rester côté serveur et ne jamais partir dans le navigateur.
GitHub Pages ou un hébergement de fichiers statiques ne conviennent donc pas.

```bash
npm run build   # → dist/ (client + dist/server.cjs + la vidéo de fond)
npm start       # sert dist/ en production
```

Points à respecter côté hébergeur :

- **Ne pas déployer le fichier `.env`.** La clé se met dans les variables
  d'environnement / secrets de la plateforme.
- Le serveur écoute sur `process.env.PORT` s'il est fourni, sinon 3000.
- `npm start` passe `--production` : c'est ce qui déclenche le service de
  `dist/` au lieu du serveur de développement Vite. `NODE_ENV=production`
  produit le même effet.
- L'API renvoie sa progression en **NDJSON au fil de l'eau**. Un proxy qui
  met les réponses en tampon casserait l'écran de chargement (l'en-tête
  `X-Accel-Buffering: no` est déjà envoyé).
- La génération IA peut prendre jusqu'à 45 s : éviter les plateformes dont la
  durée de requête est plafonnée plus bas.
