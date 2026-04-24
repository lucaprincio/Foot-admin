// Données simulées — à remplacer par vos appels API
export const COMPETITIONS = [
  "Ligue 1",
  "Ligue 2",
  "Coupe de France",
  "Champions League",
];

export const STATUTS = [
  { value: "a_venir", label: "À venir" },
  { value: "en_direct", label: "En direct" },
  { value: "termine", label: "Terminé" },
];

export const MATCHS_INITIAUX = [
  {
    id: 1,
    date: "20/04/2026",
    competition: "Ligue 1",
    domicile: "PSG",
    exterieur: "OM",
    scoreDomicile: 2,
    scoreExterieur: 1,
    statut: "termine",
  },
  {
    id: 2,
    date: "21/04/2026",
    competition: "Ligue 1",
    domicile: "Lyon",
    exterieur: "Monaco",
    scoreDomicile: 0,
    scoreExterieur: 0,
    statut: "termine",
  },
  {
    id: 3,
    date: "22/04/2026",
    competition: "Champions League",
    domicile: "PSG",
    exterieur: "Bayern",
    scoreDomicile: 1,
    scoreExterieur: 3,
    statut: "termine",
  },
  {
    id: 4,
    date: "26/04/2026",
    competition: "Ligue 1",
    domicile: "Marseille",
    exterieur: "Rennes",
    scoreDomicile: 0,
    scoreExterieur: 0,
    statut: "a_venir",
  },
  {
    id: 5,
    date: "28/04/2026",
    competition: "Coupe de France",
    domicile: "Nantes",
    exterieur: "Bordeaux",
    scoreDomicile: 0,
    scoreExterieur: 0,
    statut: "a_venir",
  },
];
