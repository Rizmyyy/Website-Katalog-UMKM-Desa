import { useState } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useGaleri } from '@/hooks/useGaleri'
import { useDesa } from '@/hooks/useDesa'
import SEO from '@/components/ui/SEO'

export default function Galeri() {
  const { galeri: galeriKkn, loading: galeriLoading } = useGaleri()
  const { desaInfo } = useDesa()
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [visibleCount, setVisibleCount] = useState(6)

  const categories = [
    'Semua',
    'Proses Produksi',
    'Sosialisasi',
    'Bersama Warga',
  ]

  const filteredGaleri = activeCategory === 'Semua' 
    ? galeriKkn 
    : galeriKkn.filter(item => {
        // Cek data baru
        if (item.category === activeCategory) return true
        
        // Cek data lama (mock data)
        const mockCategoryMap = {
          'Proses Produksi': 'proses',
          'Sosialisasi': 'sosialisasi',
          'Bersama Warga': 'bersama-warga'
        }
        
        return item.kategori === mockCategoryMap[activeCategory]
      })

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setVisibleCount(6) // Reset saat ganti kategori
  }

  const loadMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  return (
    <>
      <SEO title="Galeri Dokumentasi" description="Rekam jejak digital dedikasi dan kolaborasi KKN di Desa Gumelar Kidul." />
      <section className="hero-section" style={{ minHeight: '40vh', paddingBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-dots" aria-hidden="true" />
        <div className="container" style={{ textAlign: 'center', paddingTop: 'clamp(30px, 5vw, 60px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              JEJAK LANGKAH KKN
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: '1.2', marginBottom: '16px' }}>
              Wajah & suasana di balik setiap produk
            </h1>
            <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(14px, 3.5vw, 17px)', padding: '0 24px', lineHeight: '1.6', opacity: 0.9 }}>
              Rekam jejak perjalanan, melihat proses pembuatan, dan momen kebersamaan kami dalam mendukung kemajuan UMKM {desaInfo?.nama || 'Desa Gumelar Kidul'}.
            </p>
          </ScrollReveal>
        </div>
        
        {/* Wave Divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="var(--color-bg)"></path>
          </svg>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          
          <ScrollReveal>
            <div 
              className="category-filter-scroll"
              style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-start',
                marginBottom: '40px',
                overflowX: 'auto',
                paddingBottom: '12px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <style>{`.category-filter-scroll::-webkit-scrollbar { display: none; }`}</style>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                    color: activeCategory === cat ? '#ffffff' : 'var(--color-text)',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* ======================================================
              MASONRY GRID
          ====================================================== */}
          <section className="section" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
            <div className="container">
              {galeriLoading ? (
                <div className="masonry-grid">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <div key={num} className="masonry-item skeleton" style={{ minHeight: '200px', borderRadius: '16px' }} />
                  ))}
                </div>
              ) : filteredGaleri.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface)', borderRadius: '16px' }}>
                  <h3>Belum ada foto</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>Belum ada foto dalam kategori {activeCategory}.</p>
                </div>
              ) : (
                <>
                  <div className="masonry-grid">
                    {filteredGaleri.slice(0, visibleCount).map((item, index) => (
                      <ScrollReveal key={item.id} delay={(index % 3) * 0.1}>
                        <div 
                          className={`masonry-item ${item.span === 'wide' ? 'span-2' : ''}`}
                          onClick={() => setLightboxIndex(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img src={item.url || item.src} alt={item.caption || item.title} className="masonry-img" loading="lazy" />
                          <div className="masonry-overlay">
                            <span className="masonry-caption">{item.caption || item.title}</span>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  {visibleCount < filteredGaleri.length && (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                      <button className="btn btn-outline" onClick={loadMore}>
                        Muat Lebih Banyak ↓
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredGaleri[lightboxIndex] && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes zoomIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              zIndex: 10000
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            aria-label="Tutup foto"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <img
            src={filteredGaleri[lightboxIndex].url || filteredGaleri[lightboxIndex].src}
            alt={filteredGaleri[lightboxIndex].caption || filteredGaleri[lightboxIndex].title || "Galeri"}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'zoom-out'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
