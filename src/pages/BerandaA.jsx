import { Link } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { desaInfo } from '@/data/mockData'
import ScrollReveal from '@/components/ui/ScrollReveal'
import UmkmCard from '@/components/ui/UmkmCard'
import VideoEmbed from '@/components/ui/VideoEmbed'
import MapEmbed from '@/components/ui/MapEmbed'

export default function BerandaA() {
  const { getFeatured, loading } = useUmkm()
  const featured = getFeatured()

  return (
    <>
      {/* ===== OPSI A — Hero simpel + Produk langsung di bawah ===== */}
      <section style={{
        padding: 'var(--space-8) 0 var(--space-6)',
        borderBottom: '1px solid var(--color-border-light)',
      }} id="beranda">
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <ScrollReveal>
              <span style={{
                display: 'inline-block',
                fontSize: 13, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--color-primary)',
                marginBottom: 16, padding: '6px 14px',
                backgroundColor: 'var(--color-primary-10)',
                borderRadius: 999,
              }}>
                Desa Gumelar Kidul · Banyumas
              </span>
              <h1 style={{
                fontWeight: 800, color: 'var(--color-text)',
                fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1,
                letterSpacing: '-0.03em', marginBottom: 20,
              }}>
                Produk Asli<br />
                <span style={{ color: 'var(--color-primary)' }}>Buatan Warga Desa</span>
              </h1>
              <p style={{
                fontSize: 18, color: 'var(--color-text-secondary)',
                lineHeight: 1.65, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px',
              }}>
                Temukan ragam produk asli — kuliner, kerajinan, dan hasil bumi langsung dari tangan pembuatnya.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/umkm" className="btn btn-primary btn-lg btn-pill" id="btn-jelajahi">
                  Lihat Semua Produk
                </Link>
                <a href="#produk" className="btn btn-ghost btn-lg btn-pill">
                  Produk Unggulan ↓
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN — langsung setelah hero ===== */}
      <section className="section" id="produk" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-label">⭐ Pilihan Terbaik</p>
              <h2 className="section-title">UMKM Unggulan Desa</h2>
              <p className="section-desc">
                Produk-produk terpilih langsung dari tangan para pelaku usaha Desa Gumelar Kidul.
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ cursor: 'default' }}>
                  <div className="skeleton skeleton-img" />
                  <div className="card-body">
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text short" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {featured.map((umkm, index) => (
                <ScrollReveal key={umkm.id} delay={index < 3 ? index + 1 : 0}>
                  <UmkmCard umkm={umkm} index={index} />
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
              <Link to="/umkm" className="btn btn-primary btn-lg" id="btn-lihat-semua">
                Lihat Semua Produk →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VIDEO DOKUMENTER ===== */}
      <section className="section section-alt" id="video">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-label">🎬 Cerita Kami</p>
              <h2 className="section-title">Video Dokumenter UMKM</h2>
              <p className="section-desc">
                Saksikan semangat para pelaku UMKM Desa Gumelar Kidul dalam mengembangkan usahanya.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <VideoEmbed videoId={desaInfo.videoYoutubeId} title="Video Dokumenter UMKM Gumelar Kidul" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PETA LOKASI ===== */}
      <section className="section" id="lokasi">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-label">📍 Kunjungi Kami</p>
              <h2 className="section-title">Lokasi Desa Gumelar Kidul</h2>
              <p className="section-desc">
                Desa kami terletak di lereng pegunungan Banyumas dengan udara sejuk dan keramahan warga yang hangat.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <MapEmbed src={desaInfo.linkPetaDesa} title="Peta Desa Gumelar Kidul" height="400px" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', color: 'var(--color-text-muted)', fontSize: 14 }}>
              📍 {desaInfo.nama}, Kecamatan {desaInfo.kecamatan}, Kabupaten {desaInfo.kabupaten}, {desaInfo.provinsi}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
