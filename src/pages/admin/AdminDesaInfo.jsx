import { useState, useEffect } from 'react'
import { useDesa } from '@/hooks/useDesa'
import { useToast } from '@/components/admin/Toast'
import imageCompression from 'browser-image-compression'
import { uploadToCloudinary } from '@/utils/imageUpload'

export default function AdminDesaInfo() {
  const { desaInfo, loading, updateDesaInfo } = useDesa()
  const { addToast } = useToast()
  
  const [formData, setFormData] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('identitas')

  // Initialize form when data loads
  useEffect(() => {
    if (desaInfo && !formData) {
      setFormData(desaInfo)
    }
  }, [desaInfo, formData])

  if (loading || !formData) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Memuat pengaturan desa...</div>
  }

  const handleChange = (e, section, field) => {
    const value = e.target.value
    if (section) {
      if (field) {
        // Handle nested like beranda.kades.nama
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }))
      } else {
        // This is for something like kontakDesa or statistik where we pass the field directly
        // Wait, the previous logic was: handleChange(e, 'statistik', 'penduduk')
        // So section='statistik', field='penduduk'
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNestedChange = (e, section, subSection, field) => {
    // For beranda.kades.nama -> section='beranda', subSection='kades', field='nama'
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }))
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const options = {
        maxSizeMB: 0.1, // 100KB for logos/favicons
        maxWidthOrHeight: 512,
        useWebWorker: true
      }
      const compressedFile = await imageCompression(file, options)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          identitas: {
            ...prev.identitas,
            [field]: reader.result
          }
        }))
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Upload error:', error)
      addToast('Gagal memproses gambar.', 'error')
    }
  }

  const handleKadesPhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const options = {
        maxSizeMB: 0.2, // 200KB for photo
        maxWidthOrHeight: 800,
        useWebWorker: true
      }
      const compressedFile = await imageCompression(file, options)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          beranda: {
            ...prev.beranda,
            kades: {
              ...prev.beranda.kades,
              foto: reader.result
            }
          }
        }))
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Upload error:', error)
      addToast('Gagal memproses foto kepala desa.', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi Manual
    if (isNaN(Number(formData.statistik?.penduduk)) || isNaN(Number(formData.statistik?.kk)) || isNaN(Number(formData.statistik?.umkm))) {
      addToast('Data statistik (Penduduk, KK, UMKM) harus berupa angka valid.', 'error')
      return
    }

    if (formData.kontakDesa?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.kontakDesa.email)) {
      addToast('Format email tidak valid.', 'error')
      return
    }

    if (formData.kontakDesa?.telepon && !/^[\d+\-\s()]+$/.test(formData.kontakDesa.telepon)) {
      addToast('Format telepon tidak valid.', 'error')
      return
    }

    setIsSaving(true)
    try {
      let finalData = JSON.parse(JSON.stringify(formData));
      
      // Upload Logo ke Cloudinary jika berupa Base64 baru
      if (finalData.identitas?.logo?.startsWith('data:image')) {
        addToast('Mengunggah logo ke server...', 'info')
        finalData.identitas.logo = await uploadToCloudinary(finalData.identitas.logo, 'logo-desa')
      }

      // Upload Foto Kades ke Cloudinary jika berupa Base64 baru
      if (finalData.beranda?.kades?.foto?.startsWith('data:image')) {
        addToast('Mengunggah foto Kepala Desa ke server...', 'info')
        finalData.beranda.kades.foto = await uploadToCloudinary(finalData.beranda.kades.foto, 'foto-kades')
      }

      await updateDesaInfo(finalData)
      addToast('Pengaturan desa berhasil disimpan!', 'success')
    } catch (err) {
      addToast('Gagal menyimpan pengaturan.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'identitas', label: 'Identitas Website' },
    { id: 'beranda', label: 'Teks Beranda & Kades' },
    { id: 'profil', label: 'Sejarah & Visi Misi' },
    { id: 'statistik', label: 'Data & Kontak' },
  ]

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="heading-1" style={{ fontSize: 24 }}>Pengaturan Konten Website (CMS)</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Ubah logo, teks halaman depan, hingga informasi profil desa Anda.
          </p>
        </div>
      </div>

      <style>{`
        .admin-tabs-wrap {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .admin-tabs-wrap button {
          flex: 1 1 calc(50% - 8px);
          text-align: center;
          font-size: 13px !important;
          padding: 10px 8px !important;
          white-space: normal !important;
          line-height: 1.2;
        }
        @media (min-width: 768px) {
          .admin-tabs-wrap {
            flex-wrap: nowrap;
          }
          .admin-tabs-wrap button {
            flex: 0 1 auto;
            font-size: 14px !important;
            padding: 10px 20px !important;
            white-space: nowrap !important;
          }
        }
      `}</style>

      <div className="admin-tabs-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === tab.id ? 'white' : 'var(--color-text)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            
            {/* TAB IDENTITAS */}
            <div style={{ display: activeTab === 'identitas' ? 'block' : 'none' }}>
              <div className="form-group">
                <label className="form-label">Nama Website / Judul Global</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.identitas?.namaWeb || ''} 
                  onChange={(e) => handleChange(e, 'identitas', 'namaWeb')} 
                />
                <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '8px' }}>
                  Logo dan Favicon kini diatur secara permanen melalui file <b>logo.png</b> dan <b>favicon.png</b> di dalam folder <b>public</b>. Tidak perlu repot mengunggah lewat sini lagi.
                </small>
              </div>
            </div>

            {/* TAB BERANDA */}
            <div style={{ display: activeTab === 'beranda' ? 'block' : 'none' }}>
              <h3 style={{ marginBottom: 16, color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 8 }}>Hero Section</h3>
              <div className="form-group">
                <label className="form-label">Judul Utama Beranda</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.beranda?.judulHero || ''} 
                  onChange={(e) => handleChange(e, 'beranda', 'judulHero')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teks Sub-Judul (Deskripsi Singkat Beranda)</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={formData.beranda?.teksHero || ''} 
                  onChange={(e) => handleChange(e, 'beranda', 'teksHero')} 
                />
              </div>

              <h3 style={{ marginTop: 32, marginBottom: 16, color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 8 }}>Sambutan Kepala Desa</h3>
              <div className="form-group">
                <label className="form-label">Nama Kepala Desa</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.beranda?.kades?.nama || ''} 
                  onChange={(e) => handleNestedChange(e, 'beranda', 'kades', 'nama')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Foto Kepala Desa</label>
                {formData.beranda?.kades?.foto ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-surface-alt)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <img src={formData.beranda.kades.foto} alt="Foto Kades" style={{ height: 64, width: 64, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: 'var(--color-primary)' }}>✓ Tersimpan Permanen</p>
                      <label className="btn btn-outline" style={{ cursor: 'pointer', fontSize: '13px', padding: '6px 12px', display: 'inline-block' }}>
                        Ganti Foto
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleKadesPhotoUpload} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <input type="file" accept="image/*" className="form-input" onChange={handleKadesPhotoUpload} />
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Teks Sambutan Singkat</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  value={formData.beranda?.kades?.teks || ''} 
                  onChange={(e) => handleNestedChange(e, 'beranda', 'kades', 'teks')} 
                />
              </div>
            </div>

            {/* TAB PROFIL DESA */}
            <div style={{ display: activeTab === 'profil' ? 'block' : 'none' }}>
              <div className="form-group">
                <label className="form-label">Deskripsi Singkat (SEO Meta Description)</label>
                <textarea 
                  className="form-input" 
                  rows="2" 
                  value={formData.deskripsi || ''} 
                  onChange={(e) => handleChange(e, null, 'deskripsi')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sejarah & Profil Desa</label>
                <textarea 
                  className="form-input" 
                  rows="5" 
                  value={formData.sejarah || ''} 
                  onChange={(e) => handleChange(e, null, 'sejarah')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visi</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={formData.visi || ''} 
                  onChange={(e) => handleChange(e, null, 'visi')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Misi</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  value={formData.misi || ''} 
                  onChange={(e) => handleChange(e, null, 'misi')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">ID Video YouTube (Opsional - Contoh: dQw4w9WgXcQ)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.videoYoutubeId || ''} 
                  onChange={(e) => handleChange(e, null, 'videoYoutubeId')} 
                />
              </div>
            </div>

            {/* TAB STATISTIK & KONTAK */}
            <div style={{ display: activeTab === 'statistik' ? 'block' : 'none' }}>
              <h3 style={{ marginBottom: 16, color: 'var(--color-primary)' }}>Data Statistik</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Penduduk</label>
                  <input type="number" className="form-input" value={formData.statistik?.penduduk || ''} onChange={(e) => handleChange(e, 'statistik', 'penduduk')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kepala Keluarga</label>
                  <input type="number" className="form-input" value={formData.statistik?.kk || ''} onChange={(e) => handleChange(e, 'statistik', 'kk')} />
                </div>
                <div className="form-group">
                  <label className="form-label">UMKM Aktif</label>
                  <input type="number" className="form-input" value={formData.statistik?.umkm || ''} onChange={(e) => handleChange(e, 'statistik', 'umkm')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah RT</label>
                  <input type="number" className="form-input" value={formData.statistik?.rt || ''} onChange={(e) => handleChange(e, 'statistik', 'rt')} />
                </div>
              </div>

              <h3 style={{ marginBottom: 16, color: 'var(--color-primary)' }}>Informasi Kontak</h3>
              <div className="form-group">
                <label className="form-label">Telepon Desa</label>
                <input type="text" className="form-input" value={formData.kontakDesa?.telepon || ''} onChange={(e) => handleChange(e, 'kontakDesa', 'telepon')} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Desa</label>
                <input type="email" className="form-input" value={formData.kontakDesa?.email || ''} onChange={(e) => handleChange(e, 'kontakDesa', 'email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Alamat Kantor</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={formData.kontakDesa?.alamatKantor || ''} 
                  onChange={(e) => handleChange(e, 'kontakDesa', 'alamatKantor')} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tautan Semat Peta (Google Maps Embed URL)</label>
                <input type="text" className="form-input" value={formData.linkPetaDesa || ''} onChange={(e) => handleChange(e, null, 'linkPetaDesa')} />
              </div>
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border-light)' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
