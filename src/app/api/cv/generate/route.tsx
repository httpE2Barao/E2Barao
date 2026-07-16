import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { pdf } from '@react-pdf/renderer';
import { ChronologicalCV } from '@/components/cv/templates/chronological';
import { FunctionalCV } from '@/components/cv/templates/functional';
import { CombinationCV } from '@/components/cv/templates/combination';
import { MinimalCV } from '@/components/cv/templates/minimal';
import { CreativeCV } from '@/components/cv/templates/creative';
import { getSkillCategory } from '@/lib/skill-categories';

const templateMap: Record<string, any> = {
  chronological: ChronologicalCV,
  functional: FunctionalCV,
  combination: CombinationCV,
  minimal: MinimalCV,
  creative: CreativeCV,
};

type LocalizedString = { pt: string; en: string; es: string };

function getLocalizedValue(obj: LocalizedString | undefined, lang: string): string {
  if (!obj) return '';
  return obj[lang as keyof LocalizedString] || obj.pt || obj.en || obj.es || '';
}

async function getLatestConfig() {
  const { rows } = await sql`
    SELECT config FROM cv_generated
    WHERE format = 'config'
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return rows[0]?.config || null;
}

async function fetchExperience(ids: number[]) {
  try {
    const { rows } = await sql`SELECT * FROM experience_entries ORDER BY id`;
    return rows;
  } catch {
    return [];
  }
}

async function fetchEducation(ids: number[]) {
  try {
    const { rows } = await sql`SELECT * FROM education_entries ORDER BY id`;
    return rows;
  } catch {
    return [];
  }
}

async function fetchSkills() {
  try {
    const { rows } = await sql`SELECT * FROM skills WHERE active = true ORDER BY display_order NULLS LAST, name`;
    return rows;
  } catch {
    return [];
  }
}

async function fetchProjects(ids: number[]) {
  try {
    const { rows } = await sql`SELECT * FROM projects ORDER BY id`;
    return rows;
  } catch {
    return [];
  }
}

function localizeField(pt: string, en?: string, es?: string): LocalizedString {
  return { pt: pt || '', en: en || pt || '', es: es || en || pt || '' };
}

function buildLocalizedData(config: any, lang: string, experience: any[], education: any[], skills: any[], projects: any[]) {
  // Filter by selected IDs
  const selectedExp = config.selectedExperienceIds?.length > 0
    ? experience.filter((e) => config.selectedExperienceIds.includes(e.id))
    : experience;

  const selectedEdu = config.selectedEducationIds?.length > 0
    ? education.filter((e) => config.selectedEducationIds.includes(e.id))
    : education;

  const selectedProj = config.selectedProjectIds?.length > 0
    ? projects.filter((p) => config.selectedProjectIds.includes(p.id))
    : projects;

  // Filter and sort skills
  let selectedSkills = config.selectedSkillIds?.length > 0
    ? skills.filter((s) => config.selectedSkillIds.includes(s.id))
    : skills;

  // Apply max limit
  if (config.maxSkills > 0) {
    selectedSkills = selectedSkills.slice(0, config.maxSkills);
  }

  const skillNames = selectedSkills.map((s: any) => getLocalizedValue(localizeField(s.name_pt || s.name, s.name_en || s.name, s.name_es || s.name_en || s.name), lang));
  const skillOrders = selectedSkills.map((s: any) => s.display_order ?? 0);

  return {
    name: getLocalizedValue(config.name, lang),
    title: getLocalizedValue(config.title, lang),
    email: config.email || '',
    phone: config.phone || '',
    whatsapp: config.whatsapp || '',
    location: getLocalizedValue(config.location, lang),
    linkedin: config.linkedin || '',
    github: config.github || '',
    summary: getLocalizedValue(config.summary, lang),
    language: lang,
    experience: selectedExp.map((e: any) => ({
      role: getLocalizedValue(localizeField(e.role_pt || e.role, e.role_en || e.role, e.role_es || e.role_en || e.role), lang),
      company: getLocalizedValue(localizeField(e.company_pt || e.company, e.company_en || e.company, e.company_es || e.company_en || e.company), lang),
      period: `${e.period_start} - ${e.period_end || 'Atual'}`,
      description: getLocalizedValue(localizeField(e.description_pt || e.description, e.description_en || e.description, e.description_es || e.description_en || e.description), lang),
    })),
    education: selectedEdu.map((e: any) => ({
      degree: getLocalizedValue(localizeField(e.degree_pt || e.degree, e.degree_en || e.degree, e.degree_es || e.degree_en || e.degree), lang),
      school: getLocalizedValue(localizeField(e.school_pt || e.school, e.school_en || e.school, e.school_es || e.school_en || e.school), lang),
      period: `${e.period_start} - ${e.period_end || 'Atual'}`,
      description: getLocalizedValue(localizeField(e.description_pt || e.description, e.description_en || e.description, e.description_es || e.description_en || e.description), lang),
    })),
    skills: skillNames,
    skillOrders: skillOrders,
    projects: selectedProj.map((p: any) => ({
      name: getLocalizedValue(localizeField(p.name_pt || p.name, p.name_en || p.name, p.name_es || p.name_en || p.name), lang),
      description: getLocalizedValue(localizeField(p.abt_pt || p.abt, p.abt_en || p.abt, p.abt_es || p.abt_en || p.abt), lang),
      tags: Array.isArray(p.tags) ? p.tags : [],
    })),
    languages: (config.languages || []).map((l: any) => getLocalizedValue(l, lang)),
    additionalInfo: getLocalizedValue(config.additionalInfo, lang),
    additionalData: {
      willingnessToTravel: getLocalizedValue(config.additionalData?.willingnessToTravel, lang),
      willingnessToRelocate: getLocalizedValue(config.additionalData?.willingnessToRelocate, lang),
      driverLicense: getLocalizedValue(config.additionalData?.driverLicense, lang),
      vehicleType: getLocalizedValue(config.additionalData?.vehicleType, lang),
    },
    includeExperience: config.includeExperience ?? true,
    includeEducation: config.includeEducation ?? true,
    includeSkills: config.includeSkills ?? true,
    includeProjects: config.includeProjects ?? true,
    includeLanguages: config.includeLanguages ?? true,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || 'pt';

  try {
    const config = await getLatestConfig();
    if (!config) {
      return NextResponse.json({ error: 'No CV config found. Save one from the admin panel first.' }, { status: 404 });
    }

    const [experience, education, skills, projects] = await Promise.all([
      fetchExperience(config.selectedExperienceIds || []),
      fetchEducation(config.selectedEducationIds || []),
      fetchSkills(),
      fetchProjects(config.selectedProjectIds || []),
    ]);

    const localizedData = buildLocalizedData(config, language, experience, education, skills, projects);

    const templateId = config.selectedTemplate || 'chronological';
    const Component = templateMap[templateId] || ChronologicalCV;

    const doc = pdf(<Component data={localizedData} />);
    const blob = await doc.toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="CV-EliasBarao-${language}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('CV generate error:', error);
    return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
  }
}
