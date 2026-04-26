-- Migration: Add visibility and GitHub link to projects table
-- Date: 2026-04-26

-- Add show_on_page column (controls visibility on public page)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_on_page BOOLEAN DEFAULT true;

-- Add github_src column (links to GitHub repo name for merging data)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_src VARCHAR(100);

-- Add github_languages column (stores language percentages from GitHub)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_languages JSONB DEFAULT '{}';

-- Add is_private column (marks if it's a private repo from GitHub)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_show ON projects(show_on_page);
CREATE INDEX IF NOT EXISTS idx_projects_github_src ON projects(github_src);