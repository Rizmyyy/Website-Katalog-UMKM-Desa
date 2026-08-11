import { Helmet } from 'react-helmet-async'
import { useDesa } from '@/hooks/useDesa'

export default function SEO({ title, description, image, url }) {
  const { desaInfo } = useDesa()
  const siteName = desaInfo?.identitas?.namaWeb || 'UMKM Gumelar Kidul'
  const defaultTitle = siteName
  const pageTitle = title ? `${title} — ${siteName}` : defaultTitle
  
  const defaultDescription = desaInfo?.deskripsi || 'Sistem Informasi dan Manajemen UMKM Desa.'
  const pageDescription = description || defaultDescription
  
  const defaultImage = '/logo.png' // Ganti dengan URL default gambar yang sesuai
  const pageImage = image || defaultImage
  
  const faviconUrl = '/favicon.png'

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      
      {/* Favicon Dinamis (Tanpa type agar support PNG/JPEG) */}
      <link rel="icon" href={faviconUrl} />
      <link rel="shortcut icon" href={faviconUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />
    </Helmet>
  )
}
