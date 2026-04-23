-- =====================================================
-- MIGRATION: Admin Portfolio + CV Generator System
-- Date: 2026-04-06
-- =====================================================

-- 1. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('tech', 'concept', 'program')),
  level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  color VARCHAR(50),
  icon_src VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EXPERIENCE ENTRIES TABLE
CREATE TABLE IF NOT EXISTS experience_entries (
  id SERIAL PRIMARY KEY,
  period_start VARCHAR(50),
  period_end VARCHAR(50),
  role_pt TEXT,
  role_en TEXT,
  role_es TEXT,
  role_fr TEXT,
  role_zh TEXT,
  company_pt TEXT,
  company_en TEXT,
  company_es TEXT,
  company_fr TEXT,
  company_zh TEXT,
  description_pt TEXT,
  description_en TEXT,
  description_es TEXT,
  description_fr TEXT,
  description_zh TEXT,
  highlight BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  github_repos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EDUCATION ENTRIES TABLE
CREATE TABLE IF NOT EXISTS education_entries (
  id SERIAL PRIMARY KEY,
  period_start VARCHAR(50),
  period_end VARCHAR(50),
  degree_pt TEXT,
  degree_en TEXT,
  degree_es TEXT,
  degree_fr TEXT,
  degree_zh TEXT,
  school_pt TEXT,
  school_en TEXT,
  school_es TEXT,
  school_fr TEXT,
  school_zh TEXT,
  description_pt TEXT,
  description_en TEXT,
  description_es TEXT,
  description_fr TEXT,
  description_zh TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PORTFOLIO CONTENT TABLE (hero, about, phrases, footer, etc.)
CREATE TABLE IF NOT EXISTS portfolio_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value_pt TEXT,
  value_en TEXT,
  value_es TEXT,
  value_fr TEXT,
  value_zh TEXT,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- 5. CONTACT INFO TABLE
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  icon VARCHAR(50),
  description_pt TEXT,
  description_en TEXT,
  description_es TEXT,
  description_fr TEXT,
  description_zh TEXT,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PROJECTS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  src VARCHAR(100) NOT NULL UNIQUE,
  site_url TEXT,
  repo_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  name_pt TEXT,
  name_en TEXT,
  name_es TEXT,
  name_fr TEXT,
  name_zh TEXT,
  subtitle_pt TEXT,
  subtitle_en TEXT,
  subtitle_es TEXT,
  subtitle_fr TEXT,
  subtitle_zh TEXT,
  abt_pt TEXT,
  abt_en TEXT,
  abt_es TEXT,
  abt_fr TEXT,
  abt_zh TEXT,
  alt_pt TEXT,
  alt_en TEXT,
  alt_es TEXT,
  alt_fr TEXT,
  alt_zh TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ALTER PROJECTS TABLE - add missing columns to existing table
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 7. CV TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS cv_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  format VARCHAR(50) NOT NULL CHECK (format IN ('chronological', 'functional', 'combination', 'minimal', 'creative')),
  config JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CV GENERATED TABLE (saved CVs)
CREATE TABLE IF NOT EXISTS cv_generated (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES cv_templates(id) ON DELETE SET NULL,
  format VARCHAR(10) DEFAULT 'pdf',
  blob_url TEXT,
  language VARCHAR(5) DEFAULT 'pt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(active);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience_entries(display_order);
CREATE INDEX IF NOT EXISTS idx_education_order ON education_entries(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_section ON portfolio_content(section);
CREATE INDEX IF NOT EXISTS idx_contact_visible ON contact_info(visible);
CREATE INDEX IF NOT EXISTS idx_cv_generated_lang ON cv_generated(language);
