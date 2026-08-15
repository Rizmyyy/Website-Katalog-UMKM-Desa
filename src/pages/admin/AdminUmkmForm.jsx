import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'

const emptyForm = {
  namaUmkm: '',
  namaPemilik: '',
  idPemilik: '',
  kategori: 'kuliner',
  deskripsiSingkat: '',
  storytelling: '',
  produkUnggulan: '',
  keunikanProduk: '',
  daftarHarga: [{ namaProduk: '', harga: '' }],
  kendalaUsaha: '',
  alamat: '',
  linkPeta: '',
  kontakWhatsapp: '',
  isFeatured: false,
  fotoProses: [],
}

export default function AdminUmkmForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, createUmkm, updateUmkm, uploadImages, umkmList } = useUmkm()
  const { addToast } = useToast()
  const isEdit = !!id

  // Buat daftar pemilik unik dari data yang sudah ada
  const daftarPemilik = useMemo(() => {
    const map = new Map()
    umkmList.forEach((u) => {
      if (u.idPemilik && u.namaPemilik) {
        map.set(u.idPemilik, u.namaPemilik)
      }
    })
    return Array.from(map.entries()).map(([idPemilik, namaPemilik]) => ({ idPemilik, namaPemilik }))
  }, [umkmList])

  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([]) // Untuk foto produk utama
  const [prosesImages, setProsesImages] = useState([]) // Untuk foto proses pembuatan
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const data = getById(id)
      if (data) {
        setForm({
          namaUmkm: data.namaUmkm || '',
          namaPemilik: data.namaPemilik || '',
          idPemilik: data.idPemilik || '',
          kategori: data.kategori || 'kuliner',
          deskripsiSingkat: data.deskripsiSingkat || '',
          storytelling: data.storytelling || '',
          produkUnggulan: data.produkUnggulan || '',
          keunikanProduk: data.keunikanProduk || '',
          daftarHarga: data.daftarHarga && data.daftarHarga.length > 0
            ? data.daftarHarga.map((d) => ({ namaProduk: d.namaProduk, harga: String(d.harga) }))
            : [{ namaProduk: '', harga: '' }],
          kendalaUsaha: data.kendalaUsaha || '',
          alamat: data.alamat || '',
          linkPeta: data.linkPeta || '',
          kontakWhatsapp: data.kontakWhatsapp || '',
          isFeatured: data.isFeatured || false,
        })
        // Load existing images
        if (data.fotoUrls && data.fotoUrls.length > 0) {
          setImages(data.fotoUrls.map((url) => ({ url, preview: url, isNew: false })))
        }
        if (data.fotoProses && data.fotoProses.length > 0) {
          setProsesImages(data.fotoProses.map((url) => ({ url, preview: url, isNew: false })))
        }
      }
    }
  }, [id, isEdit, getById])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePriceChange = (index, field, value) => {
    const updated = [...form.daftarHarga]
    updated[index] = { ...updated[index], [field]: value }
    setForm((prev) => ({ ...prev, daftarHarga: updated }))
  }

  const addPriceRow = () => {
    setForm((prev) => ({
      ...prev,
      daftarHarga: [...prev.daftarHarga, { namaProduk: '', harga: '' }],
    }))
  }

  const removePriceRow = (index) => {
    if (form.daftarHarga.length <= 1) return
    setForm((prev) => ({
      ...prev,
      daftarHarga: prev.daftarHarga.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!form.namaUmkm.trim()) {
      addToast('Nama UMKM wajib diisi.', 'error')
      return
    }
    if (!form.namaPemilik.trim()) {
      addToast('Nama Pemilik wajib diisi.', 'error')
      return
    }
    if (!form.kontakWhatsapp.trim()) {
      addToast('Nomor WhatsApp wajib diisi.', 'error')
      return
    }
    if (!/^[\d+\-\s()]+$/.test(form.kontakWhatsapp)) {
      addToast('Format nomor WhatsApp tidak valid (hanya angka).', 'error')
      return
    }
    if (form.linkPeta && !form.linkPeta.includes('http')) {
      addToast('Tautan peta harus berupa URL yang valid (dimulai dengan http).', 'error')
      return
    }

    setSaving(true)
    try {
      // Process main images
      const newFiles = images.filter((img) => img.isNew && img.file).map((img) => img.file)
      let allUrls = images.filter((img) => !img.isNew).map((img) => img.url)
      if (newFiles.length > 0) {
        const uploadedUrls = await uploadImages(newFiles)
        allUrls = [...allUrls, ...uploadedUrls]
      }

      // Process "proses pembuatan" images
      const newProsesFiles = prosesImages.filter((img) => img.isNew && img.file).map((img) => img.file)
      let allProsesUrls = prosesImages.filter((img) => !img.isNew).map((img) => img.url)
      if (newProsesFiles.length > 0) {
        const uploadedProsesUrls = await uploadImages(newProsesFiles)
        allProsesUrls = [...allProsesUrls, ...uploadedProsesUrls]
      }

      // Process price data
      const processedPrices = form.daftarHarga
        .filter((p) => p.namaProduk.trim())
        .map((p) => ({
          namaProduk: p.namaProduk.trim(),
          harga: parseInt(p.harga) || 0,
        }))

      const data = {
        ...form,
        // Jika pemilik baru, generate idPemilik otomatis dari namaPemilik
        idPemilik: form.idPemilik.trim() ||
          form.namaPemilik.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        daftarHarga: processedPrices,
        fotoUrls: allUrls,
        fotoUtama: allUrls[0] || '',
        fotoProses: allProsesUrls,
      }

      if (isEdit) {
        await updateUmkm(id, data)
        addToast('Data berhasil diperbarui! ✓', 'success')
      } else {
        await createUmkm(data)
        addToast('UMKM baru berhasil ditambahkan! ✓', 'success')
      }

      navigate('/admin/dashboard')
    } catch (err) {
      addToast('Gagal menyimpan data. Silakan coba lagi.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="admin-page-header">
        <div>
          <h1 className="heading-1" style={{ fontSize: 24 }}>
            {isEdit ? 'Ubah Data UMKM' : 'Tambah UMKM Baru'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            {isEdit ? 'Perbarui informasi UMKM di bawah ini.' : 'Isi informasi UMKM yang akan ditampilkan di website.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Informasi Dasar */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            📝 Informasi Dasar
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="namaUmkm">Nama UMKM *</label>
            <input
              id="namaUmkm"
              className="form-input"
              placeholder="Contoh: Batik Gumelar Asri"
              value={form.namaUmkm}
              onChange={(e) => handleChange('namaUmkm', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="namaPemilik">Nama Pemilik *</label>
            <input
              id="namaPemilik"
              className="form-input"
              placeholder="Contoh: Bu Siti Aminah"
              value={form.namaPemilik}
              onChange={(e) => handleChange('namaPemilik', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="idPemilik">Kelompokkan dengan Pemilik Lain</label>
            <p className="form-hint">
              Pilih pemilik yang sudah ada jika produk ini milik orang yang sama, agar produk-produknya bisa tampil bersama di website.
            </p>
            <select
              id="idPemilik"
              className="form-select"
              value={form.idPemilik}
              onChange={(e) => handleChange('idPemilik', e.target.value)}
            >
              <option value="">— Pemilik baru (belum ada di daftar) —</option>
              {daftarPemilik.map(({ idPemilik, namaPemilik }) => (
                <option key={idPemilik} value={idPemilik}>{namaPemilik}</option>
              ))}
            </select>
            {!form.idPemilik && form.namaPemilik.trim() && (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                ID otomatis: <strong>{form.namaPemilik.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}</strong>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="kategori">Kategori</label>
            <select
              id="kategori"
              className="form-select"
              value={form.kategori}
              onChange={(e) => handleChange('kategori', e.target.value)}
            >
              <option value="kuliner">🍴 Kuliner</option>
              <option value="kerajinan">🎨 Kerajinan</option>
              <option value="pertanian">🌾 Pertanian</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="deskripsiSingkat">Deskripsi Singkat</label>
            <p className="form-hint">Gambaran singkat tentang usaha ini (1-2 kalimat)</p>
            <textarea
              id="deskripsiSingkat"
              className="form-textarea"
              placeholder="Contoh: Batik tulis khas Gumelar dengan motif flora dan fauna pegunungan..."
              value={form.deskripsiSingkat}
              onChange={(e) => handleChange('deskripsiSingkat', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontWeight: 500 }}>⭐ Tampilkan sebagai UMKM Unggulan di beranda</span>
            </label>
          </div>
        </div>

        {/* Cerita Usaha */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            📖 Cerita Usaha
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="storytelling">Kisah / Cerita Usaha</label>
            <p className="form-hint">Ceritakan perjalanan usaha ini — bagaimana awalnya, siapa yang terlibat, dan apa artinya bagi keluarga/desa</p>
            <textarea
              id="storytelling"
              className="form-textarea"
              placeholder="Tuliskan cerita di balik usaha ini..."
              value={form.storytelling}
              onChange={(e) => handleChange('storytelling', e.target.value)}
              rows={6}
              style={{ minHeight: 160 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="keunikanProduk">Keunikan Produk / Mengapa Harus Coba</label>
            <p className="form-hint">Apa yang membuat produk ini spesial? (bahan lokal, teknik khusus, dll)</p>
            <textarea
              id="keunikanProduk"
              className="form-textarea"
              placeholder="Contoh: Menggunakan pewarna alami 100% dari dedaunan dan kulit kayu lokal..."
              value={form.keunikanProduk}
              onChange={(e) => handleChange('keunikanProduk', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Produk */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            🏆 Produk & Harga
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="produkUnggulan">Produk Unggulan</label>
            <input
              id="produkUnggulan"
              className="form-input"
              placeholder="Contoh: Batik Tulis Motif Pegunungan"
              value={form.produkUnggulan}
              onChange={(e) => handleChange('produkUnggulan', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Daftar Harga</label>
            <p className="form-hint">Tambahkan nama produk dan harganya</p>

            {form.daftarHarga.map((item, index) => (
              <div key={index} className="price-row">
                <input
                  className="form-input"
                  placeholder="Nama produk"
                  value={item.namaProduk}
                  onChange={(e) => handlePriceChange(index, 'namaProduk', e.target.value)}
                />
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', fontSize: 14, pointerEvents: 'none',
                  }}>
                    Rp
                  </span>
                  <input
                    className="form-input price-input-amount"
                    type="number"
                    placeholder="0"
                    value={item.harga}
                    onChange={(e) => handlePriceChange(index, 'harga', e.target.value)}
                    style={{ paddingLeft: 36 }}
                  />
                </div>
                {form.daftarHarga.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-remove-row"
                    style={{ color: 'var(--color-error)', padding: '10px' }}
                    onClick={() => removePriceRow(index)}
                    title="Hapus baris"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={addPriceRow}
              style={{ marginTop: 'var(--space-1)' }}
            >
              + Tambah Produk Lain
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="kendalaUsaha">Kendala / Tantangan Usaha</label>
            <p className="form-hint">Opsional — akan ditampilkan sebagai bentuk keterbukaan dan ajakan dukungan</p>
            <textarea
              id="kendalaUsaha"
              className="form-textarea"
              placeholder="Contoh: Keterbatasan bahan baku saat musim kemarau..."
              value={form.kendalaUsaha}
              onChange={(e) => handleChange('kendalaUsaha', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Foto Utama */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            📸 Foto Produk & Profil
          </h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-2)' }}>
            Foto pertama akan digunakan sebagai foto utama di daftar UMKM
          </p>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Foto Proses Pembuatan (Di Balik Layar) */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            🔨 Foto Proses Pembuatan (Di Balik Layar)
          </h3>
          <p className="form-hint" style={{ marginBottom: 'var(--space-2)' }}>
            Opsional — Foto ibu-ibu sedang memasak, bapak sedang memotong kayu, atau alat produksi. Ini sangat disukai pembeli karena menunjukkan keaslian produk.
          </p>
          <ImageUploader images={prosesImages} onChange={setProsesImages} />
        </div>

        {/* Kontak & Lokasi */}
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-3)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            📍 Kontak & Lokasi
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="kontakWhatsapp">Nomor WhatsApp *</label>
            <p className="form-hint">Tulis tanpa spasi, awali dengan 62 (tanpa tanda +). Contoh: 6281234567890</p>
            <input
              id="kontakWhatsapp"
              className="form-input"
              placeholder="6281234567890"
              value={form.kontakWhatsapp}
              onChange={(e) => handleChange('kontakWhatsapp', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="alamat">Alamat Lengkap</label>
            <textarea
              id="alamat"
              className="form-textarea"
              placeholder="Contoh: Jl. Desa Gumelar Kidul RT 03/RW 02, Kecamatan Gumelar..."
              value={form.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="linkPeta">Link Peta Google Maps</label>
            <p className="form-hint">Salin link embed dari Google Maps (opsional)</p>
            <input
              id="linkPeta"
              className="form-input"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={form.linkPeta}
              onChange={(e) => handleChange('linkPeta', e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/admin/dashboard')}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            id="btn-simpan"
          >
            {saving ? 'Menyimpan...' : isEdit ? '✓ Simpan Perubahan' : '✓ Tambah UMKM'}
          </button>
        </div>
      </form>
    </div>
  )
}
