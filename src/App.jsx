import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import PerfumeDetail from './pages/PerfumeDetail'
import Ingredients from './pages/Ingredients'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/perfume/:id" element={<PerfumeDetail />} />
            <Route path="/ingredients" element={<Ingredients />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
