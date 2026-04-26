"use client";
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem, getTechIconUrl } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface ConstellationViewProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const STAR_COLORS = {
  bright: "#ffffff",
  medium: "#b8d4e8",
  dim: "#6b8caa",
  glow: "#00d4ff",
  accent: "#ffd700",
};

const CONSTELLATION_SHAPES: Record<string, [number, number][]> = {
  languages: [
    [0, 0], [0.8, 0.5], [1.6, 0.2], [2.2, 0.8], [3, 0.5],
  ],
  frameworks: [
    [0, 0], [0.6, -0.4], [1.2, 0.1], [1.8, -0.3], [2.4, 0.2], [3, 0],
  ],
  tools: [
    [0, 0], [0.5, 0.5], [1, 0], [1.5, 0.5], [2, 0],
  ],
  cloud: [
    [0, 0], [0.7, 0.3], [1.4, -0.2], [2.1, 0.4], [2.8, 0],
  ],
};

function StarCore({
  size,
  color,
  pulseSpeed = 1,
  glowIntensity = 1,
}: {
  size: number;
  color: string;
  pulseSpeed?: number;
  glowIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15 + 0.85;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <pointLight color={color} intensity={glowIntensity} distance={size * 10} />
    </group>
  );
}

function TwinklingStar({
  position,
  size,
  brightness,
  onHover,
  tech,
  isHighlighted,
  isRelated,
}: {
  position: [number, number, number];
  size: number;
  brightness: number;
  onHover: (tech: TechItem | null) => void;
  tech: TechItem;
  isHighlighted: boolean;
  isRelated: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = brightness > 0.8 ? STAR_COLORS.bright : brightness > 0.5 ? STAR_COLORS.medium : STAR_COLORS.dim;
  const activeColor = isHighlighted || hovered ? STAR_COLORS.glow : isRelated ? STAR_COLORS.accent : baseColor;

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const twinkle = Math.sin(time * 2 + position[0] * 10) * 0.2 + 0.8;
      const targetScale = (isHighlighted || hovered ? 2 : isRelated ? 1.5 : 1) * twinkle;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
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
      <StarCore
        size={size * (isHighlighted || hovered ? 1.5 : 1)}
        color={activeColor}
        pulseSpeed={2 + Math.random()}
        glowIntensity={isHighlighted || hovered ? 2 : 0.5}
      />

      {(isHighlighted || hovered) && (
        <StarCore
          size={size * 0.5}
          color={STAR_COLORS.glow}
          pulseSpeed={3}
          glowIntensity={3}
        />
      )}
    </group>
  );
}

