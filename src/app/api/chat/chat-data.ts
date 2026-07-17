import { getAllProjects } from "@/lib/db/queries/projects"
import { getAllSkills } from "@/lib/db/queries/skills"
import { sql } from '@vercel/postgres'

type LangKey = "pt" | "en" | "es" | "fr" | "zh"

function pickField(row: Record<string, any>, base: string, lang: LangKey): string {
  return row[`${base}_${lang}`] || row[`${base}_en`] || ""
}

export async function getProjectsContext(lang: LangKey): Promise<string> {
  const projects = await getAllProjects()

  const lines = projects
    .filter((p) => p.visible !== false)
    .map((p) => {
      const name = pickField(p as any, "name", lang)
      const desc = pickField(p as any, "abt", lang)
      const tags = p.tags?.filter(Boolean).join(", ") || ""
      const links = [p.site_url ? `Site: ${p.site_url}` : "", p.repo_url ? `Repo: ${p.repo_url}` : ""]
        .filter(Boolean)
        .join(", ")
      return `- **${name}**: ${desc.substring(0, 350)}${desc.length > 350 ? "..." : ""} [Tech: ${tags}]${links ? ` (${links})` : ""}`
    })
    .join("\n")

  const prefix = lang === "pt"
    ? "## PROJETOS DE ELIAS BARÃO\n\nAbaixo estão os projetos reais de Elias. Use estas informações quando perguntarem sobre projetos.\n\n"
    : "## ELIAS BARÃO'S PROJECTS\n\nBelow are Elias' real projects. Use this information when asked about projects.\n\n"

  return prefix + lines
}

export async function getExperienceContext(lang: LangKey): Promise<string> {
  const { rows } = await sql`
    SELECT role_pt, role_en, role_es, role_fr, role_zh,
           company_pt, company_en, company_es, company_fr, company_zh,
           period_start, period_end
    FROM experience_entries
    ORDER BY display_order ASC NULLS LAST
  `

  return rows.map((r: any) => {
    const role = pickField(r, "role", lang)
    const company = pickField(r, "company", lang)
    return `- ${role} @ ${company} (${r.period_start} - ${r.period_end})`
  }).join("\n")
}

export async function getEducationContext(lang: LangKey): Promise<string> {
  const { rows } = await sql`
    SELECT degree_pt, degree_en, degree_es, degree_fr, degree_zh,
           school_pt, school_en, school_es, school_fr, school_zh,
           period_start, period_end, education_type
    FROM education_entries
    ORDER BY display_order ASC NULLS LAST
  `

  return rows.map((r: any) => {
    const degree = pickField(r, "degree", lang)
    const school = pickField(r, "school", lang)
    return `- ${degree} @ ${school} (${r.period_start} - ${r.period_end})`
  }).join("\n")
}

export async function getSkillsContext(): Promise<string> {
  const skills = await getAllSkills()
  return skills.filter((s) => s.active).map((s) => s.name).join(", ")
}
