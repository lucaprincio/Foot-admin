import { useState, useEffect, useRef } from "react";
import MatchRow from "./MatchRow";
import MatchForm from "./MatchForm";
import { MATCHS_INITIAUX } from "../../data/matchs";

// ── Animation hook : observer pour déclencher les entrées ──
function useInView(threshold = 0.1) {
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
  }, []);
  return [ref, visible];
}

// ── Compteur animé ─────────────────────────────────────────
function AnimatedCounter({ target, duration = 800 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

// ── Carte stat animée ──────────────────────────────────────
function StatCard({ label, val, accent, delay }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full rounded-t-2xl"
        style={{ background: accent }}
      />
      {/* Glow au hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${accent}18 0%, transparent 70%)`,
        }}
      />
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold text-gray-900 tabular-nums">
        {visible ? <AnimatedCounter target={val} /> : 0}
      </p>
    </div>
  );
}

// ── Ligne animée (wrapper) ─────────────────────────────────
function AnimatedRow({ children, index, visible }) {
  return (
    <tr
      style={{
        transitionDelay: `${index * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-16px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {children}
    </tr>
  );
}

// ── Toast notification ─────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors = {
    success: "bg-green-600",
    danger: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-2xl
        ${colors[type]}
        animate-slide-up`}
      style={{
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <span>{type === "success" ? "✓" : type === "danger" ? "✕" : "ℹ"}</span>
      {message}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function MatchsTable() {
  const [matchs, setMatchs] = useState(MATCHS_INITIAUX);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [matchAEditer, setMatchAEditer] = useState(null);
  const [toast, setToast] = useState(null);
  const [tableRef, tableVisible] = useInView(0.05);
  const [headerMounted, setHeaderMounted] = useState(false);

  // Monter le header avec un léger délai
  useEffect(() => {
    const t = setTimeout(() => setHeaderMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ── Stats ────────────────────────────────────────────────
  const total = matchs.length;
  const termines = matchs.filter((m) => m.statut === "termine").length;
  const aVenir = matchs.filter((m) => m.statut === "a_venir").length;

  // ── Helpers ──────────────────────────────────────────────
  const showToast = (message, type = "success") => setToast({ message, type });

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
      setMatchs((prev) =>
        prev.map((m) => (m.id === matchAEditer.id ? { ...m, ...formData } : m)),
      );
      showToast("Match mis à jour", "info");
    } else {
      setMatchs((prev) => [{ ...formData, id: Date.now() }, ...prev]);
      showToast("Match ajouté avec succès", "success");
    }
  };

  const supprimer = (id) => {
    setMatchs((prev) => prev.filter((m) => m.id !== id));
    showToast("Match supprimé", "danger");
  };

  // ── Rendu ────────────────────────────────────────────────
  return (
    <>
      {/* Keyframes injectées */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .btn-pulse:active {
          transform: scale(0.96);
          transition: transform 0.1s;
        }
        tr { display: table-row; }
      `}</style>

      <div className="p-6 min-h-screen bg-gray-50">
        {/* ── En-tête ───────────────────────────────────── */}
        <div
          style={{
            opacity: headerMounted ? 1 : 0,
            transform: headerMounted ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
          className="flex items-center justify-between mb-7"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              {/* Pastille live animée */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-widest">
                Live Dashboard
              </p>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tableau des matchs
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Gestion et insertion des résultats
            </p>
          </div>

          <button
            onClick={ouvrirAjout}
            className="btn-pulse relative overflow-hidden bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl
                       hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-green-200 hover:shadow-lg
                       flex items-center gap-2 font-medium"
          >
            {/* Shimmer effect */}
            <span
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
            <span className="text-lg leading-none">+</span>
            Ajouter un match
          </button>
        </div>

        {/* ── Cartes stats ──────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          <StatCard
            label="Total matchs"
            val={total}
            accent="#22c55e"
            delay={0}
          />
          <StatCard
            label="Terminés"
            val={termines}
            accent="#3b82f6"
            delay={80}
          />
          <StatCard label="À venir" val={aVenir} accent="#f59e0b" delay={160} />
        </div>

        {/* ── Tableau ───────────────────────────────────── */}
        <div
          ref={tableRef}
          style={{
            opacity: tableVisible ? 1 : 0,
            transform: tableVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
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
                    className="px-4 py-3 text-left text-xs text-gray-400 uppercase tracking-wider font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchs.map((m, i) => (
                <AnimatedRow key={m.id} index={i} visible={tableVisible}>
                  <MatchRow
                    match={m}
                    onEdit={ouvrirEdit}
                    onDelete={supprimer}
                  />
                </AnimatedRow>
              ))}

              {matchs.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-sm text-gray-400"
                    style={{ animation: "fadeIn 0.4s ease" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">⚽</span>
                      <span>Aucun match enregistré</span>
                      <button
                        onClick={ouvrirAjout}
                        className="mt-1 text-green-600 hover:underline text-sm"
                      >
                        Ajouter le premier match
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pied de tableau */}
          {matchs.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {matchs.length} match{matchs.length > 1 ? "s" : ""} au total
              </p>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />{" "}
                  Terminé
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{" "}
                  En direct
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />{" "}
                  À venir
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Modale ────────────────────────────────────── */}
        <MatchForm
          key={`${modalOuverte}-${matchAEditer?.id ?? "new"}`}
          isOpen={modalOuverte}
          onClose={() => setModalOuverte(false)}
          onSave={sauvegarder}
          matchAEditer={matchAEditer}
        />

        {/* ── Toast ─────────────────────────────────────── */}
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
