import { useState } from "react";
import MatchsTable from "./components/matchs/MatchsTable";
import FlashNewsList from "./components/flashnews/FlashNewsList";

const PAGES = [
  { id: "matchs", label: "Matchs", composant: MatchsTable },
  { id: "flashnews", label: "Flash news", composant: FlashNewsList },
];

export default function App() {
  const [pageActive, setPageActive] = useState("matchs");
  const Page = PAGES.find((p) => p.id === pageActive).composant;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-48 bg-white border-r border-gray-100 flex flex-col p-4 gap-1">
        <div className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center text-white text-xs">
            ⚽
          </span>
          FootAdmin
        </div>
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPageActive(p.id)}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              pageActive === p.id
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto">
        <Page />
      </main>
    </div>
  );
}
