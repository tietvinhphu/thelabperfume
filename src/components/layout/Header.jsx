import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <h1>The Lab Perfume 🧪</h1>
          </Link>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse</Link></li>
            <li><Link to="/ingredients">Ingredients</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
