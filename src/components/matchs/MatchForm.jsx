import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import { COMPETITIONS, STATUTS } from "../../data/matchs";

// Valeurs par défaut d'un nouveau match
const MATCH_VIDE = {
  date: "",
  competition: "Ligue 1",
  domicile: "",
  exterieur: "",
  scoreDomicile: 0,
  scoreExterieur: 0,
  statut: "a_venir",
};

export default function MatchForm({ isOpen, onClose, onSave, matchAEditer }) {
  const [form, setForm] = useState(matchAEditer ?? MATCH_VIDE);

  const handleChange = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.value }));

  const handleSave = () => {
    if (!form.domicile || !form.exterieur) return; // validation basique
    onSave(form);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={matchAEditer ? "Modifier le match" : "Ajouter un match"}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Équipe domicile"
            value={form.domicile}
            onChange={handleChange("domicile")}
            placeholder="PSG"
          />
          <Input
            label="Équipe extérieur"
            value={form.exterieur}
            onChange={handleChange("exterieur")}
            placeholder="OM"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Score domicile"
            type="number"
            min={0}
            value={form.scoreDomicile}
            onChange={handleChange("scoreDomicile")}
          />
          <Input
            label="Score extérieur"
            type="number"
            min={0}
            value={form.scoreExterieur}
            onChange={handleChange("scoreExterieur")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            value={form.date}
            onChange={handleChange("date")}
            placeholder="26/04/2026"
          />
          <Select
            label="Compétition"
            value={form.competition}
            onChange={handleChange("competition")}
            options={COMPETITIONS}
          />
        </div>

        <Select
          label="Statut"
          value={form.statut}
          onChange={handleChange("statut")}
          options={STATUTS}
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
            className="px-4 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}
