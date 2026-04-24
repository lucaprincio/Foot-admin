import { useState } from "react";
import MatchRow from "./MatchRow";
import MatchForm from "./MatchForm";
import { MATCHS_INITIAUX } from "../../data/matchs";

export default function MatchsTable() {
  const [matchs, setMatchs] = useState(MATCHS_INITIAUX);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [matchAEditer, setMatchAEditer] = useState(null);

  // ── Stats ─────────────────────────────────────────
  const total = matchs.length;
  const termines = matchs.filter((m) => m.statut === "termine").length;
  const aVenir = matchs.filter((m) => m.statut === "a_venir").length;

  // ── Handlers ──────────────────────────────────────
  const ouvrirAjout = () => {
    setMatchAEditer(null);
    setModalOuverte(true);
  };
  const ouvrirEdit = (m) => {
    setMatchAEditer(m);
    setModalOuverte(true);
  };

  const sauvegarder = (formData) => {
    if (matchAEditer) {
      // Édition : remplacer l'entrée existante
      setMatchs((prev) =>
        prev.map((m) => (m.id === matchAEditer.id ? { ...m, ...formData } : m)),
      );
    } else {
      // Ajout : générer un id temporaire (côté UI uniquement)
      setMatchs((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    }
  };

  const supprimer = (id) =>
    setMatchs((prev) => prev.filter((m) => m.id !== id));

  // ── Rendu ─────────────────────────────────────────
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Tableau des matchs
          </h1>
          <p className="text-sm text-gray-400">
            Gestion et insertion des résultats
          </p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Ajouter un match
        </button>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total matchs", val: total },
          { label: "Terminés", val: termines },
          { label: "À venir", val: aVenir },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Date",
                "Compétition",
                "Domicile",
                "Score",
                "Extérieur",
                "Statut",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-gray-400 uppercase tracking-wide font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matchs.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                onEdit={ouvrirEdit}
                onDelete={supprimer}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale ajout/édition */}
      <MatchForm
        key={`${modalOuverte}-${matchAEditer?.id ?? "new"}`}
        isOpen={modalOuverte}
        onClose={() => setModalOuverte(false)}
        onSave={sauvegarder}
        matchAEditer={matchAEditer}
      />
    </div>
  );
}
