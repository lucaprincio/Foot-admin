import { useState, useEffect, useRef } from "react";
import FlashNewsCard from "./FlashNewsCard";
import FlashNewsForm from "./FlashNewsForm";
import { FLASHNEWS_INITIALES } from "../../data/flashnews";

// ── Keyframes ──────────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { transform: translateY(8px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }
  @keyframes filterSlide {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes emptyBounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes spinOnce {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes tickerScroll {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes urgentPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
  }
`;

// ── Hook IntersectionObserver ──────────────────────────────
function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Compteur animé ─────────────────────────────────────────
function AnimatedCounter({ target }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target]);

  return (
    <span key={target} style={{ animation: "countUp 0.3s ease forwards" }}>
      {val}
    </span>
  );
}

// ── Carte stat ─────────────────────────────────────────────
function StatCard({ label, val, accent, icon, delay, onClick, active }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-3px)"
            : "translateY(0)"
          : "translateY(20px)",
        transition:
          "opacity 0.45s ease, transform 0.3s ease, box-shadow 0.3s ease",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        boxShadow: active
          ? `0 0 0 2px ${accent}, 0 8px 24px ${accent}28`
          : hovered
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 1px 3px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
      }}
      className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden"
    >
      {/* Barre accent */}
      <div
        className="absolute top-0 left-0 h-1 rounded-t-2xl transition-all duration-300"
        style={{
          width: active || hovered ? "100%" : "40%",
          background: accent,
        }}
      />

      {/* Glow de fond */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 20% 80%, ${accent}12 0%, transparent 60%)`,
          opacity: active || hovered ? 1 : 0,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
            {label}
          </p>
          <p className="text-3xl font-black text-gray-900 tabular-nums leading-none">
            {visible ? <AnimatedCounter target={val} /> : 0}
          </p>
        </div>
        <span className="text-2xl opacity-70">{icon}</span>
      </div>
    </div>
  );
}

