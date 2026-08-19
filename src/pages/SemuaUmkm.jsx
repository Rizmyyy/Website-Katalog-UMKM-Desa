import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { kategoriList } from '@/data/mockData'
import ScrollReveal from '@/components/ui/ScrollReveal'
import UmkmCard from '@/components/ui/UmkmCard'
import CategoryFilter from '@/components/ui/CategoryFilter'
import SEO from '@/components/ui/SEO'

export default function SemuaUmkm() {
  const { umkmList, loading, getByCategory } = useUmkm()
  const location = useLocation()
  
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'Semua')
  const [searchQuery, setSearchQuery] = useState(location.state?.search || '')
  const [visibleCount, setVisibleCount] = useState(12)

  // Memastikan sinkronisasi jika pengguna bernavigasi menggunakan tombol back/forward browser
  // atau mengklik kategori dari Header saat sudah berada di halaman ini.
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category)
    }
    if (location.state?.search !== undefined) {
      setSearchQuery(location.state.search)
    }
  }, [location.state])

  const categories = ['Semua', 'Kuliner', 'Kerajinan', 'Pertanian']

  // Buat versi acak dari umkmList yang hanya dikalkulasi saat data umkmList berubah (saat pertama load/refresh)
  const randomizedUmkmList = useMemo(() => {
    return [...umkmList].sort(() => Math.random() - 0.5)
  }, [umkmList])

  const filteredList = useMemo(() => {
    let result = activeCategory === 'Semua' ? randomizedUmkmList : getByCategory(activeCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.namaUmkm.toLowerCase().includes(q) ||
          item.namaPemilik.toLowerCase().includes(q) ||
          item.deskripsiSingkat.toLowerCase().includes(q) ||
          item.produkUnggulan.toLowerCase().includes(q)
      )
    }

    return result
  }, [activeCategory, searchQuery, getByCategory, randomizedUmkmList])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setVisibleCount(12) // Reset pagination on category change
  }

  const loadMore = () => {
    setVisibleCount(prev => prev + 12)
  }

  return (
    <>
      <SEO title="Daftar UMKM" description="Eksplorasi seluruh potensi bisnis lokal dan produk unggulan desa." />
      <section className="hero-section" style={{ minHeight: '40vh', paddingBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-dots" aria-hidden="true" />
        <div className="container" style={{ textAlign: 'center', paddingTop: 'clamp(30px, 5vw, 60px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              KATALOG PRODUK
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: '1.2', marginBottom: '16px' }}>
              Produk UMKM Gumelar Kidul
            </h1>
            <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(13px, 3vw, 16px)', padding: '0 24px', lineHeight: '1.6', opacity: 0.9 }}>
              Menampilkan {umkmList.length > 0 ? umkmList.length : '15+'} produk dari para pelaku UMKM tangguh desa kami. Gunakan kolom pencarian atau filter kategori untuk menemukan apa yang Anda butuhkan.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="var(--color-bg)"></path>
          </svg>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">

        <ScrollReveal>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div className="search-input-wrapper" style={{ marginBottom: 'var(--space-3)', maxWidth: '100%' }}>
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Cari nama UMKM, pemilik, atau produk..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(12)
                }}
                id="search-umkm"
              />
            </div>

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-mobile-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={`skeleton-${i}`} className="skeleton" style={{ height: '360px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 style={{ marginBottom: '8px' }}>Tidak ada UMKM ditemukan</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        ) : (
          <>
            <div className="grid mobile-grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {filteredList.slice(0, visibleCount).map((umkm, idx) => (
                <ScrollReveal key={umkm.id} delay={idx * 0.05}>
                  <UmkmCard umkm={umkm} />
                </ScrollReveal>
              ))}
            </div>
            
            {visibleCount < filteredList.length && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  className="btn" 
                  onClick={loadMore}
                  style={{ 
                    background: 'rgba(22, 163, 74, 0.1)', 
                    color: 'var(--color-primary-dark)', 
                    border: '1.5px solid rgba(22, 163, 74, 0.3)',
                    fontWeight: '700',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)'
                  }}
                >
                  Muat Lebih Banyak 👇
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
    </>
  )
}
