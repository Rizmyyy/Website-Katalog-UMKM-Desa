const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

const targetStart = '{/* Di Balik Layar (Proses Pembuatan) */}';
const targetEnd = '{/* UMKM Lain yang Mungkin Anda Suka */}';

let startIndex = code.indexOf(targetStart);
let endIndex = code.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find targets");
    process.exit(1);
}

// We also need to preserve the closing tags that appear before "UMKM Lain"
// Let's look at the original code around endIndex:
//           </div>
//         </div>
//       </section>
//
//       {/* UMKM Lain yang Mungkin Anda Suka */}

let replacement = `              {/* Seksi Gabungan: Di Balik Layar & Peta Lokasi */}
              <ScrollReveal>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                  gap: '32px', 
                  marginTop: '16px',
                  marginBottom: '16px',
                  padding: '32px',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  
                  {/* Kolom Kiri: Di Balik Layar */}
                  {umkm.fotoProses && umkm.fotoProses.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Di Balik Layar</h2>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                        Intip proses pembuatan produk ini langsung dari dapur produksi {umkm.namaUmkm}.
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px'
                      }}>
                        {umkm.fotoProses.map((foto, idx) => (
                          <div key={idx} style={{ 
                            borderRadius: '12px', overflow: 'hidden', 
                            aspectRatio: '1/1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            <img 
                              src={foto} 
                              alt={\`Proses pembuatan \${umkm.namaUmkm} \${idx + 1}\`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kolom Kanan: Peta Lokasi */}
                  {umkm.linkPeta && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Lokasi Usaha</h2>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                        Kunjungi lokasi produksi kami secara langsung di peta berikut.
                      </p>
                      <div style={{ 
                        flex: 1, 
                        minHeight: '240px',
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <MapEmbed src={umkm.linkPeta} title={\`Lokasi \${umkm.namaUmkm}\`} height="100%" />
                      </div>
                    </div>
                  )}

                </div>
              </ScrollReveal>
          </div>
        </div>
      </section>

      `;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Successfully combined Di Balik Layar and Maps into a 2-column layout.');
