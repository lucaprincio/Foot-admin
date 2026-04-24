// Carte d'une flash news — affiche titre, contenu, méta et actions

export default function FlashNewsCard({ flash, onEdit, onDelete }) {
  const estUrgent = flash.urgence === "urgent";

  return (
    <div
      className={`
      flex items-start gap-4 p-4 rounded-xl border transition-colors
      ${
        estUrgent
          ? "border-red-100 bg-red-50"
          : "border-gray-100 bg-white hover:bg-gray-50"
      }
    `}
    >
      {/* Indicateur urgence */}
      <div className="mt-1 flex-shrink-0">
        <span
          className={`
          block w-2.5 h-2.5 rounded-full
          ${estUrgent ? "bg-red-500" : "bg-green-500"}
        `}
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {flash.categorie}
          </span>
          {estUrgent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
              Urgent
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {flash.date} à {flash.heure}
          </span>
        </div>

        {/* Titre */}
        <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
          {flash.titre}
        </p>

        {/* Contenu */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {flash.contenu}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => onEdit(flash)}
          className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(flash.id)}
          className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors"
        >
          Suppr.
        </button>
      </div>
    </div>
  );
}
