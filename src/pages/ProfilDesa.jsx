import { useState } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import VideoEmbed from '@/components/ui/VideoEmbed'
import MapEmbed from '@/components/ui/MapEmbed'
import { useDesa } from '@/hooks/useDesa'
import { useUmkm } from '@/hooks/useUmkm'
import SEO from '@/components/ui/SEO'

export default function ProfilDesa() {
  const { desaInfo, loading: desaLoading } = useDesa()
  const { umkmList, loading: umkmLoading } = useUmkm()
  const [expandedKades, setExpandedKades] = useState(false)
  const [expandedSejarah, setExpandedSejarah] = useState(false)

  if (desaLoading || umkmLoading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <>
      <SEO title="Profil Desa" description={`Sejarah, visi misi, dan profil lengkap Desa ${desaInfo.nama}`} />
      
      {/* HEADER HERO (Konsisten dengan halaman lain) */}
      <section className="hero-section" style={{ minHeight: '40vh', paddingBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-dots" aria-hidden="true" />
        <div className="container" style={{ textAlign: 'center', paddingTop: 'clamp(30px, 5vw, 60px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              TENTANG KAMI
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: '1.2', marginBottom: '16px' }}>
              Profil {desaInfo.nama}
            </h1>
            <p className="hero-desc" style={{ maxWidth: '700px', margin: '0 auto', fontSize: 'clamp(15px, 3vw, 17px)', padding: '0 24px', lineHeight: '1.7', opacity: 0.88 }}>
              Mengenal lebih dekat sejarah, visi misi, letak geografis, serta potensi sumber daya manusia dan alam yang ada di {desaInfo.nama}.
            </p>
          </ScrollReveal>
        </div>
        
        {/* Wave divider bawah */}
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="var(--color-bg)"></path>
          </svg>
        </div>
      </section>

      {/* --- DASHBOARD & BENTO GRID SECTION --- */}
      <section className="section" style={{ padding: '40px 0 80px', background: 'var(--color-bg)' }}>
        <div className="container">
          
          {/* 1. PITA STATISTIK (DASHBOARD BANNER) */}
          <ScrollReveal>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '16px',
              marginBottom: '32px',
              background: 'var(--color-primary-dark)',
              padding: '24px',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-md)',
              backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '8px' }}>
                  {desaInfo?.statistik?.penduduk || '9.900'}<span style={{ fontSize: '0.6em', opacity: 0.9 }}>+</span>
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Jiwa Penduduk</div>
              </div>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '8px' }}>
                  {umkmList.length || '24'}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Pelaku UMKM Aktif</div>
              </div>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '8px' }}>
                  {desaInfo?.statistik?.rt || '32'}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Rukun Tetangga (RT)</div>
              </div>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '8px' }}>
                  2026
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Tahun Digitalisasi</div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2. BENTO GRID UTAMA */}
          <style>{`
            .bento-grid {
              display: grid;
              grid-template-columns: repeat(12, 1fr);
              gap: 24px;
            }
            .bento-item {
              background: var(--color-surface);
              border-radius: 24px;
              padding: 32px;
              box-shadow: var(--shadow-sm);
              border: 1px solid var(--color-border-light);
              display: flex;
              flex-direction: column;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .bento-item:hover {
              transform: translateY(-4px);
              box-shadow: var(--shadow-md);
            }
            .bento-sejarah { grid-column: span 8; }
            .bento-kades { grid-column: span 4; height: fit-content; }
            .bento-visi { grid-column: span 6; }
            .bento-kontak { grid-column: span 6; height: fit-content; }
            .bento-media { grid-column: span 6; padding: 0; overflow: hidden; }
            
            @media (max-width: 992px) {
              .bento-sejarah, .bento-kades, .bento-visi, .bento-kontak, .bento-media {
                grid-column: span 12;
              }
              .bento-kades { order: -1; } /* Kades di atas di mobile */
            }
            @media (max-width: 768px) {
              .bento-grid {
                gap: 16px;
              }
              .bento-item {
                padding: 20px;
                border-radius: 16px;
              }
              .media-content {
                min-height: 200px !important;
              }
              .contact-wrapper {
                flex-direction: column !important;
                gap: 8px !important;
              }
              .contact-wrapper > div {
                padding: 10px 14px !important;
                gap: 12px !important;
              }
              .contact-wrapper-icon {
                font-size: 20px !important;
              }
              .contact-wrapper-text {
                font-size: 14px !important;
              }
            }
          `}</style>

          <div className="bento-grid">
            
            {/* --- BARIS 1 --- */}
            {/* Kades Card */}
            <ScrollReveal className="bento-item bento-kades" style={{ alignItems: 'center', textAlign: 'center', background: 'linear-gradient(to bottom, var(--color-surface), var(--color-surface-alt))' }}>
              <div style={{ position: 'relative', marginBottom: '24px', display: 'inline-block' }}>
                <img src="/pakkades.png" alt="Bpk. Imam Tobroni" style={{ position: 'relative', zIndex: 1, width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 0 0 4px var(--color-surface), 0 0 0 7px var(--color-primary), 0 10px 24px rgba(0,0,0,0.15)', backgroundColor: '#f3f4f6' }} />
                </div>
                <div style={{ color: 'var(--color-primary)', fontSize: '48px', lineHeight: 0.5, marginBottom: '16px', opacity: 0.3 }}>&ldquo;</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '20px' }}>
                  <p style={{ 
                    fontSize: '15px', 
                    fontStyle: 'italic', 
                    lineHeight: '1.6', 
                    color: 'var(--color-text-secondary)', 
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: expandedKades ? 'unset' : 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    {desaInfo.beranda.kades.teks}
                  </p>
                  
                  {/* Tampilkan tombol baca selengkapnya jika teks cukup panjang (asumsi lebih dari 150 karakter) */}
                  {desaInfo.beranda.kades.teks.length > 150 && (
                    <button 
                      onClick={() => setExpandedKades(!expandedKades)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--color-primary)', 
                        fontWeight: '700', 
                        fontSize: '13px', 
                        padding: '4px 0', 
                        marginTop: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        alignSelf: 'center',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                      onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                    >
                      {expandedKades ? 'Tutup Selengkapnya' : 'Baca Selengkapnya'}
                      <svg 
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: expandedKades ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '4px' }}>Bpk. Imam Tobroni</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-primary-dark)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kepala Desa
                  </p>
                </div>
              </ScrollReveal>

            {/* Sejarah Card */}
            <ScrollReveal className="bento-item bento-sejarah" delay={1}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0, paddingLeft: '16px', borderLeft: '5px solid var(--color-primary)' }}>Sejarah Desa</h2>
              </div>
              <div style={{ 
                fontSize: '16px', 
                lineHeight: '1.8', 
                color: 'var(--color-text-secondary)', 
                display: '-webkit-box',
                WebkitLineClamp: expandedSejarah ? 'unset' : 6,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                  {desaInfo.sejarah || 'Belum ada data sejarah yang ditambahkan.'}
                </div>
              </div>
              <button 
                onClick={() => setExpandedSejarah(!expandedSejarah)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-primary)', 
                  fontWeight: '700', 
                  fontSize: '14px', 
                  padding: '4px 0', 
                  marginTop: '16px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
              >
                {expandedSejarah ? 'Tutup Selengkapnya' : 'Baca Selengkapnya'}
                <svg 
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: expandedSejarah ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </ScrollReveal>


            {/* --- BARIS 2 --- */}
            {/* Visi Misi Card */}
            <ScrollReveal className="bento-item bento-visi" delay={2}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0, paddingLeft: '16px', borderLeft: '5px solid #d97706' }}>Visi & Misi</h2>
              </div>
              
              <div style={{ padding: '0 8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Visi
                </h3>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                  {desaInfo.visi || 'Mewujudkan desa yang mandiri, sejahtera, dan berbudaya melalui pemberdayaan ekonomi kerakyatan.'}
                </p>

                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Misi
                </h3>
                {desaInfo.misi ? (
                  <div style={{ fontSize: '16px', lineHeight: '2', color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>
                    {desaInfo.misi}
                  </div>
                ) : (
                  <div style={{ fontSize: '16px', lineHeight: '2', color: 'var(--color-text-secondary)' }}>
                    - Mengembangkan potensi UMKM warga<br/>
                    - Meningkatkan kualitas infrastruktur desa
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Kontak Card */}
            <ScrollReveal className="bento-item bento-kontak" delay={3}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0, paddingLeft: '16px', borderLeft: '5px solid #059669' }}>Pusat Layanan</h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                Kunjungi pusat tata usaha dan pelayanan administrasi kami pada jam kerja untuk informasi lebih lanjut.
              </p>
              
              <div className="contact-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--color-surface-alt)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <div className="contact-wrapper-icon" style={{ fontSize: '24px' }}>📞</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telepon Resmi</div>
                    <div className="contact-wrapper-text" style={{ color: 'var(--color-text)', fontSize: '16px', fontWeight: '700' }}>{desaInfo.kontakDesa?.telepon || '-'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--color-surface-alt)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <div className="contact-wrapper-icon" style={{ fontSize: '24px' }}>✉️</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Instansi</div>
                    <div className="contact-wrapper-text" style={{ color: 'var(--color-text)', fontSize: '16px', fontWeight: '700' }}>{desaInfo.kontakDesa?.email || '-'}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>


            {/* --- BARIS 3 (MEDIA) --- */}
            {/* Video Dokumenter */}
            <ScrollReveal className="bento-item bento-media" delay={4}>
              <div className="media-content" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-container)', color: 'var(--color-text-muted)' }}>
                {desaInfo.videoYoutubeId ? (
                  <>
                    <VideoEmbed videoId={desaInfo.videoYoutubeId} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span> Dokumenter
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <p style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>Video dokumenter belum tersedia.</p>
                    <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>Nantikan tayangan profil desa kami di sini.</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Peta Desa */}
            <ScrollReveal className="bento-item bento-media" delay={5}>
              <div className="media-content" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
                <MapEmbed src={desaInfo.linkPetaDesa} height="100%" />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--color-text-dark)', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none', boxShadow: 'var(--shadow-sm)' }}>
                  📍 Lokasi Balai Desa
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

    </>
  )
}
