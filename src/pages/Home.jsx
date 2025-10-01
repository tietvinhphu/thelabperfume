import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>The Lab Perfume 🧪</h1>
          <p>An open-source encyclopedia of fragrances</p>
          <p className="subtitle">Discover, explore, and learn about the world of perfumes</p>
          <div className="cta-buttons">
            <Link to="/browse" className="btn btn-primary">
              Browse Perfumes
            </Link>
            <Link to="/ingredients" className="btn btn-secondary">
              Explore Ingredients
            </Link>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Featured Collections</h2>
          <p>Coming soon: Featured perfumes, trending fragrances, and more...</p>
        </div>
      </section>
    </div>
  )
}

export default Home
