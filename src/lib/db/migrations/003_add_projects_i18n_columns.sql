-- Migration: Add missing columns to projects table
-- Date: 2026-04-26

-- Add subtitle columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_pt TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_es TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_fr TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_zh TEXT;

-- Add abt (about) columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_pt TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_en TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_es TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_fr TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_zh TEXT;

-- Add alt columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_pt TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_en TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_es TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_fr TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS alt_zh TEXT;

-- Add featured and display_order if they don't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;