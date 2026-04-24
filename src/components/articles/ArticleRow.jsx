// Ligne individuelle du tableau des articles

const STATUT_STYLES = {
  publie: "bg-green-100 text-green-800",
  brouillon: "bg-gray-100 text-gray-600",
  archive: "bg-amber-100 text-amber-700",
};

const STATUT_LABELS = {
  publie: "Publié",
  brouillon: "Brouillon",
  archive: "Archivé",
};

export default function ArticleRow({ article, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Titre + extrait */}
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm font-medium text-gray-900 truncate">
          {article.titre}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {article.extrait}
        </p>
      </td>

      {/* Catégorie */}
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {article.categorie}
        </span>
      </td>

      {/* Auteur */}
      <td className="px-4 py-3 text-sm text-gray-600">{article.auteur}</td>

      {/* Date */}
      <td className="px-4 py-3 text-xs text-gray-400">{article.date}</td>

      {/* Statut */}
      <td className="px-4 py-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_STYLES[article.statut] ?? STATUT_STYLES.brouillon}`}
        >
          {STATUT_LABELS[article.statut] ?? article.statut}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(article)}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors"
          >
            Suppr.
          </button>
        </div>
      </td>
    </tr>
  );
}
