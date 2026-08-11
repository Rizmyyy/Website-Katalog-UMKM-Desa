import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUmkm } from '@/hooks/useUmkm'
import { useToast } from '@/components/admin/Toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function AdminDashboard() {
  const { umkmList, loading, deleteUmkm } = useUmkm()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const kategoriLabel = {
    kuliner: 'Kuliner',
    kerajinan: 'Kerajinan',
    pertanian: 'Pertanian',
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteUmkm(deleteTarget.id)
      addToast(`Data "${deleteTarget.namaUmkm}" berhasil dihapus!`, 'success')
    } catch (err) {
      addToast('Gagal menghapus data. Silakan coba lagi.', 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="heading-1" style={{ fontSize: 24 }}>Daftar UMKM</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            Total {umkmList.length} UMKM terdaftar
          </p>
        </div>
        <Link to="/admin/umkm/tambah" className="btn btn-primary" id="btn-tambah-umkm">
          + Tambah UMKM Baru
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Memuat data...
        </div>
      ) : umkmList.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 'var(--space-2)' }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>Belum ada data UMKM</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            Mulai tambahkan data UMKM pertama Anda.
          </p>
          <Link to="/admin/umkm/tambah" className="btn btn-primary">
            + Tambah UMKM Baru
          </Link>
        </div>
      ) : (
        <div className="table-wrapper" style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--rounded-lg)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-card)',
          overflowX: 'auto'
        }}>
          <table className="table" id="table-umkm">
            <thead>
              <tr>
                <th style={{ width: 50 }}>No</th>
                <th>Nama UMKM</th>
                <th>Pemilik</th>
                <th>Kategori</th>
                <th>WhatsApp</th>
                <th style={{ width: 160 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {umkmList.map((umkm, index) => (
                <tr key={umkm.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Nama UMKM">
                    <div className="flex items-center gap-2">
                      {umkm.fotoUtama && (
                        <img
                          src={umkm.fotoUtama}
                          alt=""
                          style={{
                            width: 40, height: 40,
                            borderRadius: 'var(--rounded)',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <span style={{ fontWeight: 600 }}>{umkm.namaUmkm}</span>
                        {umkm.isFeatured && (
                          <span style={{
                            display: 'inline-block',
                            fontSize: 11,
                            color: '#E65100',
                            backgroundColor: '#FFF3E0',
                            padding: '2px 6px',
                            borderRadius: 'var(--rounded-full)',
                            marginLeft: 6,
                          }}>
                            ★ Unggulan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-label="Pemilik">{umkm.namaPemilik}</td>
                  <td data-label="Kategori">
                    <span className="badge badge-primary" style={{ fontSize: 11 }}>
                      {kategoriLabel[umkm.kategori] || umkm.kategori}
                    </span>
                  </td>
                  <td data-label="WhatsApp" style={{ fontSize: 13, fontFamily: 'monospace' }}>
                    {umkm.kontakWhatsapp}
                  </td>
                  <td data-label="Aksi">
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/admin/umkm/edit/${umkm.id}`)}
                        title="Ubah data"
                      >
                        ✏️ Ubah
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => setDeleteTarget(umkm)}
                        title="Hapus data"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Data UMKM"
        message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.namaUmkm}"? Data yang sudah dihapus tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
