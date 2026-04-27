-- Migration: Add in_spiral and visible columns to projects table
-- Date: 2026-04-26

-- Add in_spiral column (controls appearance in home page spiral)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS in_spiral BOOLEAN DEFAULT true;

-- Add visible column (controls appearance in "other projects" section)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_in_spiral ON projects(in_spiral);
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);