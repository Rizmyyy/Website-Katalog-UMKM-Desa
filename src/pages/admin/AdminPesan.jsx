import { usePesan } from '@/hooks/usePesan'
import { useState } from 'react'

export default function AdminPesan() {
  const { pesan, loading, tandaiDibaca, hapusPesan } = usePesan()
  const [isDeleting, setIsDeleting] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const handleTandaiDibaca = async (id) => {
    await tandaiDibaca(id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pesan ini?')) {
      setIsDeleting(id)
      await hapusPesan(id)
      setIsDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>Memuat pesan...</p>
      </div>
    )
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Pesan Masuk (Pendaftaran UMKM)</h1>
          <p className="admin-subtitle">Kelola pengajuan pendaftaran UMKM dari warga.</p>
        </div>
      </div>

      <style>{`
        /* DESKTOP (Default) - Normal Expanded View */
        .pesan-card {
          padding: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
          cursor: default;
        }
        .pesan-summary {
          display: none; /* Hide accordion summary on desktop */
        }
        .pesan-desktop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
        }
        .pesan-details-container {
          display: flex; /* Always visible on desktop */
          flex-direction: column;
          gap: 16px;
        }
        .mobile-wa-wrapper {
          display: none; /* Hide mobile-specific button on desktop */
        }
        .desktop-wa-wrapper {
          display: block; /* Show desktop WA button */
        }
        .pesan-grid-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 0 16px;
        }
        .pesan-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
          border-top: 1px solid var(--color-border-light);
          padding-top: 16px;
        }

        /* MOBILE (<768px) - Accordion View */
        @media (max-width: 768px) {
          .pesan-card {
            padding: 0;
            gap: 0;
            border-radius: 12px;
            cursor: pointer; /* Make it clickable on mobile */
          }
          .pesan-desktop-header {
            display: none; /* Hide desktop header */
          }
          .pesan-summary {
            display: flex; /* Show accordion summary */
            padding: 12px 16px;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .pesan-summary-left {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
            min-width: 0;
          }
          .pesan-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--color-primary-10);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            flex-shrink: 0;
          }
          .pesan-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--color-text);
            margin: 0 0 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .pesan-subtitle {
            margin: 0;
            font-size: 13px;
            color: var(--color-text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .chevron {
            transition: transform 0.3s ease;
            color: var(--color-text-muted);
          }
          .chevron.open {
            transform: rotate(180deg);
          }

          /* Details container logic for mobile */
          .pesan-details-container {
            display: none; /* Hidden by default on mobile */
          }
          .pesan-details-container.expanded {
            display: flex; /* Show when expanded */
            padding: 0 16px 16px 16px;
            border-top: 1px dashed var(--color-border-light);
            margin-top: 4px;
            padding-top: 16px;
          }

          .mobile-wa-wrapper {
            display: block;
            width: 100%;
            margin-bottom: 8px;
          }
          .mobile-wa-wrapper .btn {
            width: 100%;
            justify-content: center;
          }
          .desktop-wa-wrapper {
            display: none;
          }
          
          .pesan-grid-info {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 0;
          }
          .pesan-actions {
            flex-direction: column-reverse;
            gap: 8px;
          }
          .pesan-actions .btn {
            width: 100%;
            padding: 12px !important;
          }
        }
      `}</style>

      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--rounded-lg)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {pesan.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>📭</span>
            <p>Belum ada pesan atau pendaftaran masuk.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pesan.map((msg) => (
                <div 
                  key={msg.id} 
                  className="pesan-card"
                  style={{ 
                    border: '1px solid var(--color-border)',
                    borderLeft: !msg.isRead ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                {/* 1. Desktop Header (Hidden on Mobile) */}
                <div className="pesan-desktop-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{msg.namaUmkm}</h3>
                      {!msg.isRead && (
                        <span style={{ padding: '2px 8px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>BARU</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Oleh: <strong>{msg.namaPemilik}</strong> • {msg.kategori}</p>
                  </div>
                  <div className="desktop-wa-wrapper">
                    <a 
                      href={`https://wa.me/${msg.nomorWa.replace(/^0/, '62')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', borderColor: '#22c55e', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Hubungi WA
                    </a>
                  </div>
                </div>

                {/* 2. Mobile Landscape Summary (Hidden on Desktop) */}
                <div className="pesan-summary" onClick={() => toggleExpand(msg.id)}>
                  <div className="pesan-summary-left">
                    <div className="pesan-avatar">
                      {msg.namaUmkm ? msg.namaUmkm.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className="pesan-title">{msg.namaUmkm}</h3>
                        {!msg.isRead && (
                          <span style={{ padding: '2px 6px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>BARU</span>
                        )}
                      </div>
                      <p className="pesan-subtitle">{msg.namaPemilik} • {msg.kategori}</p>
                    </div>
                  </div>
                  <div className={`chevron ${expandedId === msg.id ? 'open' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>

                {/* 3. Expanded Details (Always visible on Desktop, Collapsible on Mobile via CSS) */}
                <div className={`pesan-details-container ${expandedId === msg.id ? 'expanded' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className="mobile-wa-wrapper">
                    <a 
                      href={`https://wa.me/${msg.nomorWa.replace(/^0/, '62')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-hubungi"
                      style={{ padding: '8px 16px', borderColor: '#22c55e', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Hubungi WhatsApp Sekarang
                    </a>
                  </div>
                  
                  <div className="pesan-grid-info">
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Nomor WhatsApp</span>
                        <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>{msg.nomorWa}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Alamat Lengkap</span>
                        <span style={{ color: 'var(--color-text)', fontSize: '15px' }}>{msg.alamat || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {msg.deskripsi && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', padding: '0 16px' }}>
                      <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <div>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Deskripsi Singkat</span>
                        <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.6 }}>{msg.deskripsi}</p>
                      </div>
                    </div>
                  )}

                  <div className="pesan-actions">
                    {!msg.isRead && (
                      <button 
                        onClick={() => handleTandaiDibaca(msg.id)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Tandai Sudah Dibaca
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="btn"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                        color: 'var(--color-danger)', 
                        border: 'none',
                        fontWeight: 600
                      }}
                      disabled={isDeleting === msg.id}
                    >
                      {isDeleting === msg.id ? 'Menghapus...' : 'Hapus Pendaftaran'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
