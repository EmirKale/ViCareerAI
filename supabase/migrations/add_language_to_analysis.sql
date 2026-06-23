-- ============================================================
-- Migration: Add language column to analysis tables
-- ============================================================

ALTER TABLE public.skills_analysis ADD COLUMN IF NOT EXISTS language text default 'tr';
ALTER TABLE public.roadmap_analysis ADD COLUMN IF NOT EXISTS language text default 'tr';
