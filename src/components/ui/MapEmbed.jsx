export default function MapEmbed({ src, title = 'Lokasi di peta', height = '350px' }) {
  if (!src) return null

  return (
    <div className="map-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={src}
        title={title}
        style={{ height: '100%', flex: 1, border: 'none' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}
