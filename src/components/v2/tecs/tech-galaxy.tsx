"use client";
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem, getTechIconUrl } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface TechGalaxyProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const COLORS = {
  dark: {
    accent: "#00FF88",
    text: "#ffffff",
    muted: "#888888",
  },
  light: {
    accent: "#00AA66",
    text: "#111111",
    muted: "#666666",
  },
};

const RELATION_MAP: Record<string, string[]> = {
  "TypeScript": ["JavaScript", "React", "Next.js"],
  "JavaScript": ["TypeScript", "React", "jQuery"],
  "React": ["Next.js", "TypeScript", "Styled Components"],
  "Next.js": ["React", "Vercel", "TypeScript"],
  "Tailwind CSS": ["React", "CSS3"],
  "Node.js": ["Express", "GitHub"],
  "Git": ["GitHub", "VS Code"],
  "GitHub": ["Git", "Vercel"],
  "VS Code": ["Git", "TypeScript"],
  "HTML5": ["CSS3", "JavaScript"],
  "CSS3": ["HTML5", "Tailwind CSS", "SASS"],
  "Python": ["AI"],
  "Vite": ["React", "TypeScript"],
};

const CONSTELLATION_LAYOUTS: Record<string, [number, number][]> = {
  linear: [[-1.5, 0], [-0.5, 0.3], [0.5, -0.2], [1.5, 0], [2.5, 0.3]],
  triangle: [[0, 0.8], [-0.8, -0.4], [0.8, -0.4], [0, -1.2]],
  circle: [[0, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-0.7, -0.7], [0, -1], [0.7, -0.7]],
  arc: [[-1.2, 0.3], [-0.6, 0.6], [0, 0.7], [0.6, 0.6], [1.2, 0.3]],
  cross: [[0, 0.8], [0, -0.8], [-0.8, 0], [0.8, 0], [0, 0]],
};

