import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDesa } from '@/hooks/useDesa'

export default function Footer() {
  const [openSection, setOpenSection] = useState('')
  const { desaInfo, loading } = useDesa()

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section)
  }

  if (loading || !desaInfo) return null

  return (
    <footer className="footer" id="kontak">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-col">
            <h3 className={`footer-title ${openSection === 'info' ? 'active' : ''}`} onClick={() => toggleSection('info')}>
              <span>UMKM {desaInfo?.nama || 'Desa Gumelar Kidul'}</span>
              <span className="footer-toggle-icon">{openSection === 'info' ? '−' : '+'}</span>
            </h3>
            <div className={`footer-content ${openSection === 'info' ? 'open' : ''}`}>
              <p className="footer-text" style={{ maxWidth: '380px', lineHeight: '1.7' }}>
                Etalase digital produk UMKM Desa Gumelar Kidul, Kecamatan Tambak, Kabupaten Banyumas.
              </p>
            </div>
          </div>

          <div className="footer-col">
            <h4 className={`footer-title ${openSection === 'jelajahi' ? 'active' : ''}`} onClick={() => toggleSection('jelajahi')}>
              <span>Jelajahi</span>
              <span className="footer-toggle-icon">{openSection === 'jelajahi' ? '−' : '+'}</span>
            </h4>
            <div className={`footer-content ${openSection === 'jelajahi' ? 'open' : ''}`}>
              <Link to="/" className="footer-link">Beranda</Link>
              <Link to="/umkm" className="footer-link">Katalog UMKM</Link>
              <Link to="/profil" className="footer-link">Profil Desa</Link>
              <Link to="/galeri" className="footer-link">Jejak KKN</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4 className={`footer-title ${openSection === 'bantuan' ? 'active' : ''}`} onClick={() => toggleSection('bantuan')}>
              <span>Bantuan</span>
              <span className="footer-toggle-icon">{openSection === 'bantuan' ? '−' : '+'}</span>
            </h4>
            <div className={`footer-content ${openSection === 'bantuan' ? 'open' : ''}`}>
              <Link to="/gabung" className="footer-link">Cara Memesan</Link>
              <a href={`https://wa.me/${(desaInfo.kontakDesa?.telepon || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-link">Hubungi Kami</a>
              <Link to="/faq" className="footer-link">Pertanyaan Umum</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4 className={`footer-title ${openSection === 'kontak' ? 'active' : ''}`} onClick={() => toggleSection('kontak')}>
              <span>Kontak Desa</span>
              <span className="footer-toggle-icon">{openSection === 'kontak' ? '−' : '+'}</span>
            </h4>
            <div className={`footer-content ${openSection === 'kontak' ? 'open' : ''}`}>
              
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Alamat Kantor</span>
                  <span className="footer-contact-value">{desaInfo.kontakDesa?.alamatKantor}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Email Resmi</span>
                  <span className="footer-contact-value">{desaInfo.kontakDesa?.email}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Telepon / WA</span>
                  <span className="footer-contact-value">{desaInfo.kontakDesa?.telepon}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {desaInfo.nama || 'Desa Gumelar Kidul'}. Hak cipta dilindungi.
          </p>
          <div className="footer-credits">
            <p className="footer-credits-text">Dibuat dengan ❤️ oleh Tim KKN 27 UIN SAIZU 2026</p>
            <span className="footer-credits-bullet">•</span>
            <Link to="/admin" className="footer-admin-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
