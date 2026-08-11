import { useState } from 'react'

export default function PhotoGallery({ photos, alt = 'Foto produk' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (!photos || photos.length === 0) return null

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev + 1) % photos.length)
  }

  const goPrev = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % photos.length)
    if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((url, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            aria-label={`${alt} ${index + 1}`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
          >
            <img src={url} alt={`${alt} ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Galeri foto"
        >
          <button
            className="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Tutup galeri"
          >
            ✕
          </button>

          {photos.length > 1 && (
            <>
              <button className="gallery-lightbox-nav prev" onClick={goPrev} aria-label="Foto sebelumnya">
                ‹
              </button>
              <button className="gallery-lightbox-nav next" onClick={goNext} aria-label="Foto berikutnya">
                ›
              </button>
            </>
          )}

          <img
            src={photos[lightboxIndex]}
            alt={`${alt} ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
