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
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759505489/e2cver7lpqpljjixpu3u.jpg',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502858/xtiareii8g4u2dpsqivj.webp',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759502965/ncldkowjyykjv4a8oo3n.avif',
    'https://res.cloudinary.com/dt7b6ovud/image/upload/v1759505102/x5lmlttjdhsopecxpung.jpg'
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
            <h1 className="hero-title">Khám Phá Nước Hoa Cao Cấp</h1>
            <p className="hero-subtitle">Bách khoa toàn thư về nước hoa tinh tế</p>
            <Link to="/browse" className="btn btn-primary">
              Khám Phá Bộ Sưu Tập
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
            <h2>Bộ Sưu Tập Nổi Bật</h2>
            <p>Khám phá những mùi hương tinh tế nhất</p>
          </div>

          {loading ? (
            <div className="loading">Đang tải nước hoa...</div>
          ) : (
            <div className="perfumes-grid">
              {featuredPerfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/browse" className="btn btn-secondary">
              Xem Tất Cả Nước Hoa
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Nghệ Thuật Chế Tác Nước Hoa</h2>
              <p>
                Đắm mình trong thế giới nước hoa cao cấp. Bộ sưu tập được tuyển chọn của chúng tôi
                tập hợp những mùi hương tinh tế nhất từ các nhà chế tác nước hoa nổi tiếng và những
                nghệ nhân mới nổi, mỗi chai kể một câu chuyện khứu giác độc đáo.
              </p>
              <p>
                Từ những nốt hương hoa tinh tế đến hơi ấm sâu lắng của gỗ quý hiếm,
                khám phá bách khoa toàn thư về hương thơm, nơi tinh hoa của sự thanh lịch
                và sang trọng được lưu giữ.
              </p>
              <Link to="/ingredients" className="btn btn-primary">
                Khám Phá Nguyên Liệu
              </Link>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
                alt="Chai nước hoa"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Bắt Đầu Hành Trình Hương Thơm</h2>
          <p>Khám phá bộ sưu tập nước hoa cao cấp hoàn chỉnh của chúng tôi</p>
          <div className="cta-buttons">
            <Link to="/browse" className="btn btn-primary">
              Xem Tất Cả Nước Hoa
            </Link>
            <Link to="/create" className="btn btn-secondary">
              Thêm Nước Hoa Mới
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
