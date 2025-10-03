import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759379175/perfumes/hummge7h7xaytgryiigd.webp',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502858/xtiareii8g4u2dpsqivj.webp',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502965/ncldkowjyykjv4a8oo3n.avif'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <div className="home">
      <section className="hero">
        {/* Slideshow Images */}
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
            <h1 className="hero-title">The Lab Perfume</h1>
            <p className="hero-subtitle">A curated encyclopedia of fine fragrances</p>
            <p className="hero-description">Discover the art and science of perfumery</p>
            <div className="cta-buttons">
              <Link to="/browse" className="btn btn-primary">
                Explore Collection
              </Link>
              <Link to="/ingredients" className="btn btn-secondary">
                Discover Ingredients
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
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

      <section className="featured">
        <div className="container">
          <h2>Featured Collections</h2>
          <p>Explore our carefully selected fragrances</p>
        </div>
      </section>
    </div>
  )
}

export default Home
