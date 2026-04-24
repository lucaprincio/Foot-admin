// Données simulées Articles — remplacer par appels API

export const CATEGORIES_ARTICLE = [
  "Analyse",
  "Interview",
  "Reportage",
  "Opinion",
  "Résumé de match",
];

export const STATUTS_ARTICLE = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publie", label: "Publié" },
  { value: "archive", label: "Archivé" },
];

export const ARTICLES_INITIAUX = [
  {
    id: 1,
    titre: "Analyse : le 4-3-3 du PSG cette saison",
    categorie: "Analyse",
    auteur: "Jean Dupont",
    extrait:
      "Décryptage du système de jeu mis en place par Luis Enrique depuis le début de la saison, entre pressing haut et transitions rapides.",
    statut: "publie",
    date: "23/04/2026",
  },
  {
    id: 2,
    titre: "Interview exclusive : Luis Enrique parle tactique",
    categorie: "Interview",
    auteur: "Marie Martin",
    extrait:
      "Le coach parisien s'est confié sur ses choix tactiques, la gestion du groupe et les objectifs de fin de saison.",
    statut: "publie",
    date: "21/04/2026",
  },
  {
    id: 3,
    titre: "Reportage : dans les coulisses du Vélodrome",
    categorie: "Reportage",
    auteur: "Paul Bernard",
    extrait:
      "Nous avons eu accès aux entraînements de l'OM pendant une semaine. Ambiance, préparation, tensions — récit de l'intérieur.",
    statut: "brouillon",
    date: "19/04/2026",
  },
  {
    id: 4,
    titre: "Opinion : la Ligue 1 est-elle encore compétitive ?",
    categorie: "Opinion",
    auteur: "Sarah Leroy",
    extrait:
      "Avec les départs successifs de grands joueurs, le championnat français perd de son attrait européen. Analyse et débat.",
    statut: "brouillon",
    date: "18/04/2026",
  },
  {
    id: 5,
    titre: "Résumé : PSG 2-1 OM, le clasico tourne au PSG",
    categorie: "Résumé de match",
    auteur: "Jean Dupont",
    extrait:
      "Retour sur les temps forts d'un clasico maîtrisé par les Parisiens, avec un doublé de Dembélé et une fin de match tendue.",
    statut: "archive",
    date: "15/04/2026",
  },
];
