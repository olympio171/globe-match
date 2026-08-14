<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# GlobeMatch — Quiz Voyage Sur Mesure

Quiz de 17 étapes qui calcule 3 destinations idéales parmi une base curatée de
20 fiches (itinéraire, budget, gastronomie, conseils pratiques), sur un fond
vidéo de trou noir.

**Site entièrement statique** : tout le calcul tourne dans le navigateur, il n'y
a ni serveur ni clé API à gérer.

## Lancer en local

**Prérequis :** Node.js

```bash
npm install
npm run dev
```

→ http://localhost:5173

## Déployer sur GitHub Pages

Le déploiement est automatique : à chaque push sur `main`, le workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) type-check,
construit et publie le site.

Une seule chose à faire, une fois : dans **Settings → Pages** du dépôt, régler
*Source* sur **GitHub Actions**.

Le site sera servi depuis `https://<pseudo>.github.io/<nom-du-dépôt>/`. Le
workflow passe ce sous-chemin au build via `VITE_BASE`, en le déduisant du nom
du dépôt — renommer le dépôt ne casse donc rien.

Pour reproduire le build de production en local :

```bash
VITE_BASE=/nom-du-depot/ npm run build && VITE_BASE=/nom-du-depot/ npm run preview
```

## Le score d'affinité

Chaque destination est notée critère par critère (continent, budget, durée de
vol, climat, décors, culture, rythme, compagnons, gastronomie, ambiance,
saison). Le pourcentage affiché est le rapport entre les points obtenus et les
points **atteignables compte tenu de vos réponses** : un critère que vous
laissez ouvert ne compte pas dans le total plutôt que de plafonner le score.
Deux destinations d'un même continent au maximum peuvent occuper le podium,
sauf si vous avez vous-même restreint la recherche.

## Enrichissement IA (optionnel, désactivé)

Le dépôt conserve un serveur Express qui faisait rédiger les textes par Gemini.
Il n'est pas utilisé par le site statique, mais reste fonctionnel :

```bash
# .env à la racine (PAS .env.local) : GEMINI_API_KEY=votre_clé
npm run dev:server     # http://localhost:3000
npm run build:server   # build client + serveur
npm start
```

Clé gratuite sur https://aistudio.google.com/apikey. Le serveur écoute sur
`process.env.PORT` s'il est fourni, diffuse sa progression en NDJSON, et bascule
automatiquement entre modèles Gemini quand l'un est saturé.
