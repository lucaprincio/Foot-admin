import { useState } from "react";
import Modal from "../ui/Modal";
import { COMPETITIONS, STATUTS } from "../../data/matchs";

// ── Keyframes globales ─────────────────────────────────────
const STYLES = `
  @keyframes fieldFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes scorePopIn {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes spinOnce {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: var(--target-width); }
  }
`;

// ── Champ animé avec focus ring ────────────────────────────
function AnimatedField({ label, error, delay = 0, children }) {
  return (
    <div
      className="flex flex-col gap-1.5"
      style={{
        animation: `fieldFadeUp 0.35s ease forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {label}
        {error && (
          <span
            className="ml-2 text-red-500 normal-case font-normal tracking-normal"
            style={{ animation: "fieldFadeUp 0.2s ease forwards" }}
          >
            — {error}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// ── Input stylisé ──────────────────────────────────────────
function StyledInput({ error, shake: doShake, ...props }) {
  return (
    <input
      className={`
        w-full px-3 py-2 text-sm rounded-xl border bg-gray-50
        focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
        placeholder:text-gray-300 text-gray-900 font-medium
        transition-all duration-200
        ${error ? "border-red-300 bg-red-50" : "border-gray-200"}
      `}
      style={doShake ? { animation: "shake 0.4s ease" } : {}}
      {...props}
    />
  );
}

// ── Select stylisé ─────────────────────────────────────────
function StyledSelect({ options, error, ...props }) {
  return (
    <select
      className={`
        w-full px-3 py-2 text-sm rounded-xl border bg-gray-50
        focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
        text-gray-900 font-medium transition-all duration-200 cursor-pointer
        ${error ? "border-red-300 bg-red-50" : "border-gray-200"}
      `}
      {...props}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ),
      )}
    </select>
  );
}

// ── Score stepper avec animation ───────────────────────────
function ScoreStepper({ label, value, onChange, delay }) {
  const [popped, setPopped] = useState(false);

  const change = (delta) => {
    const next = Math.max(0, parseInt(value) + delta);
    onChange({ target: { value: next } });
    setPopped(true);
    setTimeout(() => setPopped(false), 300);
  };

  return (
    <AnimatedField label={label} delay={delay}>
      <div className="flex items-center gap-2">
        {/* Bouton − */}
        <button
          type="button"
          onClick={() => change(-1)}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50
                     hover:bg-red-50 hover:border-red-200 hover:text-red-600
                     flex items-center justify-center text-gray-500
                     transition-all duration-150 active:scale-90 text-lg font-light flex-shrink-0"
        >
          −
        </button>

        {/* Valeur */}
        <div className="flex-1 relative">
          <div
            className="w-full text-center py-2 rounded-xl border border-gray-200 bg-gray-50
                       text-2xl font-bold text-gray-900 tabular-nums select-none"
            style={
              popped
                ? {
                    animation:
                      "scorePopIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }
                : {}
            }
          >
            {value}
          </div>
        </div>

        {/* Bouton + */}
        <button
          type="button"
          onClick={() => change(+1)}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50
                     hover:bg-green-50 hover:border-green-300 hover:text-green-700
                     flex items-center justify-center text-gray-500
                     transition-all duration-150 active:scale-90 text-lg font-light flex-shrink-0"
        >
          +
        </button>
      </div>
    </AnimatedField>
  );
}

// ── Barre de progression (complétude du formulaire) ────────
function ProgressBar({ form }) {
  const champs = [
    form.domicile,
    form.exterieur,
    form.date,
    form.competition,
    form.statut,
  ];
  const remplis = champs.filter(Boolean).length;
  const pct = Math.round((remplis / champs.length) * 100);

  const color = pct < 40 ? "#f87171" : pct < 80 ? "#fbbf24" : "#22c55e";

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-400 font-medium">
          Complétude du formulaire
        </span>
        <span
          className="text-xs font-bold tabular-nums transition-all duration-300"
          style={{ color }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Aperçu live du match ───────────────────────────────────
function MatchPreview({ form }) {
  const domicile = form.domicile || "Équipe A";
  const exterieur = form.exterieur || "Équipe B";
  const aVenir = form.statut === "a_venir";

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 mb-5 relative overflow-hidden">
      {/* Motif décoratif */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Badge compétition */}
      <div className="flex justify-center mb-3">
        <span className="text-xs text-gray-400 bg-gray-700/60 px-3 py-1 rounded-full font-medium">
          {form.competition}
        </span>
      </div>

      {/* Équipes + score */}
      <div className="flex items-center justify-between gap-2 relative">
        <div className="flex-1 text-center">
          <p className="text-white font-bold text-base truncate">{domicile}</p>
          <p className="text-gray-500 text-xs mt-0.5">Domicile</p>
        </div>

        <div className="flex flex-col items-center gap-1 px-3">
          {aVenir ? (
            <div className="text-gray-400 text-xs font-medium tracking-widest">
              VS
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-black tabular-nums">
                {form.scoreDomicile}
              </span>
              <span className="text-gray-500 font-light">–</span>
              <span className="text-white text-2xl font-black tabular-nums">
                {form.scoreExterieur}
              </span>
            </div>
          )}
          {form.date && (
            <span className="text-gray-500 text-xs">{form.date}</span>
          )}
        </div>

        <div className="flex-1 text-center">
          <p className="text-white font-bold text-base truncate">{exterieur}</p>
          <p className="text-gray-500 text-xs mt-0.5">Extérieur</p>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
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
  if (!isOpen) return null;

  return (
    <MatchFormContent
      key={matchAEditer?.id ?? "new"}
      onClose={onClose}
      onSave={onSave}
      matchAEditer={matchAEditer}
    />
  );
}

function MatchFormContent({ onClose, onSave, matchAEditer }) {
  const [form, setForm] = useState(() => matchAEditer ?? MATCH_VIDE);
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (champ) => (e) => {
    setForm((f) => ({ ...f, [champ]: e.target.value }));
    if (errors[champ]) setErrors((e) => ({ ...e, [champ]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.domicile.trim()) errs.domicile = "requis";
    if (!form.exterieur.trim()) errs.exterieur = "requis";
    if (!form.date.trim()) errs.date = "requise";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setSaving(true);
    // Simuler un court délai "sauvegarde" pour l'effet visuel
    setTimeout(() => {
      onSave(form);
      setSaving(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={matchAEditer ? "Modifier le match" : "Ajouter un match"}
    >
      <style>{STYLES}</style>

      {/* Aperçu live */}
      <MatchPreview form={form} />

      {/* Barre de complétude */}
      <ProgressBar form={form} />

      <div
        className="flex flex-col gap-4"
        style={shaking ? { animation: "shake 0.4s ease" } : {}}
      >
        {/* Équipes */}
        <div className="grid grid-cols-2 gap-3">
          <AnimatedField
            label="Équipe domicile"
            error={errors.domicile}
            delay={0}
          >
            <StyledInput
              value={form.domicile}
              onChange={set("domicile")}
              placeholder="PSG"
              error={errors.domicile}
            />
          </AnimatedField>
          <AnimatedField
            label="Équipe extérieur"
            error={errors.exterieur}
            delay={60}
          >
            <StyledInput
              value={form.exterieur}
              onChange={set("exterieur")}
              placeholder="OM"
              error={errors.exterieur}
            />
          </AnimatedField>
        </div>

        {/* Score steppers */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreStepper
            label="Score domicile"
            value={form.scoreDomicile}
            onChange={set("scoreDomicile")}
            delay={120}
          />
          <ScoreStepper
            label="Score extérieur"
            value={form.scoreExterieur}
            onChange={set("scoreExterieur")}
            delay={180}
          />
        </div>

        {/* Date + Compétition */}
        <div className="grid grid-cols-2 gap-3">
          <AnimatedField label="Date" error={errors.date} delay={240}>
            <StyledInput
              value={form.date}
              onChange={set("date")}
              placeholder="26/04/2026"
              error={errors.date}
            />
          </AnimatedField>
          <AnimatedField label="Compétition" delay={300}>
            <StyledSelect
              value={form.competition}
              onChange={set("competition")}
              options={COMPETITIONS}
            />
          </AnimatedField>
        </div>

        {/* Statut */}
        <AnimatedField label="Statut" delay={360}>
          {/* Sélecteur visuel par boutons */}
          <div className="grid grid-cols-3 gap-2">
            {STATUTS.map((s) => {
              const active = form.statut === s.value;
              const colors = {
                a_venir: {
                  bg: "#f3f4f6",
                  active: "#e0f2fe",
                  border: "#7dd3fc",
                  text: "#0284c7",
                },
                en_direct: {
                  bg: "#f3f4f6",
                  active: "#fef9c3",
                  border: "#fde047",
                  text: "#a16207",
                },
                termine: {
                  bg: "#f3f4f6",
                  active: "#dcfce7",
                  border: "#86efac",
                  text: "#15803d",
                },
              };
              const c = colors[s.value] ?? colors.a_venir;

              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("statut")({ target: { value: s.value } })}
                  className="py-2 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95"
                  style={{
                    background: active ? c.active : c.bg,
                    borderColor: active ? c.border : "#e5e7eb",
                    color: active ? c.text : "#9ca3af",
                    boxShadow: active ? `0 0 0 3px ${c.border}40` : "none",
                    transform: active ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </AnimatedField>

        {/* Actions */}
        <div
          className="flex justify-end gap-2 pt-2 border-t border-gray-100"
          style={{
            animation: "fieldFadeUp 0.35s ease forwards 420ms",
            opacity: 0,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200
                       hover:bg-gray-50 text-gray-600 transition-all duration-150 active:scale-95"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="relative px-5 py-2 text-sm rounded-xl bg-green-600 text-white
                       hover:bg-green-700 transition-all duration-150 active:scale-95
                       disabled:opacity-70 flex items-center gap-2 font-medium min-w-[130px] justify-center"
          >
            {saving ? (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "spinOnce 0.6s linear infinite" }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Enregistrement…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {matchAEditer ? "Mettre à jour" : "Enregistrer"}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
