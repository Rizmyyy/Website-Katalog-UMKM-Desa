import { Link } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { desaInfo } from '@/data/mockData'
import ScrollReveal from '@/components/ui/ScrollReveal'
import UmkmCard from '@/components/ui/UmkmCard'
import VideoEmbed from '@/components/ui/VideoEmbed'
import MapEmbed from '@/components/ui/MapEmbed'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'
import Badge from '@/components/ui/Badge'

export default function Beranda() {
  const { getFeatured, umkmList, loading } = useUmkm()
  const featured = getFeatured()
  // Ambil 3 produk unggulan untuk preview di hero
  const heroProducts = featured.slice(0, 3)
  // Produk sisanya di bawah
  const remainingFeatured = featured.slice(3)

  const kategoriLabel = { kuliner: 'Kuliner', kerajinan: 'Kerajinan', pertanian: 'Pertanian' }

  return (
    <>
      {/* ===== HERO — Full-width dengan produk mengintip ===== */}
      <section className="hero-section" id="beranda">
        <div className="hero-inner">
          {/* Teks kiri */}
          <div className="hero-text">
            <ScrollReveal>
              <span className="hero-eyebrow">Desa Gumelar Kidul · Banyumas</span>
              <h1 className="hero-title">
                Produk Lokal<br />
                <span className="hero-title-accent">Berkualitas Tinggi</span>
              </h1>
              <p className="hero-desc">
                Temukan ragam produk asli buatan warga Desa Gumelar Kidul — kuliner, kerajinan, dan hasil bumi langsung dari tangan pembuatnya.
              </p>
              <div className="hero-actions">
                <Link to="/umkm" className="btn btn-primary btn-lg btn-pill" id="btn-jelajahi">
                  Lihat Semua Produk
                </Link>
                <a href="#produk-unggulan" className="btn btn-ghost-white btn-lg btn-pill">
                  Produk Unggulan ↓
                </a>
              </div>
              {/* Stats */}
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-num">{umkmList.length}+</span>
                  <span className="hero-stat-label">Produk</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">3</span>
                  <span className="hero-stat-label">Kategori</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-num">100%</span>
                  <span className="hero-stat-label">Lokal</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Kartu produk mengintip di kanan */}
          <div className="hero-cards-preview">
            {!loading && heroProducts.map((umkm, i) => (
              <ScrollReveal key={umkm.id} delay={i + 1}>
                <Link
                  to={`/umkm/${umkm.id}`}
                  className="hero-product-card"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="hero-card-img-wrap">
                    <ImageWithSkeleton
                      src={umkm.fotoUtama}
                      alt={umkm.namaUmkm}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="hero-card-body">
                    <div className="hero-card-badge">
                      <Badge variant="primary">{kategoriLabel[umkm.kategori] || umkm.kategori}</Badge>
                    </div>
                    <p className="hero-card-name">{umkm.namaUmkm}</p>
                    <p className="hero-card-owner">oleh {umkm.namaPemilik}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
            {loading && [1, 2, 3].map(i => (
              <div key={i} className="hero-product-card">
                <div className="skeleton" style={{ height: 130 }} />
                <div style={{ padding: '12px 14px' }}>
                  <div className="skeleton skeleton-text short" />
                  <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <span>Scroll untuk melihat lebih banyak</span>
          <div className="hero-scroll-arrow">↓</div>
        </div>
      </section>

      {/* ===== PRODUK UNGGULAN ===== */}
      <section className="section" id="produk-unggulan" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-label">⭐ Pilihan Terbaik</p>
              <h2 className="section-title">UMKM Unggulan Desa</h2>
              <p className="section-desc">
                Produk-produk terpilih dari para pelaku usaha Desa Gumelar Kidul.
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
