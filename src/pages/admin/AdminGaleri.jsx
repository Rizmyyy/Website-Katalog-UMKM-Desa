import { useState } from 'react'
import { useGaleri } from '@/hooks/useGaleri'
import { useToast } from '@/components/admin/Toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import imageCompression from 'browser-image-compression'
import { uploadToImgBB } from '@/utils/imageUpload'

export default function AdminGaleri() {
  const { galeri, loading, addFoto, updateFoto, deleteFoto } = useGaleri()
  const { addToast } = useToast()
  
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const [formData, setFormData] = useState({ src: '', title: '', category: 'Sosialisasi', date: today })

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteFoto(deleteTarget.id)
      addToast(`Foto "${deleteTarget.title}" berhasil dihapus!`, 'success')
    } catch (err) {
      addToast('Gagal menghapus foto.', 'error')
    }
    setDeleteTarget(null)
  }

  const handleEdit = (foto) => {
    setEditingId(foto.id)
    setFormData({
      src: foto.src || foto.url || '',
      title: foto.title || foto.caption || '',
      category: foto.category || foto.kategori || 'Sosialisasi',
      date: foto.date || today
    })
    setShowAddForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    setFormData({ src: '', title: '', category: 'Sosialisasi', date: today })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      let finalSrc = formData.src;
      // Jika src berupa Base64 (gambar baru diunggah), kirim ke ImgBB dulu
      if (finalSrc.startsWith('data:image')) {
        addToast('Sedang mengunggah gambar ke server...', 'info')
        finalSrc = await uploadToImgBB(finalSrc, formData.title.replace(/\s+/g, '-'));
      }

      const finalData = { ...formData, src: finalSrc };

      if (editingId) {
        await updateFoto(editingId, finalData)
        addToast('Foto berhasil diperbarui!', 'success')
      } else {
        await addFoto(finalData)
        addToast('Foto baru berhasil ditambahkan!', 'success')
      }
      handleCancel()
    } catch (err) {
      console.error(err);
      addToast(err.message || (editingId ? 'Gagal memperbarui foto.' : 'Gagal menambahkan foto.'), 'error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="heading-1" style={{ fontSize: 24 }}>Galeri Jejak KKN</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Kelola foto dokumentasi kegiatan desa
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => showAddForm ? handleCancel() : setShowAddForm(true)}
        >
          {showAddForm ? 'Batal' : '+ Tambah Foto'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ 
          background: 'var(--color-surface)', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: 'var(--shadow-card)',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Foto' : 'Tambah Foto Baru'}</h3>
          <div className="form-group">
            <label className="form-label">Upload Foto</label>
            <input 
              type="file" 
              accept="image/*"
              className="form-input" 
              onChange={async (e) => {
                const file = e.target.files[0]
                if (file) {
                  try {
                    const options = {
                      maxSizeMB: 0.8, // Increased for better quality
                      maxWidthOrHeight: 1920,
                      useWebWorker: true
                    }
                    const compressedFile = await imageCompression(file, options)
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setFormData({...formData, src: reader.result})
                    }
                    reader.readAsDataURL(compressedFile)
                  } catch (error) {
                    console.error('Gagal mengompres gambar:', error)
                  }
                }
              }}
              required={!editingId} // Only required when adding new
            />
            {formData.src && (
              <div style={{ marginTop: '16px', background: 'var(--color-bg)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <img 
                  src={formData.src} 
                  alt="Preview" 
                  style={{ maxHeight: '250px', maxWidth: '100%', borderRadius: '4px', objectFit: 'contain' }} 
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Judul Keterangan / Caption</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Pelatihan Digitalisasi..." 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>
          <div className="grid mobile-grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select 
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Proses Produksi">Proses Produksi</option>
                <option value="Sosialisasi">Sosialisasi</option>
                <option value="Bersama Warga">Bersama Warga</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Kegiatan</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={handleCancel} disabled={isUploading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Foto')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Memuat galeri...
        </div>
      ) : galeri.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
          <h3>Belum ada foto</h3>
        </div>
      ) : (
        <div className="table-wrapper" style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-card)',
          overflowX: 'auto'
        }}>
          <style>{`
            @media (max-width: 768px) {
              .table-gallery tbody {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px;
              }
              .table-gallery tr {
                display: flex !important;
                flex-direction: column !important;
                padding: 12px !important;
                margin-bottom: 0 !important;
                border-radius: 12px !important;
                height: 100%;
              }
              .table-gallery td {
                padding: 0 !important;
                padding-left: 0 !important;
                border: none !important;
                text-align: left !important;
                justify-content: flex-start !important;
                width: 100% !important;
              }
              .table-gallery td::before {
                display: none !important;
              }
              .table-gallery td:nth-child(1) img {
                width: 100% !important;
                height: 100px !important;
                margin-bottom: 8px;
                border-radius: 8px !important;
              }
              .table-gallery td:nth-child(2) {
                font-size: 13px !important;
                font-weight: 700 !important;
                margin-bottom: 6px;
                line-height: 1.3;
                white-space: normal !important;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .table-gallery td:nth-child(3) .badge {
                font-size: 9px !important;
                padding: 2px 6px !important;
                margin-bottom: 4px;
                display: inline-block;
              }
              .table-gallery td:nth-child(4) {
                font-size: 11px !important;
                margin-bottom: 12px;
              }
              .table-gallery td:nth-child(5) {
                margin-top: auto !important;
                padding-top: 0 !important;
              }
              .table-gallery td:nth-child(5) .flex {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
                width: 100%;
              }
              .table-gallery td:nth-child(5) .btn {
                padding: 6px !important;
                font-size: 11px !important;
                width: 100%;
                justify-content: center;
              }
            }
          `}</style>
          <table className="table table-gallery">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Foto</th>
                <th>Caption</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {galeri.map((foto) => (
                <tr key={foto.id}>
                  <td>
                    <img 
                      src={foto.src || foto.url} 
                      alt={foto.title || foto.caption} 
                      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{foto.title || foto.caption}</td>
                  <td><span className="badge badge-primary" style={{ fontSize: 10 }}>{foto.category || foto.kategori}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{foto.date || '-'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(foto)}
                        title="Edit Foto"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => setDeleteTarget(foto)}
                        title="Hapus"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Foto?"
        message={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
