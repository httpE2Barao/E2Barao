import { sql } from '@vercel/postgres';

interface Migration {
  id: string;
  description: string;
  sql: string[];
}

const MIGRATIONS: Migration[] = [
  {
    id: '001_schema',
    description: 'Create initial tables',
    sql: [
      `CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_en VARCHAR(100),
        name_es VARCHAR(100),
        category VARCHAR(50) NOT NULL,
        level INTEGER DEFAULT 0,
        color VARCHAR(50),
        icon_src VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS experience_entries (
        id SERIAL PRIMARY KEY,
        period_start VARCHAR(50), period_end VARCHAR(50),
        role_pt TEXT, role_en TEXT, role_es TEXT, role_fr TEXT, role_zh TEXT,
        company_pt TEXT, company_en TEXT, company_es TEXT, company_fr TEXT, company_zh TEXT,
        description_pt TEXT, description_en TEXT, description_es TEXT, description_fr TEXT, description_zh TEXT,
        highlight BOOLEAN DEFAULT false, display_order INTEGER DEFAULT 0,
        github_repos TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS education_entries (
        id SERIAL PRIMARY KEY,
        period_start VARCHAR(50), period_end VARCHAR(50),
        degree_pt TEXT, degree_en TEXT, degree_es TEXT, degree_fr TEXT, degree_zh TEXT,
        school_pt TEXT, school_en TEXT, school_es TEXT, school_fr TEXT, school_zh TEXT,
        description_pt TEXT, description_en TEXT, description_es TEXT, description_fr TEXT, description_zh TEXT,
        education_type VARCHAR(20) DEFAULT 'course', display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS portfolio_content (
        id SERIAL PRIMARY KEY, section VARCHAR(50) NOT NULL, key VARCHAR(100) NOT NULL,
        value_pt TEXT, value_en TEXT, value_es TEXT, value_fr TEXT, value_zh TEXT,
        display_order INTEGER DEFAULT 0, updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(section, key)
      )`,
      `CREATE TABLE IF NOT EXISTS contact_info (
        id SERIAL PRIMARY KEY, label VARCHAR(100) NOT NULL, value TEXT NOT NULL, icon VARCHAR(50),
        description_pt TEXT, description_en TEXT, description_es TEXT, description_fr TEXT, description_zh TEXT,
        visible BOOLEAN DEFAULT true, display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY, src VARCHAR(100) NOT NULL UNIQUE,
        site_url TEXT, repo_url TEXT,
        image_urls TEXT[] DEFAULT '{}', tags TEXT[] DEFAULT '{}',
        name_pt TEXT, name_en TEXT, name_es TEXT, name_fr TEXT, name_zh TEXT,
        subtitle_pt TEXT, subtitle_en TEXT, subtitle_es TEXT, subtitle_fr TEXT, subtitle_zh TEXT,
        abt_pt TEXT, abt_en TEXT, abt_es TEXT, abt_fr TEXT, abt_zh TEXT,
        alt_pt TEXT, alt_en TEXT, alt_es TEXT, alt_fr TEXT, alt_zh TEXT,
        featured BOOLEAN DEFAULT false, display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS cv_templates (
        id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,
        format VARCHAR(50) NOT NULL, config JSONB DEFAULT '{}',
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS cv_generated (
        id SERIAL PRIMARY KEY, template_id INTEGER REFERENCES cv_templates(id) ON DELETE SET NULL,
        format VARCHAR(10) DEFAULT 'pdf', blob_url TEXT, language VARCHAR(5) DEFAULT 'pt',
        config JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS github_cache (
        id SERIAL PRIMARY KEY, cache_key VARCHAR(50) NOT NULL UNIQUE,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      )`,
    ],
  },
  {
    id: '002_projects_visibility',
    description: 'Add show_on_page, github_src, github_languages, is_private to projects',
    sql: [
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_on_page BOOLEAN DEFAULT true`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_src VARCHAR(100)`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_languages JSONB DEFAULT '{}'`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false`,
    ],
  },
  {
    id: '003_projects_i18n',
    description: 'Add subtitle, abt, alt, featured, display_order columns to projects',
    sql: [
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_pt TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_en TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_es TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_fr TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_zh TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_pt TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_en TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_es TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_fr TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_zh TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_pt TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_en TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_es TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_fr TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_zh TEXT`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0`,
    ],
  },
  {
    id: '004_projects_spiral_visible',
    description: 'Add in_spiral and visible columns to projects',
    sql: [
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS in_spiral BOOLEAN DEFAULT true`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true`,
    ],
  },
  {
    id: '005_skill_categories',
    description: 'Add category CHECK constraint to skills',
    sql: [
      `ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_check`,
      `ALTER TABLE skills ADD CONSTRAINT skills_category_check
        CHECK (category IN (
          'languages', 'frameworks', 'styling', 'database', 'state', 'auth',
          'ai', 'devops', 'design', 'testing', 'realtime', 'dataviz',
          'integrations', 'tools', 'concepts'
        ))`,
    ],
  },
  {
    id: '006_cv_template_nullable',
    description: 'Make template_id nullable in cv_generated',
    sql: [
      `ALTER TABLE cv_generated ALTER COLUMN template_id DROP NOT NULL`,
    ],
  },
  {
    id: '007_projects_skill_ids',
    description: 'Add skill_ids array column to projects',
    sql: [
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS skill_ids INTEGER[] DEFAULT '{}'`,
    ],
  },
];

export async function runMigrations(): Promise<{ applied: number; pending: number; errors: string[] }> {
  const errors: string[] = [];
  let applied = 0;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
  } catch (e: any) {
    return { applied: 0, pending: MIGRATIONS.length, errors: [`Failed to create _migrations table: ${e.message}`] };
  }

  for (const migration of MIGRATIONS) {
    try {
      const { rows } = await sql`SELECT id FROM _migrations WHERE name = ${migration.id}`;
      if (rows.length > 0) continue;

      for (const stmt of migration.sql) {
        await sql.query(stmt);
      }

      await sql`INSERT INTO _migrations (name) VALUES (${migration.id})`;
      applied++;
      console.log(`[Migration] Applied: ${migration.id} - ${migration.description}`);
    } catch (e: any) {
      errors.push(`${migration.id}: ${e.message}`);
      console.error(`[Migration] Error on ${migration.id}:`, e.message);
    }
  }

  const { rows: totalRows } = await sql`SELECT COUNT(*) as cnt FROM _migrations`;
  const pending = MIGRATIONS.length - (totalRows[0]?.cnt ?? 0);

  return { applied, pending, errors };
}
