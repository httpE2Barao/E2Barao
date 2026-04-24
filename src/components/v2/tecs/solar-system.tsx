"use client";
import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { techCategories, TechItem } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface SolarSystemViewProps {
  activeCategory: string | null;
  onTechSelect?: (tech: TechItem | null) => void;
}

const SUN_PALETTES = [
  { core: "#ffaa00", light: "#ff8800", glow: "#ffdd44" },
  { core: "#00d4ff", light: "#0088ff", glow: "#66eeff" },
  { core: "#c084fc", light: "#9333ea", glow: "#ddb3ff" },
  { core: "#ff6b35", light: "#ff3366", glow: "#ff9966" },
];

const PLANET_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
];

// ── STARS ──────────────────────────────────────────────
function StarField() {
  const ref = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 15 + Math.random() * 40;
      const t = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI;
      p[i * 3] = r * Math.sin(ph) * Math.cos(t);
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(t) * 0.3;
      p[i * 3 + 2] = r * Math.cos(ph);
    }
    return p;
  }, []);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── SUN SPRITE ─────────────────────────────────────────
function SunSprite({ radius, palette }: { radius: number; palette: (typeof SUN_PALETTES)[0] }) {
  const ref = useRef<THREE.Sprite>(null);

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, palette.core);
    g.addColorStop(0.35, palette.light);
    g.addColorStop(0.7, palette.glow + "88");
    g.addColorStop(1, palette.glow + "00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [palette]);

  useFrame((s) => {
    if (ref.current) {
      const p = Math.sin(s.clock.elapsedTime * 2) * 0.08 + 1;
      ref.current.scale.set(radius * 4 * p, radius * 4 * p, 1);
    }
  });

  return (
    <sprite ref={ref}>
      <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

// ── SUN (CATEGORY / SOLAR SYSTEM) ─────────────────────
function Sun({
  categoryIndex,
  palette,
  isFocused,
  isSelecting,
  onSunClick,
  onPlanetSelect,
}: {
  categoryIndex: number;
  palette: (typeof SUN_PALETTES)[0];
  isFocused: boolean;
  isSelecting: boolean;
  onSunClick: () => void;
  onPlanetSelect: (tech: TechItem) => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const category = techCategories[categoryIndex];
  const techs = category.techs;
  const sunR = 0.4 + Math.min(techs.length, 8) * 0.03;

  useFrame((s) => {
    if (coreRef.current) {
      const p = Math.sin(s.clock.elapsedTime * 2) * 0.06 + 1;
      coreRef.current.scale.setScalar(p);
    }
    if (groupRef.current && isFocused) {
      groupRef.current.rotation.y = s.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <SunSprite radius={sunR} palette={palette} />

      <mesh
        ref={coreRef}
        onClick={(e) => { e.stopPropagation(); onSunClick(); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <sphereGeometry args={[sunR, 12, 12]} />
        <meshBasicMaterial color={palette.core} />
      </mesh>

      <pointLight color={palette.core} intensity={isFocused ? 3 : hovered ? 2 : 1} distance={sunR * 12} />

      <Html position={[0, sunR + 0.6, 0]} center distanceFactor={20}>
        <div
          style={{
            padding: "2px 6px",
            borderRadius: "999px",
            fontSize: "7px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
            background: isFocused ? palette.core : hovered ? palette.core + "cc" : palette.core + "55",
            color: isFocused || hovered ? "#000" : "#fff",
            border: `1px solid ${palette.glow}`,
            boxShadow: (isFocused || hovered) ? `0 0 8px ${palette.core}` : "none",
          }}
        >
          {isFocused ? "◀" : category.name.en}
        </div>
      </Html>
    </group>
  );
}

// ── PLANET (TECHNOLOGY) ─────────────────────────────────
function Planet({
  tech,
  size,
  color,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  moonCount,
  isFocusedPlanet,
  onPlanetClick,
  onPlanetHover,
  planetGroupPos,
}: {
  tech: TechItem;
  size: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  moonCount: number;
  isFocusedPlanet: boolean;
  onPlanetClick: () => void;
  onPlanetHover: (tech: TechItem | null) => void;
  planetGroupPos: [number, number, number];
}) {
  const planetRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((s) => {
    // Cada planeta orbita independentemente
    if (planetRef.current) {
      planetRef.current.rotation.y = orbitOffset + s.clock.elapsedTime * orbitSpeed;
    }
    // Rotação do planeta em si
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.02;
      const sc = (hovered || isFocusedPlanet ? 1.5 : 1) * (Math.sin(s.clock.elapsedTime * 3) * 0.04 + 1);
      sphereRef.current.scale.lerp(new THREE.Vector3(sc, sc, sc), 0.1);
    }
  });

  return (
    <group ref={planetRef}>
      {/* Órbita visível */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.008, orbitRadius + 0.008, 64]} />
        <meshBasicMaterial color={color} transparent opacity={isFocusedPlanet ? 0.25 : 0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Posição na órbita */}
      <group ref={orbitRef} position={[orbitRadius, 0, 0]}>
        <mesh
          ref={sphereRef}
          onClick={(e) => { e.stopPropagation(); onPlanetClick(); }}
          onPointerOver={(ev) => { ev.stopPropagation(); setHovered(true); onPlanetHover(tech); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); onPlanetHover(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isFocusedPlanet ? 0.7 : 0.25}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Ícone da tech */}
        <Html position={[0, size + 0.3, 0]} center distanceFactor={25}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.92)",
            border: `1px solid ${hovered || isFocusedPlanet ? color : "rgba(255,255,255,0.1)"}`,
            boxShadow: (hovered || isFocusedPlanet) ? `0 0 6px ${color}60` : "none",
          }}>
            <Image
              src={`/images/${tech.icon}`}
              alt={tech.name}
              width={10}
              height={10}
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          </div>
        </Html>

        {/* Luas */}
        {moonCount >= 1 && (
          <mesh position={[size * 2.2, size * 0.3, 0]}>
            <sphereGeometry args={[size * 0.22, 8, 8]} />
            <meshStandardMaterial color="#e4e4e7" roughness={0.8} metalness={0.1} />
          </mesh>
        )}
        {moonCount >= 2 && (
          <mesh position={[-size * 1.5, size * 0.8, size * 1]}>
            <sphereGeometry args={[size * 0.18, 8, 8]} />
            <meshStandardMaterial color="#a1a1aa" roughness={0.8} metalness={0.1} />
          </mesh>
        )}
        {moonCount >= 3 && (
          <mesh position={[size * 0.5, -size * 0.5, -size * 1.8]}>
            <sphereGeometry args={[size * 0.14, 8, 8]} />
            <meshStandardMaterial color="#71717a" roughness={0.8} metalness={0.1} />
          </mesh>
        )}

        {(hovered || isFocusedPlanet) && (
          <pointLight color={color} intensity={1.5} distance={size * 8} />
        )}
      </group>
    </group>
  );
}

// ── SOLAR SYSTEM (CATEGORY / SUN + PLANETS) ────────────
function SolarSystem({
  categoryIndex,
  palette,
  isFocused,
  focusedPlanetName,
  onSunClick,
  onPlanetClick,
  onPlanetHover,
}: {
  categoryIndex: number;
  palette: (typeof SUN_PALETTES)[0];
  isFocused: boolean;
  focusedPlanetName: string | null;
  onSunClick: () => void;
  onPlanetClick: (tech: TechItem) => void;
  onPlanetHover: (tech: TechItem | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const category = techCategories[categoryIndex];
  const techs = category.techs;

  // Posição do sistema solar
  const baseRadius = 5 + categoryIndex * 2.5;
  const angle = (categoryIndex / techCategories.length) * Math.PI * 2;
  const x = Math.cos(angle) * baseRadius;
  const z = Math.sin(angle) * baseRadius;
  const y = categoryIndex % 2 === 0 ? 0.4 : -0.4;

  useFrame((s) => {
    if (groupRef.current && isFocused) {
      groupRef.current.rotation.y = s.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[x, y, z]}>
      <Sun
        categoryIndex={categoryIndex}
        palette={palette}
        isFocused={isFocused}
        isSelecting={false}
        onSunClick={onSunClick}
        onPlanetSelect={() => {}}
      />

      {/* Planetas — cada um com sua própria órbita */}
      {techs.map((tech, i) => {
        const pSize = 0.1 + (tech.level / 100) * 0.14;
        const pSpeed = 0.15 + (tech.level / 100) * 0.5;
        const pOffset = (i / techs.length) * Math.PI * 2;
        // Órbitas crescem progressivamente — n��o sobrepostas
        const pOrbit = 0.6 + i * 0.55;
        const moonCount = Math.min(3, Math.floor(tech.level / 30));

        return (
          <Planet
            key={tech.name}
            tech={tech}
            size={pSize}
            color={PLANET_COLORS[i % PLANET_COLORS.length]}
            orbitRadius={pOrbit}
            orbitSpeed={pSpeed}
            orbitOffset={pOffset}
            moonCount={moonCount}
            isFocusedPlanet={focusedPlanetName === tech.name}
            onPlanetClick={() => onPlanetClick(tech)}
            onPlanetHover={onPlanetHover}
            planetGroupPos={[x, y, z]}
          />
        );
      })}
    </group>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────
export default function SolarSystemView({ activeCategory, onTechSelect }: SolarSystemViewProps) {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(null);
  const [focusedPlanet, setFocusedPlanet] = useState<TechItem | null>(null);
  const controlsRef = useRef<any>(null);

  const handlePlanetHover = useCallback((tech: TechItem | null) => {
    setHoveredTech(tech);
    if (onTechSelect) onTechSelect(tech);
  }, [onTechSelect]);

  const handleSunClick = useCallback((catId: string, index: number) => {
    setFocusedPlanet(null);
    if (focusedCategoryId === catId) {
      // Voltar
      setFocusedCategoryId(null);
    } else {
      // Focar sistema
      setFocusedCategoryId(catId);
      setFocusedPlanet(null);

      // Calcular posição e mover câmera
      const baseRadius = 5 + index * 2.5;
      const angle = (index / techCategories.length) * Math.PI * 2;
      const px = Math.cos(angle) * baseRadius;
      const pz = Math.sin(angle) * baseRadius;
      const py = index % 2 === 0 ? 0.4 : -0.4;

      setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.target.set(px, py, pz);
          controlsRef.current.zoomTo(22, true);
          controlsRef.current.update();
        }
      }, 80);
    }
  }, [focusedCategoryId]);

  const handlePlanetClick = useCallback((tech: TechItem) => {
    setFocusedPlanet(tech);
  }, []);

  const handleBack = useCallback(() => {
    setFocusedCategoryId(null);
    setFocusedPlanet(null);
    setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.zoomTo(15, true);
        controlsRef.current.update();
      }
    }, 50);
  }, []);

  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  const focusedCategory = focusedCategoryId ? techCategories.find(c => c.id === focusedCategoryId) : null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: 520,
        background: "radial-gradient(ellipse at center, #0a0010 0%, #000000 100%)",
        border: "1px solid rgba(255,100,0,0.1)",
      }}
    >
      <Canvas gl={{ antialias: true, alpha: true } as any} dpr={[1, 1.5]}>
        <OrthographicCamera makeDefault position={[18, 18, 18]} zoom={focusedCategoryId ? 22 : 15} near={0.1} far={200} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minZoom={5}
          maxZoom={50}
          enableDamping
          dampingFactor={0.05}
        />

        <ambientLight intensity={0.05} />
        <StarField />

        {techCategories.map((cat, i) => (
          <SolarSystem
            key={cat.id}
            categoryIndex={i}
            palette={SUN_PALETTES[i % SUN_PALETTES.length]}
            isFocused={focusedCategoryId === cat.id}
            focusedPlanetName={focusedCategoryId === cat.id ? focusedPlanet?.name || null : null}
            onSunClick={() => handleSunClick(cat.id, i)}
            onPlanetClick={handlePlanetClick}
            onPlanetHover={handlePlanetHover}
          />
        ))}
      </Canvas>

      {/* HUD */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-3">
            {focusedCategoryId && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "8px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  background: "rgba(255,100,0,0.15)",
                  color: "rgba(255,120,0,0.8)",
                  border: "1px solid rgba(255,100,0,0.3)",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onClick={handleBack}
              >
                ◀
              </motion.button>
            )}
            <p style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,120,0,0.4)" }}>
              {focusedCategory ? focusedCategory.name.en : "Solar System"}
            </p>
          </div>
          <p style={{ fontSize: "7px", fontFamily: "monospace", marginTop: "2px", color: "rgba(255,120,0,0.2)" }}>
            {focusedCategoryId
              ? focusedPlanet
                ? `1/${(focusedCategory?.techs.length) || 0} · CLIQUE PLANETA`
                : `${(focusedCategory?.techs.length) || 0} planetas · CLIQUE NO PLANETA`
              : `${techCategories.length} sóis · CLIQUE NO SOL PARA ENTRAR`}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p style={{ fontSize: "7px", fontFamily: "monospace", color: "rgba(255,120,0,0.2)" }}>DRAG · SCROLL · CLICK</p>
          <p style={{ fontSize: "7px", fontFamily: "monospace", color: "rgba(255,120,0,0.2)" }}>
            ☀ SOL · ● ÓRBITA · 🌍 PLANETA · ○ LUA
          </p>
        </div>
      </div>

      {/* PLANET INFO CARD */}
      {(() => {
        const currentTech = hoveredTech || focusedPlanet;
        if (!currentTech) return null;
        const techDesc = currentTech.description[language as keyof typeof currentTech.description] || currentTech.description.en;
        return (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "16px",
              borderRadius: "16px",
              border: `1px solid ${focusedPlanet ? "rgba(255,120,0,0.5)" : "rgba(255,120,0,0.3)"}`,
              background: "rgba(5, 0, 12, 0.95)",
              boxShadow: focusedPlanet
                ? "0 0 80px rgba(255,120,0,0.15), 0 25px 50px rgba(0,0,0,0.6)"
                : "0 0 40px rgba(255,120,0,0.06), 0 20px 40px rgba(0,0,0,0.4)",
              minWidth: 180,
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,120,0,0.1)",
                border: "1px solid rgba(255,120,0,0.2)",
                flexShrink: 0,
              }}>
                <Image src={`/images/${currentTech.icon}`} alt={currentTech.name}
                  width={20} height={20} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>{currentTech.name}</h3>
                  {focusedPlanet && (
                    <span style={{ fontSize: "7px", padding: "1px 5px", borderRadius: 4, background: "rgba(255,120,0,0.2)", color: "rgba(255,120,0,0.8)" }}>SELECIONADO</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,120,0,0.5)" }}>{currentTech.years}y</span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,120,0,0.2)" }}>·</span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,120,0,0.5)" }}>{currentTech.projects}proj</span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,120,0,0.2)" }}>·</span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: "rgba(255,120,0,0.5)" }}>Lv{currentTech.level}</span>
                </div>
              </div>
            </div>

            <div style={{ width: "100%", height: "6px", borderRadius: "999px", overflow: "hidden", marginBottom: "8px", background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentTech.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #ff6600, #ffaa00)" }}
              />
            </div>

            <p style={{ fontSize: "9px", lineHeight: 1.5, color: "rgba(255,255,255,0.45)" }}>
              {techDesc}
            </p>

            {focusedPlanet && (
              <div style={{ marginTop: "10px", paddingTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px solid rgba(255,120,0,0.15)" }}>
                <span style={{ fontSize: "7px", fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: "rgba(255,120,0,0.1)", color: "rgba(255,120,0,0.4)" }}>
                  LUA: {Math.min(3, Math.floor(currentTech.level / 30))}
                </span>
                <span style={{ fontSize: "7px", fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: "rgba(255,120,0,0.1)", color: "rgba(255,120,0,0.4)" }}>
                  ORB: {currentTech.level}%
                </span>
                <span style={{ fontSize: "7px", fontFamily: "monospace", padding: "2px 6px", borderRadius: 4, background: "rgba(255,120,0,0.1)", color: "rgba(255,120,0,0.4)" }}>
                  ANO: {currentTech.years}y
                </span>
              </div>
            )}
          </motion.div>
        );
      })()}
    </div>
  );
}