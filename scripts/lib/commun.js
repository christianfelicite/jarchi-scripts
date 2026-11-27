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

/** Lit une propriété jArchi sans planter si elle n'existe pas pour ce type. */
function lire(o, nom) {
    try {
        var v = o[nom];
        return (v === null || v === undefined || v === "") ? undefined : v;
    } catch (e) {
        return undefined;
    }
}

/**
 * Vues ArchiMate de la sélection, sans doublon : vues de l'arbre du modèle
 * ou vue contenant l'objet sélectionné dans un diagramme.
 */
function vuesSelectionnees() {
    var vues = [], vus = {};
    $(selection).each(function (o) {
        var v = o.type === "archimate-diagram-model" ? o : lire(o, "view");
        if (v && v.type === "archimate-diagram-model" && !vus[v.id]) {
            vus[v.id] = true;
            vues.push(v);
        }
    });
    return vues;
}

/** Nom de fichier sûr, dérivé d'un libellé. */
function nomDeFichier(libelle, extension) {
    return String(libelle).replace(/[\\\/:*?"<>|]/g, "_") + "." + extension;
}

// Couleurs par défaut d'Archi, par couche.
var COULEURS = {
    strategie: "#F5DEAA",
    metier: "#FFFFB5",
    application: "#B5FFFF",
    technologie: "#C9E7B7",
    motivation: "#CCCCFF",
    implementation: "#FFE0E0",
    localisation: "#FBB875",
    autre: "#FFFFFF"
};

// Une règle par couche plutôt qu'une table par type.
var COUCHES = [
    ["metier", /^(business-.*|contract|representation|product)$/],
    ["application", /^(application-.*|data-object)$/],
    ["technologie", /^(technology-.*|node|device|system-software|communication-network|path|artifact|equipment|facility|distribution-network|material)$/],
    ["motivation", /^(stakeholder|driver|assessment|goal|outcome|principle|requirement|constraint|meaning|value)$/],
    ["strategie", /^(resource|capability|value-stream|course-of-action)$/],
    ["implementation", /^(work-package|deliverable|implementation-event|plateau|gap)$/],
    ["localisation", /^location$/]
];

/** Couche ArchiMate d'un type d'élément ; « autre » si aucune règle ne s'applique. */
function couche(type) {
    for (var i = 0; i < COUCHES.length; i++) {
        if (COUCHES[i][1].test(type)) return COUCHES[i][0];
    }
    return "autre";
}
