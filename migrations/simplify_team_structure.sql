-- Migration: Simplify team structure - Remove Role layer
-- Members now belong directly to Categories (Layers)
-- Date: 2026-02-10

-- Step 1: Add layerId column to team_members if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='team_members' AND column_name='layerId'
  ) THEN
    ALTER TABLE team_members 
      ADD COLUMN "layerId" INTEGER;
  END IF;
END $$;

-- Step 2: Migrate existing data - copy layerId from roles to team_members
UPDATE team_members tm
SET "layerId" = r."layerId"
FROM roles r
WHERE tm."roleId" = r.id
AND tm."layerId" IS NULL;

-- Step 3: Make layerId required for future entries
ALTER TABLE team_members 
  ALTER COLUMN "layerId" SET NOT NULL;

-- Step 4: Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'team_members_layerId_fkey'
  ) THEN
    ALTER TABLE team_members
      ADD CONSTRAINT team_members_layerId_fkey
      FOREIGN KEY ("layerId")
      REFERENCES leadership_layers(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Step 5: Rename designation to title (job title)
ALTER TABLE team_members 
  RENAME COLUMN "designation" TO "title";

-- Step 6: Make title required (every member needs a job title)
UPDATE team_members 
SET "title" = 'Team Member' 
WHERE "title" IS NULL OR "title" = '';

ALTER TABLE team_members 
  ALTER COLUMN "title" SET NOT NULL;

-- Step 7: Drop roleId column (no longer needed)
ALTER TABLE team_members 
  DROP COLUMN IF EXISTS "roleId";

-- Verify the changes
SELECT 'team_members structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'team_members' 
ORDER BY ordinal_position;
