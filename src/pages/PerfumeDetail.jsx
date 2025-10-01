import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { perfumeService } from '../services/supabase'
import './PerfumeDetail.css'

function PerfumeDetail() {
  const { id } = useParams()
  const [perfume, setPerfume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPerfume() {
      try {
        setLoading(true)
        setError(null)
        const data = await perfumeService.getPerfumeById(id)
        setPerfume(data)
      } catch (err) {
        console.error('Error loading perfume:', err)
        setError('Failed to load perfume details.')
      } finally {
        setLoading(false)
      }
    }
    loadPerfume()
  }, [id])

  if (loading) {
    return (
      <div className="perfume-detail">
        <div className="container">
          <div className="loading">Loading perfume details...</div>
        </div>
      </div>
    )
  }

  if (error || !perfume) {
    return (
      <div className="perfume-detail">
        <div className="container">
          <div className="error-message">
            <p>{error || 'Perfume not found'}</p>
            <Link to="/browse" className="btn btn-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="perfume-detail">
      <div className="container">
        <Link to="/browse" className="back-link">
          ← Back to Browse
        </Link>

        <div className="detail-content">
          <div className="detail-image">
            {perfume.image_url ? (
              <img src={perfume.image_url} alt={perfume.name} />
            ) : (
              <div className="placeholder-image">🧪</div>
            )}
          </div>

          <div className="detail-info">
            <h1>{perfume.name}</h1>
            <div className="detail-meta">
              <span className="brand">{perfume.brand}</span>
              {perfume.year && <span className="year">{perfume.year}</span>}
              <span className="family">{perfume.family}</span>
            </div>

            <p className="description">{perfume.description}</p>

            <div className="notes-section">
              <h2>Fragrance Notes</h2>

              {perfume.top_notes && perfume.top_notes.length > 0 && (
                <div className="notes-category">
                  <h3>Top Notes</h3>
                  <div className="notes-list">
                    {perfume.top_notes.map((note, index) => (
                      <span key={index} className="note-badge top">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {perfume.middle_notes && perfume.middle_notes.length > 0 && (
                <div className="notes-category">
                  <h3>Middle Notes</h3>
                  <div className="notes-list">
                    {perfume.middle_notes.map((note, index) => (
                      <span key={index} className="note-badge middle">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {perfume.base_notes && perfume.base_notes.length > 0 && (
                <div className="notes-category">
                  <h3>Base Notes</h3>
                  <div className="notes-list">
                    {perfume.base_notes.map((note, index) => (
                      <span key={index} className="note-badge base">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfumeDetail
