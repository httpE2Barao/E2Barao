import { sql } from '@vercel/postgres';
import { Skill, SkillBrief } from '../types';

function mapRowToSkill(row: any): Skill {
  return { ...row };
}

export async function getAllSkills(): Promise<Skill[]> {
  const { rows } = await sql`SELECT * FROM skills ORDER BY display_order NULLS LAST, name`;
  return rows.map(mapRowToSkill);
}

export async function getActiveSkills(): Promise<Skill[]> {
  const { rows } = await sql`SELECT * FROM skills WHERE active = true ORDER BY display_order NULLS LAST, name`;
  return rows.map(mapRowToSkill);
}

export async function getSkillMap(): Promise<Record<number, SkillBrief>> {
  const map: Record<number, SkillBrief> = {};
  const { rows } = await sql`SELECT id, name, category FROM skills WHERE active = true`;
  for (const s of rows) {
    map[s.id] = { id: s.id, name: s.name, category: s.category };
  }
  return map;
}

export async function createSkill(data: {
  name: string;
  category: string;
  level?: number;
  color?: string;
  icon_src?: string;
  display_order?: number;
  active?: boolean;
}): Promise<Skill> {
  let order = data.display_order;
  if (!order || order === 0) {
    const { rows } = await sql`
      SELECT COALESCE(MAX(display_order), 0) + 10 AS next_order
      FROM skills WHERE category = ${data.category}
    `;
    order = rows[0]?.next_order || 10;
  }

  const { rows } = await sql`
    INSERT INTO skills (name, category, level, color, icon_src, display_order, active)
    VALUES (
      ${data.name}, ${data.category},
      ${data.level || 0}, ${data.color || ''}, ${data.icon_src || ''},
      ${order}, ${data.active ?? true}
    )
    RETURNING *
  `;
  return mapRowToSkill(rows[0]);
}

export async function updateSkill(id: number, fields: Partial<Skill>): Promise<Skill | null> {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (key !== 'id') {
      setClauses.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return null;

  values.push(id);
  const { rows } = await sql.query(
    `UPDATE skills SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return rows.length > 0 ? mapRowToSkill(rows[0]) : null;
}

export async function findOrCreateSkill(name: string, category: string): Promise<{ id: number; name: string; category: string }> {
  const { rows } = await sql`SELECT id, name, category FROM skills WHERE LOWER(name) = LOWER(${name}) LIMIT 1`;
  if (rows.length > 0) {
    return { id: rows[0].id, name: rows[0].name, category: rows[0].category };
  }
  const skill = await createSkill({ name, category, level: 0, active: true });
  return { id: skill.id, name: skill.name, category: skill.category };
}

export async function deleteSkill(id: number): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM skills WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
