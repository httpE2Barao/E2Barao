"use client";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface TimelineViewProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const TRUNK_COLOR_DARK = "#4a3728";
const TRUNK_COLOR_LIGHT = "#8b7355";
const BRANCH_COLOR = "#6b8e5a";
const LEAF_ACTIVE = "#7cb342";
const LEAF_INACTIVE = "#4a5d23";

function TimelineTrunk({
  height,
  isDark,
}: {
  height: number;
  isDark: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-3 rounded-full"
      style={{
        height,
        background: isDark
          ? "linear-gradient(to bottom, #5d4a3a, #3d2d20, #2a1f18)"
          : "linear-gradient(to bottom, #a08060, #8b7355, #6d5a45)",
        boxShadow: isDark
          ? "0 0 20px rgba(90, 70, 50, 0.3)"
          : "0 0 20px rgba(139, 115, 85, 0.2)",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)"
            : "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
          scaleY,
          transformOrigin: "top",
        }}
      />

      <div
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 8px,
            ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"} 8px,
            ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"} 10px
          )`,
        }}
      />
    </motion.div>
  );
}

function TimelineNode({
  tech,
  index,
  side,
  isActive,
  isRelated,
  onHover,
}: {
  tech: TechItem;
  index: number;
  side: "left" | "right";
  isActive: boolean;
  isRelated: boolean;
  onHover: (tech: TechItem | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { theme, language } = useTheme();
  const isDark = theme === "dark";

  const lang = language as keyof typeof tech.description;
  const description = tech.description[lang] || tech.description.en;

  const leafColor = isActive ? LEAF_ACTIVE : isRelated ? BRANCH_COLOR : LEAF_INACTIVE;

  const xOffset = side === "left" ? -20 : 20;
  const translateX = side === "left" ? "-110%" : "10%";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xOffset * 2 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex items-center mb-12"
      style={{ minHeight: 100 }}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 z-10"
        style={{
          background: isActive
            ? "linear-gradient(135deg, #7cb342, #558b2f)"
            : isRelated
              ? "linear-gradient(135deg, #6b8e5a, #4a6d3a)"
              : isDark
                ? "linear-gradient(135deg, #3d2d20, #2a1f18)"
                : "linear-gradient(135deg, #a08060, #8b7355)",
          borderColor: leafColor,
          boxShadow: isActive
            ? `0 0 20px ${LEAF_ACTIVE}`
            : isRelated
              ? `0 0 15px ${BRANCH_COLOR}`
              : "none",
        }}
        whileHover={{ scale: 1.2 }}
      >
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <Image
            src={`/images/${tech.icon}`}
            alt={tech.name}
            width={14}
            height={14}
            className="object-contain brightness-0 invert opacity-80"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className="absolute left-1/2 h-0.5 origin-left"
        style={{
          width: side === "left" ? 80 : 80,
          background: `linear-gradient(${side === "left" ? "to left" : "to right"}, ${leafColor}, transparent)`,
          top: "50%",
          transform: `translateY(-50%) ${side === "left" ? "" : "scaleX(-1)"}`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: translateX, scale: 0.8 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3, ease: "backOut" }}
        onMouseEnter={() => onHover(tech)}
        onMouseLeave={() => onHover(null)}
        className={`
          absolute ${side === "left" ? "right-1/2" : "left-1/2"} w-44 p-4 rounded-xl cursor-pointer
          transition-all duration-300
          ${isActive
            ? isDark
              ? "bg-gradient-to-br from-green-900/40 to-emerald-950/60 border-green-500/50"
              : "bg-gradient-to-br from-green-100/80 to-green-200/60 border-green-500/50"
            : isRelated
              ? isDark
                ? "bg-gradient-to-br from-amber-900/30 to-orange-950/50 border-amber-600/40"
                : "bg-gradient-to-br from-amber-100/80 to-orange-200/60 border-amber-500/40"
              : isDark
                ? "bg-gradient-to-br from-stone-900/60 to-stone-950/80 border-stone-700/40"
                : "bg-gradient-to-br from-stone-100/80 to-stone-200/60 border-stone-400/40"
          }
        `}
        style={{
          transform: side === "left" ? "translateX(calc(-100% - 60px))" : "translateX(60px)",
          boxShadow: isActive
            ? `0 0 30px ${LEAF_ACTIVE}40`
            : isRelated
              ? `0 0 20px ${BRANCH_COLOR}30`
              : "none",
        }}
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #7cb342, #558b2f)"
                : isDark
                  ? "linear-gradient(135deg, #4a3728, #2a1f18)"
                  : "linear-gradient(135deg, #a08060, #8b7355)",
            }}
          >
            <Image
              src={`/images/${tech.icon}`}
              alt={tech.name}
              width={22}
              height={22}
              className="object-contain brightness-0 invert opacity-90"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-sm truncate ${
                isDark ? "text-stone-100" : "text-stone-800"
              }`}
            >
              {tech.name}
            </h3>
            <p className={`text-[10px] ${isDark ? "text-stone-500" : "text-stone-600"}`}>
              {tech.years}y exp · {tech.projects} proj
            </p>
          </div>
        </div>

        <p
          className={`text-[10px] leading-relaxed ${
            isDark ? "text-stone-400" : "text-stone-600"
          }`}
        >
          {description.slice(0, 80)}...
        </p>

        <div
          className="flex gap-3 mt-2 text-[9px]"
          style={{ color: isActive ? LEAF_ACTIVE : isDark ? "#6b5b4a" : "#9a8a7a" }}
        >
          <span>{tech.years}y exp</span>
          <span>•</span>
          <span>{tech.projects} proj</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CategoryRoot({
  category,
  index,
  onHover,
  isActive,
}: {
  category: (typeof techCategories)[0];
  index: number;
  onHover: (tech: TechItem | null) => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme, language } = useTheme();
  const isDark = theme === "dark";

  const lang = language as keyof typeof category.name;
  const categoryName = category.name[lang] || category.name.en;

  const rootColor = isActive
    ? LEAF_ACTIVE
    : isDark
      ? TRUNK_COLOR_DARK
      : TRUNK_COLOR_LIGHT;

  const totalYears = category.techs.reduce((acc, tech) => acc + tech.years, 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative mb-16"
    >
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, delay: index * 0.2 + 0.3 }}
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${LEAF_ACTIVE}, #558b2f)`
              : isDark
                ? `linear-gradient(135deg, ${TRUNK_COLOR_DARK}, #2a1f18)`
                : `linear-gradient(135deg, ${TRUNK_COLOR_LIGHT}, #6d5a45)`,
            boxShadow: isActive
              ? `0 0 40px ${LEAF_ACTIVE}50, 0 10px 30px rgba(0,0,0,0.3)`
              : isDark
                ? "0 5px 20px rgba(0,0,0,0.5)"
                : "0 5px 20px rgba(0,0,0,0.2)",
            border: `3px solid ${rootColor}`,
          }}
        >
          {category.icon}
        </motion.div>

        <div className="flex-1">
          <h2
            className={`text-3xl font-bold ${
              isDark ? "text-stone-100" : "text-stone-800"
            }`}
          >
            {categoryName}
            <span
              className="ml-2"
              style={{ color: isActive ? LEAF_ACTIVE : rootColor }}
            >
              .
            </span>
          </h2>
          <div
            className="flex items-center gap-3 text-sm"
            style={{ color: isDark ? "#6b5b4a" : "#9a8a7a" }}
          >
            <span>{category.techs.length} technologies</span>
            <span>•</span>
            <span>{totalYears} years of growth</span>
          </div>
        </div>
      </div>

      <div className="relative pl-8">
        <TimelineTrunk
          height={category.techs.length * 120 + 50}
          isDark={isDark}
        />

        {category.techs.map((tech, i) => (
          <TimelineNode
            key={tech.name}
            tech={tech}
            index={index * 10 + i}
            side={i % 2 === 0 ? "left" : "right"}
            isActive={isActive}
            isRelated={false}
            onHover={onHover}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function TimelineView({ activeCategory, onTechSelect }: TimelineViewProps) {
  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const filteredCategories = useMemo(() => {
    if (!activeCategory) return techCategories;
    return techCategories.filter(cat => cat.id === activeCategory);
  }, [activeCategory]);

  const handleTechSelect = (tech: TechItem | null) => {
    if (onTechSelect) onTechSelect(tech);
  };

  return (
    <div className="relative">
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center left, rgba(74, 55, 40, 0.15), transparent 60%)"
              : "radial-gradient(ellipse at center left, rgba(139, 115, 85, 0.15), transparent 60%)",
          }}
        />
      </motion.div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl sm:text-5xl font-bold mb-4 ${
              isDark ? "text-stone-100" : "text-stone-800"
            }`}
          >
            Technology Roots
            <span style={{ color: LEAF_ACTIVE }}>.</span>
          </h2>
          <p
            className={`text-base max-w-2xl mx-auto ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            {language === "pt"
              ? "Uma jornada orgânica através das tecnologias que cultivaram minha carreira"
              : language === "es"
                ? "Un viaje orgánico a través de las tecnologías que cultivaron mi carrera"
                : "An organic journey through the technologies that cultivated my career"}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-4">
          {filteredCategories.map((category, index) => (
            <CategoryRoot
              key={category.id}
              category={category}
              index={index}
              onHover={handleTechSelect}
              isActive={activeCategory === category.id || activeCategory === null}
            />
          ))}
        </div>
      </div>

      <div
        className="text-center text-xs font-mono mt-16"
        style={{ color: isDark ? "#4a3d30" : "#a09080" }}
      >
        ◆ STACK TIMELINE VIEW • {filteredCategories.reduce((a, c) => a + c.techs.length, 0)} TECHNOLOGIES
      </div>
    </div>
  );
}