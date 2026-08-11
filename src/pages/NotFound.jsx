import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{
      textAlign: 'center',
      padding: 'var(--space-8) var(--space-3)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ fontSize: 80, marginBottom: 'var(--space-3)' }}>🌿</div>
      <h1 style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>
        404
      </h1>
      <h2 style={{ fontSize: 22, marginBottom: 'var(--space-2)' }}>
        Halaman Tidak Ditemukan
      </h2>
      <p style={{
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-4)',
        maxWidth: 400,
        lineHeight: 1.5,
      }}>
        Sepertinya halaman yang Anda cari tidak ada atau sudah dipindahkan.
        Mari kembali menjelajahi UMKM desa kami!
      </p>
      <div className="flex gap-2" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          ← Kembali ke Beranda
        </Link>
        <Link to="/umkm" className="btn btn-ghost">
          Jelajahi UMKM
        </Link>
      </div>
    </section>
  )
}
