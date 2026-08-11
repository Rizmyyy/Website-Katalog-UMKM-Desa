import { useState } from 'react'

export default function ImageWithSkeleton({ src, alt, className = '', style = {}, aspectRatio, onClick, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', cursor: onClick ? 'zoom-in' : 'default', ...style }} onClick={onClick} {...props}>
      {!loaded && !error && (
        <div
          className="skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            aspectRatio: aspectRatio || undefined,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {error ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-surface-container)',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            borderRadius: 'inherit',
            aspectRatio: aspectRatio || '4/3',
            width: '100%',
            height: '100%',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${className} ${loaded ? 'img-loaded' : 'img-loading'}`}
          style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: style.objectFit || 'cover' }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}
