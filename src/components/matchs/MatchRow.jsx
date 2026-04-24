import { useState } from "react";
import Badge from "../ui/Badge";

// ── Confirmation suppression inline ───────────────────────
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <span className="text-xs text-red-600 font-medium whitespace-nowrap">
        Confirmer ?
      </span>
      <button
        onClick={onConfirm}
        className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
      >
        Oui
      </button>
      <button
        onClick={onCancel}
        className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        Non
      </button>
    </div>
  );
}

// ── Score avec animation flash si en direct ────────────────
function ScoreDisplay({ domicile, exterieur, statut }) {
  if (statut === "a_venir") {
    return <span className="text-gray-300 text-lg tracking-widest">· · ·</span>;
  }

  if (statut === "en_direct") {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className="font-bold text-base tabular-nums text-gray-900"
          style={{ animation: "pulseBright 2s ease-in-out infinite" }}
        >
          {domicile}
        </span>
        <span
          className="text-amber-500 font-bold text-xs px-1"
          style={{ animation: "blink 1s step-end infinite" }}
        >
          VS
        </span>
        <span
          className="font-bold text-base tabular-nums text-gray-900"
          style={{ animation: "pulseBright 2s ease-in-out infinite 0.5s" }}
        >
          {exterieur}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-base tabular-nums text-gray-900">
        {domicile}
      </span>
      <span className="text-gray-300 font-light text-sm">–</span>
      <span className="font-bold text-base tabular-nums text-gray-900">
        {exterieur}
      </span>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function MatchRow({ match, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [suppression, setSuppression] = useState(false);

  const handleDelete = () => {
    setSuppression(true);
    // Laisser l'animation de sortie jouer avant de supprimer
    setTimeout(() => onDelete(match.id), 380);
  };

  return (
    <>
      {/* Keyframes locales */}
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulseBright {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        @keyframes rowSlideOut {
          to { opacity: 0; transform: translateX(40px) scaleY(0.5); }
        }
        @keyframes rowGlow {
          0%   { box-shadow: inset 3px 0 0 #22c55e; }
          100% { box-shadow: inset 3px 0 0 transparent; }
        }
      `}</style>

      <tr
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setConfirmDelete(false);
        }}
        style={{
          ...(suppression
            ? { animation: "rowSlideOut 0.38s ease forwards" }
            : {}),
          transition: "background 0.2s ease",
          background: hovered ? "#f9fafb" : "white",
          position: "relative",
        }}
      >
        {/* Indicateur latéral au hover */}
        <td
          className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap"
          style={{
            boxShadow: hovered
              ? "inset 3px 0 0 #22c55e"
              : "inset 3px 0 0 transparent",
            transition: "box-shadow 0.25s ease",
          }}
        >
          {match.date}
        </td>

        {/* Compétition */}
        <td className="px-4 py-3.5">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200"
            style={{
              background: hovered ? "#dcfce7" : "#f3f4f6",
              color: hovered ? "#15803d" : "#6b7280",
            }}
          >
            {match.competition}
          </span>
        </td>

        {/* Équipe domicile */}
        <td className="px-4 py-3.5">
          <span
            className="text-sm font-semibold text-gray-900 transition-all duration-200"
            style={{ letterSpacing: hovered ? "0.02em" : "0" }}
          >
            {match.domicile}
          </span>
        </td>

        {/* Score */}
        <td className="px-4 py-3.5 text-center">
          <ScoreDisplay
            domicile={match.scoreDomicile}
            exterieur={match.scoreExterieur}
            statut={match.statut}
          />
        </td>

        {/* Équipe extérieur */}
        <td className="px-4 py-3.5">
          <span
            className="text-sm font-semibold text-gray-900 transition-all duration-200"
            style={{ letterSpacing: hovered ? "0.02em" : "0" }}
          >
            {match.exterieur}
          </span>
        </td>

        {/* Statut */}
        <td className="px-4 py-3.5">
          <div
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.2s ease",
              display: "inline-block",
            }}
          >
            <Badge statut={match.statut} />
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5">
          <div
            className="flex gap-2 items-center"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {confirmDelete ? (
              <DeleteConfirm
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(false)}
              />
            ) : (
              <>
                {/* Bouton Modifier */}
                <button
                  onClick={() => onEdit(match)}
                  className="group relative text-xs px-3 py-1.5 rounded-lg border border-gray-200
                             overflow-hidden transition-all duration-200
                             hover:border-green-300 hover:text-green-700"
                >
                  <span className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.5 18.81l-4 1 1-4 11.362-11.323z"
                      />
                    </svg>
                    Modifier
                  </span>
                </button>

                {/* Bouton Supprimer */}
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="group relative text-xs px-3 py-1.5 rounded-lg border border-red-100
                             bg-red-50 text-red-600 overflow-hidden transition-all duration-200
                             hover:bg-red-100 hover:border-red-200"
                >
                  <span className="relative flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m-4 0h10"
                      />
                    </svg>
                    Suppr.
                  </span>
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
