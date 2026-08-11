const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

const sidebarStartStr = `            {/* KANAN: Sidebar UI Bersih & Elegan */}`;
const sidebarEndStr = `            </div>\n            \n          </div>\n\n          {/* KONTEN TAMBAHAN FULL WIDTH (Di Bawah Grid Utama) */}`;

const startIndex = code.indexOf(sidebarStartStr);
const endIndex = code.indexOf(sidebarEndStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not find sidebar boundaries.');
  process.exit(1);
}

const newSidebar = `            {/* KANAN: Sidebar UI Bersih & Elegan (Lebih Kompak & Berdimensi) */}
            <div className="detail-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ScrollReveal>
                
                {/* Badge Eksklusif & Judul */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(180, 134, 72, 0.1)', color: 'var(--color-primary-dark)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '100px', marginBottom: '12px', border: '1px solid rgba(180, 134, 72, 0.2)', boxShadow: '0 2px 8px rgba(180,134,72,0.1)' }}>
                    {umkm.kategori} Unggulan
                  </span>
                  <h1 className="heading-1" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2, margin: 0, color: 'var(--color-text)', letterSpacing: '-0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {umkm.namaUmkm}
                  </h1>
                </div>

                {/* Harga Premium */}
                {umkm.daftarHarga && umkm.daftarHarga.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {umkm.daftarHarga.length > 1 && (
                      <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Mulai dari</span>
                    )}
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary-dark)', letterSpacing: '-0.03em', textShadow: '0 2px 4px rgba(180,134,72,0.15)' }}>
                      Rp {Number(umkm.daftarHarga[0].harga).toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
                
                {/* Deskripsi Produk */}
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', fontWeight: 400 }}>
                  {umkm.deskripsiSingkat}
                </p>

                {/* Kotak Keterangan (Daftar Harga & Layanan) */}
                {umkm.daftarHarga && umkm.daftarHarga.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 2px 4px rgba(180,134,72,0.4)' }}></div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daftar Layanan & Harga</h3>
                      </div>
                      <PriceTable items={umkm.daftarHarga} />
                    </div>
                  </div>
                )}

                {/* Tombol Pesan (UX Asli) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: 'auto'
                }}>
                  {/* Efek gradien tipis di background kartu */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}></div>
                  
                  <div style={{ padding: '20px 20px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
                      Tertarik memesan?
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                      Hubungi pemilik usaha sekarang juga untuk memesan atau bertanya detail.
                    </p>
                    <a
                      href={\`https://wa.me/\${umkm.kontakWhatsapp}?text=\${encodeURIComponent(waMessage)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: 15, padding: '14px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #15803d)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)', transition: 'all 0.3s', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat WhatsApp
                    </a>
                  </div>
                </div>

              </ScrollReveal>\n`;

code = code.substring(0, startIndex) + newSidebar + code.substring(endIndex);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Sidebar made compact and 3D!');
