"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { TechCategory, TechItem, getTechIconUrl } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

interface TechCardProps {
  tech: TechItem;
  index: number;
}

function TechCard({ tech, index }: TechCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  
  const lang = language as keyof typeof tech.description;
  const description = tech.description[lang] || tech.description.en;
  
  const yearsLabel = language === "pt" ? "anos" : language === "es" ? "años" : language === "fr" ? "ans" : "yrs";
  const projectsLabel = language === "pt" ? "projetos" : language === "es" ? "proyectos" : language === "fr" ? "projets" : "projects";
  const levelLabel = language === "pt" ? "Nível" : language === "es" ? "Nivel" : language === "fr" ? "Niveau" : "Level";

  const bgCard = isDark 
    ? "bg-gradient-to-br from-white/5 to-white/10 border-white/10" 
    : "bg-gradient-to-br from-black/5 to-black/10 border-black/10";
  const bgHover = isDark 
    ? "hover:border-cyan-400/50 hover:bg-cyan-400/5" 
    : "hover:border-blue-500/50 hover:bg-blue-500/5";
  const textPrimary = isDark ? "text-white" : "text-black";
  const textMuted = isDark ? "text-white/50" : "text-black/50";
  const accentColor = isDark ? "text-cyan-400" : "text-blue-500";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${bgCard} ${bgHover}`}
      style={{ minHeight: isHovered ? "200px" : "100px" }}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isDark ? "bg-white/10" : "bg-black/10"
        }`}>
          <Image
            src={getTechIconUrl(tech.icon)}
            alt={tech.name}
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg ${textPrimary}`}>{tech.name}</h3>
          <p className={`text-sm ${textMuted}`}>{tech.years} {yearsLabel} · {tech.projects} {projectsLabel}</p>
          
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className={`text-sm leading-relaxed ${textMuted} mt-3`}>
              {description}
            </p>
            
            <div className="flex gap-4 mt-3">
              <div className={`text-xs ${textMuted}`}>
                <span className={accentColor}>{tech.years}</span> {yearsLabel}
              </div>
              <div className={`text-xs ${textMuted}`}>
                <span className={accentColor}>{tech.projects}</span> {projectsLabel}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 pointer-events-none ${
            isDark 
              ? "bg-gradient-to-t from-cyan-400/5 to-transparent" 
              : "bg-gradient-to-t from-blue-500/5 to-transparent"
          }`}
        />
      )}
    </motion.div>
  );
}

interface CategorySectionProps {
  category: TechCategory;
  index: number;
}

function CategorySection({ category, index }: CategorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { theme, language } = useTheme();
  const isDark = theme === "dark";
  
  const lang = language as keyof typeof category.name;
  const categoryName = category.name[lang] || category.name.en;
  
  const accentColor = isDark ? "text-cyan-400" : "text-blue-500";
  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const textPrimary = isDark ? "text-white" : "text-black";

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{category.icon}</span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
          {categoryName}
          <span className={accentColor}>.</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.techs.map((tech, i) => (
          <TechCard key={tech.name} tech={tech} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

export default function TechCards({ categories }: { categories: TechCategory[] }) {
  return (
    <div className="w-full">
      {categories.map((category, index) => (
        <CategorySection key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}