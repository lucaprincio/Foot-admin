import { useState } from "react";
import ArticleRow from "./ArticleRow";
import ArticleForm from "./ArticleForm";
import { ARTICLES_INITIAUX, CATEGORIES_ARTICLE } from "../../data/articles";

export default function ArticlesTable() {
  const [articles, setArticles] = useState(ARTICLES_INITIAUX);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [articleAEditer, setArticleAEditer] = useState(null);

  // Filtres
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreCategorie, setFiltreCategorie] = useState("toutes");
  const [recherche, setRecherche] = useState("");

  // ── Stats ──────────────────────────────────────────────────────────────
  const nbPublies = articles.filter((a) => a.statut === "publie").length;
  const nbBrouillons = articles.filter((a) => a.statut === "brouillon").length;
  const nbArchives = articles.filter((a) => a.statut === "archive").length;

  // ── Handlers ───────────────────────────────────────────────────────────
  const ouvrirAjout = () => {
    setArticleAEditer(null);
    setModalOuverte(true);
  };
  const ouvrirEdit = (a) => {
    setArticleAEditer(a);
    setModalOuverte(true);
  };

  const sauvegarder = (formData) => {
    if (articleAEditer) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleAEditer.id ? { ...a, ...formData } : a,
        ),
      );
    } else {
      setArticles((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    }
  };

  const supprimer = (id) =>
    setArticles((prev) => prev.filter((a) => a.id !== id));

  // ── Filtrage ───────────────────────────────────────────────────────────
  const articlesFiltres = articles.filter((a) => {
    const matchStatut = filtreStatut === "tous" || a.statut === filtreStatut;
    const matchCategorie =
      filtreCategorie === "toutes" || a.categorie === filtreCategorie;
    const matchRecherche =
      a.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      a.auteur.toLowerCase().includes(recherche.toLowerCase());
    return matchStatut && matchCategorie && matchRecherche;
  });

  // ── Rendu ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-400">
            Gestion des contenus éditoriaux
          </p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Créer un article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", val: articles.length },
          { label: "Publiés", val: nbPublies },
          { label: "Brouillons", val: nbBrouillons },
          { label: "Archivés", val: nbArchives },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Barre de filtres + recherche */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Recherche */}
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un titre, un auteur..."
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />

        {/* Filtre statut */}
        <div className="flex gap-1">
          {[
            { value: "tous", label: "Tous" },
            { value: "publie", label: "Publiés" },
            { value: "brouillon", label: "Brouillons" },
            { value: "archive", label: "Archivés" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltreStatut(f.value)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filtreStatut === f.value
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtre catégorie */}
        <select
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="toutes">Toutes catégories</option>
          {CATEGORIES_ARTICLE.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Titre",
                "Catégorie",
                "Auteur",
                "Date",
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
            {articlesFiltres.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              articlesFiltres.map((a) => (
                <ArticleRow
                  key={a.id}
                  article={a}
                  onEdit={ouvrirEdit}
                  onDelete={supprimer}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modale */}
      <ArticleForm
        isOpen={modalOuverte}
        onClose={() => setModalOuverte(false)}
        onSave={sauvegarder}
        articleAEditer={articleAEditer}
      />
    </div>
  );
}
