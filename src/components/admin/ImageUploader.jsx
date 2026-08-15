import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'

export default function ImageUploader({ images = [], onChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const fileInputRef = useRef(null)

  const handleFiles = async (files) => {
    // Terima file gambar standar dan file heic/heif
    const fileList = Array.from(files).filter((f) => 
      f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif')
    )
    if (fileList.length === 0) return

    setIsCompressing(true)
    try {
      const compressedFiles = await Promise.all(fileList.map(async (file) => {
        try {
          let processFile = file;
          
          // Konversi HEIC ke JPEG
          if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
            const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
            processFile = new File([convertedBlob], file.name.replace(/\.heic$|\.heif$/i, '.jpg'), { type: 'image/jpeg' })
          }

          const options = {
            maxSizeMB: 0.8, // Kualitas tinggi
            maxWidthOrHeight: 1920,
            useWebWorker: true
          }
          const compressedFile = await imageCompression(processFile, options)
          
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                file: compressedFile,
                preview: URL.createObjectURL(compressedFile),
                base64: reader.result,
                isNew: true,
              })
            }
            reader.readAsDataURL(compressedFile)
          })
        } catch (error) {
          console.error('Gagal memproses gambar:', error)
          return null
        }
      }))

      const validNewImages = compressedFiles.filter(img => img !== null)
      onChange([...images, ...validNewImages])
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleInputChange = (e) => {
    handleFiles(e.target.files)
    e.target.value = '' // Reset agar file yang sama bisa dipilih lagi jika dihapus
  }

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleDragStartItem = (e, index) => {
    setDraggedIndex(index)
    // Required for Firefox
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', index)
    }
  }

  const handleDragEnterItem = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    const newImages = [...images]
    const item = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, item)
    setDraggedIndex(index)
    onChange(newImages)
  }

  const handleDragEndItem = () => {
    setDraggedIndex(null)
  }

  return (
    <div>
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onClick={() => !isCompressing && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ opacity: isCompressing ? 0.6 : 1, cursor: isCompressing ? 'wait' : 'pointer' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={isCompressing}
        />
        
        {isCompressing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
            <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' }}></div>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
            <p style={{ fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>Memproses gambar...</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Mohon tunggu sebentar</p>
          </div>
        ) : (
          <>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ margin: '0 auto 12px' }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>
              Klik atau seret foto ke sini
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Format: JPG, PNG, WebP, HEIC (maks 5MB per foto)
            </p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="upload-preview-grid">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`upload-preview-item ${draggedIndex === index ? 'dragging' : ''}`}
              draggable={!isCompressing}
              onDragStart={(e) => handleDragStartItem(e, index)}
              onDragEnter={(e) => handleDragEnterItem(e, index)}
              onDragEnd={handleDragEndItem}
              onDragOver={(e) => e.preventDefault()}
              style={{ 
                cursor: isCompressing ? 'default' : 'move', 
                opacity: draggedIndex === index ? 0.4 : 1,
                border: draggedIndex === index ? '2px dashed var(--color-primary)' : 'none'
              }}
              title="Seret untuk memindahkan urutan"
            >
              <img
                src={img.preview || img.url || img}
                alt={`Foto ${index + 1}`}
              />
              <button
                type="button"
                className="upload-preview-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                aria-label="Hapus foto"
                disabled={isCompressing}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
