/*
 * Bibliothèque commune. Chargement :
 *   load(__DIR__ + "../lib/commun.js");
 */

/** Arrête le script si aucun modèle n'est ouvert ou sélectionné. */
function exigerModele() {
    if (!model || !model.isSet()) {
        console.error("Aucun modèle sélectionné. Ouvrir et sélectionner un modèle.");
        exit();
    }
}

/** Arrête le script si la sélection est vide. Retourne la sélection. */
function exigerSelection() {
    if ($(selection).size() === 0) {
        console.error("Sélection vide. Sélectionner au moins un élément.");
        exit();
    }
    return $(selection);
}

/** Affiche un titre de section dans la console. */
function titre(texte) {
    console.log("");
    console.log("== " + texte + " ==");
}
