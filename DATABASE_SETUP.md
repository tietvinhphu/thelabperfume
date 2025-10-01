# Database Setup Guide

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be ready

### 2. Get Credentials
1. Go to Project Settings > API
2. Copy your `Project URL` and `anon public` key
3. Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Create Database Tables

Run these SQL commands in the Supabase SQL Editor:

#### Perfumes Table
```sql
CREATE TABLE perfumes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER,
  family TEXT,
  description TEXT,
  top_notes TEXT[],
  middle_notes TEXT[],
  base_notes TEXT[],
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to everyone
CREATE POLICY "Allow public read access" ON perfumes
  FOR SELECT USING (true);
```

#### Ingredients Table
```sql
CREATE TABLE ingredients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  origin TEXT,
  scent_profile TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to everyone
CREATE POLICY "Allow public read access" ON ingredients
  FOR SELECT USING (true);
```

### 4. Insert Sample Data

#### Insert Perfumes
```sql
INSERT INTO perfumes (name, brand, year, family, description, top_notes, middle_notes, base_notes)
VALUES
(
  'Chanel No. 5',
  'Chanel',
  1921,
  'Floral Aldehyde',
  'A timeless classic with a complex floral bouquet and powdery aldehydic notes.',
  ARRAY['Aldehydes', 'Ylang-Ylang', 'Neroli', 'Bergamot', 'Lemon'],
  ARRAY['Iris', 'Jasmine', 'Rose', 'Orris Root', 'Lily of the Valley'],
  ARRAY['Sandalwood', 'Vanilla', 'Amber', 'Patchouli', 'Musk']
),
(
  'Sauvage',
  'Dior',
  2015,
  'Aromatic Fougère',
  'A fresh and spicy fragrance inspired by wide-open spaces and blue sky.',
  ARRAY['Calabrian Bergamot', 'Pepper'],
  ARRAY['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'],
  ARRAY['Ambroxan', 'Cedar', 'Labdanum']
),
(
  'Aventus',
  'Creed',
  2010,
  'Fruity Chypre',
  'A sophisticated blend inspired by the dramatic life of a historic emperor.',
  ARRAY['Pineapple', 'Bergamot', 'Black Currant', 'Apple'],
  ARRAY['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
  ARRAY['Musk', 'Oak Moss', 'Ambergris', 'Vanilla']
);
```

#### Insert Ingredients
```sql
INSERT INTO ingredients (name, category, description, origin, scent_profile)
VALUES
(
  'Bergamot',
  'Citrus',
  'A citrus fruit that provides fresh, sparkling top notes with a slightly spicy character.',
  'Italy, Calabria',
  'Fresh, Citrus, Bright, Slightly Bitter'
),
(
  'Jasmine',
  'Floral',
  'One of the most precious flowers in perfumery, offering rich, sweet, and intoxicating floral notes.',
  'India, Egypt, France',
  'Floral, Sweet, Sensual, Exotic'
),
(
  'Sandalwood',
  'Woody',
  'A precious wood that provides warm, creamy, and smooth base notes.',
  'India, Australia',
  'Woody, Creamy, Warm, Soft'
),
(
  'Vanilla',
  'Gourmand',
  'A sweet, comforting note extracted from vanilla pods, adding warmth and sweetness.',
  'Madagascar, Tahiti, Mexico',
  'Sweet, Creamy, Warm, Comforting'
),
(
  'Patchouli',
  'Earthy',
  'An earthy, rich note with woody and slightly sweet undertones.',
  'Indonesia, India',
  'Earthy, Woody, Sweet, Spicy'
);
```

### 5. Update Browse Component

Replace the mock data fetch in `src/pages/Browse.jsx`:

```javascript
// Replace this:
fetch('/data/perfumes.json')

// With this:
import { perfumeService } from '../services/supabase'
// Then use: perfumeService.getAllPerfumes()
```

## Alternative: PostgreSQL or Other Databases

If you prefer to use PostgreSQL, MySQL, or MongoDB:

1. Install the appropriate client library
2. Create similar service files in `src/services/`
3. Update the API functions to match your database schema
4. Follow your database provider's documentation for setup

## Current Setup

The app currently uses **mock JSON data** from `public/data/perfumes.json`.
The Supabase integration is ready but requires setup to use.
