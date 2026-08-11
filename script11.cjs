const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// The block to replace:
const targetStart = '{/* Produk Lain dari Pemilik (Cross-Selling) - FULL WIDTH */}';
const targetEnd = '{/* Di Balik Layar (Proses Pembuatan) */}';
let startIndex = code.indexOf(targetStart);
let endIndex = code.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find targets");
    process.exit(1);
}

let originalBlock = code.substring(startIndex, endIndex);

let newBlock = `{/* Produk Lain dari Pemilik (Dalam Kolom) */}
      {produkPemilik && produkPemilik.length > 0 && (
        <div style={{ 
          marginTop: "40px", 
          marginBottom: "40px",
          backgroundColor: 'var(--color-primary-dark)',
          borderRadius: '24px',
          padding: '40px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ornamen Garis Diagonal Latar Belakang */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)', pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <ScrollReveal>
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 32px' }}>
                <p style={{ 
                  color: "#6ee7b7",
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase'
                }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: "#6ee7b7", borderRadius: '50%' }}></span>
                  Rekomendasi Lainnya
                </p>
                <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 900, lineHeight: 1.2, margin: 0 }}>
                  Produk Lain dari {umkm.namaPemilik}
                </h2>
              </div>
            </ScrollReveal>

            {/* Horizontal Scroll Slider for Products */}
            <ScrollReveal>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '24px',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                width: '100%',
                paddingLeft: '32px',
                paddingRight: '32px'
              }}
              className="hide-scrollbar"
              >
                <style>{\`.hide-scrollbar::-webkit-scrollbar { display: none; }\`}</style>
                
                {produkPemilik.map((item, idx) => (
                  <div key={item.id} style={{
                    minWidth: '200px',
                    maxWidth: '240px',
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    borderRadius: '24px'
                  }}>
                    <UmkmCard umkm={item} index={idx} />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      `;

code = code.substring(0, startIndex) + newBlock + code.substring(endIndex);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Successfully updated background and styling');
