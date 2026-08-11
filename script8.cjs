const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Remove IntersectionObserver hook logic
const hooksLogicRegex = /  \/\/ State for Sticky Bottom Bar[\s\S]*?}, \[\]\)/;
code = code.replace(hooksLogicRegex, '');

// 2. Remove bottom bar JSX
const bottomBarJSXRegex = /      \{\/\* E-commerce Sticky Bottom Bar \*\/\}[\s\S]*?      \{\/\* Hide Floating WhatsApp circle if Bottom Bar is active \*\/\}[\s\S]*?\{!isWaVisible \? null : <WhatsAppFloat phoneNumber=\{umkm\.kontakWhatsapp\} message=\{waMessage\} \/>\}/;
code = code.replace(bottomBarJSXRegex, '      {/* Floating WhatsApp */}\n      <WhatsAppFloat phoneNumber={umkm.kontakWhatsapp} message={waMessage} />');

// 3. Replace the WA Box with the exact design from the screenshot and make it sticky
const waContainerTargetRegex = /                \{\/\* Tombol Pesan \(UX Asli\) \*\/\}[\s\S]*?                <\/div>/;

const exactWaBoxDesign = `                {/* Tombol Pesan (Desain Sesuai Gambar & Sticky) */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderTop: '4px solid #22c55e',
                  padding: '24px',
                  position: 'sticky',
                  top: '24px',
                  bottom: '24px',
                  zIndex: 50,
                  marginTop: 'auto'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 8px 0' }}>
                    Tertarik memesan?
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                    Hubungi pemilik usaha sekarang juga untuk memesan atau bertanya detail.
                  </p>
                  <a
                    href={\`https://wa.me/\${umkm.kontakWhatsapp}?text=\${encodeURIComponent(waMessage)}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      borderRadius: '8px', 
                      backgroundColor: '#1da851', 
                      border: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '15px',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat WhatsApp
                  </a>
                </div>`;

code = code.replace(waContainerTargetRegex, exactWaBoxDesign);

// 4. Ensure detail-sidebar has flex so marginTop auto works, but allow sticky to work
// We previously added style={{ display: 'flex', flexDirection: 'column', height: '100%' }} to ScrollReveal.
// Let's make sure it's there.
code = code.replace('<ScrollReveal>', `<ScrollReveal style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>`);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Reverted to exact WA box design with sticky!');
