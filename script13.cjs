const fs = require('fs');

const code = `import ScrollReveal from '@/components/ui/ScrollReveal'
import VideoEmbed from '@/components/ui/VideoEmbed'
import MapEmbed from '@/components/ui/MapEmbed'
import { useDesa } from '@/hooks/useDesa'
import { useUmkm } from '@/hooks/useUmkm'
import SEO from '@/components/ui/SEO'

export default function ProfilDesa() {
  const { desaInfo, loading: desaLoading } = useDesa()
  const { umkmList, loading: umkmLoading } = useUmkm()

  if (desaLoading || umkmLoading) {
    return <div className="loading-screen"><div className="spinner"></div></div>
  }

  return (
    <>
      <SEO title="Profil Desa" description={\`Sejarah, visi misi, dan profil lengkap Desa \${desaInfo.nama}\`} />
      
      {/* HEADER HERO (Konsisten dengan halaman lain) */}
      <section className="hero-section" style={{ minHeight: '40vh', paddingBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-dots" aria-hidden="true" />
        <div className="container" style={{ textAlign: 'center', paddingTop: 'clamp(80px, 10vw, 100px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              PROFIL DESA
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: '1.2', marginBottom: '16px' }}>
              {desaInfo.nama} Pusat Kemandirian Ekonomi Warga
            </h1>
            <p className="hero-desc" style={{ maxWidth: '700px', margin: '0 auto', fontSize: 'clamp(13px, 3vw, 16px)', padding: '0 24px', lineHeight: '1.6', opacity: 0.9 }}>
              Terletak di Kecamatan Tambak, Kabupaten Banyumas, Jawa Tengah. Kami secara aktif mengelola dan memaksimalkan potensi alam, hasil bumi, serta kerajinan tangan lokal warisan turun-temurun.
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

      {/* 1. SAMBUTAN KADES (Rapi & Elegan) */}
      {desaInfo?.beranda?.kades?.teks && (
        <section className="section" style={{ padding: '60px 0', background: 'var(--color-bg)' }}>
          <div className="container">
            <ScrollReveal>
              <div style={{
                background: 'var(--color-surface)',
                borderRadius: '32px',
                padding: 'clamp(32px, 6vw, 64px)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: '10px', left: '-10px', width: '100%', height: '100%', background: 'var(--color-primary)', borderRadius: '24px', zIndex: 0 }}></div>
                  {desaInfo.beranda.kades.foto ? (
                    <img src={desaInfo.beranda.kades.foto} alt={desaInfo.beranda.kades.nama} style={{ position: 'relative', zIndex: 1, width: 'clamp(140px, 18vw, 200px)', height: 'clamp(180px, 22vw, 250px)', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }} />
                  ) : (
                    <div style={{ position: 'relative', zIndex: 1, width: 'clamp(140px, 18vw, 200px)', height: 'clamp(180px, 22vw, 250px)', background: 'var(--color-surface-alt)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>👤</div>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: '56px', lineHeight: 0.5, marginBottom: '24px', opacity: 0.3 }}>&ldquo;</div>
                  <p style={{ fontSize: 'clamp(15px, 3vw, 18px)', fontStyle: 'italic', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '24px' }}>
                    {desaInfo.beranda.kades.teks}
                  </p>
                  <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>{desaInfo.beranda.kades.nama}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kepala Desa {desaInfo.nama}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 2. SEJARAH & LATAR BELAKANG */}
      <section className="section" style={{ padding: '80px 0', background: 'var(--color-surface-container)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '16px' }}>Sejarah & Potensi Desa</h2>
              <div style={{ width: '60px', height: '5px', background: 'var(--color-primary)', borderRadius: '4px', margin: '0 auto' }}></div>
            </div>
            
            <div style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p>
                Berawal dari sebuah pedukuhan kecil yang mengandalkan sektor pertanian tradisional, Desa {desaInfo.nama} secara bertahap bertransformasi menjadi salah satu pusat ekonomi kreatif dan UMKM yang tangguh di wilayah ini.
              </p>
              <p>
                {desaInfo.sejarah || 'Masyarakat kami memiliki keahlian turun-temurun dalam mengolah sumber daya alam sekitar, menciptakan produk inovatif yang bernilai tinggi dan berdaya saing di pasar.'}
              </p>
              <p>
                Kini, desa kami dikenal luas karena komitmen kuat seluruh warga dalam membina UMKM lokal, melestarikan kearifan budaya leluhur, sekaligus terus beradaptasi dengan perkembangan teknologi informasi dan komunikasi untuk memperluas jangkauan pasar.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. STATISTIK DESA (Diambil dari Beranda) */}
      <section className="section" style={{ 
        position: 'relative', 
        padding: 'clamp(60px, 8vw, 100px) 0', 
        backgroundColor: 'var(--color-primary-dark)',
        backgroundImage: 'radial-gradient(circle at center, var(--color-primary-10) 0%, transparent 70%)',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)', pointerEvents: 'none' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Desa Kami dalam Angka
              </h2>
              <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>
                Bukti nyata dari perkembangan dan produktivitas warga {desaInfo.nama}.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '12px' }}>
                  {desaInfo?.statistik?.penduduk || '9.900'}<span style={{ fontSize: '0.6em', opacity: 0.9 }}>+</span>
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Jiwa Penduduk</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '12px' }}>
                  {umkmList.length || '24'}
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Pelaku UMKM Aktif</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '12px' }}>
                  {desaInfo?.statistik?.dusun || '7'}
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Dusun & RT/RW</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '900', color: '#fcd34d', lineHeight: '1', marginBottom: '12px' }}>
                  2026
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Tahun Digitalisasi</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. VISI & MISI */}
      <section className="section" style={{ padding: '80px 0', background: 'var(--color-bg)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '16px' }}>Visi & Misi</h2>
              <div style={{ width: '60px', height: '5px', background: 'var(--color-primary)', borderRadius: '4px', margin: '0 auto 32px' }}></div>
              <p style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: '600', color: 'var(--color-primary-dark)', lineHeight: '1.6' }}>
                "{desaInfo.visi || 'Mewujudkan desa yang mandiri, sejahtera, dan berbudaya melalui pemberdayaan ekonomi kerakyatan.'}"
              </p>
            </div>
            
            {desaInfo.misi && (
              <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--color-surface)', padding: '40px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '24px', background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                  Misi Kami
                </h3>
                <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>
                  {desaInfo.misi}
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 5. VIDEO DOKUMENTER (Jika Ada) */}
      {desaInfo.videoYoutubeId && (
        <section className="section" style={{ padding: '40px 0', background: 'var(--color-surface-container)' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <ScrollReveal>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-dark)' }}>Dokumenter Desa</h2>
              </div>
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <VideoEmbed videoId={desaInfo.videoYoutubeId} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 6. PETA & KONTAK (Footer Profil) */}
      <section className="section" style={{ padding: '60px 0 100px', background: 'var(--color-surface-container)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start', background: 'var(--color-surface)', padding: 'clamp(24px, 5vw, 48px)', borderRadius: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '12px' }}>Pusat Layanan Desa</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>Kunjungi pusat tata usaha dan pelayanan administrasi kami pada jam kerja untuk informasi lebih lanjut.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--color-surface-alt)', borderRadius: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: 'var(--shadow-xs)', fontSize: '18px' }}>
                      📞
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600', marginBottom: '2px' }}>Telepon Resmi</div>
                      <div style={{ color: 'var(--color-text)', fontSize: '15px', fontWeight: '600' }}>{desaInfo.kontakDesa?.telepon || '-'}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--color-surface-alt)', borderRadius: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: 'var(--shadow-xs)', fontSize: '18px' }}>
                      ✉️
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '600', marginBottom: '2px' }}>Email Instansi</div>
                      <div style={{ color: 'var(--color-text)', fontSize: '15px', fontWeight: '600' }}>{desaInfo.kontakDesa?.email || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ height: '350px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
                <MapEmbed src={desaInfo.linkPetaDesa} height="100%" />
              </div>
              
            </div>
          </ScrollReveal>
        </div>
      </section>

    </>
  )
}
`;

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/ProfilDesa.jsx', code, 'utf8');
console.log('Successfully restructured ProfilDesa.jsx');
