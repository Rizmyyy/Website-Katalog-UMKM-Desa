import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useUmkm } from '@/hooks/useUmkm'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'
import Badge from '@/components/ui/Badge'
import PhotoGallery from '@/components/ui/PhotoGallery'
import PriceTable from '@/components/ui/PriceTable'
import MapEmbed from '@/components/ui/MapEmbed'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import UmkmCard from '@/components/ui/UmkmCard'
import SEO from '@/components/ui/SEO'

export default function DetailUmkm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, getRecommendations, getByPemilik, loading } = useUmkm()

  const umkm = getById(id)
  const recommendations = getRecommendations(id, 6)
  const produkPemilik = umkm?.idPemilik ? getByPemilik(umkm.idPemilik, id) : []
  const validHargaList = umkm?.daftarHarga?.filter(item => Number(item.harga) > 0) || []
  
  const [activeImage, setActiveImage] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [isStoryExpanded, setIsStoryExpanded] = useState(false)
  const [isKeunikanExpanded, setIsKeunikanExpanded] = useState(false)
  
  const storyRef = useRef(null)
  const keunikanRef = useRef(null)
  const prosesGalleryRef = useRef(null)

  const [showStoryToggle, setShowStoryToggle] = useState(false)
  const [showKeunikanToggle, setShowKeunikanToggle] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      // Tunggu DOM selesai render untuk mengukur tinggi dengan akurat
      setTimeout(() => {
        if (storyRef.current) setShowStoryToggle(storyRef.current.scrollHeight > storyRef.current.clientHeight)
        if (keunikanRef.current) setShowKeunikanToggle(keunikanRef.current.scrollHeight > keunikanRef.current.clientHeight)
      }, 100)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [umkm])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    if (umkm) {
      setActiveImage(umkm.fotoUtama)
    }
  }, [id, umkm])

  // Auto-scroll untuk galeri foto proses
  useEffect(() => {
    let interval;
    if (umkm && umkm.fotoProses && umkm.fotoProses.length > 1) {
      interval = setInterval(() => {
        if (prosesGalleryRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = prosesGalleryRef.current;
          // Jika sudah mencapai paling kanan, lompat kembali ke awal untuk efek unlimited
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            prosesGalleryRef.current.scrollTo({ left: 0, behavior: 'auto' });
          } else {
            prosesGalleryRef.current.scrollBy({ left: 280, behavior: 'smooth' });
          }
        }
      }, 3500); // Geser setiap 3.5 detik
    }
    return () => { if (interval) clearInterval(interval); }
  }, [umkm]);

  // Gallery Navigation Logic
  // Menghapus duplikasi URL gambar agar navigasi panah tidak tersangkut/lompat
  const allImages = useMemo(() => {
    return umkm ? Array.from(new Set([umkm.fotoUtama, ...(umkm.fotoUrls || [])].filter(Boolean))) : []
  }, [umkm])

  const currentIndex = allImages.indexOf(activeImage || umkm?.fotoUtama)
  const safeIndex = currentIndex !== -1 ? currentIndex : 0

  // Auto-slide effect
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    // Geser setiap 4 detik. Timer akan otomatis direset jika user mengklik secara manual (karena safeIndex berubah).
    const timer = setInterval(() => {
      const newIndex = safeIndex === allImages.length - 1 ? 0 : safeIndex + 1
      setActiveImage(allImages[newIndex])
    }, 4000)
    
    return () => clearInterval(timer)
  }, [allImages, safeIndex])

  const kategoriLabel = {
    kuliner: 'Kuliner',
    kerajinan: 'Kerajinan',
    pertanian: 'Pertanian',
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 200, borderRadius: 'var(--rounded-xl)', marginBottom: 'var(--space-4)' }} />
          <div className="skeleton skeleton-text" style={{ height: 32, width: '60%', marginBottom: 'var(--space-2)' }} />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text short" />
        </div>
      </section>
    )
  }

  if (!umkm) {
    return (
      <section className="section" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-3)' }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--space-3)' }}>😕</div>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>UMKM Tidak Ditemukan</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          Maaf, data UMKM yang Anda cari tidak tersedia.
        </p>
        <Link to="/umkm" className="btn btn-primary">
          ← Kembali ke Daftar UMKM
        </Link>
      </section>
    )
  }
  const waMessage = `Halo ${umkm.namaPemilik}, saya tertarik dengan produk ${umkm.namaUmkm}. Bisa info lebih lanjut?`

  const handlePrev = (e) => {
    e.stopPropagation()
    const newIndex = safeIndex === 0 ? allImages.length - 1 : safeIndex - 1
    setActiveImage(allImages[newIndex])
  }
  
  const handleNext = (e) => {
    e.stopPropagation()
    const newIndex = safeIndex === allImages.length - 1 ? 0 : safeIndex + 1
    setActiveImage(allImages[newIndex])
  }

  return (
    <>
      
  <style>{`
    @media (max-width: 600px) {
      .hide-on-mobile { display: none !important; }
    }
  `}</style>
  <SEO 
        title={umkm.nama} 
        description={umkm.deskripsiSingkat} 
        image={umkm.gambarUtama} 
      />
      <section className="section" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'clamp(0px, 2vw, 16px)' }}>
        <div className="container" style={{ maxWidth: 1280 }}>

          {/* Breadcrumb */}
          <ScrollReveal style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <nav style={{ marginBottom: 'var(--space-5)', fontSize: 14, color: 'var(--color-text-muted)' }}>
              <Link to="/" style={{ color: 'var(--color-primary)' }}>Home</Link>
              <span style={{ margin: '0 8px' }}>›</span>
              <Link to="/umkm" style={{ color: 'var(--color-primary)' }}>UMKM</Link>
              <span style={{ margin: '0 8px' }}>›</span>
              <span style={{ color: 'var(--color-text)' }}>{umkm.namaUmkm}</span>
            </nav>
          </ScrollReveal>

          <div className="detail-layout">
            
            {/* KIRI: Main Content */}
            <div className="detail-main">
              <ScrollReveal>
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  {/* Container Ambient Blur & Navigation */}
                  <div 
                    className="gallery-main-container mobile-edge-to-edge"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1/1',
                      borderRadius: 'var(--rounded-xl)',
                      overflow: 'hidden',
                      backgroundColor: '#111',
                      cursor: 'pointer' /* Affordance klik */
                    }}
                  >
                    <style>{`
                      .gallery-nav-btn {
                        opacity: 0;
                        transform: scale(0.9);
                        transition: all 0.3s ease;
                      }
                      .gallery-main-container:hover .gallery-nav-btn {
                        opacity: 1;
                        transform: scale(1);
                      }
                      .thumb-item {
                        transition: all 0.2s ease;
                      }
                      .thumb-item:hover {
                        transform: translateY(-2px);
                        opacity: 1 !important;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                      }
                    `}</style>

                    {/* Layer 1: Blurred Background (Ambient) */}
                    <div style={{
                      position: 'absolute',
                      top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
                      backgroundImage: `url(${activeImage || umkm.fotoUtama})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(30px) brightness(0.6)',
                      zIndex: 1,
                      transition: 'background-image 0.3s ease'
                    }} />
                    
                    {/* Layer 2: Main Image (Utuh) */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <ImageWithSkeleton
                        src={activeImage || umkm.fotoUtama}
                        alt={umkm.namaPemilik}
                        onClick={() => setLightboxImage(activeImage || umkm.fotoUtama)}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain', 
                          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))',
                          transition: 'all 0.3s ease',
                          cursor: 'zoom-in'
                        }}
                      />
                    </div>

                    {/* Badge: 1 / 4 Foto */}
                    {allImages.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '16px', right: '16px',
                        zIndex: 10,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        {safeIndex + 1} / {allImages.length} Foto
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button 
                          onClick={handlePrev}
                          className="gallery-nav-btn"
                          style={{
                            position: 'absolute', left: '16px', top: '50%', marginTop: '-20px',
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)', color: '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                        <button 
                          onClick={handleNext}
                          className="gallery-nav-btn"
                          style={{
                            position: 'absolute', right: '16px', top: '50%', marginTop: '-20px',
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)', color: '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Product Thumbnails Track */}
                  {allImages.length > 1 && (
                    <div style={{ marginTop: '16px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        Pilih foto untuk memperbesar
                      </p>
                      
                      <div style={{ 
                        display: 'flex', gap: '12px', overflowX: 'auto', padding: '12px',
                        backgroundColor: 'var(--color-surface-container)', borderRadius: '12px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        {allImages.map((url, idx) => {
                          const isActive = safeIndex === idx;
                          return (
                            <div 
                              key={idx}
                              onClick={() => setActiveImage(url)}
                              className="thumb-item"
                              style={{ 
                                width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                                border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                                opacity: isActive ? 1 : 0.5,
                              }}
                            >
                              <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Foto ${idx+1}`} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>

            </div>

            {/* KANAN: Sidebar UI Bersih & Elegan (Lebih Kompak & Berdimensi) */}
            <div className="detail-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ScrollReveal style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Badge Eksklusif & Judul */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(180, 134, 72, 0.1)', color: 'var(--color-primary-dark)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '100px', marginBottom: '12px', border: '1px solid rgba(180, 134, 72, 0.2)', boxShadow: '0 2px 8px rgba(180,134,72,0.1)' }}>
                    {umkm.kategori} Unggulan
                  </span>
                  <h1 className="heading-1" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2, margin: 0, color: 'var(--color-text)', letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {umkm.namaUmkm}
                  </h1>
                  
                  {/* Alamat UMKM */}
                  {umkm.alamat && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary-dark)' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{umkm.alamat}</span>
                    </div>
                  )}
                </div>

                {/* Harga Premium */}
                {validHargaList.length > 0 && (
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'flex-start',
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#d97706', marginTop: '4px', marginRight: '4px' }}>Rp</span>
                      <span style={{ 
                        fontSize: 'clamp(24px, 6vw, 32px)', 
                        fontWeight: 900, 
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.03em', 
                        lineHeight: 1 
                      }}>
                        {Number(validHargaList[0].harga).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Deskripsi Produk */}
                <p style={{ fontSize: '16px', color: '#333333', lineHeight: 1.6, marginBottom: '16px', fontWeight: 400 }}>
                  {umkm.deskripsiSingkat}
                </p>

                {/* Kotak Keterangan (Daftar Harga & Layanan) */}
                {validHargaList.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 2px 4px rgba(180,134,72,0.4)' }}></div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daftar Layanan & Harga</h3>
                      </div>
                      <PriceTable items={validHargaList} />
                    </div>
                  </div>
                )}

              </ScrollReveal>

                {/* Tombol Pesan (Desain Sesuai Gambar & Sticky Bottom di Mobile) */}
                <div className="mobile-sticky-bottom" style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderTop: '4px solid #22c55e',
                  padding: '16px'
                }}>
                  <h3 className="mobile-hide-text" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                    Tertarik memesan?
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', lineHeight: 1.4, fontSize: '13px' }}>
                    Hubungi pemilik usaha sekarang juga untuk memesan atau bertanya detail.
                  </p>
                  <a
                    href={`https://wa.me/${umkm.kontakWhatsapp}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      backgroundColor: '#1da851', 
                      border: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '15px',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat WhatsApp
                  </a>
                </div>
            </div>
            
          </div>

          {/* KONTEN TAMBAHAN FULL WIDTH (Di Bawah Grid Utama) */}
          <div style={{ marginTop: 'clamp(16px, 4vw, 64px)' }}>
              {/* Editorial Asymmetric Grid */}
              {(umkm.storytelling || umkm.keunikanProduk) && (
                <ScrollReveal>
                  <div className="editorial-grid">
                    {/* Block 01: Kisah Dibalik Usaha (Soft Tint) */}
                    {umkm.storytelling && (
                      <div style={{
                        position: 'relative', overflow: 'hidden',
                        padding: 'clamp(16px, 4vw, 36px) clamp(16px, 4vw, 32px)', backgroundColor: '#f0fdf4', // Soft emerald tint
                        borderRadius: 'clamp(16px, 4vw, 24px)', border: '1px solid rgba(16, 185, 129, 0.2)',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.05)'
                      }}>
                        <div style={{ position: 'absolute', right: -10, bottom: -24, fontSize: 'clamp(60px, 15vw, 140px)', fontWeight: 900, color: 'rgba(16, 185, 129, 0.15)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em' }}>01</div>
                        <h3 style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 'clamp(8px, 2vw, 16px)' }}>Kisah Dibalik Usaha</h3>
                        
                        <div ref={storyRef} className="story-text-container" style={{ 
                          maxHeight: isStoryExpanded ? '1000px' : '80px', 
                          overflow: 'hidden',
                          transition: 'max-height 0.4s ease-in-out',
                          position: 'relative', zIndex: 1
                        }}>
                          <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', color: 'var(--color-text)', lineHeight: 1.6, fontWeight: 500, margin: 0, whiteSpace: 'pre-wrap' }}>{umkm.storytelling}</p>
                        </div>

                        {showStoryToggle && !isStoryExpanded && (
                          <div className="story-gradient-mask" style={{
                            position: 'absolute',
                            bottom: '36px', left: 0, right: 0, height: '40px',
                            background: 'linear-gradient(to bottom, transparent, #f0fdf4)',
                            pointerEvents: 'none', zIndex: 2
                          }} />
                        )}

                        {showStoryToggle && (
                          <button 
                            className="story-toggle-btn"
                            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                            style={{
                              marginTop: '12px', background: 'none', border: 'none',
                              color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '13px',
                              cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px',
                              position: 'relative', zIndex: 3
                            }}
                          >
                            {isStoryExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isStoryExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Block 02: Keunikan Produk (Premium Dark Mode) */}
                    {umkm.keunikanProduk && (
                      <div style={{
                        position: 'relative', overflow: 'hidden',
                        padding: 'clamp(16px, 4vw, 36px) clamp(16px, 4vw, 32px)', background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                        borderRadius: 'clamp(16px, 4vw, 24px)', color: 'white',
                        boxShadow: '0 20px 40px rgba(6,78,59,0.25)'
                      }}>
                        <div style={{ position: 'absolute', right: -10, bottom: -24, fontSize: 'clamp(60px, 15vw, 140px)', fontWeight: 900, color: 'rgba(255,255,255,0.12)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em' }}>02</div>
                        <h3 style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 'clamp(8px, 2vw, 16px)' }}>Mengapa Harus Coba?</h3>
                        
                        <div ref={keunikanRef} className="story-text-container" style={{ 
                          maxHeight: isKeunikanExpanded ? '1000px' : '80px', 
                          overflow: 'hidden',
                          transition: 'max-height 0.4s ease-in-out',
                          position: 'relative', zIndex: 1
                        }}>
                          <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6, fontWeight: 300, margin: 0 }}>{umkm.keunikanProduk}</p>
                        </div>

                        {showKeunikanToggle && !isKeunikanExpanded && (
                          <div className="story-gradient-mask" style={{
                            position: 'absolute',
                            bottom: '36px', left: 0, right: 0, height: '40px',
                            background: 'linear-gradient(to bottom, transparent, #022c22)',
                            pointerEvents: 'none', zIndex: 2
                          }} />
                        )}

                        {showKeunikanToggle && (
                          <button 
                            className="story-toggle-btn"
                            onClick={() => setIsKeunikanExpanded(!isKeunikanExpanded)}
                            style={{
                              marginTop: '12px', background: 'none', border: 'none',
                              color: '#6ee7b7', fontWeight: 700, fontSize: '13px',
                              cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', gap: '4px',
                              position: 'relative', zIndex: 3
                            }}
                          >
                            {isKeunikanExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isKeunikanExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}



              {/* Produk Lain dari Pemilik (Dalam Kolom) */}
      {produkPemilik && produkPemilik.length > 0 && (
        <div className="mobile-full-bleed" style={{ 
          marginTop: "40px", 
          marginBottom: "40px",
          backgroundColor: 'var(--color-primary-dark)',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 40px) 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ornamen Garis Diagonal Latar Belakang */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)', pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <ScrollReveal>
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 clamp(16px, 4vw, 32px)' }}>
                <p style={{ 
                  color: "#6ee7b7",
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase'
                }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: "#6ee7b7", borderRadius: '50%' }}></span>
                  Rekomendasi Lainnya
                </p>
                <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
                  Produk Lain dari {umkm.namaPemilik}
                </h2>
              </div>
            </ScrollReveal>

            {/* Horizontal Scroll Slider for Products */}
            <ScrollReveal>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '24px',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                width: '100%'
              }}
              className="hide-scrollbar"
              >
                <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                
                {/* Spacer Kiri (Pengganti padding-left agar tidak terpotong saat scroll dan sejajar teks) */}
                <div style={{ minWidth: 'clamp(16px, 4vw, 32px)', flexShrink: 0 }}></div>

                {produkPemilik.map((item, idx) => (
                  <div key={item.id} style={{
                    minWidth: 'clamp(140px, 40vw, 220px)',
                    maxWidth: 'clamp(140px, 40vw, 220px)',
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    borderRadius: '24px'
                  }}>
                    <UmkmCard umkm={item} index={idx} />
                  </div>
                ))}

                {/* Spacer Kanan */}
                <div style={{ minWidth: 'clamp(16px, 4vw, 32px)', flexShrink: 0 }}></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

                    {/* Seksi Gabungan: Di Balik Layar & Peta Lokasi (Hanya Muncul Jika Ada Data) */}
              {(umkm.fotoProses?.length > 0 || umkm.linkPeta) && (
                <ScrollReveal>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
                  gap: '32px', 
                  marginTop: '16px',
                  marginBottom: '16px',
                  padding: 'clamp(16px, 4vw, 32px)',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  
                  {/* Kolom Kiri: Di Balik Layar */}
                  {umkm.fotoProses && umkm.fotoProses.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Di Balik Layar</h2>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                          Intip proses pembuatan produk ini langsung dari dapur produksi {umkm.namaUmkm}.
                        </p>
                      </div>
                      <style>{`
                        @keyframes bounceRight {
                          0%, 100% { transform: translateY(-50%) translateX(0); }
                          50% { transform: translateY(-50%) translateX(6px); }
                        }
                        @keyframes bounceLeft {
                          0%, 100% { transform: translateY(-50%) translateX(0); }
                          50% { transform: translateY(-50%) translateX(-6px); }
                        }
                        .scroll-indicator-right, .scroll-indicator-left {
                          position: absolute;
                          top: 50%;
                          transform: translateY(-50%);
                          width: 48px;
                          height: 48px;
                          background: white;
                          border-radius: 50%;
                          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: var(--color-primary);
                          cursor: pointer;
                          z-index: 10;
                          border: 1px solid rgba(0,0,0,0.05);
                          transition: all 0.3s ease;
                        }
                        .scroll-indicator-right {
                          right: -16px;
                          animation: bounceRight 2s infinite;
                        }
                        .scroll-indicator-left {
                          left: -16px;
                          animation: bounceLeft 2s infinite;
                        }
                        .scroll-indicator-right:hover, .scroll-indicator-left:hover {
                          background: var(--color-primary);
                          color: white;
                        }
                        @media (max-width: 768px) {
                          .scroll-indicator-right { right: 4px; width: 36px; height: 36px; }
                          .scroll-indicator-left { left: 4px; width: 36px; height: 36px; }
                          .scroll-indicator-right svg, .scroll-indicator-left svg { width: 20px; height: 20px; }
                        }
                        .horizontal-scroll-container {
                          display: flex;
                          overflow-x: auto;
                          gap: 16px;
                          padding-bottom: 12px;
                          scroll-snap-type: x mandatory;
                          -webkit-overflow-scrolling: touch;
                          scrollbar-width: none;
                          -ms-overflow-style: none;
                        }
                        .horizontal-scroll-container::-webkit-scrollbar {
                          display: none;
                        }
                        .horizontal-scroll-item {
                          flex: 0 0 auto;
                          height: 280px;
                          border-radius: 16px;
                          overflow: hidden;
                          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                          border: 1px solid rgba(0,0,0,0.04);
                          background-color: var(--color-surface);
                          scroll-snap-align: start;
                        }
                        .horizontal-scroll-item img {
                          height: 100%;
                          width: auto;
                          max-width: 85vw; /* Mencegah gambar terlalu lebar di HP */
                          object-fit: contain; /* Memastikan gambar utuh tidak terpotong */
                          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        .horizontal-scroll-item:hover img {
                          transform: scale(1.03);
                        }
                      `}</style>
                      <div style={{ position: 'relative' }}>
                        {umkm.fotoProses.length > 1 && (
                          <div 
                            className="scroll-indicator-left" 
                            onClick={() => prosesGalleryRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}
                            title="Geser ke kiri"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </div>
                        )}
                        <div className="horizontal-scroll-container" ref={prosesGalleryRef}>
                          {[...umkm.fotoProses, ...umkm.fotoProses, ...umkm.fotoProses, ...umkm.fotoProses, ...umkm.fotoProses].map((foto, idx) => (
                            <div key={idx} className="horizontal-scroll-item" onClick={() => setLightboxImage(foto)} style={{ cursor: 'zoom-in' }}>
                              <img 
                                src={foto} 
                                alt={`Proses pembuatan ${umkm.namaUmkm} ${idx + 1}`} 
                              />
                            </div>
                          ))}
                        </div>
                        {umkm.fotoProses.length > 1 && (
                          <div 
                            className="scroll-indicator-right" 
                            onClick={() => prosesGalleryRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}
                            title="Geser ke kanan"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Kolom Kanan: Peta Lokasi */}
                  {umkm.linkPeta && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Lokasi Usaha</h2>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                        Kunjungi lokasi produksi kami secara langsung di peta berikut.
                      </p>
                      <div style={{ 
                        flex: 1, 
                        minHeight: '240px',
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <MapEmbed src={umkm.linkPeta} title={`Lokasi ${umkm.namaUmkm}`} height="100%" />
                      </div>
                    </div>
                  )}

                </div>
              </ScrollReveal>
              )}
          </div>
        </div>
      </section>

      {/* UMKM Lain yang Mungkin Anda Suka */}
      {recommendations.length > 0 && (
        <section className="section section-alt" style={{ paddingTop: 'clamp(16px, 3vw, 32px)', marginTop: '0' }}>
          <div className="container">
            <ScrollReveal>
              <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: 'var(--color-text-dark, #111827)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                  UMKM Lain yang Mungkin <span style={{ color: 'var(--color-primary-dark)' }}>Anda Suka</span>
                </h2>
                <div style={{ width: '60px', height: '6px', background: 'linear-gradient(to right, var(--color-primary-dark), #10b981)', borderRadius: '100px', margin: '0 auto' }}></div>
              </div>
            </ScrollReveal>

            {/* Horizontal Scroll Slider for Recommendations (Konsisten dengan Produk Lain) */}
            <ScrollReveal>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '24px',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                width: '100%',
                paddingLeft: '4px',
                paddingRight: '4px'
              }}
              className="hide-scrollbar"
              >
                {recommendations.map((rec, index) => (
                  <div key={rec.id} style={{
                    minWidth: 'clamp(140px, 40vw, 220px)',
                    maxWidth: 'clamp(140px, 40vw, 220px)',
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    borderRadius: '24px'
                  }}>
                    <UmkmCard umkm={rec} />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}


      {/* Floating WhatsApp */}
      <WhatsAppFloat phoneNumber={umkm.kontakWhatsapp} message={waMessage} />

      {/* Lightbox Modal */}
      {lightboxImage && (
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
          onClick={() => setLightboxImage(null)}
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
            onClick={() => setLightboxImage(null)}
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
            src={lightboxImage}
            alt="Di Balik Layar (Diperbesar)"
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

