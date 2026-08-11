const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Extract the "Karya Lain" section
const startIndex = code.indexOf('{/* Produk Lain dari Pemilik (Cross-Selling) - FULL WIDTH */}');
const endIndex = code.indexOf('</section>', startIndex) + 10;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find Karya Lain section");
    process.exit(1);
}

let produkLainSection = code.substring(startIndex, endIndex);

// Remove the section from the bottom
code = code.substring(0, startIndex) + code.substring(endIndex);

// 2. Modify the section to fit inside the main layout
// Change text
produkLainSection = produkLainSection.replace('Karya Lain dari', 'Produk Lain dari');
produkLainSection = produkLainSection.replace('Lebih Banyak Pilihan', 'Rekomendasi Lainnya');

// Remove dark background wrapper and use normal styling
produkLainSection = produkLainSection.replace(
    /<section className="section" style=\{\{[^}]+\}\}>/,
    '<div className="detail-section" style={{ marginTop: "40px", marginBottom: "40px" }}>'
);
produkLainSection = produkLainSection.replace('</section>', '</div>');

// Remove background effects
produkLainSection = produkLainSection.replace(/<div style=\{\{ position: 'absolute', top: '-50%'.*?<\/div>/, '');
produkLainSection = produkLainSection.replace(/<div className="container" style=\{\{ position: 'relative', zIndex: 2 \}\}>/, '<div>');
// And its closing div
// We know it's the last </div> before the end of the section block (which we changed to </div> above)
// So we just replace the last </div></div> with </div></div>
// Actually, it's easier:
produkLainSection = produkLainSection.replace(/<h2 style=\{\{ fontSize: 'clamp\(28px, 5vw, 36px\)', color: '#ffffff'/, '<h2 style={{ fontSize: "20px", color: "var(--color-text)"');
produkLainSection = produkLainSection.replace(/color: '#4ade80'/g, 'color: "var(--color-primary)"');
produkLainSection = produkLainSection.replace(/backgroundColor: '#4ade80'/g, 'backgroundColor: "var(--color-primary)"');
produkLainSection = produkLainSection.replace(/boxShadow: '0 0 10px #4ade80'/g, '');

// Shrink the cards from 280-320px to something smaller like 200-240px
produkLainSection = produkLainSection.replace(/minWidth: '280px'/g, "minWidth: '200px'");
produkLainSection = produkLainSection.replace(/maxWidth: '320px'/g, "maxWidth: '240px'");
// Remove the heavy box shadow for dark background
produkLainSection = produkLainSection.replace(/boxShadow: '0 20px 40px rgba\(0,0,0,0\.4\)'/g, "boxShadow: '0 10px 20px rgba(0,0,0,0.05)'");


// 3. Insert the section below "Kisah di Balik Usaha"
const insertTarget = '{/* Di Balik Layar (Proses Pembuatan) */}';
const insertIndex = code.indexOf(insertTarget);

if (insertIndex !== -1) {
    code = code.substring(0, insertIndex) + produkLainSection + '\n\n              ' + code.substring(insertIndex);
} else {
    console.error("Could not find Di Balik Layar section to insert above");
}

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Successfully moved and restyled Produk Lain section.');
