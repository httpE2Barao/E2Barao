"use client";

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Array<{ role: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; school: string; period: string; description: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string }>;
  languages: string[];
}

function categorizeSkills(skills: string[]) {
  return [
    { title: "Frontend Development", skills: skills.filter((s) => /react|next|typescript|javascript|tailwind|html|css|sass/i.test(s)) },
    { title: "Backend & Database", skills: skills.filter((s) => /node|python|php|postgres|mysql|prisma|api/i.test(s)) },
    { title: "Tools & Platforms", skills: skills.filter((s) => /git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
    { title: "Concepts & Practices", skills: skills.filter((s) => !/react|next|typescript|javascript|tailwind|html|css|sass|node|python|php|postgres|mysql|prisma|api|git|docker|figma|wordpress|n8n|vercel/i.test(s)) },
  ].filter((cat) => cat.skills.length > 0);
}

export function FunctionalPreview({ data }: { data: CVData }) {
  const skillCategories = categorizeSkills(data.skills);

  return (
    <div className="bg-white text-gray-900 p-8 text-[10px] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-4 pb-3 border-b border-gray-200 text-center">
        <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-[11px] text-gray-500 mb-2">{data.title}</p>
        <div className="flex flex-wrap justify-center gap-3 text-[9px] text-gray-600">
          {data.email && <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>}
          {data.phone && <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">{data.phone}</a>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
          {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>}
        </div>
      </div>

      <p className="text-[10px] text-gray-700 leading-relaxed mb-4">{data.summary}</p>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Core Competencies</h2>
        {skillCategories.map((cat, i) => (
          <div key={i} className="mb-3">
            <h3 className="text-[10px] font-semibold text-gray-800 mb-1">{cat.title}</h3>
            <div className="flex flex-wrap gap-1">
              {cat.skills.map((skill, j) => (
                <span key={j} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[9px]">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Key Projects</h2>
        {data.projects.map((project, i) => (
          <div key={i} className="mb-2">
            <p className="text-[10px] font-semibold text-gray-800">{project.name}</p>
            <p className="text-[9px] text-gray-700 leading-relaxed">{project.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Professional Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[10px] text-gray-800">{exp.role}</span>
              <span className="text-[9px] text-gray-500">{exp.period}</span>
            </div>
            <p className="text-[9px] text-gray-600">{exp.company}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[10px] text-gray-800">{edu.degree}</span>
              <span className="text-[9px] text-gray-500">{edu.period}</span>
            </div>
            <p className="text-[9px] text-gray-600">{edu.school}</p>
          </div>
        ))}
      </div>

      {data.languages.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-200">Languages</h2>
          <p className="text-[10px] text-gray-700">{data.languages.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}
