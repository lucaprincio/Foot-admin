import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { CATEGORIES_ARTICLE, STATUTS_ARTICLE } from "../../data/articles";

const ARTICLE_VIDE = {
  titre: "",
  categorie: "Analyse",
  auteur: "",
  extrait: "",
  statut: "brouillon",
  date: "",
};

export default function ArticleForm({
  isOpen,
  onClose,
  onSave,
  articleAEditer,
}) {
  if (!isOpen) return null;

  return (
    <ArticleFormContent
      key={articleAEditer?.id ?? "new"}
      onClose={onClose}
      onSave={onSave}
      articleAEditer={articleAEditer}
    />
  );
}

function ArticleFormContent({ onClose, onSave, articleAEditer }) {
  const [form, setForm] = useState(() => articleAEditer ?? ARTICLE_VIDE);

  const set = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }));

  const handleSave = () => {
    if (!form.titre.trim() || !form.auteur.trim()) return;
    onSave({
      ...form,
      date: form.date || new Date().toLocaleDateString("fr-FR"),
    });
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={articleAEditer ? "Modifier l'article" : "Créer un article"}
    >
      <div className="flex flex-col gap-3">
        <Input
          label="Titre *"
          value={form.titre}
          onChange={set("titre")}
          placeholder="Ex : Analyse tactique — PSG vs OM"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Catégorie"
            value={form.categorie}
            onChange={set("categorie")}
            options={CATEGORIES_ARTICLE}
          />
          <Input
            label="Auteur *"
            value={form.auteur}
            onChange={set("auteur")}
            placeholder="Nom de l'auteur"
          />
        </div>

        {/* Textarea extrait */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">
            Extrait / résumé
          </label>
          <textarea
            value={form.extrait}
            onChange={set("extrait")}
            placeholder="Introduction courte de l'article..."
            rows={3}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <Select
          label="Statut"
          value={form.statut}
          onChange={set("statut")}
          options={STATUTS_ARTICLE}
        />

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
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}
