"use client";
import { useRef, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem, getTechIconUrl } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface CircuitViewProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const COLORS = {
  dark: {
    bg: "#0a0a0a",
    card: "#111111",
    border: "#1a1a1a",
    accent: "#00FF88",
    text: "#ffffff",
    muted: "#666666",
    trace: "#1a1a1a",
  },
  light: {
    bg: "#f5f5f5",
    card: "#ffffff",
    border: "#e5e5e5",
    accent: "#00AA66",
    text: "#111111",
    muted: "#888888",
    trace: "#e5e5e5",
  },
};

function TechChip({
  tech,
  categoryId,
  isActive,
  isRelated,
  onHover,
  index,
}: {
  tech: TechItem;
  categoryId: string;
  isActive: boolean;
  isRelated: boolean;
  onHover: (tech: TechItem | null) => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme, language } = useTheme();
  const c = theme === "dark" ? COLORS.dark : COLORS.light;

  const lang = language as keyof typeof tech.description;
  const description = tech.description[lang] || tech.description.en;

  const borderColor = isActive
    ? c.accent
    : isRelated
      ? `${c.accent}60`
      : c.border;

  const bgColor = isActive
    ? `${c.accent}15`
    : isHovered
      ? `${c.accent}08`
      : c.card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(tech);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      className="relative"
      style={{ zIndex: isHovered ? 10 : 1 }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : isActive ? 1.01 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="p-4 rounded-xl border cursor-pointer transition-all duration-200"
        style={{
          background: bgColor,
          borderColor: borderColor,
          borderWidth: isActive ? 2 : 1,
          boxShadow: isActive
            ? `0 0 20px ${c.accent}30`
            : isHovered
              ? `0 4px 20px rgba(0,0,0,0.1)`
              : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: isActive
                ? `${c.accent}20`
                : isHovered
                  ? `${c.accent}15`
                  : `${c.accent}08`,
              border: `1px solid ${isActive ? c.accent : `${c.accent}30`}`,
            }}
          >
            <Image
              src={getTechIconUrl(tech.icon)}
              alt={tech.name}
              width={22}
              height={22}
              className="object-contain"
              style={{
                filter: theme === "dark"
                  ? "brightness(0) invert(1)"
                  : "none",
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-sm truncate"
              style={{ color: isActive ? c.accent : c.text }}
            >
              {tech.name}
            </h3>
            <p className="text-xs" style={{ color: c.muted }}>
              {tech.years}y · {tech.projects}proj
            </p>
          </div>
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-3 border-t"
            style={{ borderColor: c.border }}
          >
            <p className="text-xs leading-relaxed" style={{ color: c.muted }}>
              {description}
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="absolute -z-10"
        style={{
          inset: 0,
          background: `radial-gradient(circle at center, ${c.accent}20 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          borderRadius: 12,
          filter: "blur(20px)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function CategorySection({
  category,
  isActive,
  onTechHover,
}: {
  category: (typeof techCategories)[0];
  isActive: boolean;
  onTechHover: (tech: TechItem | null) => void;
}) {
  const { theme, language } = useTheme();
  const c = theme === "dark" ? COLORS.dark : COLORS.light;

  const lang = language as keyof typeof category.name;
  const categoryName = category.name[lang] || category.name.en;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{category.icon}</span>
        <h2
          className="text-lg font-bold"
          style={{ color: c.text }}
        >
          {categoryName}
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: c.border }}
        />
        <span className="text-xs font-mono" style={{ color: c.muted }}>
          {category.techs.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {category.techs.map((tech, i) => (
          <TechChip
            key={tech.name}
            tech={tech}
            categoryId={category.id}
            isActive={isActive}
            isRelated={false}
            onHover={onTechHover}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function CircuitDecoration({
  theme,
}: {
  theme: "dark" | "light";
}) {
  const c = theme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute w-full h-full opacity-[0.03]">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 5}%`}
            x2="100%"
            y2={`${(i + 1) * 5}%`}
            stroke={c.trace}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i + 1) * 5}%`}
            y1="0"
            x2={`${(i + 1) * 5}%`}
            y2="100%"
            stroke={c.trace}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}
      </svg>

      <div
        className="absolute top-8 left-8 w-px h-20"
        style={{ background: `linear-gradient(to bottom, ${c.accent}, transparent)` }}
      />
      <div
        className="absolute bottom-8 right-8 w-20 h-px"
        style={{ background: `linear-gradient(to right, ${c.accent}, transparent)` }}
      />

      <div
        className="absolute top-4 right-4 w-2 h-2 rounded-full"
        style={{ background: c.accent, boxShadow: `0 0 10px ${c.accent}` }}
      />
      <div
        className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
        style={{ background: c.accent, boxShadow: `0 0 10px ${c.accent}` }}
      />
    </div>
  );
}

export default function CircuitView({ activeCategory, onTechSelect }: CircuitViewProps) {
  const { theme, language } = useTheme();
  const c = theme === "dark" ? COLORS.dark : COLORS.light;

  const filteredCategories = useMemo(() => {
    if (!activeCategory) return techCategories;
    return techCategories.filter(cat => cat.id === activeCategory);
  }, [activeCategory]);

  const handleTechHover = useCallback(
    (tech: TechItem | null) => {
      if (onTechSelect) onTechSelect(tech);
    },
    [onTechSelect]
  );

  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <CircuitDecoration theme={theme as "dark" | "light"} />

      <div className="relative z-10">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isActive={activeCategory === category.id || activeCategory === null}
            onTechHover={handleTechHover}
          />
        ))}
      </div>

      <div
        className="absolute bottom-2 right-4 text-[9px] font-mono"
        style={{ color: c.muted, opacity: 0.5 }}
      >
        ◈ CIRCUIT VIEW
      </div>
    </div>
  );
}