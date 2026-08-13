import { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { useDesa } from '@/hooks/useDesa'
import { useGaleri } from '@/hooks/useGaleri'
import ScrollReveal from '@/components/ui/ScrollReveal'
import UmkmCard from '@/components/ui/UmkmCard'
import VideoEmbed from '@/components/ui/VideoEmbed'
import MapEmbed from '@/components/ui/MapEmbed'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'
import Badge from '@/components/ui/Badge'

import SEO from '@/components/ui/SEO'

const kategoriLabel = { kuliner: 'Kuliner', kerajinan: 'Kerajinan', pertanian: 'Pertanian' }

export default function Beranda() {
  const { getFeatured, umkmList, loading: umkmLoading } = useUmkm()
  const { desaInfo, loading: desaLoading } = useDesa()
  const { galeri, loading: galeriLoading } = useGaleri()
  
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const galeriRef = useRef(null)

  // Efek Auto-Scroll untuk Carousel Produk & Galeri di Mobile
  useEffect(() => {
    let interval;
    // Jalankan hanya di layar HP
    if (window.innerWidth <= 768) {
      let scrollAmount = 0;
      let direction = 1;
      
      interval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          
          // Jika sudah sampai ujung kanan, putar arah ke kiri
          if (scrollLeft + clientWidth >= scrollWidth - 5) {
            direction = -1;
          } 
          // Jika sudah sampai ujung kiri, putar arah ke kanan
          else if (scrollLeft <= 5) {
            direction = 1;
          }
          
          // Geser sejauh 250px setiap 3 detik secara halus
          carouselRef.current.scrollBy({ left: 250 * direction, behavior: 'smooth' });
        }
        if (galeriRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = galeriRef.current;
          let galeriDirection = 1;
          if (scrollLeft + clientWidth >= scrollWidth - 5) {
            galeriDirection = -1;
          } else if (scrollLeft <= 5) {
            galeriDirection = 1;
          }
          galeriRef.current.scrollBy({ left: 250 * galeriDirection, behavior: 'smooth' });
        }
      }, 3000); // 3 detik
    }
    
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [umkmList]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/umkm', { state: { search: searchQuery } })
    } else {
      navigate('/umkm')
    }
  }

  const featured = getFeatured()
  
  // Memilih 3 Produk acak untuk Header dari seluruh produk agar bervariasi setiap kali refresh
  const heroProducts = useMemo(() => {
    if (umkmList.length > 0) {
      const shuffled = [...umkmList].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    }
    return []
  }, [umkmList])

  // Menghitung jumlah produk per kategori secara dinamis
  const categoryStats = useMemo(() => {
    const stats = { kuliner: 0, kerajinan: 0, pertanian: 0 }
    umkmList.forEach(u => {
      if (stats[u.kategori] !== undefined) {
        stats[u.kategori]++
      }
    })
    return stats
  }, [umkmList])

  const recentPhotos = galeri.slice(0, 3)

  return (
    <>
      <SEO 
        title="Beranda" 
        description={desaInfo?.deskripsi || `Kumpulan UMKM unggulan dan Jejak KKN di Desa ${desaInfo?.nama}`}
      />
      {/* ======================================================
          HERO — Full-height, gradien hijau, kartu produk preview
      ====================================================== */}
      <section className="hero-section" id="beranda">

        {/* Dekorasi latar: lingkaran cahaya blur & pola titik */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-dots" aria-hidden="true" />

        <div className="hero-inner">

          {/* ——— Teks kiri ——— */}
          <div className="hero-text">
            <ScrollReveal>
              <span className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Produk {desaInfo?.identitas?.namaWeb || 'UMKM Gumelar Kidul'} · Banyumas
              </span>

              <h1 
                className="hero-title"
                dangerouslySetInnerHTML={{ 
                  __html: desaInfo?.beranda?.judulHero || 'Temukan &amp; Beli Produk Asli Gumelar Kidul' 
                }}
              />

              <p className="hero-desc">
                {desaInfo?.beranda?.teksHero || 'Katalog resmi kerajinan, kuliner, dan hasil tani langsung dari pembuatnya. Kualitas desa, standar kota.'}
              </p>

              {/* Tombol Aksi Kritis */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', width: '100%' }}>
                <Link to="/umkm" className="btn btn-primary" style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '12px 16px', fontSize: 'clamp(12px, 3.5vw, 16px)', 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: '#ffffff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  Jelajahi Produk <span>→</span>
                </Link>
                <Link to="/profil" className="btn btn-outline" style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '12px 16px', fontSize: 'clamp(12px, 3.5vw, 16px)', 
                  color: 'rgba(255,255,255,0.9)', 
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  <span style={{ fontSize: '10px' }}>▶</span> Kenali Desa
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-num">{desaInfo?.statistik?.umkm || umkmList.length}<span className="hero-stat-plus">+</span></span>
                  <span className="hero-stat-label">Produk UMKM</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">3</span>
                  <span className="hero-stat-label">Kategori</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">100<span className="hero-stat-plus">%</span></span>
                  <span className="hero-stat-label">Produk Lokal</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ——— Visual Showcase (kanan) ——— */}
          <div className="hero-showcase">
            <div className="showcase-grid">
              {!umkmLoading && heroProducts.length > 0 ? (
                heroProducts.map((umkm, idx) => (
                  <Link key={umkm.id} to={`/umkm/${umkm.id}`} className="showcase-item">
                    <ImageWithSkeleton src={umkm.fotoUtama} alt={umkm.namaUmkm} className="showcase-img" />
                    <div className="showcase-badge" style={{ textTransform: 'capitalize' }}>
                      {umkm.kategori || 'Produk'}
                    </div>
                  </Link>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="showcase-item skeleton"></div>
                ))
              )}
            </div>
            
            {/* Trust Badge (Melayang di pojok kanan bawah gambar) */}
            <div className="hero-trust-badge">
              <div className="hero-trust-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="hero-trust-text">
                100% Produk Asli Warga {desaInfo?.nama || 'Gumelar Kidul'}
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint animasi */}
        <div className="hero-scroll-hint" aria-hidden="true">
          <div className="hero-scroll-mouse">
            <div className="hero-scroll-wheel" />
          </div>
          <span>Scroll</span>
        </div>

        {/* Wave divider bawah */}
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--color-bg)" />
          </svg>
        </div>
      </section>


      {/* ======================================================
          KATEGORI INSTAN (Peta Mental)
      ====================================================== */}
      <section className="section" style={{ paddingTop: 'clamp(30px, 4vw, 40px)', paddingBottom: '20px', background: 'var(--color-bg)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header" style={{ marginBottom: 'clamp(32px, 6vw, 48px)' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Mulai dari yang <span style={{ color: 'var(--color-primary)' }}>Anda Cari</span>
              </h2>
              <div style={{ width: '48px', height: '5px', background: 'linear-gradient(90deg, var(--color-primary), #4ade80)', borderRadius: '4px', margin: '0 auto 24px' }}></div>
              <p className="section-desc" style={{ maxWidth: '540px', margin: '0 auto', fontSize: 'clamp(14px, 3.5vw, 15px)' }}>
                Lebih cepat dan mudah. Jelajahi kategori utama kami untuk langsung menemukan produk UMKM desa yang sedang Anda cari.
              </p>
            </div>

            <div className="category-grid">
              {/* Kategori 1: Kuliner (Tema Utama/Hijau + Dotted Pattern & Watermark) */}
              <Link to="/umkm?kategori=kuliner" style={{ background: 'radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px), linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', backgroundSize: '16px 16px, 100% 100%', padding: '32px 24px', borderRadius: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), var(--shadow-md)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', overflow: 'hidden' }} className="category-card-hover">
                {/* Cahaya di Pojok Atas */}
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
                
                {/* Watermark Ikon Raksasa di Pojok Kanan Bawah */}
                <svg className="category-watermark" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>

                <div className="category-icon-wrapper" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                </div>
                <h3 className="category-title" style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>Kuliner & Makanan</h3>
                <span className="category-subtitle" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', fontWeight: '600', position: 'relative', zIndex: 1 }}>{categoryStats.kuliner} produk</span>
              </Link>

              {/* Kategori 2: Kerajinan (Tema Utama/Hijau + Dotted Pattern & Watermark) */}
              <Link to="/umkm?kategori=kerajinan" style={{ background: 'radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px), linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', backgroundSize: '16px 16px, 100% 100%', padding: '32px 24px', borderRadius: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), var(--shadow-md)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', overflow: 'hidden' }} className="category-card-hover">
                {/* Cahaya di Pojok Atas */}
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
                
                {/* Watermark Ikon Raksasa di Pojok Kanan Bawah */}
                <svg className="category-watermark" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>

                <div className="category-icon-wrapper" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                </div>
                <h3 className="category-title" style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>Kerajinan</h3>
                <span className="category-subtitle" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', fontWeight: '600', position: 'relative', zIndex: 1 }}>{categoryStats.kerajinan} produk</span>
              </Link>
            </div>

            
            <style>{`
              .category-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                justify-content: center;
                gap: 24px;
              }
              .category-card-hover:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 24px 48px rgba(0,0,0,0.15);
              }
              .category-watermark {
                position: absolute;
                bottom: -10%;
                right: -10%;
                width: 160px;
                height: 160px;
                opacity: 0.05;
                transform: rotate(-15deg);
                pointer-events: none;
              }
              @media (max-width: 768px) {
                .category-watermark {
                  width: 110px;
                  height: 110px;
                  bottom: -15%;
                  right: -15%;
                }
              }
              
              /* Mobile Carousel untuk Kategori */
              @media (max-width: 768px) {
                .category-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 12px;
                }
                .category-card-hover {
                  padding: 20px 12px !important;
                  border-radius: 16px !important;
                }
                .category-icon-wrapper {
                  width: 50px !important;
                  height: 50px !important;
                  margin-bottom: 12px !important;
                }
                .category-icon-wrapper svg {
                  width: 24px;
                  height: 24px;
                }
                .category-title {
                  font-size: 14px !important;
                }
                .category-subtitle {
                  font-size: 12px !important;
                }
              }
            `}</style>
          </ScrollReveal>
        </div>
      </section>

      {/* ======================================================
          PRODUK UNGGULAN
      ====================================================== */}
      <section className="section" id="produk-unggulan" style={{ paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(40px, 6vw, 60px)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header" style={{ marginBottom: 'clamp(32px, 6vw, 56px)' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Produk Unggulan <span style={{ color: 'var(--color-primary)' }}>Desa</span>
              </h2>
              <div style={{ width: '48px', height: '5px', background: 'linear-gradient(90deg, var(--color-primary), #4ade80)', borderRadius: '4px', margin: '0 auto 24px' }}></div>
              <p className="section-desc" style={{ maxWidth: '540px', margin: '0 auto', fontSize: 'clamp(14px, 3.5vw, 15px)' }}>
                Jelajahi berbagai macam produk asli buatan tangan terampil warga {desaInfo?.nama || 'Desa Gumelar Kidul'}.
              </p>
            </div>
          </ScrollReveal>

          {umkmLoading ? (
            <div className="grid mobile-auto-carousel" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {[1, 2, 3].map((i) => (
                 <div key={i} className="card" style={{ cursor: 'default', flex: '0 0 75vw' }}>
                  <div className="skeleton skeleton-img" />
                  <div className="card-body">
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text short" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid mobile-auto-carousel" ref={carouselRef} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {featured.map((umkm, index) => (
                <ScrollReveal key={umkm.id} delay={index < 3 ? index + 1 : 0} className="carousel-item">
                  <UmkmCard umkm={umkm} index={index} />
                </ScrollReveal>
              ))}
            </div>
          )}

          <style>{`
            /* CSS Khusus untuk Carousel Auto-Scroll di Mobile */
            @media (max-width: 768px) {
              .mobile-auto-carousel {
                display: flex !important;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                padding-bottom: 24px;
                /* Tarik keluar dari container margin agar full lebar layar */
                width: 100vw;
                margin-left: calc(-1 * var(--space-container));
                padding-left: var(--space-container);
                padding-right: var(--space-container);
              }
              .mobile-auto-carousel::-webkit-scrollbar {
                display: none;
              }
              .mobile-auto-carousel .carousel-item,
              .mobile-auto-carousel > .card {
                flex: 0 0 55vw; /* Ukuran produk diperkecil dari 75vw menjadi 55vw */
                scroll-snap-align: center;
              }
            }
          `}</style>

          <ScrollReveal>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
              <Link to="/umkm" className="btn btn-primary btn-lg" id="btn-lihat-semua">
                Lihat Semua Produk →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ======================================================
          PROFIL DESA SINGKAT (Why Trust Us)
      ====================================================== */}
      <section className="section" style={{ 
        position: 'relative', 
        padding: 'clamp(32px, 6vw, 100px) 0', 
        backgroundColor: 'var(--color-primary-dark)', // Menggunakan warna utama website
        backgroundImage: 'radial-gradient(circle at top right, var(--color-primary-10) 0%, transparent 60%)',
        overflow: 'hidden'
      }}>
        {/* Ornamen Garis Diagonal Latar Belakang */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)', pointerEvents: 'none' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(24px, 6vw, 80px)', alignItems: 'center' }}>
            
            {/* Kiri: Narasi */}
            <ScrollReveal>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: '#ffffff', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
                Kenali Potensi Asli dari Tangan Warga
              </h2>
              <p style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: 'clamp(20px, 4vw, 36px)' }}>
                Setiap produk yang Anda temukan di katalog ini adalah hasil karya nyata warga {desaInfo?.nama || 'Desa Gumelar Kidul'}. Kami merangkum seluruh potensi desa agar Anda bisa melihat langsung kualitas dari para pelaku UMKM kami.
              </p>
              <Link to="/profil-desa" className="btn-hero-primary" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)', color: '#fff', border: 'none' }}>
                Baca Profil Lengkap Desa &rarr;
              </Link>
            </ScrollReveal>

            {/* Kanan: Statistik (Glassmorphism) */}
            <ScrollReveal delay={1}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(8px, 2vw, 16px)' }}>
                {/* Stat 1 */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: 'clamp(12px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.3s ease' }} className="stat-glass-card">
                  <span style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', letterSpacing: '-0.03em' }}>
                    {desaInfo?.statistik?.penduduk || '9.900'}<span style={{ fontSize: '0.6em', opacity: 0.9 }}>+</span>
                  </span>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: 'rgba(255,255,255,0.7)', fontWeight: '500', lineHeight: '1.3' }}>Jiwa penduduk desa</span>
                </div>
                {/* Stat 2 */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: 'clamp(12px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.3s ease' }} className="stat-glass-card">
                  <span style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', letterSpacing: '-0.03em' }}>
                    {umkmList.length || '24'}
                  </span>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: 'rgba(255,255,255,0.7)', fontWeight: '500', lineHeight: '1.3' }}>Pelaku UMKM aktif</span>
                </div>
                {/* Stat 3 */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: 'clamp(12px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.3s ease' }} className="stat-glass-card">
                  <span style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', letterSpacing: '-0.03em' }}>
                    {desaInfo?.statistik?.rt || '32'}
                  </span>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: 'rgba(255,255,255,0.7)', fontWeight: '500', lineHeight: '1.3' }}>Rukun Tetangga (RT)</span>
                </div>
                {/* Stat 4 */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: 'clamp(12px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'all 0.3s ease' }} className="stat-glass-card">
                  <span style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', letterSpacing: '-0.03em' }}>
                    2026
                  </span>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: 'rgba(255,255,255,0.7)', fontWeight: '500', lineHeight: '1.3' }}>Tahun sistem diluncurkan</span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
        <style>{`
          .stat-glass-card:hover {
            transform: translateY(-6px);
            background: rgba(255,255,255,0.08) !important;
            border-color: rgba(255,255,255,0.15) !important;
            box-shadow: 0 16px 32px rgba(0,0,0,0.2);
          }
        `}</style>
      </section>

      {/* ======================================================
          GALERI TEASER
      ====================================================== */}
      <section className="section section-alt" id="galeri-teaser" style={{ padding: 'clamp(60px, 8vw, 100px) 0' }}>
        <div className="container">
          <style>{`
            .galeri-expand-container {
              display: flex;
              height: clamp(300px, 40vw, 450px);
              gap: 16px;
              width: 100%;
              margin-bottom: 40px;
            }
            .galeri-expand-item {
              flex: 1;
              border-radius: 24px;
              overflow: hidden;
              position: relative;
              transition: flex 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
              box-shadow: 0 10px 20px rgba(0,0,0,0.05);
              cursor: pointer;
            }
            .galeri-expand-item::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%);
              opacity: 0;
              transition: opacity 0.4s ease;
            }
            .galeri-expand-item:hover {
              flex: 2;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            }
            .galeri-expand-item:hover::after {
              opacity: 1;
            }
            .galeri-expand-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.8s ease;
            }
            .galeri-expand-item:hover img {
              transform: scale(1.08);
            }
            @media (max-width: 768px) {
              .galeri-expand-container {
                flex-direction: row;
                height: auto;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
                padding-bottom: 16px;
                width: 100vw;
                margin-left: calc(-1 * var(--space-container));
                padding-left: var(--space-container);
                padding-right: var(--space-container);
                gap: 12px;
              }
              .galeri-expand-container::-webkit-scrollbar {
                display: none;
              }
              .galeri-expand-item {
                flex: 0 0 70vw; /* Ukuran gambar melintang ke samping */
                height: 220px;
                scroll-snap-align: center;
                border-radius: 16px;
              }
              .galeri-expand-item:hover {
                flex: 0 0 70vw; /* Matikan efek flex-grow memanjang di mobile */
              }
            }
          `}</style>
          
          <ScrollReveal>
            <div className="section-header text-center" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Galeri Kegiatan <span style={{ color: 'var(--color-primary)' }}>UMKM</span>
              </h2>
              <div style={{ width: '48px', height: '5px', background: 'linear-gradient(90deg, var(--color-primary), #4ade80)', borderRadius: '4px', margin: '0 auto 24px' }}></div>
              <p className="section-desc" style={{ maxWidth: '540px', margin: '0 auto', fontSize: 'clamp(14px, 3.5vw, 15px)' }}>
                Menampilkan rekam jejak kegiatan Mahasiswa KKN saat melakukan pendampingan, berbincang santai, melihat langsung proses pembuatan, hingga merancang inovasi bersama para pelaku UMKM {desaInfo?.nama || 'Desa Gumelar Kidul'}.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="galeri-expand-container" ref={galeriRef}>
              {galeriLoading ? [1, 2, 3].map(num => (
                <div key={num} className="galeri-expand-item skeleton" />
              )) : recentPhotos.map((foto) => (
                <div key={foto.id} className="galeri-expand-item">
                  <img 
                    src={foto.src || foto.url} 
                    alt={foto.title || foto.caption} 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/galeri" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '999px', fontWeight: 600 }}>
                Lihat Seluruh Galeri Foto →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
      {/* ======================================================
          FINAL CALL TO ACTION (Sosial)
      ====================================================== */}
      <section className="section" style={{ padding: '0 0 clamp(60px, 8vw, 100px) 0' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
              borderRadius: '32px',
              padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(5, 69, 67, 0.2)'
            }}>
              {/* Ornamen Lingkaran Abstrak */}
              <div style={{ position: 'absolute', top: '-30%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', bottom: '-30%', right: '-5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

              <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: '900', color: '#ffffff', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  Temukan Lebih <span style={{ background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>Banyak</span> Cerita & Karya
                </h2>
                
                <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8', marginBottom: '40px' }}>
                  Setiap produk punya ceritanya sendiri. Lanjutkan penjelajahan Anda untuk melihat hasil karya terbaik dari tangan-tangan terampil warga {desaInfo?.nama || 'Gumelar Kidul'}.
                </p>
                
                <Link to="/umkm" className="btn-hero-primary" style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 36px', 
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4)', 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
                  Mulai Jelajahi Produk <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </>
  )
}
