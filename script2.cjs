const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Extract "Editorial Asymmetric Grid"
const gridStart = `              {/* Editorial Asymmetric Grid */}`;
const gridEnd = `              {/* Produk & Harga (Redesigned in component later, wrapping it elegantly here) */}`;
const gridText = code.substring(code.indexOf(gridStart), code.indexOf(gridEnd));
code = code.substring(0, code.indexOf(gridStart)) + code.substring(code.indexOf(gridEnd));

// 2. Extract "Storytelling" and "Di Balik Layar"
const storyStart = `              {/* Storytelling dengan Smart Fallback */}`;
const storyEnd = `              <ScrollReveal className="sticky-sidebar">`;
const storyText = code.substring(code.indexOf(storyStart), code.indexOf(storyEnd));
code = code.substring(0, code.indexOf(storyStart)) + code.substring(code.indexOf(storyEnd));

// 3. Extract MapEmbed from inside sticky-sidebar
const mapStart = `                  {umkm.linkPeta && (\n                    <div style={{ height: 350, borderTop: '1px solid var(--color-border)', backgroundColor: '#f0f0f0' }}>\n                      <MapEmbed src={umkm.linkPeta} title={\`Lokasi \${umkm.namaUmkm}\`} height="100%" />\n                    </div>\n                  )}`;
const mapIndex = code.indexOf(mapStart);
let mapText = '';
if (mapIndex !== -1) {
  mapText = `              {/* Peta Lokasi (Moved Below) */}\n              ${mapStart}\n`;
  code = code.replace(mapStart, '');
}

// 4. Find the end of detail-layout and insert the extracted sections below it
const layoutEnd = `            </div>\n            \n          </div>\n        </div>\n      </section>`;
const insertionPoint = code.indexOf(layoutEnd);

if (insertionPoint !== -1) {
  const insertText = `            </div>\n            \n          </div>\n\n          {/* KONTEN TAMBAHAN FULL WIDTH (Di Bawah Grid Utama) */}\n          <div style={{ marginTop: '64px', maxWidth: '800px', margin: '64px auto 0' }}>\n${gridText}${storyText}${mapText}          </div>\n        </div>\n      </section>`;
  
  code = code.substring(0, insertionPoint) + insertText + code.substring(insertionPoint + layoutEnd.length);
  
  fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
  console.log('DetailUmkm.jsx refined successfully!');
} else {
  console.log('Could not find insertion point.');
}
