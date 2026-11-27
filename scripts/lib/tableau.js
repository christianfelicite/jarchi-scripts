/*
 * Tableaux de concepts : collecte des éléments et relations d'une vue, onglet
 * SWT triable et filtrable. Chargement, après commun.js :
 *   load(__DIR__ + "../lib/tableau.js");
 */

var SEPARATEUR_VALEURS = " | ";
var LARGEUR_MAX_COLONNE = 400;

var SWT = Java.type("org.eclipse.swt.SWT");
var Shell = Java.type("org.eclipse.swt.widgets.Shell");
var Composite = Java.type("org.eclipse.swt.widgets.Composite");
var TabFolder = Java.type("org.eclipse.swt.widgets.TabFolder");
var TabItem = Java.type("org.eclipse.swt.widgets.TabItem");
var Label = Java.type("org.eclipse.swt.widgets.Label");
var Text = Java.type("org.eclipse.swt.widgets.Text");
var Button = Java.type("org.eclipse.swt.widgets.Button");
var Table = Java.type("org.eclipse.swt.widgets.Table");
var TableColumn = Java.type("org.eclipse.swt.widgets.TableColumn");
var TableItem = Java.type("org.eclipse.swt.widgets.TableItem");
var GridLayout = Java.type("org.eclipse.swt.layout.GridLayout");
var GridData = Java.type("org.eclipse.swt.layout.GridData");

// ---------------------------------------------------------------------------
// Données

/** « business-actor » → « Business Actor ». */
function libelleType(type) {
    return String(type).split("-").map(function (m) {
        return m.charAt(0).toUpperCase() + m.slice(1);
    }).join(" ");
}

function texte(v) {
    return v === undefined || v === null ? "" : String(v);
}

/** Texte sur une ligne, pour une cellule de tableau. */
function enLigne(v) {
    return texte(v).replace(/\s*[\r\n]+\s*/g, " ");
}

/** Toutes les valeurs d'une clé, une propriété pouvant être répétée. */
function valeursPropriete(c, cle) {
    var valeurs = c.prop(cle, true) || [], sortie = [];
    for (var i = 0; i < valeurs.length; i++) sortie.push(texte(valeurs[i]));
    return sortie.join(SEPARATEUR_VALEURS);
}

/**
 * Une ligne par concept distinct trouvé par le sélecteur jArchi dans les vues ;
 * clés de propriétés dans l'ordre de rencontre. completer(concept, ligne)
 * ajoute les champs propres au genre de concept.
 */
function collecter(vues, selecteur, completer) {
    var lignes = [], parId = {}, cles = [], clesVues = {};
    vues.forEach(function (vue) {
        $(vue).find(selecteur).each(function (o) {
            var c = lire(o, "concept");
            if (!c) return;
            var ligne = parId[c.id];
            if (!ligne) {
                ligne = {
                    id: c.id,
                    nom: texte(lire(c, "name")),
                    type: libelleType(c.type),
                    specialisation: texte(lire(c, "specialization")),
                    documentation: texte(lire(c, "documentation")),
                    proprietes: {},
                    vues: []
                };
                var props = c.prop();
                for (var i = 0; i < props.length; i++) {
                    var cle = String(props[i]);
                    if (ligne.proprietes.hasOwnProperty(cle)) continue;
                    ligne.proprietes[cle] = valeursPropriete(c, cle);
                    if (!clesVues[cle]) {
                        clesVues[cle] = true;
                        cles.push(cle);
                    }
                }
                if (completer) completer(c, ligne);
                parId[c.id] = ligne;
                lignes.push(ligne);
            }
            if (ligne.vues.indexOf(vue.name) < 0) ligne.vues.push(vue.name);
        });
    });
    return { lignes: lignes, cles: cles };
}

/** Extrémités d'une relation. Une extrémité peut être elle-même une relation. */
function extremites(r, ligne) {
    ligne.source = texte(lire(r.source, "name"));
    ligne.typeSource = libelleType(r.source.type);
    ligne.cible = texte(lire(r.target, "name"));
    ligne.typeCible = libelleType(r.target.type);
}

