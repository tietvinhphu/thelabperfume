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
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/browse">Khám Phá</Link></li>
            <li><Link to="/ingredients">Nguyên Liệu</Link></li>
            <li><Link to="/scent-profile">Hồ Sơ</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
