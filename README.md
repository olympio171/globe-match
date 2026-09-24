# GlobeMatch — Où partir, vraiment ?

Un quiz voyage de 21 questions qui choisit, parmi **108 destinations**, les trois
qui vous ressemblent le plus, et explique pourquoi.

L’interface commence **neutre**, puis prend peu à peu les couleurs de vos réponses :
un climat tropical la réchauffe, la neige la refroidit, la palette se sature à
mesure que vos goûts se précisent, et un paysage en bas de l’écran (mer, sommets,
dunes, jungle, skyline…) suit les décors choisis. Sur la page de résultats, elle
prend les couleurs de la destination affichée.

**Site entièrement statique** : tout le calcul tourne dans le navigateur, aucune
réponse n’est envoyée nulle part.

## Lancer en local

**Prérequis :** Node.js 20 ou plus.

```bash
npm install
npm run dev      # http://localhost:5173
```

| Commande         | Rôle                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `npm run dev`    | Serveur de développement                                          |
| `npm run build`  | Build de production dans `dist/`                                  |
| `npm run lint`   | Vérification TypeScript (mode strict)                             |
| `npm test`       | Valide les 108 fiches et le classement sur des profils types      |
| `npm run images` | Récupère les photos manquantes sur Wikimedia Commons (voir plus bas) |

## Comment le classement est calculé

Chaque destination (`src/data/destinations/`) est décrite par :

- **une quarantaine de traits notés de 0 à 5** : paysages (plages, montagnes,
  volcans…), activités (randonnée, plongée, ski, vie nocturne…), culture (histoire,
  spiritualité, musique…), et des traits de base (dépaysement, affluence,
  sécurité, confort, adaptée aux familles, romantique, télétravail, luxe, facile
  sans voiture) ;
- **sa météo réelle mois par mois** : température maximale moyenne, niveau de
  pluie et mois recommandés ;
- **son coût** sur place (€/jour/personne), son accès (coordonnées, nombre
  d’escales depuis Paris et Montréal), la durée de séjour idéale, les formalités,
  le décalage horaire, le paludisme, l’altitude, la place du français.

Le moteur (`src/services/engine.ts`) évalue chaque destination **pour chaque mois
où vous pouvez partir** et retient le meilleur :

1. **Les traits dépendent de la saison** : pas de baignade par 18 °C, pas de ski
   sans neige, pas d’aurores sous le soleil de minuit, pas de randonnée en
   altitude enneigée ni par 40 °C.
2. **Seize critères** sont notés de 0 à 1 : météo à vos dates, saison, paysages,
   activités, culture, dépaysement, affluence, rythme, gastronomie, budget, temps
   de trajet, durée du séjour, compagnons, hébergement, ambiance, et vos envies
   écrites librement (« des volcans, pas de grandes villes » est compris, négation
   comprise).
3. **Le budget est calculé, pas deviné** : vol estimé depuis votre aéroport
   (distance orthodromique, escales, détour hors de l’espace aérien russe) +
   dépenses sur place selon l’hébergement et les compagnons, pour votre durée.
4. **Vos priorités comptent double** ; vos critères éliminatoires (visa,
   paludisme, décalage horaire, altitude, sécurité, français…), une limite de
   trajet dépassée ou un budget impossible font chuter la note.
5. Le pourcentage affiché est la **part de vos attentes satisfaite**, pondérée par
   l’importance de chaque critère. Le podium évite trois destinations du même
   pays quand une alternative proche existe ailleurs.

Chaque résultat est accompagné de ses raisons, de ses points de vigilance, du
détail du score critère par critère, du climat sur douze mois, d’un itinéraire
construit à votre rythme, d’un simulateur de budget et des infos pratiques.

`npm test` fait passer une douzaine de profils types (plage en janvier, week-end
culturel, aurores, safari, trek, ski, télétravail, départ de Montréal…) et
échoue si le podium n’a plus de sens.

## Ajouter ou modifier une destination

1. Ajoutez une fiche dans le fichier de la région concernée
   (`src/data/destinations/*.ts`) ; le type `Destination` (`src/types.ts`)
   documente chaque champ.
2. Renseignez `wiki` avec le titre d’un article Wikipédia en anglais dont la photo
   principale convient, puis lancez `npm run images`. Pour imposer une autre photo,
   ajoutez son nom de fichier Commons dans `OVERRIDES`
   (`scripts/resolve-images.ts`).
3. Lancez `npm test`.

Les photos viennent de **Wikimedia Commons** ; l’auteur et la licence de chacune
sont affichés sur l’image et enregistrés dans `src/data/images.json`.

## Déployer sur GitHub Pages

Le déploiement est automatique : à chaque push sur `main`, le workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) vérifie les types,
lance les tests, construit et publie le site.

Une seule chose à faire, une fois : dans **Settings → Pages** du dépôt, régler
*Source* sur **GitHub Actions**. Le site est servi depuis
`https://<pseudo>.github.io/<nom-du-dépôt>/` ; le workflow passe ce sous-chemin au
build via `VITE_BASE`.

Pour reproduire le build de production en local :

```bash
VITE_BASE=/nom-du-depot/ npm run build && VITE_BASE=/nom-du-depot/ npm run preview
```
