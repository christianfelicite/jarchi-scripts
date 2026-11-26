# CLAUDE.md

Règles de travail dans ce dépôt.

## Nature du dépôt

Scripts jArchi génériques. Le dépôt ne contient **aucun modèle** ni donnée
d'un modèle : ni fichier `.archimate`, ni export, ni nom de client,
d'application ou de personne tiré d'un modèle réel.

## Interdits

- Aucun fichier `.archimate`, `.bak`, ni export CSV/HTML/PDF.
- Aucun identifiant d'élément codé en dur. Sélectionner par type, nom ou
  propriété.
- Aucun `TODO` dans un script livré. Ouvrir une issue.

## Méthode

- **Tester avant de livrer.** Exécuter sur une copie du modèle, jamais sur
  l'original.
- **Lecture seule par défaut.** Un script de `qualite/` ne modifie rien.
- **Chercher avant de créer.** Vérifier que `lib/` ne couvre pas déjà le besoin.
- **Minimalisme.** Une fonction utilisée par deux scripts monte dans `lib/`.
  Une fonction utilisée par un seul script y reste.

## Style

Français pour la documentation et les messages. Identifiants de code en
anglais ou en français, mais cohérents au sein d'un fichier.
