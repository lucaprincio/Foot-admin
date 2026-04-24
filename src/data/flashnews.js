// Données simulées Flash News — remplacer par appels API

export const CATEGORIES = [
  "Transfert",
  "Blessure",
  "Résultat",
  "Général",
  "Mercato",
];

export const NIVEAUX_URGENCE = [
  { value: "normal", label: "Normale" },
  { value: "urgent", label: "Urgente" },
];

export const FLASHNEWS_INITIALES = [
  {
    id: 1,
    titre: "Mbappé signe son retour à l'entraînement",
    contenu:
      "Le capitaine des Bleus a repris le travail collectif ce matin après trois semaines d'absence. Son retour est prévu pour le prochain match de Ligue 1.",
    categorie: "Blessure",
    urgence: "normal",
    date: "24/04/2026",
    heure: "10:32",
  },
  {
    id: 2,
    titre: "Transfert : Dembélé vers la Premier League ?",
    contenu:
      "Selon plusieurs sources proches du dossier, trois clubs anglais auraient formulé des offres pour l'ailier du PSG. Une décision est attendue d'ici la fin du mois.",
    categorie: "Transfert",
    urgence: "urgent",
    date: "23/04/2026",
    heure: "15:48",
  },
  {
    id: 3,
    titre: "Ligue 1 : le calendrier de la dernière journée dévoilé",
    contenu:
      "La LFP a officialisé les horaires de la dernière journée de championnat, prévue le 18 mai prochain. Plusieurs affiches au programme.",
    categorie: "Général",
    urgence: "normal",
    date: "22/04/2026",
    heure: "09:15",
  },
  {
    id: 4,
    titre: "OM : blessure de Pau Lopez à l'entraînement",
    contenu:
      "Le gardien marseillais a quitté la séance prématurément. Son état sera évalué dans les prochaines heures par le staff médical.",
    categorie: "Blessure",
    urgence: "urgent",
    date: "21/04/2026",
    heure: "17:20",
  },
];
