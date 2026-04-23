"use client";
import { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface CircuitViewProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const PCB_GREEN = "#0a3d2e";
const PCB_GREEN_DARK = "#061f18";
const COPPER_GOLD = "#d4a574";
const COPPER_BRIGHT = "#f0c987";
const SOLDER_SILVER = "#c0c0c0";
const VIA_COLOR = "#b8956e";

function PCBVia({ x, y, size = 4 }: { x: number; y: number; size?: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${COPPER_BRIGHT} 0%, ${VIA_COLOR} 50%, ${COPPER_GOLD} 100%)`,
        boxShadow: `0 0 2px ${COPPER_GOLD}, inset 0 0 1px ${COPPER_BRIGHT}`,
      }}
    />
  );
}

function PCBSmdComponent({
  tech,
  x,
  y,
  width = 60,
  height = 30,
  onHover,
  isActive,
  isRelated,
}: {
  tech: TechItem;
  x: number;
  y: number;
  width?: number;
  height?: number;
  onHover: (tech: TechItem | null) => void;
  isActive: boolean;
  isRelated: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const borderColor = isActive
    ? COPPER_BRIGHT
    : isRelated
      ? COPPER_GOLD
      : "rgba(180, 160, 140, 0.3)";

  const glowIntensity = isActive ? "0 0 15px" : isRelated ? "0 0 8px" : "none";
  const glowColor = isActive || isRelated ? COPPER_GOLD : "transparent";

  const labelColor = isActive || isHovered ? "#0a3d2e" : COPPER_GOLD;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: x, top: y }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(tech);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      animate={{
        scale: isHovered || isActive ? 1.1 : 1,
        filter: `drop-shadow(${glowIntensity} ${glowColor})`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="relative rounded-sm"
        style={{
          width,
          height,
          background: `linear-gradient(135deg, #1a4a3a 0%, ${PCB_GREEN} 50%, #0d2e23 100%)`,
          border: `1px solid ${borderColor}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-6 h-6 shrink-0">
            <Image
              src={`/images/${tech.icon}`}
              alt={tech.name}
              width={24}
              height={24}
              className="object-contain brightness-0 invert opacity-80"
            />
          </div>
          <span
            className="text-[8px] font-mono font-bold tracking-wider truncate"
            style={{ color: labelColor }}
          >
            {tech.name.toUpperCase()}
          </span>
        </div>

        <div
          className="absolute w-1 h-3"
          style={{
            background: `linear-gradient(to bottom, ${COPPER_GOLD}, ${COPPER_BRIGHT})`,
            top: "50%",
            transform: "translateY(-50%)",
            left: -4,
            boxShadow: `0 0 2px ${COPPER_GOLD}`,
          }}
        />
        <div
          className="absolute w-1 h-3"
          style={{
            background: `linear-gradient(to bottom, ${COPPER_GOLD}, ${COPPER_BRIGHT})`,
            top: "50%",
            transform: "translateY(-50%)",
            right: -4,
            boxShadow: `0 0 2px ${COPPER_GOLD}`,
          }}
        />
      </div>

      {(isHovered || isActive) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 z-50 pointer-events-none"
        >
          <div
            className="px-3 py-2 rounded-lg backdrop-blur-md border"
            style={{
              background: `rgba(6, 31, 24, 0.95)`,
              borderColor: COPPER_GOLD,
              boxShadow: `0 0 20px rgba(212, 165, 116, 0.3)`,
              minWidth: 120,
            }}
          >
            <p className="text-[10px] font-mono font-bold" style={{ color: COPPER_BRIGHT }}>
              {tech.name}
            </p>
            <p className="text-[8px] mt-1" style={{ color: COPPER_GOLD, opacity: 0.8 }}>
              {tech.level}% • {tech.years}y • {tech.projects}proj
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function PCBChip({
  label,
  pins,
  x,
  y,
  width = 80,
  height = 40,
}: {
  label: string;
  pins: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  const pinWidth = 3;
  const pinSpacing = width / (pins + 1);

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className="rounded-sm relative"
        style={{
          width,
          height,
          background: `linear-gradient(145deg, #1a5a4a 0%, ${PCB_GREEN_DARK} 100%)`,
          border: `1px solid ${COPPER_GOLD}`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <div
          className="absolute inset-x-1 top-1 text-[7px] font-mono font-bold text-center tracking-widest"
          style={{ color: COPPER_GOLD }}
        >
          {label}
        </div>
        <div
          className="absolute inset-x-1 bottom-1 text-[6px] font-mono text-center"
          style={{ color: COPPER_GOLD, opacity: 0.5 }}
        >
          {pins} PIN
        </div>
      </div>

      {Array.from({ length: pins }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: pinWidth,
            height: 6,
            background: `linear-gradient(to bottom, ${COPPER_BRIGHT}, ${COPPER_GOLD})`,
            top: "50%",
            transform: "translateY(-50%)",
            left: i * pinSpacing + pinSpacing - pinWidth / 2,
            boxShadow: `0 0 3px ${COPPER_GOLD}`,
          }}
        />
      ))}

      {Array.from({ length: pins }).map((_, i) => (
        <div
          key={`bottom-${i}`}
          className="absolute"
          style={{
            width: pinWidth,
            height: 6,
            background: `linear-gradient(to bottom, ${COPPER_GOLD}, ${COPPER_BRIGHT})`,
            bottom: -8,
            left: i * pinSpacing + pinSpacing - pinWidth / 2,
            boxShadow: `0 0 3px ${COPPER_GOLD}`,
          }}
        />
      ))}
    </div>
  );
}

