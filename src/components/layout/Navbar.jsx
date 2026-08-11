import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useDesa } from '@/hooks/useDesa'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { desaInfo } = useDesa()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/umkm', label: 'Katalog Produk' },
    { path: '/profil', label: 'Profil Desa' },
    { path: '/galeri', label: 'Galeri Kegiatan' },
    { path: '/gabung', label: 'Kontak' },
  ]

  const handleNavClick = (path) => {
    setMobileOpen(false)
    if (path.includes('#')) {
      const hash = path.split('#')[1]
      if (location.pathname === '/') {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <nav className="navbar" id="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            {desaInfo?.identitas?.logo ? (
              <img src={desaInfo.identitas.logo} alt="Logo Desa" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            ) : (
              <img src="/logo.png" alt="Logo Default" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            )}
            <span>{desaInfo?.identitas?.namaWeb || 'UMKM Gumelar Kidul'}</span>
          </Link>

          <div className="navbar-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => handleNavClick(link.path)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />

            <button
              className="navbar-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
        <div className="mobile-nav-panel">
          <div className="mobile-nav-header">
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Menu</span>
            <button
              className="btn-icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
