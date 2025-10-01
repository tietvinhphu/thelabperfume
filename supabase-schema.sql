-- TheLab Perfume Database Schema
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create perfumes table
CREATE TABLE perfumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  family VARCHAR(100),
  year INTEGER,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2),
  concentration VARCHAR(50), -- e.g., EDP, EDT, Parfum
  gender VARCHAR(20), -- e.g., Unisex, Men, Women
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100), -- e.g., Floral, Woody, Citrus, Spice
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create perfume_ingredients junction table (many-to-many relationship)
CREATE TABLE perfume_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  note_type VARCHAR(20), -- top, middle, base
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5), -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(perfume_id, ingredient_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_perfumes_family ON perfumes(family);
CREATE INDEX idx_perfumes_brand ON perfumes(brand);
CREATE INDEX idx_perfumes_name ON perfumes(name);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_perfume_ingredients_perfume ON perfume_ingredients(perfume_id);
CREATE INDEX idx_perfume_ingredients_ingredient ON perfume_ingredients(ingredient_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at
CREATE TRIGGER update_perfumes_updated_at BEFORE UPDATE ON perfumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample perfumes data
INSERT INTO perfumes (name, brand, family, year, description, image_url, price, concentration, gender) VALUES
('Bleu de Chanel', 'Chanel', 'Woody Aromatic', 2010, 'A woody aromatic fragrance that embodies freedom with its clean and sensual scent.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 120.00, 'EDP', 'Men'),
('Sauvage', 'Dior', 'Fresh Spicy', 2015, 'Radically fresh composition, raw and noble all at once.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', 110.00, 'EDT', 'Men'),
('La Vie Est Belle', 'Lancôme', 'Floral Fruity Gourmand', 2012, 'A modern interpretation of an oriental fragrance with a twist of gourmand.', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400', 115.00, 'EDP', 'Women'),
('Black Opium', 'Yves Saint Laurent', 'Oriental Vanilla', 2014, 'A highly addictive gourmand fragrance shot through with a caffeinated jolt of coffee.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', 105.00, 'EDP', 'Women'),
('Acqua di Giò', 'Giorgio Armani', 'Aquatic Aromatic', 1996, 'Fresh and aquatic, inspired by the Mediterranean sea.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', 95.00, 'EDT', 'Men'),
('Chance Eau Tendre', 'Chanel', 'Floral Fruity', 2010, 'A delicate presence, an intensely tender trail.', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', 125.00, 'EDT', 'Women'),
('1 Million', 'Paco Rabanne', 'Spicy Leather', 2008, 'A fresh and sensual fragrance blending mint, blood mandarin, and rose absolute.', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400', 90.00, 'EDT', 'Men'),
('Good Girl', 'Carolina Herrera', 'Oriental Floral', 2016, 'Contrasting notes of light and dark with a blend of jasmine and cocoa.', 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', 130.00, 'EDP', 'Women');

-- Insert sample ingredients data
INSERT INTO ingredients (name, category, description, image_url) VALUES
('Bergamot', 'Citrus', 'A fresh, uplifting citrus note derived from the bergamot orange.', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400'),
('Rose', 'Floral', 'Classic floral note with a sweet, romantic character.', 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400'),
('Vanilla', 'Sweet', 'Warm, comforting sweet note with a creamy character.', 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400'),
('Sandalwood', 'Woody', 'Creamy, warm wood note with a soft, milky quality.', 'https://images.unsplash.com/photo-1598985915650-f2d14976ea86?w=400'),
('Patchouli', 'Earthy', 'Deep, earthy note with a slightly sweet and spicy character.', 'https://images.unsplash.com/photo-1607270459092-2bb3e6885993?w=400'),
('Jasmine', 'Floral', 'Rich, intoxicating floral note with a sweet, exotic character.', 'https://images.unsplash.com/photo-1609607881879-eae908fc2a99?w=400'),
('Musk', 'Animalic', 'Soft, powdery base note that adds depth and sensuality.', 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400'),
('Amber', 'Resinous', 'Warm, sweet, resinous note with a balsamic quality.', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400'),
('Lavender', 'Aromatic', 'Clean, fresh aromatic note with a calming effect.', 'https://images.unsplash.com/photo-1595759127869-d90c5b8be792?w=400'),
('Cedar', 'Woody', 'Dry, clean wood note with a pencil-shavings quality.', 'https://images.unsplash.com/photo-1620127807580-990c3ecebd14?w=400'),
('Lemon', 'Citrus', 'Bright, zesty citrus note that adds freshness.', 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400'),
('Vetiver', 'Earthy', 'Green, earthy note with a smoky, woody character.', 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400'),
('Tonka Bean', 'Sweet', 'Warm, sweet note with hints of vanilla and almond.', 'https://images.unsplash.com/photo-1607270459092-2bb3e6885993?w=400'),
('Orange Blossom', 'Floral', 'Fresh, sweet floral note with a honey-like quality.', 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400'),
('Coffee', 'Gourmand', 'Rich, roasted note that adds depth and intensity.', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400');

-- Insert sample perfume-ingredient relationships
-- Bleu de Chanel
INSERT INTO perfume_ingredients (perfume_id, ingredient_id, note_type, intensity) VALUES
((SELECT id FROM perfumes WHERE name = 'Bleu de Chanel'), (SELECT id FROM ingredients WHERE name = 'Lemon'), 'top', 4),
((SELECT id FROM perfumes WHERE name = 'Bleu de Chanel'), (SELECT id FROM ingredients WHERE name = 'Bergamot'), 'top', 5),
((SELECT id FROM perfumes WHERE name = 'Bleu de Chanel'), (SELECT id FROM ingredients WHERE name = 'Cedar'), 'middle', 4),
((SELECT id FROM perfumes WHERE name = 'Bleu de Chanel'), (SELECT id FROM ingredients WHERE name = 'Sandalwood'), 'base', 5);

-- Sauvage
INSERT INTO perfume_ingredients (perfume_id, ingredient_id, note_type, intensity) VALUES
((SELECT id FROM perfumes WHERE name = 'Sauvage'), (SELECT id FROM ingredients WHERE name = 'Bergamot'), 'top', 5),
((SELECT id FROM perfumes WHERE name = 'Sauvage'), (SELECT id FROM ingredients WHERE name = 'Lavender'), 'middle', 3),
((SELECT id FROM perfumes WHERE name = 'Sauvage'), (SELECT id FROM ingredients WHERE name = 'Amber'), 'base', 4);

-- La Vie Est Belle
INSERT INTO perfume_ingredients (perfume_id, ingredient_id, note_type, intensity) VALUES
((SELECT id FROM perfumes WHERE name = 'La Vie Est Belle'), (SELECT id FROM ingredients WHERE name = 'Jasmine'), 'top', 5),
((SELECT id FROM perfumes WHERE name = 'La Vie Est Belle'), (SELECT id FROM ingredients WHERE name = 'Orange Blossom'), 'middle', 4),
((SELECT id FROM perfumes WHERE name = 'La Vie Est Belle'), (SELECT id FROM ingredients WHERE name = 'Vanilla'), 'base', 5),
((SELECT id FROM perfumes WHERE name = 'La Vie Est Belle'), (SELECT id FROM ingredients WHERE name = 'Tonka Bean'), 'base', 4);

-- Black Opium
INSERT INTO perfume_ingredients (perfume_id, ingredient_id, note_type, intensity) VALUES
((SELECT id FROM perfumes WHERE name = 'Black Opium'), (SELECT id FROM ingredients WHERE name = 'Coffee'), 'top', 5),
((SELECT id FROM perfumes WHERE name = 'Black Opium'), (SELECT id FROM ingredients WHERE name = 'Jasmine'), 'middle', 4),
((SELECT id FROM perfumes WHERE name = 'Black Opium'), (SELECT id FROM ingredients WHERE name = 'Vanilla'), 'base', 5),
((SELECT id FROM perfumes WHERE name = 'Black Opium'), (SELECT id FROM ingredients WHERE name = 'Patchouli'), 'base', 3);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on perfumes" ON perfumes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on ingredients" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on perfume_ingredients" ON perfume_ingredients
  FOR SELECT USING (true);

-- If you want to add write access later (for admin users), you can add policies like:
-- CREATE POLICY "Allow authenticated users to insert perfumes" ON perfumes
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a view for perfumes with their ingredients (useful for queries)
CREATE OR REPLACE VIEW perfumes_with_ingredients AS
SELECT
  p.id,
  p.name,
  p.brand,
  p.family,
  p.year,
  p.description,
  p.image_url,
  p.price,
  p.concentration,
  p.gender,
  p.created_at,
  json_agg(
    json_build_object(
      'ingredient_id', i.id,
      'ingredient_name', i.name,
      'category', i.category,
      'note_type', pi.note_type,
      'intensity', pi.intensity
    ) ORDER BY pi.note_type, pi.intensity DESC
  ) FILTER (WHERE i.id IS NOT NULL) as ingredients
FROM perfumes p
LEFT JOIN perfume_ingredients pi ON p.id = pi.perfume_id
LEFT JOIN ingredients i ON pi.ingredient_id = i.id
GROUP BY p.id;

-- Grant access to the view
GRANT SELECT ON perfumes_with_ingredients TO anon, authenticated;
