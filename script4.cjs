const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Change Image aspectRatio from 16/9 to 1/1
code = code.replace(`aspectRatio: '16/9'`, `aspectRatio: '1/1'`);
code = code.replace(`aspectRatio: "16/9"`, `aspectRatio: '1/1'`);

// 2. Replace the detail-sidebar with the new clean layout requested by the user
const sidebarStartStr = `            {/* KANAN: Sidebar UI Baru (Ala E-commerce) */}`;
const sidebarEndStr = `            </div>\n            \n          </div>\n\n          {/* KONTEN TAMBAHAN FULL WIDTH (Di Bawah Grid Utama) */}`;

const startIndex = code.indexOf(sidebarStartStr);
const endIndex = code.indexOf(sidebarEndStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not find sidebar boundaries.');
  process.exit(1);
}

const newSidebar = `            {/* KANAN: Sidebar UI Bersih & Konsisten */}
            <div className="detail-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ScrollReveal>
                
                {/* Judul Produk */}
                <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1.2, margin: '0 0 12px 0', color: 'var(--color-text)' }}>
                  {umkm.namaUmkm}
                </h1>

                {/* Harga Besar (Ambil dari daftar harga pertama jika ada) */}
                {umkm.daftarHarga && umkm.daftarHarga.length > 0 && (
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '24px' }}>
                    {umkm.daftarHarga.length > 1 ? 'Mulai dari ' : ''}
                    Rp {Number(umkm.daftarHarga[0].harga).toLocaleString('id-ID')}
                  </div>
                )}
                
                {/* Deskripsi Produk */}
                <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
                  {umkm.deskripsiSingkat}
                </p>

                {/* Kotak Keterangan (Daftar Harga & Layanan) */}
                {umkm.daftarHarga && umkm.daftarHarga.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--color-text)' }}>Daftar Layanan & Harga</h3>
                      <PriceTable items={umkm.daftarHarga} />
                    </div>
                  </div>
                )}

                {/* Tombol Pesan (UX Asli) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
                      Tertarik dengan {umkm.namaUmkm}?
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                      Hubungi pemilik usaha sekarang juga untuk memesan atau bertanya lebih lanjut.
                    </p>
                    <a
                      href={\`https://wa.me/\${umkm.kontakWhatsapp}?text=\${encodeURIComponent(waMessage)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: 15, padding: '14px 20px', borderRadius: '12px', backgroundColor: '#22c55e', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
console.log('Sidebar UI redesign complete (Reverted back to clean aesthetic)!');
