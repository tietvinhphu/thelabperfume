import { useState, useEffect } from 'react'
import IngredientCard from '../components/perfume/IngredientCard'
import { ingredientService } from '../services/supabase'
import './Ingredients.css'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  const [filteredIngredients, setFilteredIngredients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load ingredients from Supabase
  useEffect(() => {
    async function loadIngredients() {
      try {
        setLoading(true)
        setError(null)
        const data = await ingredientService.getAllIngredients()
        setIngredients(data)
        setFilteredIngredients(data)
      } catch (err) {
        console.error('Error loading ingredients:', err)
        setError('Failed to load ingredients. Please check your database connection.')
      } finally {
        setLoading(false)
      }
    }
    loadIngredients()
  }, [])

  // Get unique categories
  const categories = ['all', ...new Set(ingredients.map(i => i.category).filter(Boolean))]

  // Filter ingredients
  useEffect(() => {
    let filtered = ingredients

    if (searchTerm) {
      filtered = filtered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ingredient => ingredient.category === selectedCategory)
    }

    setFilteredIngredients(filtered)
  }, [searchTerm, selectedCategory, ingredients])

  return (
    <div className="ingredients">
      <div className="container">
        <h1>Perfume Ingredients</h1>
        <p>Discover the building blocks of fragrances</p>

        <div className="ingredients-filters">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="ingredients-results">
          <p className="results-count">
            {filteredIngredients.length} {filteredIngredients.length === 1 ? 'ingredient' : 'ingredients'} found
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading ingredients...</div>
        ) : (
          <div className="ingredients-grid">
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map(ingredient => (
                <IngredientCard key={ingredient.id} ingredient={ingredient} />
              ))
            ) : (
              <div className="no-results">
                <p>No ingredients found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ingredients
