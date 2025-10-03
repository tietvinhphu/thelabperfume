import { Link } from 'react-router-dom'
import './PerfumeCard.css'

function PerfumeCard({ perfume }) {
  return (
    <Link to={`/perfume/${perfume.id}`} className="perfume-card">
      <div className="perfume-card-image">
        {perfume.image_url ? (
          <img src={perfume.image_url} alt={perfume.name} />
        ) : (
          <div className="placeholder-image">🧪</div>
        )}
      </div>
      <div className="perfume-card-content">
        <h3 className="perfume-name">{perfume.name}</h3>
        <p className="perfume-brand">{perfume.brand}</p>
        {perfume.concentration && (
          <span className="perfume-concentration">{perfume.concentration}</span>
        )}
        <div className="perfume-meta">
          {perfume.year && <span className="perfume-year">{perfume.year}</span>}
          {perfume.family && <span className="perfume-family">{perfume.family}</span>}
        </div>
        {perfume.price && (
          <p className="perfume-price">${perfume.price}</p>
        )}
      </div>
    </Link>
  )
}

export default PerfumeCard
