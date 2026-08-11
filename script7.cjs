const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Add useRef to the react import
if (code.includes('import { useEffect, useState, useMemo } from \'react\'')) {
  code = code.replace(
    'import { useEffect, useState, useMemo } from \'react\'',
    'import { useEffect, useState, useMemo, useRef } from \'react\''
  );
}

// 2. Insert IntersectionObserver logic
const hookInsertionPoint = `  const [activeImage, setActiveImage] = useState(null)`;
const hooksLogic = `  const [activeImage, setActiveImage] = useState(null)
  
  // State for Sticky Bottom Bar
  const waRef = useRef(null)
  const [isWaVisible, setIsWaVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsWaVisible(entry.isIntersecting)
    }, { threshold: 0 })

    if (waRef.current) {
      observer.observe(waRef.current)
    }
    return () => observer.disconnect()
  }, [])`;
code = code.replace(hookInsertionPoint, hooksLogic);

// 3. Attach ref to the WA button container and remove old sticky CSS
const waContainerTarget = `{/* Tombol Pesan (UX Asli) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  overflow: 'hidden',
                  position: 'sticky',
                  bottom: '24px',
                  zIndex: 50,
                  marginTop: 'auto'
                }}>`;
const newWaContainer = `{/* Tombol Pesan (UX Asli) */}
                <div ref={waRef} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: 'auto'
                }}>`;
code = code.replace(waContainerTarget, newWaContainer);

// 4. Inject Bottom Bar JSX at the end, and optionally remove WhatsAppFloat
const bottomBarJSX = `
      {/* E-commerce Sticky Bottom Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        padding: '16px 24px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        zIndex: 100,
        transform: isWaVisible ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isWaVisible ? 0 : 1,
        pointerEvents: isWaVisible ? 'none' : 'auto'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={umkm.fotoUtama} alt={umkm.namaUmkm} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'none' /* hidden on very small mobile if needed, but flex will handle it */ }} className="hide-on-mobile">
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{umkm.namaUmkm}</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: 800, margin: 0 }}>
              Rp {umkm.daftarHarga && umkm.daftarHarga.length > 0 ? Number(umkm.daftarHarga[0].harga).toLocaleString('id-ID') : '-'}
            </p>
          </div>
        </div>
        <a
          href={\`https://wa.me/\${umkm.kontakWhatsapp}?text=\${encodeURIComponent(waMessage)}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '12px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #15803d)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px', boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pesan Sekarang
        </a>
      </div>

      {/* Hide Floating WhatsApp circle if Bottom Bar is active */}
      {!isWaVisible ? null : <WhatsAppFloat phoneNumber={umkm.kontakWhatsapp} message={waMessage} />}
    </>
  )
}
`;

const fileEndTarget = `      {/* Floating WhatsApp */}
      <WhatsAppFloat phoneNumber={umkm.kontakWhatsapp} message={waMessage} />
    </>
  )
}`;

code = code.replace(fileEndTarget, bottomBarJSX);

// Add a quick mobile utility class for the bottom bar
if (!code.includes('@media (max-width: 600px) { .hide-on-mobile')) {
  const cssInjection = `
  <style>{\`
    @media (max-width: 600px) {
      .hide-on-mobile { display: none !important; }
    }
  \`}</style>
`;
  code = code.replace('<SEO', cssInjection + '  <SEO');
}

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Sticky Bottom Bar implemented!');
