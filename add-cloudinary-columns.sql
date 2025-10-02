-- Add Cloudinary columns to perfumes table

ALTER TABLE perfumes
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;

-- Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_perfumes_cloudinary_public_id ON perfumes(cloudinary_public_id);

-- Add Cloudinary columns to ingredients table (if needed later)
ALTER TABLE ingredients
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;

CREATE INDEX IF NOT EXISTS idx_ingredients_cloudinary_public_id ON ingredients(cloudinary_public_id);
