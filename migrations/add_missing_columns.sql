-- Migration: Add missing columns to team structure tables
-- Date: 2026-02-10

-- Add description column to leadership_layers if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='leadership_layers' AND column_name='description'
  ) THEN
    ALTER TABLE leadership_layers 
      ADD COLUMN "description" TEXT;
  END IF;
END $$;

-- Add designation column to team_members if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='team_members' AND column_name='designation'
  ) THEN
    ALTER TABLE team_members 
      ADD COLUMN "designation" VARCHAR(255);
  END IF;
END $$;

-- Verify
SELECT 'leadership_layers columns:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'leadership_layers' 
ORDER BY ordinal_position;

SELECT 'team_members columns:' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'team_members' 
ORDER BY ordinal_position;
