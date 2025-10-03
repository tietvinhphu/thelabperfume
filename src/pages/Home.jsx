import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import PerfumeCard from '../components/perfume/PerfumeCard'
import './Home.css'

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredPerfumes, setFeaturedPerfumes] = useState([])
  const [loading, setLoading] = useState(true)

  const heroImages = [
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759379175/perfumes/hummge7h7xaytgryiigd.webp',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502858/xtiareii8g4u2dpsqivj.webp',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502965/ncldkowjyykjv4a8oo3n.avif'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroImages.length])

  // Fetch featured perfumes
  useEffect(() => {
    async function fetchFeaturedPerfumes() {
      try {
        const { data, error } = await supabase
          .from('perfumes')
          .select('*')
          .limit(6)
          .order('created_at', { ascending: false })

        if (error) throw error
        setFeaturedPerfumes(data || [])
      } catch (error) {
        console.error('Error fetching perfumes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPerfumes()
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slideshow">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Discover Luxury Fragrances</h1>
            <p className="hero-subtitle">A curated encyclopedia of fine perfumery</p>
            <Link to="/browse" className="btn btn-primary">
              Explore Collection
            </Link>
          </div>
        </div>

        <div className="slide-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Perfumes Section */}
      <section className="featured-perfumes">
        <div className="container">
          <div className="section-header">
            <h2>Featured Collection</h2>
            <p>Discover our most exquisite fragrances</p>
          </div>

          {loading ? (
            <div className="loading">Loading perfumes...</div>
          ) : (
            <div className="perfumes-grid">
              {featuredPerfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/browse" className="btn btn-secondary">
              View All Fragrances
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>The Art of Perfumery</h2>
              <p>
                Immerse yourself in the world of luxury fragrances. Our curated collection
                brings together the finest scents from renowned perfume houses and emerging
                artisans, each telling a unique olfactory story.
              </p>
              <p>
                From the delicate notes of rare florals to the deep warmth of precious woods,
                explore an encyclopedia of scents that captures the essence of elegance and
                sophistication.
              </p>
              <Link to="/ingredients" className="btn btn-primary">
                Discover Ingredients
              </Link>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
                alt="Perfume bottles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Begin Your Fragrance Journey</h2>
          <p>Explore our complete collection of luxury perfumes</p>
          <div className="cta-buttons">
            <Link to="/browse" className="btn btn-primary">
              Browse All Perfumes
            </Link>
            <Link to="/create" className="btn btn-secondary">
              Add New Perfume
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
