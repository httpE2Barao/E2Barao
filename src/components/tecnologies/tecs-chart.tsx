"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- ÁREAS DE CONHECIMENTO (SEM ALTERAÇÃO) ---
const technologies = [
  { name: 'Desenvolvimento Web', color: '#3b82f6' },
  { name: 'Banco de Dados', color: '#16a34a' },
  { name: 'Design & Arquitetura de Software', color: '#f97316' },
  { name: 'Lógica de Programação', color: '#c026d3' },
  { name: 'UX (Experiência do Usuário)', color: '#8b5cf6' },
  { name: 'Inteligência Artificial', color: '#e11d48' },
  { name: 'DevOps & Quality Assurance', color: '#0891b2' },
];

// --- DADOS DA EVOLUÇÃO (AJUSTADOS CONFORME SOLICITADO) ---
const evolutionData = [
  { date: '2022-06', 'Desenvolvimento Web': 20, 'Lógica de Programação': 15 },
  { date: '2022-12', 'Desenvolvimento Web': 40, 'Lógica de Programação': 30 },
  { date: '2023-06', 'Desenvolvimento Web': 70, 'Lógica de Programação': 50, 'Design & Arquitetura de Software': 20 },
  { date: '2023-12', 'Desenvolvimento Web': 80, 'Lógica de Programação': 60, 'Design & Arquitetura de Software': 25 },
  { date: '2024-10', 'Desenvolvimento Web': 85, 'Lógica de Programação': 100, 'Design & Arquitetura de Software': 40 },
  { date: '2025-03', 'Desenvolvimento Web': 90, 'Lógica de Programação': 100, 'Design & Arquitetura de Software': 70, 'Banco de Dados': 30, 'UX (Experiência do Usuário)': 40 },
  { date: '2025-06', 'Desenvolvimento Web': 95, 'Banco de Dados': 70, 'Design & Arquitetura de Software': 75, 'Lógica de Programação': 100, 'UX (Experiência do Usuário)': 70, 'Inteligência Artificial': 40, 'DevOps & Quality Assurance': 50 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const relevantPayload = payload.filter(p => p.value != null);
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

interface SkillsEvolutionChartProps {
    theme: 'light' | 'dark';
}

export default function SkillsEvolutionChart({ theme }: SkillsEvolutionChartProps) {
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
            key={tech.name} 
            type="monotone" 
            dataKey={tech.name} 
            stackId="1" 
            stroke={tech.color} 
            fill={tech.color} 
            fillOpacity={0.8} 
            name={tech.name} 
            connectNulls
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};