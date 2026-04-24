import { useState } from "react";

// ── Keyframes ──────────────────────────────────────────────
const STYLES = `
  @keyframes urgentPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
  }
  @keyframes normalPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideOutRight {
    to { opacity: 0; transform: translateX(48px) scaleY(0.6); }
  }
  @keyframes badgeIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes expandLine {
    from { width: 0; }
    to   { width: 100%; }
  }
`;

// ── Confirmation suppression ───────────────────────────────
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div
      className="flex flex-col gap-1.5 items-end"
      style={{
        animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <span className="text-xs text-red-600 font-semibold whitespace-nowrap">
        Supprimer ?
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={onCancel}
          className="text-xs px-2.5 py-1 rounded-lg border border-gray-200
                     hover:bg-gray-50 transition-colors"
        >
          Non
        </button>
        <button
          onClick={onConfirm}
          className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white
                     hover:bg-red-700 transition-colors font-medium"
        >
          Oui
        </button>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function FlashNewsCard({ flash, onEdit, onDelete }) {
  const estUrgent = flash.urgence === "urgent";
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [suppression, setSuppression] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    setSuppression(true);
    setTimeout(() => onDelete(flash.id), 380);
  };

  return (
    <>
      <style>{STYLES}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setConfirmDelete(false);
        }}
        onClick={() => setExpanded((e) => !e)}
        style={{
          ...(suppression
            ? { animation: "slideOutRight 0.38s ease forwards" }
            : {}),
          transition: "all 0.25s ease",
          cursor: "pointer",
          background: estUrgent
            ? hovered
              ? "#fef2f2"
              : "#fff5f5"
            : hovered
              ? "#f9fafb"
              : "#ffffff",
          boxShadow: hovered
            ? estUrgent
              ? "0 8px 28px rgba(239,68,68,0.12), 0 2px 8px rgba(0,0,0,0.04)"
              : "0 8px 28px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)"
            : "0 1px 3px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
        className={`
          relative flex items-start gap-4 p-4 rounded-2xl border overflow-hidden
          ${estUrgent ? "border-red-200" : "border-gray-100"}
        `}
      >
        {/* Barre latérale colorée animée */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300"
          style={{
            background: estUrgent
              ? "linear-gradient(180deg, #ef4444, #dc2626)"
              : "linear-gradient(180deg, #22c55e, #16a34a)",
            opacity: hovered ? 1 : 0.5,
            width: hovered ? "4px" : "3px",
          }}
        />

        {/* Shimmer au hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.2s ease infinite",
            }}
          />
        )}

        {/* ── Indicateur urgence ───────────────────── */}
        <div className="mt-1.5 flex-shrink-0 relative">
          <span
            className={`block w-3 h-3 rounded-full transition-transform duration-200 ${
              estUrgent ? "bg-red-500" : "bg-green-500"
            }`}
            style={{
              animation: estUrgent
                ? "urgentPulse 2s ease-in-out infinite"
                : "normalPulse 3s ease-in-out infinite",
              transform: hovered ? "scale(1.3)" : "scale(1)",
            }}
          />
        </div>

        {/* ── Contenu ──────────────────────────────── */}
        <div className="flex-1 min-w-0 relative">
          {/* Badges + heure */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium"
              style={{ animation: "badgeIn 0.3s ease forwards" }}
            >
              {flash.categorie}
            </span>

            {estUrgent && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                style={{
                  animation: "badgeIn 0.3s ease forwards 0.05s",
                  background: "linear-gradient(90deg, #ef4444, #dc2626)",
                  color: "white",
                  letterSpacing: "0.04em",
                }}
              >
                ⚡ URGENT
              </span>
            )}

            <span className="text-xs text-gray-400 ml-auto tabular-nums">
              {flash.date} · {flash.heure}
            </span>
          </div>

          {/* Titre */}
          <p
            className="text-sm font-bold text-gray-900 leading-snug mb-1.5 transition-colors duration-200"
            style={{
              color: hovered ? (estUrgent ? "#b91c1c" : "#111827") : "#111827",
            }}
          >
            {flash.titre}
          </p>

          {/* Ligne décorative animée */}
          <div
            className="h-px bg-gray-100 mb-1.5 rounded"
            style={{
              animation: hovered ? "expandLine 0.3s ease forwards" : "none",
              width: hovered ? "100%" : "0%",
            }}
          />

          {/* Contenu — expandable */}
          <p
            className="text-xs text-gray-500 leading-relaxed transition-all duration-300 overflow-hidden"
            style={{
              WebkitLineClamp: expanded ? "unset" : 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              maxHeight: expanded ? "200px" : "2.8em",
            }}
          >
            {flash.contenu}
          </p>

          {/* Bouton lire plus */}
          {flash.contenu?.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((x) => !x);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 mt-1 transition-colors font-medium"
            >
              {expanded ? "↑ Réduire" : "↓ Lire plus"}
            </button>
          )}
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div
          className="flex flex-col gap-1.5 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
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
              {/* Modifier */}
              <button
                onClick={() => onEdit(flash)}
                className="group relative text-xs px-3 py-1.5 rounded-xl border border-gray-200
                           overflow-hidden transition-all duration-200
                           hover:border-blue-300 hover:text-blue-700"
              >
                <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
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

              {/* Supprimer */}
              <button
                onClick={() => setConfirmDelete(true)}
                className="group relative text-xs px-3 py-1.5 rounded-xl border border-red-100
                           bg-red-50 text-red-600 overflow-hidden transition-all duration-200
                           hover:bg-red-100 hover:border-red-300"
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
      </div>
    </>
  );
}
