import { Link } from 'react-router-dom'
import './PerfumeCard.css'

function PerfumeCard({ perfume }) {
  return (
    <Link to={`/perfume/${perfume.id}`} className="perfume-card">
      <div className="perfume-card-image">
        {perfume.image ? (
          <img src={perfume.image} alt={perfume.name} />
        ) : (
          <div className="placeholder-image">🧪</div>
        )}
      </div>
      <div className="perfume-card-content">
        <h3 className="perfume-name">{perfume.name}</h3>
        <p className="perfume-brand">{perfume.brand}</p>
        <p className="perfume-year">{perfume.year}</p>
        <span className="perfume-family">{perfume.family}</span>
      </div>
    </Link>
  )
}

export default PerfumeCard
