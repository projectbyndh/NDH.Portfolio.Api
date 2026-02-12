-- Migration: Convert visibleOn from ARRAY to JSON
-- Date: 2026-02-10
-- Reason: Changed from PostgreSQL-specific ARRAY to portable JSON type

-- Step 1: Drop existing default value
ALTER TABLE leadership_layers 
  ALTER COLUMN "visibleOn" DROP DEFAULT;

-- Step 2: Convert existing ARRAY data to JSON format
ALTER TABLE leadership_layers 
  ALTER COLUMN "visibleOn" TYPE jsonb 
  USING CASE 
    WHEN "visibleOn" IS NULL THEN '["about","team"]'::jsonb
    ELSE to_jsonb("visibleOn")
  END;

-- Step 3: Set new default value
ALTER TABLE leadership_layers 
  ALTER COLUMN "visibleOn" SET DEFAULT '["about","team"]'::jsonb;

-- Verify the change
-- SELECT column_name, data_type, column_default FROM information_schema.columns 
-- WHERE table_name = 'leadership_layers' AND column_name = 'visibleOn';
