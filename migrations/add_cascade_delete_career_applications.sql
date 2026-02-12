-- Migration to add CASCADE delete to career_applications foreign key
-- Run this SQL in your PostgreSQL database

-- Drop the existing foreign key constraint
ALTER TABLE career_applications 
DROP CONSTRAINT IF EXISTS career_applications_careerId_fkey;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE career_applications 
ADD CONSTRAINT career_applications_careerId_fkey 
FOREIGN KEY ("careerId") 
REFERENCES careers(id) 
ON DELETE CASCADE;