function ConstellationLine({
  start,
  end,
  isActive,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
}) {
  const points = useMemo(() => {
    const mid = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.3,
      (start[2] + end[2]) / 2
    );
    return [new THREE.Vector3(...start), mid, new THREE.Vector3(...end)];
  }, [start, end]);

  const lineRef = useRef<THREE.Line>(null!);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]), [points]);
  const curvePoints = useMemo(() => curve.getPoints(20), [curve]);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    return geo;
  }, [curvePoints]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: isActive ? STAR_COLORS.glow : STAR_COLORS.dim,
      transparent: true,
      opacity: isActive ? 0.8 : 0.2,
    });
  }, [isActive]);

  useFrame((state) => {
    if (material) {
      material.opacity = isActive ? 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0.15;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} />;
}

function NebulaBackground() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = radius * Math.cos(phi) - 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4a6b8a"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({
  activeCategory,
  onHover,
}: {
  activeCategory: string | null;
  onHover: (tech: TechItem | null) => void;
}) {
  const techData = useMemo(() => {
    const data: {
      tech: TechItem;
      position: [number, number, number];
      size: number;
      brightness: number;
      categoryId: string;
      constellationId: string;
    }[] = [];

    const radius = 5;

    techCategories.forEach((category, catIndex) => {
      const shapes = CONSTELLATION_SHAPES[category.id] || CONSTELLATION_SHAPES.languages;
      const categoryRadius = radius + catIndex * 1.5;
      const angleOffset = catIndex * (Math.PI / 3);

      category.techs.forEach((tech, techIndex) => {
        const shapeIndex = techIndex % shapes.length;
        const [relX, relY] = shapes[shapeIndex];
        const angle = angleOffset + relX * 0.3;

        const x = Math.cos(angle) * (categoryRadius + relY * 0.5);
        const y = relY * 1.5 - 2;
        const z = Math.sin(angle) * (categoryRadius + relY * 0.5);

        const size = 0.08 + Math.random() * 0.06;
        const brightness = 0.4 + (tech.years / 10) * 0.6;

        data.push({
          tech,
          position: [x, y, z],
          size,
          brightness,
          categoryId: category.id,
          constellationId: category.id,
        });
      });
    });

    return data;
  }, []);

  const connections = useMemo(() => {
    const conns: { from: number; to: number; categoryId: string }[] = [];

    techCategories.forEach((category) => {
      const categoryTechs = techData.filter(t => t.categoryId === category.id);
      for (let i = 0; i < categoryTechs.length - 1; i++) {
        const fromIdx = techData.findIndex(t => t.tech.name === categoryTechs[i].tech.name);
        const toIdx = techData.findIndex(t => t.tech.name === categoryTechs[i + 1].tech.name);
        conns.push({ from: fromIdx, to: toIdx, categoryId: category.id });
      }
    });

    return conns;
  }, [techData]);

    return (
      <>
      <ambientLight intensity={0.05} />
      <NebulaBackground />

      {connections.map((conn, i) => {
        const fromData = techData[conn.from];
        const toData = techData[conn.to];
        const isActive = activeCategory === conn.categoryId;

        return (
          <ConstellationLine
            key={i}
            start={fromData.position}
            end={toData.position}
            isActive={isActive}
          />
        );
      })}

      {techData.map((item, i) => {
        const isHighlighted = activeCategory === item.categoryId;
        const isRelated = !isHighlighted && activeCategory !== null;

        return (
          <TwinklingStar
            key={item.tech.name}
            position={item.position}
            size={item.size}
            brightness={item.brightness}
            onHover={onHover}
            tech={item.tech}
            isHighlighted={isHighlighted}
            isRelated={isRelated}
          />
        );
      })}

      <fog attach="fog" args={["#000510", 10, 30]} />
    </>
  );
}

function StarfieldOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full opacity-20">
        <defs>
          <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066aa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000510" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#nebulaGlow)" />
      </svg>
    </div>
  );
}

export default function ConstellationView({ activeCategory, onTechSelect }: ConstellationViewProps) {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleHover = useCallback((tech: TechItem | null) => {
    setHoveredTech(tech);
    if (onTechSelect) onTechSelect(tech);
  }, [onTechSelect]);

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #000510 0%, #001020 50%, #000815 100%)",
        border: "1px solid rgba(0, 212, 255, 0.2)",
        boxShadow: "inset 0 0 100px rgba(0, 100, 150, 0.1)",
      }}
    >
      <StarfieldOverlay />

      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Scene activeCategory={activeCategory} onHover={handleHover} />
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div>
          <h3 className="text-cyan-400/60 text-[10px] font-mono tracking-[0.3em] uppercase">
            Stellar Map
          </h3>
        </div>
        <div className="text-right">
          <h3 className="text-cyan-400/60 text-[10px] font-mono tracking-[0.3em] uppercase">
            {activeCategory || "All Constellations"}
          </h3>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[9px] font-mono" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
        ✦ DRAG TO ROTATE • SCROLL TO ZOOM
      </div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
        ◈ CONSTELLATION VIEW
      </div>

      <AnimatePresence>
        {hoveredTech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl backdrop-blur-md border"
            style={{
              background: "rgba(0, 5, 16, 0.9)",
              borderColor: "rgba(0, 212, 255, 0.4)",
              boxShadow: "0 0 60px rgba(0, 212, 255, 0.2), 0 25px 50px rgba(0, 0, 0, 0.5)",
              minWidth: 200,
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0, 212, 255, 0.1)", border: "1px solid rgba(0, 212, 255, 0.3)" }}>
                <Image
                  src={getTechIconUrl(hoveredTech.icon)}
                  alt={hoveredTech.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{hoveredTech.name}</h3>
                <span className="text-cyan-400/60 text-sm font-mono">{hoveredTech.years}y exp · {hoveredTech.projects} proj</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              {hoveredTech.description.en}
            </p>
            <div className="flex gap-4 text-[10px]" style={{ color: "rgba(0, 212, 255, 0.6)" }}>
              <span>{hoveredTech.years} years</span>
              <span>•</span>
              <span>{hoveredTech.projects} projects</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}