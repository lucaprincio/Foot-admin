import { useState } from "react";
import FlashNewsCard from "./FlashNewsCard";
import FlashNewsForm from "./FlashNewsForm";
import { FLASHNEWS_INITIALES } from "../../data/flashnews";

export default function FlashNewsList() {
  const [flashes, setFlashes] = useState(FLASHNEWS_INITIALES);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [flashAEditer, setFlashAEditer] = useState(null);

  // Filtre actif (optionnel, "Tous" par défaut)
  const [filtreUrgence, setFiltreUrgence] = useState("tous");

  // ── Stats ──────────────────────────────────────────
  const nbUrgentes = flashes.filter((f) => f.urgence === "urgent").length;
  const nbNormales = flashes.filter((f) => f.urgence === "normal").length;

  // ── Handlers ───────────────────────────────────────
  const ouvrirAjout = () => {
    setFlashAEditer(null);
    setModalOuverte(true);
  };
  const ouvrirEdit = (f) => {
    setFlashAEditer(f);
    setModalOuverte(true);
  };

  const sauvegarder = (formData) => {
    if (flashAEditer) {
      setFlashes((prev) =>
        prev.map((f) => (f.id === flashAEditer.id ? { ...f, ...formData } : f)),
      );
    } else {
      setFlashes((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    }
  };

  const supprimer = (id) =>
    setFlashes((prev) => prev.filter((f) => f.id !== id));

  // ── Filtrage ───────────────────────────────────────
  const flashesFiltrees =
    filtreUrgence === "tous"
      ? flashes
      : flashes.filter((f) => f.urgence === filtreUrgence);

  // ── Rendu ──────────────────────────────────────────
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Flash news</h1>
          <p className="text-sm text-gray-400">Actualités courtes et rapides</p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Nouvelle flash
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total", val: flashes.length },
          { label: "Urgentes", val: nbUrgentes },
          { label: "Normales", val: nbNormales },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        {[
          { value: "tous", label: "Toutes" },
          { value: "urgent", label: "Urgentes" },
          { value: "normal", label: "Normales" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltreUrgence(f.value)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              filtreUrgence === f.value
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {flashesFiltrees.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            Aucune flash news trouvée.
          </p>
        ) : (
          flashesFiltrees.map((f) => (
            <FlashNewsCard
              key={f.id}
              flash={f}
              onEdit={ouvrirEdit}
              onDelete={supprimer}
            />
          ))
        )}
      </div>

      {/* Modale */}
      <FlashNewsForm
        isOpen={modalOuverte}
        onClose={() => setModalOuverte(false)}
        onSave={sauvegarder}
        flashAEditer={flashAEditer}
      />
    </div>
  );
}