/** Colonne en lecture seule : titre et champ de la ligne. */
function colonne(titre, champ) {
    return { titre: titre, valeur: function (l) { return texte(l[champ]); } };
}

// ---------------------------------------------------------------------------
// Onglet

/**
 * Onglet : filtre, compteur et tableau triable. cols : [{ titre, valeur(l) }].
 * options.decorer(itemSwt, ligne), facultatif : appelé après l'écriture de
 * chaque ligne du tableau.
 * Retourne { titre, cols, tableau, affichees(), remplir() }. La ligne affichée
 * au rang i du tableau est affichees()[i].
 */
function onglet(dossier, titre, cols, lignes, options) {
    var decorer = options && options.decorer;
    var affichees = lignes.slice();
    var tri = { index: -1, croissant: true };

    var panneau = new Composite(dossier, SWT.NONE);
    panneau.setLayout(new GridLayout(3, false));
    var item = new TabItem(dossier, SWT.NONE);
    item.setText(titre + " (" + lignes.length + ")");
    item.setControl(panneau);

    new Label(panneau, SWT.NONE).setText("Filtrer :");
    var filtre = new Text(panneau, SWT.BORDER | SWT.SEARCH | SWT.ICON_CANCEL);
    filtre.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, true, false));
    var compteur = new Label(panneau, SWT.NONE);
    compteur.setLayoutData(new GridData(SWT.END, SWT.CENTER, false, false));

    var tableau = new Table(panneau, SWT.BORDER | SWT.FULL_SELECTION | SWT.MULTI);
    tableau.setHeaderVisible(true);
    tableau.setLinesVisible(true);
    var gd = new GridData(SWT.FILL, SWT.FILL, true, true, 3, 1);
    gd.widthHint = 1000;
    gd.heightHint = 500;
    tableau.setLayoutData(gd);

    var colonnesSwt = cols.map(function (c, index) {
        var col = new TableColumn(tableau, SWT.LEFT);
        col.setText(c.titre);
        col.addListener(SWT.Selection, function () { trier(index, col); });
        return col;
    });

    function remplir() {
        tableau.setRedraw(false);
        tableau.removeAll();
        affichees.forEach(function (l) {
            var ligne = new TableItem(tableau, SWT.NONE);
            cols.forEach(function (c, i) {
                ligne.setText(i, enLigne(c.valeur(l)));
            });
            if (decorer) decorer(ligne, l);
        });
        tableau.setRedraw(true);
        compteur.setText(affichees.length + " / " + lignes.length);
        panneau.layout();
    }

    function ordonner() {
        var c = cols[tri.index], signe = tri.croissant ? 1 : -1;
        affichees.sort(function (a, b) {
            var x = c.valeur(a).toLowerCase(), y = c.valeur(b).toLowerCase();
            return x < y ? -signe : x > y ? signe : 0;
        });
    }

    function filtrer() {
        var motif = texte(filtre.getText()).toLowerCase();
        affichees = lignes.filter(function (l) {
            return !motif || cols.some(function (c) {
                return c.valeur(l).toLowerCase().indexOf(motif) >= 0;
            });
        });
        if (tri.index >= 0) ordonner();
        remplir();
    }

    function trier(index, col) {
        tri.croissant = tri.index === index ? !tri.croissant : true;
        tri.index = index;
        tableau.setSortColumn(col);
        tableau.setSortDirection(tri.croissant ? SWT.UP : SWT.DOWN);
        ordonner();
        remplir();
    }

    filtre.addListener(SWT.Modify, filtrer);
    remplir();
    colonnesSwt.forEach(function (col) {
        col.pack();
        if (col.getWidth() > LARGEUR_MAX_COLONNE) col.setWidth(LARGEUR_MAX_COLONNE);
    });

    return {
        titre: titre,
        cols: cols,
        tableau: tableau,
        affichees: function () { return affichees; },
        remplir: remplir
    };
}

/** Boucle d'événements d'une fenêtre modale, jusqu'à sa fermeture. */
function attendreFermeture(fenetre) {
    var ecran = fenetre.getDisplay();
    while (!fenetre.isDisposed()) {
        if (!ecran.readAndDispatch()) ecran.sleep();
    }
}
