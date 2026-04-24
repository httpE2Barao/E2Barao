"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { techCategories } from "@/data/v2-tecs";
import { useTheme } from "@/components/switchers/switchers";

export function V2TecsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme, language } = useTheme();
  const isDark = theme === "dark";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const accentColor = isDark ? "text-cyan-400" : "text-blue-600";
  const bgGlow = isDark ? "bg-cyan-400/5" : "bg-blue-600/5";
  const textMuted = isDark ? "text-white/30" : "text-black/30";

  const title = language === "pt" ? "Tecnologias" : language === "es" ? "Tecnologías" : language === "fr" ? "Technologies" : language === "zh" ? "技术" : "Technologies";
  const subtitle = language === "pt" ? "Stack & Expertise" : language === "es" ? "Stack y Experiencia" : language === "fr" ? "Stack et Expertise" : language === "zh" ? "技术栈与专业" : "Stack & Expertise";
  const desc = language === "pt" ? "Ferramentas, linguagens e frameworks que utilizo para construir soluções digitais." : language === "es" ? "Herramientas, lenguajes y frameworks que utilizo." : language === "fr" ? "Outils, langages et frameworks que j'utilise." : language === "zh" ? "我使用的工具、语言和框架。" : "Tools, languages and frameworks I use to build digital solutions.";

  const yearsLabel = language === "pt" ? "anos" : language === "es" ? "años" : language === "fr" ? "ans" : "years";
  const projectsLabel = language === "pt" ? "projetos" : language === "es" ? "proyectos" : language === "fr" ? "projets" : "projects";

  return (
    <section ref={ref} className={`min-h-screen pt-[5rem] pb-16 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <motion.div
        style={{ y: bgY }}
        className={`absolute top-0 right-0 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] ${bgGlow} rounded-full blur-3xl pointer-events-none`}
      />

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <p className={`${accentColor} text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-mono`}>
            {subtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
            {title}
            <span className={accentColor}>.</span>
          </h1>
          <p className={`${textMuted} text-sm sm:text-base mt-4 max-w-xl leading-relaxed`}>
            {desc}
          </p>
        </motion.div>
      </div>

      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 space-y-16">
        {techCategories.map((category, catIndex) => {
          const lang = language as keyof typeof category.name;
          const categoryName = category.name[lang] || category.name.en;
          const totalYears = category.techs.reduce((acc, t) => acc + t.years, 0);
          const totalProjects = category.techs.reduce((acc, t) => acc + t.projects, 0);

          return (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {categoryName}
                  </h2>
                  <p className={`text-sm ${textMuted}`}>
                    {category.techs.length} techs · {totalYears} {yearsLabel} · {totalProjects} {projectsLabel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.techs.map((tech, techIndex) => {
                  const techLang = language as keyof typeof tech.description;
                  const description = tech.description[techLang] || tech.description.en;

                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: techIndex * 0.05, duration: 0.4 }}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isDark
                          ? "bg-white/5 border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5"
                          : "bg-black/5 border-black/10 hover:border-blue-500/30 hover:bg-blue-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isDark ? "bg-white/10" : "bg-black/10"
                        }`}>
                          <Image
                            src={`/images/${tech.icon}`}
                            alt={tech.name}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{tech.name}</h3>
                          <p className={`text-sm ${textMuted}`}>
                            {tech.years} {yearsLabel} · {tech.projects} {projectsLabel}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm mt-3 leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
                        {description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </section>
  );
}