import { useState, useEffect } from 'react'
import PerfumeCard from '../components/perfume/PerfumeCard'
import { perfumeService } from '../services/supabase'
import './Browse.css'

function Browse() {
  const [perfumes, setPerfumes] = useState([])
  const [filteredPerfumes, setFilteredPerfumes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const itemsPerPage = 6

  // Load perfumes data from Supabase
  useEffect(() => {
    async function loadPerfumes() {
      try {
        setLoading(true)
        setError(null)
        const data = await perfumeService.getAllPerfumes()
        setPerfumes(data)
        setFilteredPerfumes(data)
      } catch (err) {
        console.error('Error loading perfumes:', err)
        setError('Failed to load perfumes. Please check your database connection.')
      } finally {
        setLoading(false)
      }
    }
    loadPerfumes()
  }, [])

  // Get unique families for filter
  const families = ['all', ...new Set(perfumes.map(p => p.family))]

  // Filter and sort perfumes
  useEffect(() => {
    let filtered = perfumes

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(perfume =>
        perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by family
    if (selectedFamily !== 'all') {
      filtered = filtered.filter(perfume => perfume.family === selectedFamily)
    }

    // Sort perfumes
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'brand':
          return a.brand.localeCompare(b.brand)
        case 'year-new':
          return (b.year || 0) - (a.year || 0)
        case 'year-old':
          return (a.year || 0) - (b.year || 0)
        default:
          return 0
      }
    })

    setFilteredPerfumes(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedFamily, sortBy, perfumes])

  // Pagination
  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPerfumes = filteredPerfumes.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="browse">
      <div className="container">
        <h1>Khám Phá Nước Hoa</h1>
        <p>Khám phá bộ sưu tập hương thơm của chúng tôi</p>

        <div className="browse-filters">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="family-filter"
          >
            {families.map(family => (
              <option key={family} value={family}>
                {family === 'all' ? 'Tất Cả Dòng Hương' : family}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="name">Sắp Xếp Theo Tên</option>
            <option value="brand">Sắp Xếp Theo Thương Hiệu</option>
            <option value="year-new">Mới Nhất Trước</option>
            <option value="year-old">Cũ Nhất Trước</option>
          </select>
        </div>

        <div className="browse-results">
          <p className="results-count">
            Tìm thấy {filteredPerfumes.length} {filteredPerfumes.length === 1 ? 'nước hoa' : 'nước hoa'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading">Đang tải nước hoa...</div>
        ) : (
          <>
            <div className="perfumes-grid">
              {currentPerfumes.length > 0 ? (
                currentPerfumes.map(perfume => (
                  <PerfumeCard key={perfume.id} perfume={perfume} />
                ))
              ) : (
                <div className="no-results">
                  <p>Không tìm thấy nước hoa nào phù hợp với tiêu chí của bạn.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Trước
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Browse
