-- Make template_id nullable in cv_generated table
ALTER TABLE cv_generated ALTER COLUMN template_id DROP NOT NULL;
