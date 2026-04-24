import { useState } from "react";
import Modal from "../ui/Modal";
import { CATEGORIES } from "../../data/flashnews";

// ── Keyframes ──────────────────────────────────────────────
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
  @keyframes spinOnce {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes previewPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.7; }
  }
  @keyframes charCount {
    from { transform: scale(1.3); }
    to   { transform: scale(1); }
  }
  @keyframes urgentGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
    50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  }
  @keyframes tickerSlide {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

// ── Champ animé avec label ─────────────────────────────────
function AnimatedField({ label, error, delay = 0, required, children }) {
  return (
    <div
      className="flex flex-col gap-1.5"
      style={{
        animation: `fieldFadeUp 0.35s ease forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
        {error && (
          <span
            className="text-xs text-red-500 font-medium"
            style={{ animation: "fieldFadeUp 0.2s ease forwards" }}
          >
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Input stylisé ──────────────────────────────────────────
function StyledInput({ error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50
                 placeholder:text-gray-300 text-gray-900 font-medium
                 focus:outline-none transition-all duration-200"
      style={{
        borderColor: error ? "#fca5a5" : focused ? "#22c55e" : "#e5e7eb",
        background: error ? "#fff5f5" : focused ? "#ffffff" : "#f9fafb",
        boxShadow:
          focused && !error
            ? "0 0 0 3px rgba(34,197,94,0.12)"
            : error
              ? "0 0 0 3px rgba(239,68,68,0.1)"
              : "none",
      }}
      {...props}
    />
  );
}

// ── Textarea avec compteur de caractères ───────────────────
function StyledTextarea({ value, onChange, error, maxLength = 300, ...props }) {
  const [focused, setFocused] = useState(false);
  const count = value?.length ?? 0;
  const pct = Math.min((count / maxLength) * 100, 100);
  const color = pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#22c55e";

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        className="w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50
                   placeholder:text-gray-300 text-gray-900 font-medium
                   resize-none focus:outline-none transition-all duration-200"
        style={{
          borderColor: error ? "#fca5a5" : focused ? "#22c55e" : "#e5e7eb",
          background: error ? "#fff5f5" : focused ? "#ffffff" : "#f9fafb",
          boxShadow:
            focused && !error ? "0 0 0 3px rgba(34,197,94,0.12)" : "none",
        }}
        {...props}
      />
      {/* Barre + compteur */}
      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <span
          key={count}
          className="text-xs tabular-nums font-medium transition-colors duration-200"
          style={{
            color,
            animation: "charCount 0.15s ease forwards",
          }}
        >
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ── Sélecteur urgence visuel ───────────────────────────────
function UrgenceSelector({ value, onChange }) {
  const options = [
    {
      value: "normal",
      label: "Normale",
      icon: "🟢",
      desc: "Information standard",
      bg: "#f0fdf4",
      border: "#86efac",
      text: "#15803d",
      glow: "rgba(34,197,94,0.2)",
    },
    {
      value: "urgent",
      label: "Urgente",
      icon: "🔴",
      desc: "Breaking news",
      bg: "#fef2f2",
      border: "#fca5a5",
      text: "#b91c1c",
      glow: "rgba(239,68,68,0.2)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange({ target: { value: o.value } })}
            className="p-3 rounded-xl border text-left transition-all duration-200 active:scale-95"
            style={{
              background: active ? o.bg : "#f9fafb",
              borderColor: active ? o.border : "#e5e7eb",
              boxShadow: active
                ? `0 0 0 3px ${o.glow}, ${
                    o.value === "urgent" && active
                      ? "0 0 12px rgba(239,68,68,0.15)"
                      : ""
                  }`
                : "none",
              transform: active ? "scale(1.02)" : "scale(1)",
              animation:
                active && o.value === "urgent"
                  ? "urgentGlow 2s ease-in-out infinite"
                  : "none",
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-base">{o.icon}</span>
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: active ? o.text : "#9ca3af" }}
              >
                {o.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-tight">{o.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

// ── Aperçu live ────────────────────────────────────────────
function FlashPreview({ form }) {
  const estUrgent = form.urgence === "urgent";
  const titre = form.titre || "Titre de la flash…";
  const contenu = form.contenu || "Le contenu apparaîtra ici…";

  return (
    <div
      className="rounded-2xl border overflow-hidden mb-5 transition-all duration-300"
      style={{
        borderColor: estUrgent ? "#fca5a5" : "#e5e7eb",
        background: estUrgent ? "#fff5f5" : "#f9fafb",
        boxShadow: estUrgent
          ? "0 4px 20px rgba(239,68,68,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Ticker si urgent */}
      {estUrgent && (
        <div className="bg-red-600 h-7 overflow-hidden flex items-center">
          <div
            className="flex gap-8 items-center"
            style={{ animation: "tickerSlide 8s linear infinite" }}
          >
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="text-white text-xs font-bold whitespace-nowrap flex items-center gap-2"
              >
                <span>⚡</span> BREAKING NEWS <span>·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 flex items-start gap-3">
        {/* Dot pulsant */}
        <div className="mt-1 flex-shrink-0">
          <span
            className="block w-2.5 h-2.5 rounded-full"
            style={{
              background: estUrgent ? "#ef4444" : "#22c55e",
              animation: estUrgent
                ? "urgentGlow 1.5s ease-in-out infinite"
                : "previewPulse 2s ease-in-out infinite",
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium">
              {form.categorie || "Catégorie"}
            </span>
            {estUrgent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-bold">
                ⚡ URGENT
              </span>
            )}
            <span className="text-xs text-gray-400 ml-auto tabular-nums">
              {new Date().toLocaleDateString("fr-FR")} · maintenant
            </span>
          </div>

          {/* Titre */}
          <p
            className="text-sm font-bold leading-snug mb-1 transition-colors duration-300"
            style={{ color: estUrgent ? "#b91c1c" : "#111827" }}
          >
            {titre}
          </p>

          {/* Contenu */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {contenu}
          </p>
        </div>
      </div>

      {/* Label aperçu */}
      <div className="px-4 pb-2 flex items-center gap-1.5">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">Aperçu live</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}

// ── Barre de complétude ────────────────────────────────────
function ProgressBar({ form }) {
  const champs = [form.titre, form.contenu, form.categorie, form.urgence];
  const remplis = champs.filter(Boolean).length;
  const pct = Math.round((remplis / champs.length) * 100);
  const color = pct < 50 ? "#f87171" : pct < 100 ? "#fbbf24" : "#22c55e";

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-400 font-medium">Complétude</span>
        <span
          className="text-xs font-bold tabular-nums transition-colors duration-300"
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

// ── Wrapper export ─────────────────────────────────────────
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

// ── Composant principal ────────────────────────────────────
function FlashNewsFormContent({ onClose, onSave, flashAEditer }) {
  const [form, setForm] = useState(
    () =>
      flashAEditer ?? {
        titre: "",
        contenu: "",
        categorie: "Général",
        urgence: "normal",
        date: "",
        heure: "",
      },
  );
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (champ) => (e) => {
    setForm((f) => ({ ...f, [champ]: e.target.value }));
    if (errors[champ]) setErrors((er) => ({ ...er, [champ]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.titre.trim()) errs.titre = "Titre requis";
    if (!form.contenu.trim()) errs.contenu = "Contenu requis";
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
    const now = new Date();
    setTimeout(() => {
      onSave({
        ...form,
        date: form.date || now.toLocaleDateString("fr-FR"),
        heure:
          form.heure ||
          now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      });
      setSaving(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={flashAEditer ? "Modifier la flash news" : "Nouvelle flash news"}
    >
      <style>{STYLES}</style>

      {/* Aperçu live */}
      <FlashPreview form={form} />

      {/* Progression */}
      <ProgressBar form={form} />

      <div
        className="flex flex-col gap-4"
        style={shaking ? { animation: "shake 0.4s ease" } : {}}
      >
        {/* Titre */}
        <AnimatedField label="Titre" required error={errors.titre} delay={0}>
          <StyledInput
            value={form.titre}
            onChange={set("titre")}
            placeholder="Ex : Mbappé de retour à l'entraînement"
            error={errors.titre}
          />
        </AnimatedField>

        {/* Contenu */}
        <AnimatedField
          label="Contenu"
          required
          error={errors.contenu}
          delay={60}
        >
          <StyledTextarea
            value={form.contenu}
            onChange={set("contenu")}
            placeholder="Détails de l'information…"
            rows={4}
            error={errors.contenu}
          />
        </AnimatedField>

        {/* Catégorie */}
        <AnimatedField label="Catégorie" delay={120}>
          <select
            value={form.categorie}
            onChange={set("categorie")}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200
                       bg-gray-50 text-gray-900 font-medium focus:outline-none
                       focus:ring-2 focus:ring-green-400 focus:border-transparent
                       transition-all duration-200 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </AnimatedField>

        {/* Urgence */}
        <AnimatedField label="Niveau d'urgence" delay={180}>
          <UrgenceSelector value={form.urgence} onChange={set("urgence")} />
        </AnimatedField>

        {/* Actions */}
        <div
          className="flex justify-end gap-2 pt-2 border-t border-gray-100"
          style={{
            animation: "fieldFadeUp 0.35s ease forwards 240ms",
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
            className="relative px-5 py-2 text-sm rounded-xl text-white font-semibold
                       transition-all duration-200 active:scale-95 disabled:opacity-70
                       flex items-center gap-2 min-w-[120px] justify-center"
            style={{
              background:
                form.urgence === "urgent"
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow:
                form.urgence === "urgent"
                  ? "0 4px 14px rgba(239,68,68,0.35)"
                  : "0 4px 14px rgba(34,197,94,0.35)",
            }}
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
                Publication…
              </>
            ) : (
              <>
                <span>{form.urgence === "urgent" ? "⚡" : "✓"}</span>
                {flashAEditer ? "Mettre à jour" : "Publier"}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
