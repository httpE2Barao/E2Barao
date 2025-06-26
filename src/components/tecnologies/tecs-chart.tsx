"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../switchers/switchers';

// --- ÁREAS DE CONHECIMENTO (AGORA COM TRADUÇÕES) ---
const technologies = [
  { id: 'webDevelopment', name: { 'pt-BR': 'Desenvolvimento Web', 'en-US': 'Web Development' }, color: '#3b82f6' },
  { id: 'database', name: { 'pt-BR': 'Banco de Dados', 'en-US': 'Database' }, color: '#16a34a' },
  { id: 'softwareDesign', name: { 'pt-BR': 'Design & Arquitetura de Software', 'en-US': 'Software Design & Architecture' }, color: '#f97316' },
  { id: 'programmingLogic', name: { 'pt-BR': 'Lógica de Programação', 'en-US': 'Programming Logic' }, color: '#c026d3' },
  { id: 'userExperience', name: { 'pt-BR': 'UX (Experiência do Usuário)', 'en-US': 'UX (User Experience)' }, color: '#8b5cf6' },
  { id: 'artificialIntelligence', name: { 'pt-BR': 'Inteligência Artificial', 'en-US': 'Artificial Intelligence' }, color: '#e11d48' },
  { id: 'devOpsQA', name: { 'pt-BR': 'DevOps & Quality Assurance', 'en-US': 'DevOps & Quality Assurance' }, color: '#0891b2' },
];

// --- DADOS DA EVOLUÇÃO (AGORA USANDO IDs ESTÁVEIS) ---
const evolutionData = [
  { date: '2022-06', webDevelopment: 20, programmingLogic: 15 },
  { date: '2022-12', webDevelopment: 40, programmingLogic: 30 },
  { date: '2023-06', webDevelopment: 70, programmingLogic: 50, softwareDesign: 20 },
  { date: '2023-12', webDevelopment: 80, programmingLogic: 60, softwareDesign: 25 },
  { date: '2024-10', webDevelopment: 85, programmingLogic: 100, softwareDesign: 40 },
  { date: '2025-03', webDevelopment: 90, programmingLogic: 100, softwareDesign: 70, database: 30, userExperience: 40 },
  { date: '2025-06', webDevelopment: 95, database: 70, softwareDesign: 75, programmingLogic: 100, userExperience: 70, artificialIntelligence: 40, devOpsQA: 50 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const relevantPayload = payload.filter((p:any) => p.value != null);
    return (
      <div className="p-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-xl:px-10">
        <p className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        <ul className="space-y-1">
          {relevantPayload.map((pld: any, index: number) => (
            <li key={index} style={{ color: pld.color }} className="font-semibold text-sm">
              {`${pld.name}: ${pld.value}%`}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};


export default function SkillsEvolutionChart() {
  const { language, theme } = useTheme(); 

  // Define um tipo para garantir que o idioma seja uma chave válida
  const currentLanguage: 'pt-BR' | 'en-US' = language === 'pt-BR' ? 'pt-BR' : 'en-US';

  const tickColor = theme === 'dark' ? '#A1A1AA' : '#71717A';
  const gridColor = theme === 'dark' ? '#3F3F46' : '#E5E7EB';

  return (
    <ResponsiveContainer width="100%" height={400} className="max-w-5xl mx-auto">
      <AreaChart data={evolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 12 }} stroke={tickColor} />
        <YAxis tick={{ fill: tickColor, fontSize: 12 }} stroke={tickColor} tickFormatter={(value) => `${value}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
            formatter={(value) => (
                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} capitalize text-xs md:text-sm`}>
                    {value}
                </span>
            )}
        />
        {technologies.map(tech => (
          <Area 
            // AJUSTE: Usando o ID estável para a key e dataKey
            key={tech.id} 
            dataKey={tech.id} 
            type="monotone" 
            stackId="1" 
            stroke={tech.color} 
            fill={tech.color} 
            fillOpacity={0.8} 
            connectNulls
            // AJUSTE: Usando o nome traduzido para exibição
            name={tech.name[currentLanguage]} 
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};