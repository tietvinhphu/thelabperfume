import { useParams } from 'react-router-dom'
import './PerfumeDetail.css'

function PerfumeDetail() {
  const { id } = useParams()

  return (
    <div className="perfume-detail">
      <div className="container">
        <h1>Perfume Detail #{id}</h1>
        <p>Coming soon: Detailed perfume information, notes pyramid, reviews...</p>
      </div>
    </div>
  )
}

export default PerfumeDetail
