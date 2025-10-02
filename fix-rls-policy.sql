-- Fix RLS Policy for Perfumes Table

-- Option 1: Allow all inserts (for development/testing)
-- ⚠️ Use this for quick testing only, NOT for production

DROP POLICY IF EXISTS "Allow public insert" ON perfumes;

CREATE POLICY "Allow public insert"
ON perfumes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also allow select, update, delete for testing
DROP POLICY IF EXISTS "Allow public select" ON perfumes;
CREATE POLICY "Allow public select"
ON perfumes
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public update" ON perfumes;
CREATE POLICY "Allow public update"
ON perfumes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete" ON perfumes;
CREATE POLICY "Allow public delete"
ON perfumes
FOR DELETE
TO anon, authenticated
USING (true);


-- Option 2: Temporarily disable RLS (easiest for dev)
-- Uncomment this to disable RLS completely:

-- ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;


-- Option 3: Enable RLS with proper admin role (for production)
-- Commented out for now, use later:

/*
-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Public can only read
CREATE POLICY "Public read access"
ON perfumes
FOR SELECT
TO anon
USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admin full access"
ON perfumes
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');
*/
