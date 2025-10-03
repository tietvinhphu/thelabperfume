import { useState } from 'react'
import { supabase } from '../services/supabase'
import ImageUpload from '../components/ui/ImageUpload'
import './CreatePerfume.css'

export default function CreatePerfume() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    year: '',
    family: '',
    concentration: '',
    gender: '',
    price: '',
    description: '',
    image_url: '',
    cloudinary_public_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Handle image upload to Cloudinary
  const handleImageUpload = (result) => {
    setFormData({
      ...formData,
      image_url: result.url,
      cloudinary_public_id: result.publicId
    })
  }

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Submit form to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.image_url) {
      setError('Please upload an image')
      return
    }

    if (!formData.name || !formData.brand) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Insert perfume to Supabase
      const { data, error: insertError } = await supabase
        .from('perfumes')
        .insert({
          name: formData.name,
          brand: formData.brand,
          year: formData.year ? parseInt(formData.year) : null,
          family: formData.family,
          concentration: formData.concentration,
          gender: formData.gender,
          price: formData.price ? parseFloat(formData.price) : null,
          description: formData.description,
          image_url: formData.image_url,              // ← Cloudinary URL
          cloudinary_public_id: formData.cloudinary_public_id  // ← For future edits/deletes
        })
        .select()
        .single()

      if (insertError) throw insertError

      console.log('Perfume created:', data)

      // Reset form
      setSuccess(true)
      setFormData({
        name: '',
        brand: '',
        year: '',
        family: '',
        concentration: '',
        gender: '',
        price: '',
        description: '',
        image_url: '',
        cloudinary_public_id: ''
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/browse'
      }, 2000)

    } catch (err) {
      console.error('Error creating perfume:', err)
      setError(err.message || 'Failed to create perfume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-perfume-page">
      <div className="container">
        <h1>Create New Perfume</h1>

        <form onSubmit={handleSubmit} className="perfume-form">

          {/* Image Upload */}
          <div className="form-section">
            <h2>Product Image</h2>
            <ImageUpload
              folder="perfumes"
              onUploadSuccess={handleImageUpload}
              onUploadError={(err) => setError(err.message)}
            />
            {formData.image_url && (
              <p className="success-text">✓ Image uploaded successfully</p>
            )}
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="name">Perfume Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dior Sauvage"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Dior"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2015"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="family">Family</label>
                <select
                  id="family"
                  name="family"
                  value={formData.family}
                  onChange={handleChange}
                >
                  <option value="">Select family</option>
                  <option value="Floral">Floral</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Woody">Woody</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Aromatic Fougère">Aromatic Fougère</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Chypre">Chypre</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="concentration">Concentration</label>
                <select
                  id="concentration"
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleChange}
                >
                  <option value="">Select concentration</option>
                  <option value="Parfum">Parfum (20-30%)</option>
                  <option value="EDP">Eau de Parfum (15-20%)</option>
                  <option value="EDT">Eau de Toilette (5-15%)</option>
                  <option value="EDC">Eau de Cologne (2-4%)</option>
                  <option value="Extrait">Extrait de Parfum (15-40%)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (USD)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 120.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the perfume..."
                rows="4"
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ✓ Perfume created successfully! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Perfume'}
          </button>
        </form>
      </div>
    </div>
  )
}
