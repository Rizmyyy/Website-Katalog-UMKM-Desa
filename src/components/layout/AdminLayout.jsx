import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePesan } from '@/hooks/usePesan'
import { useDesa } from '@/hooks/useDesa'
import SEO from '@/components/ui/SEO'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { unreadCount } = usePesan()
  const { desaInfo } = useDesa()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-container)' }}>
      <SEO title="Panel Admin" />
      {/* Admin Navbar */}
      <nav className="navbar" style={{ borderBottom: '2px solid var(--color-primary)', zIndex: 1050, position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)' }}>
        <div className="container navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="admin-mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Link to="/admin/dashboard" className="navbar-brand">
              <img 
                src={desaInfo?.identitas?.logo || '/logo.png'} 
                alt="Logo Desa" 
                style={{ height: '32px', width: 'auto', objectFit: 'contain', maxHeight: '32px' }} 
              />
              <span>Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="navbar-link" target="_blank" title="Lihat website publik">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span style={{ marginLeft: '4px' }}>Lihat Situs</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" id="btn-logout">
              Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Admin Body */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <Link
            to="/admin/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Daftar UMKM
          </Link>
          <Link
            to="/admin/galeri"
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive('/admin/galeri') ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Galeri KKN
          </Link>
          <Link
            to="/admin/pengaturan"
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive('/admin/pengaturan') ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Profil Desa
          </Link>
          <Link
            to="/admin/umkm/tambah"
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive('/admin/umkm/tambah') ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Tambah UMKM
          </Link>
          <Link
            to="/admin/pesan"
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive('/admin/pesan') ? 'active' : ''}`}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Pesan Masuk
            </div>
            {unreadCount > 0 && (
              <span style={{ 
                backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 700, 
                padding: '2px 6px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {unreadCount}
              </span>
            )}
          </Link>
        </aside>

        {/* Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
