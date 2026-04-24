import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { CATEGORIES, NIVEAUX_URGENCE } from "../../data/flashnews";

const FLASH_VIDE = {
  titre: "",
  contenu: "",
  categorie: "Général",
  urgence: "normal",
  date: "",
  heure: "",
};

export default function FlashNewsForm({
  isOpen,
  onClose,
  onSave,
  flashAEditer,
}) {
  if (!isOpen) return null;

  return (
    <FlashNewsFormContent
      key={flashAEditer?.id ?? "new"}
      onClose={onClose}
      onSave={onSave}
      flashAEditer={flashAEditer}
    />
  );
}

function FlashNewsFormContent({ onClose, onSave, flashAEditer }) {
  const [form, setForm] = useState(() => flashAEditer ?? FLASH_VIDE);

  const set = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }));

  const handleSave = () => {
    if (!form.titre.trim()) return;
    const now = new Date();
    onSave({
      ...form,
      // Injecter date/heure auto si non renseignées
      date: form.date || now.toLocaleDateString("fr-FR"),
      heure:
        form.heure ||
        now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    });
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={flashAEditer ? "Modifier la flash news" : "Nouvelle flash news"}
    >
      <div className="flex flex-col gap-3">
        <Input
          label="Titre *"
          value={form.titre}
          onChange={set("titre")}
          placeholder="Ex : Mbappé de retour à l'entraînement"
        />

        {/* Textarea contenu */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">
            Contenu *
          </label>
          <textarea
            value={form.contenu}
            onChange={set("contenu")}
            placeholder="Détails de l'information..."
            rows={4}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Catégorie"
            value={form.categorie}
            onChange={set("categorie")}
            options={CATEGORIES}
          />
          <Select
            label="Urgence"
            value={form.urgence}
            onChange={set("urgence")}
            options={NIVEAUX_URGENCE}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Publier
          </button>
        </div>
      </div>
    </Modal>
  );
}
