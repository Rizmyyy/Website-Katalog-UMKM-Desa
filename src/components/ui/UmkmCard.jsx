import { Link } from 'react-router-dom'
import ImageWithSkeleton from './ImageWithSkeleton'
import Badge from './Badge'

export default function UmkmCard({ umkm, index = 0 }) {
  const kategoriLabel = {
    kuliner: 'Kuliner',
    kerajinan: 'Kerajinan',
    pertanian: 'Pertanian',
  }

  return (
    <Link to={`/umkm/${umkm.id}`} className="card-overlay" id={`umkm-card-${umkm.id}`}>
      {/* Gambar Latar */}
      <ImageWithSkeleton
        src={umkm.fotoUtama}
        alt={umkm.namaUmkm}
        className="card-img-overlay"
        aspectRatio="4/5"
      />
      
      {/* Efek Gradien Gelap */}
      <div className="card-overlay-gradient" />

      {/* Badges Kategori / Unggulan di Pojok Atas */}
      <div className="card-badges-top">
        <Badge variant="primary" style={{ padding: '4px 10px', backgroundColor: '#1f2937', color: '#fff', borderColor: '#374151' }}>
          {kategoriLabel[umkm.kategori] || umkm.kategori}
        </Badge>
        {umkm.isFeatured && (
          <Badge variant="featured" style={{ padding: '4px 10px' }}>
            ★ Unggulan
          </Badge>
        )}
      </div>

      {/* Info Teks di Bawah (Melayang di atas gambar) */}
      <div className="card-overlay-content">
        <h3 className="card-overlay-title">{umkm.namaUmkm}</h3>
        <p className="card-overlay-owner">oleh {umkm.namaPemilik}</p>
        <p className="card-overlay-desc">{umkm.deskripsiSingkat}</p>
      </div>
    </Link>
  )
}
