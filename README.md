# jarchi-scripts

Scripts [jArchi](https://github.com/archimatetool/archi-scripting-plugin) pour
automatiser la modélisation ArchiMate dans [Archi](https://www.archimatetool.com/).

## Installation

1. Installer le plugin jArchi dans Archi.
2. Cloner ce dépôt.
3. Dans Archi : *Préférences → Scripting → Scripts Manager*, pointer le dossier
   des scripts vers `scripts/` de ce clone.
4. Les scripts apparaissent dans le *Scripts Manager*. Double-clic pour exécuter.

## Organisation

| Dossier | Rôle |
|---|---|
| `scripts/lib/` | fonctions partagées, chargées par `load()`. Jamais exécutées seules. |
| `scripts/generation/` | création d'éléments, relations et vues |
| `scripts/qualite/` | contrôles de cohérence du modèle, en lecture seule |
| `scripts/export/` | sorties CSV, Markdown, rapports |
| `scripts/mise-en-forme/` | apparence des vues : couleurs, styles |

## Conventions

- Extension `.ajs` pour un script exécutable, `.js` pour une bibliothèque.
- Chaque script commence par un en-tête : objectif, prérequis (sélection,
  modèle ouvert), effets sur le modèle.
- Un script qui modifie le modèle le dit dans son nom ou son en-tête.
- Chargement d'une bibliothèque : `load(__DIR__ + "../lib/commun.js");`
- Aucun modèle `.archimate` ni export dans le dépôt.
