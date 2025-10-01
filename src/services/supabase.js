import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// TODO: Replace with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API functions for perfumes
export const perfumeService = {
  // Get all perfumes
  async getAllPerfumes() {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get perfume by ID
  async getPerfumeById(id) {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Search perfumes
  async searchPerfumes(searchTerm) {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)

    if (error) throw error
    return data
  },

  // Filter by family
  async filterByFamily(family) {
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('family', family)

    if (error) throw error
    return data
  }
}

// API functions for ingredients
export const ingredientService = {
  // Get all ingredients
  async getAllIngredients() {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Get ingredient by ID
  async getIngredientById(id) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}
