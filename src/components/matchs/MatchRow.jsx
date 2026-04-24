import Badge from "../ui/Badge";

export default function MatchRow({ match, onEdit, onDelete }) {
  const scoreVisible = match.statut !== "a_venir";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-xs text-gray-400">{match.date}</td>

      <td className="px-4 py-3">
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
          {match.competition}
        </span>
      </td>

      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {match.domicile}
      </td>

      <td className="px-4 py-3 text-center">
        {scoreVisible ? (
          <span className="font-semibold tabular-nums">
            {match.scoreDomicile} – {match.scoreExterieur}
          </span>
        ) : (
          <span className="text-gray-300">–</span>
        )}
      </td>

      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {match.exterieur}
      </td>

      <td className="px-4 py-3">
        <Badge statut={match.statut} />
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(match)}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(match.id)}
            className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
          >
            Suppr.
          </button>
        </div>
      </td>
    </tr>
  );
}
