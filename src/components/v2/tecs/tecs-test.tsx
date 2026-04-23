"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/switchers/switchers";
import { techCategories } from "@/data/v2-tecs";

const ConstellationView = dynamic(() => import("./constellation-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className={`w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin`} />
    </div>
  ),
});

const CircuitView = dynamic(() => import("./circuit-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className={`w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin`} />
    </div>
  ),
});

const TimelineView = dynamic(() => import("./timeline-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className={`w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin`} />
    </div>
  ),
});

type ViewType = "constellation" | "circuit" | "timeline";

const views: { id: ViewType; label: string; icon: string; description: string }[] = [
  {
    id: "constellation",
    label: "Constellation",
    icon: "✦",
    description: "Mapa estelar com conexões entre tecnologias"
  },
  {
    id: "circuit",
    label: "Circuit Board",
    icon: "◈",
    description: "Placa de circuito com trilhas animadas"
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: "◆",
    description: "Linha do tempo com skill trees"
  },
];

export default function TecsTestPage() {
  const [activeView, setActiveView] = useState<ViewType>("constellation");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { theme, language } = useTheme();
  const isDark = theme === "dark";

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
  };

  const categoryLabels = techCategories.map(cat => ({
    id: cat.id,
    name: cat.name[language as keyof typeof cat.name] || cat.name.en,
    icon: cat.icon,
    count: cat.techs.length,
  }));

  const allCount = techCategories.reduce((acc, cat) => acc + cat.techs.length, 0);

  return (
    <main className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Tech Views Test
            <span className={isDark ? "text-cyan-400" : "text-blue-600"}>.</span>
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Compare os 3 conceitos de design para a página de tecnologias
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {views.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${activeView === view.id
                  ? isDark
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50"
                    : "bg-blue-500/20 text-blue-600 border border-blue-500/50"
                  : isDark
                    ? "bg-white/5 text-white/60 border border-white/10 hover:border-white/30"
                    : "bg-black/5 text-black/60 border border-black/10 hover:border-black/30"
                }
              `}
            >
              <span>{view.icon}</span>
              <span>{view.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <motion.button
            onClick={() => handleCategoryChange(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === null
                ? isDark
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50"
                  : "bg-blue-500/20 text-blue-600 border border-blue-500/50"
                : isDark
                  ? "bg-white/5 text-white/60 border border-white/10"
                  : "bg-black/5 text-black/60 border border-black/10"
              }
            `}
          >
            All ({allCount})
          </motion.button>
          {categoryLabels.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1
                ${activeCategory === cat.id
                  ? isDark
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50"
                    : "bg-blue-500/20 text-blue-600 border border-blue-500/50"
                  : isDark
                    ? "bg-white/5 text-white/60 border border-white/10"
                    : "bg-black/5 text-black/60 border border-black/10"
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="opacity-60">({cat.count})</span>
            </motion.button>
          ))}
        </div>

        <div className={`rounded-2xl border ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"} p-4 sm:p-8`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === "constellation" && <ConstellationView activeCategory={activeCategory} />}
              {activeView === "circuit" && <CircuitView activeCategory={activeCategory} />}
              {activeView === "timeline" && <TimelineView activeCategory={activeCategory} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {views.map((view) => (
            <div
              key={view.id}
              className={`
                p-4 rounded-xl border transition-all
                ${activeView === view.id
                  ? isDark
                    ? "border-cyan-400/30 bg-cyan-400/5"
                    : "border-blue-500/30 bg-blue-500/5"
                  : isDark
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-black/5"
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{view.icon}</span>
                <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {view.label}
                </h3>
              </div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {view.description}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-8 p-4 rounded-xl ${isDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"}`}>
          <h3 className={`font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Como testar:
          </h3>
          <ul className={`text-sm space-y-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <li>1. Selecione um dos 3 conceitos acima</li>
            <li>2. Filtre por categoria ou veja todas as tecnologias</li>
            <li>3. Interaja com hover/click nos elementos</li>
            <li>4. Navegue entre os conceitos para comparar</li>
          </ul>
        </div>
      </div>
    </main>
  );
}