// Badge réutilisable pour les statuts
const STYLES = {
  termine: "bg-green-100 text-green-800",
  en_direct: "bg-amber-100 text-amber-800",
  a_venir: "bg-gray-100 text-gray-600",
};

const LABELS = {
  termine: "Terminé",
  en_direct: "En direct",
  a_venir: "À venir",
};

export default function Badge({ statut }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STYLES[statut] ?? STYLES.a_venir}`}
    >
      {LABELS[statut] ?? statut}
    </span>
  );
}
