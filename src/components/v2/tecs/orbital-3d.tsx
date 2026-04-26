"use client";
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem, getTechIconUrl } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface TechSphereProps {
  activeCategory: string | null;
}

function TechOrb({ tech, index, total, onHover, isHighlighted }: { 
  tech: TechItem; 
  index: number; 
  total: number;
  onHover: (tech: TechItem | null) => void;
  isHighlighted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
  const radius = 3.2;
  const baseX = radius * Math.cos(theta) * Math.sin(phi);
  const baseY = radius * Math.sin(theta) * Math.sin(phi);
  const baseZ = radius * Math.cos(phi);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.x = baseX + Math.sin(time * 0.4 + index * 0.5) * 0.08;
      groupRef.current.position.y = baseY + Math.cos(time * 0.3 + index * 0.5) * 0.08;
      groupRef.current.position.z = baseZ + Math.sin(time * 0.25 + index * 0.5) * 0.05;

      const targetScale = hovered || isHighlighted ? 1.5 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  const glowColor = isDark ? "#8FFFFF" : "#3B82F6";
  const baseColor = isDark ? "#ffffff" : "#1a1a1a";
  const orbColor = hovered || isHighlighted ? glowColor : baseColor;

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]}>
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
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={hovered || isHighlighted ? 0.8 : 0.2}
          transparent
          opacity={isDark ? 0.95 : 0.8}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {(hovered || isHighlighted) && (
        <pointLight color={glowColor} intensity={1} distance={1.5} />
      )}
    </group>
  );
}

function OrbitalRing({ radius, color, opacity, speed }: { radius: number; color: string; opacity: number; speed: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.008, 16, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function CentralCore() {
  const coreRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const coreColor = isDark ? "#8FFFFF" : "#3B82F6";

  return (
    <group ref={coreRef}>
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={coreColor}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={isDark ? "#050505" : "#f5f5f5"}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <pointLight color={coreColor} intensity={3} distance={4} />
    </group>
  );
}

function Scene({ activeCategory, onHover }: { activeCategory: string | null; onHover: (tech: TechItem | null) => void }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const allTechs = useMemo(() => techCategories.flatMap((cat) => cat.techs), []);

  return (
    <>
      <ambientLight intensity={isDark ? 0.15 : 0.4} />
      <pointLight position={[8, 8, 8]} intensity={0.8} />
      <pointLight position={[-8, -8, -8]} intensity={0.3} color={isDark ? "#8FFFFF" : "#3B82F6"} />
      
      <CentralCore />
      
      {allTechs.map((tech, i) => (
        <TechOrb
          key={tech.name}
          tech={tech}
          index={i}
          total={allTechs.length}
          onHover={onHover}
          isHighlighted={!!(activeCategory && techCategories.find(c => c.id === activeCategory)?.techs.some(t => t.name === tech.name))}
        />
      ))}
      
      <OrbitalRing radius={3.2} color={isDark ? "#8FFFFF" : "#3B82F6"} opacity={0.25} speed={0.15} />
      <OrbitalRing radius={3.6} color={isDark ? "#ffffff" : "#000000"} opacity={0.08} speed={-0.1} />
      <OrbitalRing radius={4} color={isDark ? "#8FFFFF" : "#3B82F6"} opacity={0.04} speed={0.08} />
      
      <fog attach="fog" args={[isDark ? "#050505" : "#fafafa", 6, 18]} />
    </>
  );
}

interface TechHoverCardProps {
  tech: TechItem;
}

function TechHoverCard({ tech }: TechHoverCardProps) {
  const { language, theme } = useTheme();
  const isDark = theme === "dark";
  
  const lang = language as keyof typeof tech.description;
  const description = tech.description[lang] || tech.description.en;
  
  const yearsLabel = language === "pt" ? "anos" : language === "es" ? "años" : language === "fr" ? "ans" : "yrs";
  const projectsLabel = language === "pt" ? "projetos" : language === "es" ? "proyectos" : language === "fr" ? "projets" : "projects";
  const proficiencyLabel = language === "pt" ? "proficiência" : language === "es" ? "proficiencia" : language === "fr" ? "compétence" : "proficiency";

  const cardBg = isDark 
    ? "bg-[#0a0a0a]/95 border-cyan-400/30" 
    : "bg-white/95 border-blue-500/30";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-cyan-400" : "text-blue-600";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <Html distanceFactor={12} center>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`p-5 rounded-2xl backdrop-blur-2xl border shadow-2xl ${cardBg}`}
        style={{
          boxShadow: isDark 
            ? "0 0 60px rgba(143, 255, 255, 0.15), 0 20px 40px rgba(0,0,0,0.5)" 
            : "0 0 60px rgba(59, 130, 246, 0.15), 0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? "bg-white/10" : "bg-gray-100"
          }`}>
            <Image
              src={getTechIconUrl(tech.icon)}
              alt={tech.name}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${textPrimary}`}>{tech.name}</h3>
            <span className={`text-sm font-semibold ${textSecondary}`}>
              {tech.level}% {proficiencyLabel}
            </span>
          </div>
        </div>
        
        <p className={`text-sm leading-relaxed mb-4 ${textMuted}`}>
          {description}
        </p>
        
        <div className="flex gap-6">
          <div className={`text-xs ${textMuted}`}>
            <span className={`font-bold ${textSecondary}`}>{tech.years}</span> {yearsLabel}
          </div>
          <div className={`text-xs ${textMuted}`}>
            <span className={`font-bold ${textSecondary}`}>{tech.projects}</span> {projectsLabel}
          </div>
        </div>

        <div className={`mt-3 h-1 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tech.level}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${isDark ? "from-cyan-400 to-blue-500" : "from-blue-500 to-blue-700"}`}
          />
        </div>
      </motion.div>
    </Html>
  );
}

export default function TechOrbital3D({ activeCategory }: TechSphereProps) {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  
  const handleHover = useCallback((tech: TechItem | null) => {
    setHoveredTech(tech);
  }, []);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Scene 
          activeCategory={activeCategory}
          onHover={handleHover}
        />
        <AnimatePresence>
          {hoveredTech && (
            <TechHoverCard key={hoveredTech.name} tech={hoveredTech} />
          )}
        </AnimatePresence>
      </Canvas>
    </div>
  );
}