function CircuitTrace({
  points,
  isActive = false,
}: {
  points: [number, number][];
  isActive?: boolean;
}) {
  const pathD = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    return `${acc} L ${x} ${y}`;
  }, "");

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="copperGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={pathD}
        fill="none"
        stroke={isActive ? COPPER_BRIGHT : COPPER_GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#copperGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: isActive ? 1 : 0.4 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}

export default function CircuitView({ activeCategory, onTechSelect }: CircuitViewProps) {
  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const handleHover = (tech: TechItem | null) => {
    if (onTechSelect) onTechSelect(tech);
  };

  const allTechs = useMemo(() => techCategories.flatMap(cat => cat.techs), []);

  const layoutData = useMemo(() => {
    const techs: { tech: TechItem; x: number; y: number; categoryId: string }[] = [];
    const cols = 5;
    const rowHeight = 80;
    const startX = 40;
    const startY = 40;

    techCategories.forEach((category, catIndex) => {
      category.techs.forEach((tech, techIndex) => {
        const col = (catIndex * 2 + techIndex) % cols;
        const row = Math.floor((catIndex * 2 + techIndex) / cols);
        const x = startX + col * 140 + (row % 2) * 30;
        const y = startY + row * rowHeight + catIndex * 20;

        techs.push({
          tech,
          x,
          y,
          categoryId: category.id,
        });
      });
    });

    return techs;
  }, []);

  const traces = useMemo(() => {
    const t: { points: [number, number][]; categoryId: string }[] = [];

    techCategories.forEach((category, catIndex) => {
      const categoryTechs = layoutData.filter(l => l.categoryId === category.id);
      for (let i = 0; i < categoryTechs.length - 1; i++) {
        const from = categoryTechs[i];
        const to = categoryTechs[i + 1];
        const midY = (from.y + to.y) / 2;

        t.push({
          points: [
            [from.x + 60, from.y + 15],
            [from.x + 80, from.y + 15],
            [from.x + 80, midY],
            [to.x + 80, midY],
            [to.x + 80, to.y + 15],
          ],
          categoryId: category.id,
        });
      }
    });

    return t;
  }, [layoutData]);

  const vias = useMemo(() => {
    const v: { x: number; y: number }[] = [];
    for (let i = 0; i < 30; i++) {
      v.push({
        x: Math.random() * 700,
        y: Math.random() * 500,
      });
    }
    return v;
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        y: backgroundY,
        background: `linear-gradient(135deg, ${PCB_GREEN_DARK} 0%, ${PCB_GREEN} 50%, #0a2a20 100%)`,
        border: `2px solid ${COPPER_GOLD}`,
        boxShadow: `inset 0 0 100px rgba(0,0,0,0.5), 0 0 30px rgba(212, 165, 116, 0.2)`,
        minHeight: 600,
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${COPPER_GOLD} 1px, transparent 1px),
            linear-gradient(90deg, ${COPPER_GOLD} 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {vias.map((via, i) => (
        <PCBVia key={i} x={via.x} y={via.y} size={3 + Math.random() * 3} />
      ))}

      {traces.map((trace, i) => {
        const isActive = activeCategory === trace.categoryId;
        return <CircuitTrace key={i} points={trace.points} isActive={isActive} />;
      })}

      <PCBChip
        label="CPU"
        pins={8}
        x={580}
        y={50}
        width={70}
        height={35}
      />
      <PCBChip
        label="MCU"
        pins={6}
        x={580}
        y={150}
        width={60}
        height={30}
      />

      <div className="p-6 pt-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
          {layoutData.map((item, index) => {
            const isActive = activeCategory === item.categoryId;
            const isRelated = !isActive && activeCategory !== null;

            return (
              <PCBSmdComponent
                key={item.tech.name}
                tech={item.tech}
                x={item.x}
                y={item.y}
                onHover={handleHover}
                isActive={isActive}
                isRelated={isRelated}
              />
            );
          })}
        </div>
      </div>

      <div
        className="absolute bottom-2 left-4 text-[9px] font-mono tracking-widest"
        style={{ color: COPPER_GOLD, opacity: 0.5 }}
      >
        PCB-2026 • F.R4 • 0.8mm • Cu 1oz
      </div>
      <div
        className="absolute bottom-2 right-4 text-[9px] font-mono tracking-widest"
        style={{ color: COPPER_GOLD, opacity: 0.5 }}
      >
        ◈ CIRCUIT BOARD VIEW
      </div>
    </motion.div>
  );
}