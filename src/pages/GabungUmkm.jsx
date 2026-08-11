import { useState } from 'react'
import { usePesan } from '@/hooks/usePesan'
import { useDesa } from '@/hooks/useDesa'
import SEO from '@/components/ui/SEO'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function GabungUmkm() {
  const { kirimPesan, loading } = usePesan()
  const { desaInfo } = useDesa()
  const [status, setStatus] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  
  const [formData, setFormData] = useState({
    namaPemilik: '',
    namaUmkm: '',
    nomorWa: '',
    alamat: '',
    kategori: 'Makanan',
    deskripsi: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validasi dasar
    if (!formData.namaPemilik || !formData.namaUmkm || !formData.nomorWa) {
      setStatus({ type: 'error', message: 'Mohon isi nama, nama UMKM, dan nomor WhatsApp.' })
      return
    }

    const res = await kirimPesan(formData)
    if (res.success) {
      setStatus({ type: 'success', message: 'Data berhasil dikirim! Admin kami akan segera menghubungi Anda melalui WhatsApp.' })
      setFormData({
        namaPemilik: '',
        namaUmkm: '',
        nomorWa: '',
        alamat: '',
        kategori: 'Makanan',
        deskripsi: ''
      })
    } else {
      setStatus({ type: 'error', message: 'Gagal mengirim data. Silakan coba lagi nanti.' })
    }
  }

  const faqs = [
    {
      q: "Bagaimana cara memesan produk?",
      a: 'Buka halaman produk yang diinginkan, lalu tekan tombol "Pesan via WhatsApp" — Anda akan langsung terhubung ke pelaku UMKM terkait.'
    },
    {
      q: "Apakah bisa COD atau bayar di tempat?",
      a: "Tergantung pada masing-masing penjual. Mayoritas pelaku UMKM melayani COD untuk area sekitar desa."
    },
    {
      q: "Bagaimana jika produk saya ingin ditampilkan di sini?",
      a: "Cukup isi formulir pendaftaran di halaman ini, dan pengelola akan segera menghubungi Anda untuk verifikasi."
    }
  ]

  const contactCards = [
    {
      id: 'wa',
      title: 'WhatsApp Pengelola',
      content: desaInfo?.kontakDesa?.telepon || '+62 812-3456-7890',
      sub: 'Aktif setiap hari, 08.00–20.00 WIB',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
      bgColor: 'var(--color-primary-10)',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 'email',
      title: 'Email',
      content: desaInfo?.kontakDesa?.email || 'umkm.gumelarkidul@gmail.com',
      sub: '',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
      bgColor: 'var(--color-primary-10)',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 'alamat',
      title: 'Alamat Kantor Desa',
      content: 'Balai Desa Gumelar Kidul, Kecamatan Tambak',
      sub: 'Kabupaten Banyumas, Jawa Tengah',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
      bgColor: 'var(--color-primary-10)',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 'sosmed',
      title: 'Media Sosial',
      content: `Instagram ${desaInfo?.kontakDesa?.instagram || '@umkmgumelarkidul'}`,
      sub: 'Facebook UMKM Gumelar Kidul',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
      bgColor: 'var(--color-primary-10)',
      iconColor: 'var(--color-primary)'
    }
  ]

  return (
    <>
      <SEO 
        title="Gabung UMKM | Gumelar Kidul" 
        description="Daftarkan usaha UMKM Anda di Gumelar Kidul untuk menjangkau lebih banyak pelanggan secara online." 
      />
      
      <section className="hero-section" style={{ minHeight: '40vh', paddingBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-dots" aria-hidden="true" />
        <div className="container" style={{ textAlign: 'center', paddingTop: 'clamp(30px, 5vw, 60px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: '1.2', margin: '0 auto 16px', maxWidth: '750px' }}>
              Ada pertanyaan, atau ingin bergabung sebagai UMKM?
            </h1>
            <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(14px, 3.5vw, 17px)', padding: '0 24px', lineHeight: '1.6', opacity: 0.9 }}>
              Tim pengelola siap membantu baik pembeli yang butuh bantuan, maupun pelaku usaha di Gumelar Kidul yang ingin produknya tampil di sini.
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

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '1200px' }}>
        <style>{`
          .contact-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
          }
          @media (min-width: 992px) {
            .contact-layout {
              grid-template-columns: 1fr 1.2fr;
              gap: 60px;
            }
          }
          .contact-cards-wrapper {
            display: grid;
            grid-template-columns: 1fr;
          }
          .contact-card {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
            background: var(--color-surface);
            border-radius: 16px;
            border: 1px solid var(--color-border);
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-bottom: 16px;
          }
          .contact-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          }
          @media (max-width: 768px) {
            .contact-cards-wrapper {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .contact-card {
              flex-direction: column !important;
              align-items: flex-start !important;
              padding: 16px !important;
              gap: 12px !important;
              margin-bottom: 0 !important;
            }
            .contact-card-icon-wrapper {
              width: 40px !important;
              height: 40px !important;
            }
            .contact-card-title {
              font-size: 13px !important;
            }
            .contact-card-content {
              font-size: 12px !important;
              word-break: break-word;
            }
            .contact-card-sub {
              font-size: 10px !important;
            }
            .faq-q {
              font-size: 14px !important;
            }
            .faq-a {
              font-size: 13px !important;
            }
            .faq-title {
              font-size: 20px !important;
            }
            .dark-form-container {
              padding: 24px !important;
              border-radius: 20px !important;
            }
            .dark-form-title {
              font-size: 22px !important;
            }
            .dark-form-subtitle {
              font-size: 13px !important;
              margin-bottom: 24px !important;
            }
            .dark-form-input {
              padding: 10px 14px !important;
              font-size: 13px !important;
            }
            .dark-form-label {
              margin-bottom: 4px !important;
              font-size: 12px !important;
            }
            .dark-btn-submit {
              padding: 12px !important;
              font-size: 14px !important;
            }
          }
          .faq-item {
            border-bottom: 1px solid var(--color-border);
            padding: 16px 0;
            cursor: pointer;
          }
          .faq-q {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: var(--color-text);
            font-size: 15px;
          }
          .faq-a {
            margin-top: 12px;
            font-size: 14px;
            color: var(--color-text-muted);
            line-height: 1.6;
            display: none;
          }
          .faq-item.active .faq-a {
            display: block;
          }
          .faq-item.active .faq-icon {
            transform: rotate(45deg);
          }
          .faq-icon {
            transition: transform 0.2s ease;
            color: var(--color-text-muted);
          }
          
          /* Dark Form Styles */
          .dark-form-container {
            background-color: var(--color-primary);
            border-radius: 24px;
            padding: clamp(32px, 5vw, 48px);
            position: relative;
            overflow: hidden;
            color: #fff;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          .dark-form-pattern {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0.1;
            background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px);
            pointer-events: none;
            z-index: 0;
          }
          .dark-form-content {
            position: relative;
            z-index: 1;
          }
          .dark-form-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.2s ease;
          }
          .dark-form-input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.12);
          }
          .dark-form-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          .dark-form-input option {
            background: var(--color-primary-dark);
            color: #fff;
          }
          .dark-form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
          }
          .dark-btn-submit {
            background: #d97706; /* Amber/Orange */
            color: #fff;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s ease, transform 0.1s ease;
          }
          .dark-btn-submit:hover {
            background: #b45309;
          }
          .dark-btn-submit:active {
            transform: scale(0.98);
          }
          .dark-btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}</style>

        <div className="contact-layout">
          
          {/* KOLOM KIRI: Kontak & FAQ */}
          <ScrollReveal>
            <div className="left-column">
              
              {/* Kartu Kontak */}
              <div className="contact-cards-wrapper" style={{ marginBottom: '40px' }}>
                {contactCards.map(card => (
                  <div key={card.id} className="contact-card">
                    <div className="contact-card-icon-wrapper" style={{ 
                      width: '48px', height: '48px', 
                      borderRadius: '12px', 
                      backgroundColor: card.bgColor,
                      color: card.iconColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="contact-card-title" style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>{card.title}</h3>
                      <p className="contact-card-content" style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>{card.content}</p>
                      {card.sub && <p className="contact-card-sub" style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>{card.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#d97706', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Pertanyaan Umum
                </p>
                <h2 className="faq-title" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>
                  Yang sering ditanyakan
                </h2>
                
                <div className="faq-list">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className={`faq-item ${openFaq === idx ? 'active' : ''}`}
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <div className="faq-q">
                        {faq.q}
                        <span className="faq-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </span>
                      </div>
                      <div className="faq-a">
                        {faq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </ScrollReveal>

          {/* KOLOM KANAN: Form Pendaftaran Gelap */}
          <ScrollReveal delay={100}>
            <div className="dark-form-container">
              <div className="dark-form-pattern"></div>
              
              <div className="dark-form-content">
                <h2 className="dark-form-title" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: '#fff', letterSpacing: '-0.02em' }}>
                  Daftarkan UMKM Anda
                </h2>
                <p className="dark-form-subtitle" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', lineHeight: 1.5 }}>
                  Isi formulir berikut untuk bergabung menampilkan produk di etalase digital {desaInfo?.nama || 'Desa Gumelar Kidul'}.
                </p>

                {status && (
                  <div style={{
                    padding: '16px',
                    marginBottom: '24px',
                    borderRadius: '12px',
                    backgroundColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    display: 'flex', alignItems: 'flex-start', gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{status.type === 'success' ? '✅' : '❌'}</span>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{status.message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div className="form-group-dark">
                    <label className="dark-form-label">Nama Pemilik Usaha</label>
                    <input 
                      type="text" 
                      name="namaPemilik" 
                      className="dark-form-input" 
                      placeholder="Contoh: Sarinem"
                      value={formData.namaPemilik}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group-dark">
                      <label className="dark-form-label">Nama Usaha</label>
                      <input 
                        type="text" 
                        name="namaUmkm" 
                        className="dark-form-input" 
                        placeholder="Contoh: Kopi Bu Sarinem"
                        value={formData.namaUmkm}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group-dark">
                      <label className="dark-form-label">Nomor WhatsApp</label>
                      <input 
                        type="text" 
                        name="nomorWa" 
                        className="dark-form-input" 
                        placeholder="08xx-xxxx-xxxx"
                        value={formData.nomorWa}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-dark">
                    <label className="dark-form-label">Kategori Produk</label>
                    <select 
                      name="kategori" 
                      className="dark-form-input"
                      value={formData.kategori}
                      onChange={handleChange}
                    >
                      <option value="Makanan">Makanan & Minuman</option>
                      <option value="Kerajinan">Kerajinan Tangan</option>
                      <option value="Jasa">Jasa & Layanan</option>
                      <option value="Pertanian">Pertanian & Peternakan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="form-group-dark">
                    <label className="dark-form-label">Ceritakan produk Anda (Opsional)</label>
                    <textarea 
                      name="deskripsi" 
                      className="dark-form-input" 
                      rows="3" 
                      placeholder="Contoh: Kopi robusta sangrai tradisional dari kebun keluarga..."
                      value={formData.deskripsi}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="dark-btn-submit" 
                    disabled={loading}
                    style={{ marginTop: '8px' }}
                  >
                    {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran →'}
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </>
  )
}
