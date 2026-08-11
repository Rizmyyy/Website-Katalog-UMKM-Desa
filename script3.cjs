const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

const sidebarStartStr = `            {/* KANAN: Sticky Sidebar */}\n            <div className="detail-sidebar">`;
const sidebarEndStr = `            </div>\n            \n          </div>\n\n          {/* KONTEN TAMBAHAN FULL WIDTH (Di Bawah Grid Utama) */}`;

const startIndex = code.indexOf(sidebarStartStr);
const endIndex = code.indexOf(sidebarEndStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not find sidebar boundaries.');
  process.exit(1);
}

const newSidebar = `            {/* KANAN: Sidebar UI Baru (Ala E-commerce) */}
            <div className="detail-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ScrollReveal>
                {/* 1. Seller Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#b48648', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px', boxShadow: '0 4px 10px rgba(180,134,72,0.3)' }}>
                    {umkm.namaPemilik.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>{umkm.namaPemilik}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>{umkm.alamat.split(',')[0]}</p>
                  </div>
                </div>

                {/* 2. Product Title */}
                <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1.2, margin: '0 0 16px 0', color: 'var(--color-text)' }}>
                  {umkm.namaUmkm}
                </h1>

                {/* 3. Description */}
                <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                  {umkm.deskripsiSingkat}
                </p>

                {/* 4. Table Specs (Info Utama) */}
                <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'hidden', padding: '0', marginBottom: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '16px', color: 'var(--color-text-secondary)', width: '40%' }}>Kategori</td>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text)' }}>{umkm.kategori}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>Alamat Lengkap</td>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text)' }}>{umkm.alamat}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>Kontak</td>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text)' }}>+{umkm.kontakWhatsapp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Daftar Harga Asli */}
                {umkm.daftarHarga && umkm.daftarHarga.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Daftar Harga & Layanan</h2>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-border)' }}>
                      <PriceTable items={umkm.daftarHarga} />
                    </div>
                  </div>
                )}

                {/* 5. Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a
                    href={\`https://wa.me/\${umkm.kontakWhatsapp}?text=\${encodeURIComponent(waMessage)}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '12px', backgroundColor: '#348e58', border: 'none', fontSize: '16px', fontWeight: 700, color: 'white', boxShadow: '0 4px 12px rgba(52, 142, 88, 0.3)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Pesan via WhatsApp
                  </a>
                  <button style={{ padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Simpan
                  </button>
                </div>
              </ScrollReveal>\n`;

code = code.substring(0, startIndex) + newSidebar + code.substring(endIndex);

// Also fix the bottom container to be full width
code = code.replace(
  `<div style={{ marginTop: '64px', maxWidth: '800px', margin: '64px auto 0' }}>`,
  `<div style={{ marginTop: '64px' }}>`
);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Sidebar UI redesign complete!');