// ── Ticker d'actualités ────────────────────────────────────
function NewsTicker({ flashes }) {
  const urgentes = flashes.filter((f) => f.urgence === "urgent");
  if (urgentes.length === 0) return null;

  return (
    <div className="flex items-center gap-0 bg-red-600 rounded-xl overflow-hidden mb-5 h-9">
      {/* Label fixe */}
      <div className="flex items-center gap-1.5 px-3 bg-red-700 h-full flex-shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full bg-white"
          style={{ animation: "emptyBounce 1s ease-in-out infinite" }}
        />
        <span className="text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          Urgent
        </span>
      </div>

      {/* Défilement */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div
          className="whitespace-nowrap text-white text-xs font-medium flex gap-12 items-center"
          style={{ animation: "tickerScroll 18s linear infinite" }}
        >
          {[...urgentes, ...urgentes].map((f, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="opacity-50">⚡</span>
              {f.titre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Bouton filtre animé ────────────────────────────────────
function FilterButton({ label, active, onClick, count, delay }) {
  return (
    <button
      onClick={onClick}
      style={{
        animation: `filterSlide 0.3s ease forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
        transition: "all 0.2s ease",
        transform: active ? "scale(1.04)" : "scale(1)",
      }}
      className={`
        flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border font-medium
        active:scale-95 transition-all
        ${
          active
            ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-200"
            : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
        }
      `}
    >
      {label}
      <span
        className={`
        text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums
        ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}
      `}
      >
        {count}
      </span>
    </button>
  );
}

// ── Toast ──────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const cfg = {
    success: { bg: "#16a34a", icon: "✓" },
    danger: { bg: "#dc2626", icon: "✕" },
    info: { bg: "#2563eb", icon: "ℹ" },
  }[type] ?? { bg: "#374151", icon: "·" };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3
                 rounded-2xl text-white text-sm font-medium shadow-2xl"
      style={{
        background: cfg.bg,
        animation: "fadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
        {cfg.icon}
      </span>
      {message}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function FlashNewsList() {
  const [flashes, setFlashes] = useState(FLASHNEWS_INITIALES);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [flashAEditer, setFlashAEditer] = useState(null);
  const [filtreUrgence, setFiltreUrgence] = useState("tous");
  const [toast, setToast] = useState(null);
  const [headerMounted, setHeaderMounted] = useState(false);
  const [listKey, setListKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setHeaderMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Stats
  const nbUrgentes = flashes.filter((f) => f.urgence === "urgent").length;
  const nbNormales = flashes.filter((f) => f.urgence === "normal").length;

  const showToast = (message, type = "success") => setToast({ message, type });

  // Handlers
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
      showToast("Flash mise à jour", "info");
    } else {
      setFlashes((prev) => [{ ...formData, id: Date.now() }, ...prev]);
      showToast("Flash publiée !", "success");
    }
    setListKey((k) => k + 1);
  };

  const supprimer = (id) => {
    setFlashes((prev) => prev.filter((f) => f.id !== id));
    showToast("Flash supprimée", "danger");
  };

  // Filtrage
  const comptes = {
    tous: flashes.length,
    urgent: nbUrgentes,
    normal: nbNormales,
  };

  const flashesFiltrees =
    filtreUrgence === "tous"
      ? flashes
      : flashes.filter((f) => f.urgence === filtreUrgence);

  const FILTRES = [
    { value: "tous", label: "Toutes", icon: "📋" },
    { value: "urgent", label: "Urgentes", icon: "🔴" },
    { value: "normal", label: "Normales", icon: "🟢" },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="p-6 min-h-screen bg-gray-50">
        {/* ── En-tête ─────────────────────────────────── */}
        <div
          style={{
            opacity: headerMounted ? 1 : 0,
            transform: headerMounted ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="relative flex h-2 w-2"
                style={{ animation: "urgentPulse 2s ease-in-out infinite" }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
                Salle de presse
              </p>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Flash News
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Actualités courtes et rapides
            </p>
          </div>

          <button
            onClick={ouvrirAjout}
            className="relative overflow-hidden bg-gray-900 text-white text-sm px-5 py-2.5
                       rounded-xl hover:bg-gray-800 transition-all duration-200
                       shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold
                       active:scale-95"
          >
            <span className="text-yellow-400">⚡</span>
            Nouvelle flash
          </button>
        </div>

        {/* ── Ticker urgentes ──────────────────────────── */}
        <div
          style={{ animation: "slideDown 0.4s ease forwards 0.1s", opacity: 0 }}
        >
          <NewsTicker flashes={flashes} />
        </div>

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total"
            val={flashes.length}
            accent="#6366f1"
            icon="📰"
            delay={0}
            onClick={() => setFiltreUrgence("tous")}
            active={filtreUrgence === "tous"}
          />
          <StatCard
            label="Urgentes"
            val={nbUrgentes}
            accent="#ef4444"
            icon="🔴"
            delay={80}
            onClick={() => setFiltreUrgence("urgent")}
            active={filtreUrgence === "urgent"}
          />
          <StatCard
            label="Normales"
            val={nbNormales}
            accent="#22c55e"
            icon="🟢"
            delay={160}
            onClick={() => setFiltreUrgence("normal")}
            active={filtreUrgence === "normal"}
          />
        </div>

        {/* ── Filtres ──────────────────────────────────── */}
        <div className="flex gap-2 mb-5">
          {FILTRES.map((f, i) => (
            <FilterButton
              key={f.value}
              label={f.label}
              active={filtreUrgence === f.value}
              onClick={() => setFiltreUrgence(f.value)}
              count={comptes[f.value]}
              delay={i * 60}
            />
          ))}

          {/* Séparateur + compteur résultats */}
          <div className="ml-auto flex items-center text-xs text-gray-400 font-medium">
            {flashesFiltrees.length} résultat
            {flashesFiltrees.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* ── Liste ────────────────────────────────────── */}
        <div key={listKey} className="flex flex-col gap-3">
          {flashesFiltrees.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-16 text-gray-400"
              style={{ animation: "fadeUp 0.4s ease forwards" }}
            >
              <span
                className="text-5xl"
                style={{ animation: "emptyBounce 2s ease-in-out infinite" }}
              >
                📭
              </span>
              <p className="text-sm font-medium">Aucune flash news trouvée</p>
              <button
                onClick={ouvrirAjout}
                className="text-xs text-green-600 hover:underline mt-1"
              >
                Publier la première flash
              </button>
            </div>
          ) : (
            flashesFiltrees.map((f, i) => (
              <div
                key={f.id}
                style={{
                  animation: "fadeUp 0.35s ease forwards",
                  animationDelay: `${i * 50}ms`,
                  opacity: 0,
                }}
              >
                <FlashNewsCard
                  flash={f}
                  onEdit={ouvrirEdit}
                  onDelete={supprimer}
                />
              </div>
            ))
          )}
        </div>

        {/* Pied de liste */}
        {flashesFiltrees.length > 0 && (
          <div
            className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between"
            style={{ animation: "fadeUp 0.4s ease forwards 0.3s", opacity: 0 }}
          >
            <p className="text-xs text-gray-400">
              {flashes.length} flash{flashes.length > 1 ? "s" : ""} au total
            </p>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span
                  className="w-2 h-2 rounded-full bg-red-400 inline-block"
                  style={{ animation: "urgentPulse 2s ease-in-out infinite" }}
                />
                Urgente
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                Normale
              </span>
            </div>
          </div>
        )}

        {/* ── Modale ──────────────────────────────────── */}
        <FlashNewsForm
          key={`${modalOuverte}-${flashAEditer?.id ?? "new"}`}
          isOpen={modalOuverte}
          onClose={() => setModalOuverte(false)}
          onSave={sauvegarder}
          flashAEditer={flashAEditer}
        />

        {/* ── Toast ───────────────────────────────────── */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}