function TechStar({
  tech,
  position,
  size,
  isActive,
  isRelated,
  onHover,
}: {
  tech: TechItem;
  position: [number, number, number];
  size: number;
  isActive: boolean;
  isRelated: boolean;
  onHover: (tech: TechItem | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const accentColor = isDark ? COLORS.dark.accent : COLORS.light.accent;
  const color = hovered || isActive ? accentColor : isRelated ? `${accentColor}80` : isDark ? "#ffffff" : "#111111";

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.5;

      const pulse = Math.sin(time * 2) * 0.1 + 1;
      const targetScale = (hovered || isActive ? 1.8 : isRelated ? 1.4 : 1) * (hovered ? pulse : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2} position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(tech);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isActive ? 1 : isRelated ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
          wireframe={isRelated && !hovered && !isActive}
        />
      </mesh>
      {(hovered || isActive) && (
        <pointLight color={accentColor} intensity={3} distance={2} />
      )}
    </Float>
  );
}

function ConstellationGroup({
  category,
  position,
  layout,
  isActive,
  isFocused,
  onTechHover,
  techPositions,
}: {
  category: (typeof techCategories)[0];
  position: [number, number, number];
  layout: [number, number][];
  isActive: boolean;
  isFocused: boolean;
  onTechHover: (tech: TechItem | null) => void;
  techPositions: { tech: TechItem; position: [number, number, number] }[];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const accentColor = isDark ? COLORS.dark.accent : COLORS.light.accent;

  useFrame((state) => {
    if (groupRef.current && isFocused) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {techPositions.map((item, i) => {
        const isTechActive = isActive;
        const relatedNames = RELATION_MAP[item.tech.name] || [];
        const isRelated = !isTechActive && techPositions.some(
          t => relatedNames.includes(t.tech.name)
        );

        return (
          <TechStar
            key={item.tech.name}
            tech={item.tech}
            position={item.position}
            size={0.08}
            isActive={isTechActive}
            isRelated={isRelated}
            onHover={onTechHover}
          />
        );
      })}

      <mesh>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={isFocused ? 0.6 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Html position={[0, 1.2, 0]} center>
        <div
          className="px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap"
          style={{
            background: isFocused ? accentColor : `${accentColor}30`,
            color: isFocused ? "#000" : accentColor,
            border: `1px solid ${accentColor}`,
          }}
        >
          {category.icon} {category.name.en}
        </div>
      </Html>
    </group>
  );
}

function ConstellationLines({
  techPositions,
  color,
  isActive,
}: {
  techPositions: { tech: TechItem; position: [number, number, number] }[];
  color: string;
  isActive: boolean;
}) {
  const lines: JSX.Element[] = [];

  techPositions.forEach((item, i) => {
    if (i < techPositions.length - 1) {
      const next = techPositions[i + 1];
      const points = [
        new THREE.Vector3(...item.position),
        new THREE.Vector3(
          (item.position[0] + next.position[0]) / 2,
          (item.position[1] + next.position[1]) / 2 + 0.1,
          (item.position[2] + next.position[2]) / 2
        ),
        new THREE.Vector3(...next.position),
      ];
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const curvePoints = curve.getPoints(15);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: isActive ? 0.4 : 0.1,
      });

      lines.push(<primitive key={`line-${i}`} object={new THREE.Line(geometry, material)} />);
    }
  });

  return <group>{lines}</group>;
}

function Scene({
  activeCategory,
  onHover,
  focusedCategory,
  cameraTarget,
}: {
  activeCategory: string | null;
  onHover: (tech: TechItem | null) => void;
  focusedCategory: string | null;
  cameraTarget: [number, number, number];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const controlsRef = useRef<any>(null);

  const constellationData = useMemo(() => {
    const data: {
      category: (typeof techCategories)[0];
      position: [number, number, number];
      techPositions: { tech: TechItem; position: [number, number, number] }[];
      layout: string;
    }[] = [];

    const angles = techCategories.map((_, i) => (i / techCategories.length) * Math.PI * 2);
    const radius = 5;

    techCategories.forEach((category, i) => {
      const baseAngle = angles[i] - Math.PI / 2;
      const baseX = Math.cos(baseAngle) * radius;
      const baseZ = Math.sin(baseAngle) * radius;

      const layoutType = category.id === "languages" ? "linear" :
        category.id === "frameworks" ? "circle" :
          category.id === "tools" ? "arc" :
            category.id === "cloud" ? "cross" : "triangle";

      const layoutPositions = CONSTELLATION_LAYOUTS[layoutType];
      const techPositions = category.techs.map((tech, j) => {
        const [lx, ly] = layoutPositions[j % layoutPositions.length];
        return {
          tech,
          position: [baseX + lx, ly, baseZ + lx * 0.5] as [number, number, number],
        };
      });

      data.push({
        category,
        position: [baseX, 0, baseZ],
        techPositions,
        layout: layoutType,
      });
    });

    return data;
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={isDark ? COLORS.dark.accent : COLORS.light.accent} />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {constellationData.map((data) => {
        const isActive = activeCategory === data.category.id;
        const isFocused = focusedCategory === data.category.id;
        const scale = isFocused ? 2 : isActive ? 1.5 : 1;

        return (
          <group key={data.category.id} scale={scale}>
            <ConstellationGroup
              category={data.category}
              position={data.position}
              layout={CONSTELLATION_LAYOUTS[data.layout]}
              isActive={isActive}
              isFocused={isFocused}
              onTechHover={onHover}
              techPositions={data.techPositions}
            />

            <ConstellationLines
              techPositions={data.techPositions}
              color={isDark ? COLORS.dark.accent : COLORS.light.accent}
              isActive={isActive}
            />
          </group>
        );
      })}

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={focusedCategory ? constellationData.find(c => c.category.id === focusedCategory)?.position || [0, 0, 0] : [0, 0, 0]}
      />

      <fog attach="fog" args={[isDark ? "#000000" : "#f0f0f0", 15, 40]} />
    </>
  );
}

function TechHoverCard({ tech }: { tech: TechItem }) {
  const { language, theme } = useTheme();
  const isDark = theme === "dark";
  const accentColor = isDark ? COLORS.dark.accent : COLORS.light.accent;

  const lang = language as keyof typeof tech.description;
  const description = tech.description[lang] || tech.description.en;

  return (
    <Html distanceFactor={6} center>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="p-4 rounded-xl backdrop-blur-xl border"
        style={{
          background: isDark ? "rgba(10, 10, 10, 0.9)" : "rgba(255, 255, 255, 0.95)",
          borderColor: accentColor,
          boxShadow: `0 0 30px ${accentColor}40`,
          minWidth: 160,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}50` }}
          >
            <Image
              src={getTechIconUrl(tech.icon)}
              alt={tech.name}
              width={18}
              height={18}
              className="object-contain"
              style={{ filter: isDark ? "brightness(0) invert(1)" : "none" }}
            />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: isDark ? "#fff" : "#111" }}>
              {tech.name}
            </h3>
            <span className="text-[10px]" style={{ color: accentColor }}>
              {tech.years}y · {tech.projects}proj
            </span>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: isDark ? "#888" : "#666" }}>
          {description}
        </p>
      </motion.div>
    </Html>
  );
}

export default function TechGalaxy({ activeCategory, onTechSelect }: TechGalaxyProps) {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  const accentColor = isDark ? COLORS.dark.accent : COLORS.light.accent;

  const handleHover = useCallback((tech: TechItem | null) => {
    setHoveredTech(tech);
    if (onTechSelect) onTechSelect(tech);
  }, [onTechSelect]);

  const handleConstellationClick = useCallback((categoryId: string) => {
    setFocusedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  return (
    <div className="relative">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          height: 500,
          background: isDark ? "#000000" : "#f5f5f5",
        }}
      >
        <Canvas
          camera={{ position: [0, 5, 12], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene
            activeCategory={activeCategory}
            onHover={handleHover}
            focusedCategory={focusedCategory}
            cameraTarget={[0, 0, 0]}
          />
          <AnimatePresence>
            {hoveredTech && <TechHoverCard key={hoveredTech.name} tech={hoveredTech} />}
          </AnimatePresence>
        </Canvas>
      </div>

      <div
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
        style={{ zIndex: 10 }}
      >
        {techCategories.map((category) => {
          const isActive = activeCategory === category.id;
          const isFocused = focusedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => handleConstellationClick(category.id)}
              className="p-3 rounded-xl border text-left transition-all duration-200"
              style={{
                background: isFocused
                  ? `${accentColor}20`
                  : isActive
                    ? `${accentColor}10`
                    : isDark ? "#111" : "#fff",
                borderColor: isFocused ? accentColor : isActive ? `${accentColor}60` : isDark ? "#222" : "#e5e5e5",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <div>
                  <h4
                    className="text-sm font-semibold"
                    style={{
                      color: isFocused ? accentColor : isActive ? accentColor : isDark ? "#fff" : "#111"
                    }}
                  >
                    {category.name[language as keyof typeof category.name] || category.name.en}
                  </h4>
                  <p className="text-[10px]" style={{ color: isDark ? "#666" : "#999" }}>
                    {category.techs.length} techs
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div
        className="absolute bottom-4 left-4 text-[9px] font-mono"
        style={{ color: isDark ? "#333" : "#aaa" }}
      >
        ✦ DRAG TO ROTATE • SCROLL TO ZOOM • CLICK CATEGORY TO FOCUS
      </div>
    </div>
  );
}