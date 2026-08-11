const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// 1. Extract Profile/Hero text (before gallery)
const heroStart = `              {/* Profile / Hero */}`;
const heroEnd = `                  {/* Container Ambient Blur & Navigation */}`;
const heroIndex1 = code.indexOf(heroStart);
const heroIndex2 = code.indexOf(heroEnd);

const heroText = code.substring(heroIndex1, heroIndex2);
code = code.substring(0, heroIndex1) + code.substring(heroIndex2);

// 2. Extract everything from Tentang UMKM down to the end of detail-main
const sectionsStart = `              {/* Tentang UMKM (Oversized Editorial Quote) */}`;
const sectionsEnd = `            </div>\n\n            {/* KANAN: Sticky Sidebar */}`;
const secIndex1 = code.indexOf(sectionsStart);
const secIndex2 = code.indexOf(sectionsEnd);

const sectionsText = code.substring(secIndex1, secIndex2);
code = code.substring(0, secIndex1) + code.substring(secIndex2);

// 3. Insert the extracted parts into detail-sidebar, right before the sticky-sidebar ScrollReveal
const sidebarStart = `            {/* KANAN: Sticky Sidebar */}\n            <div className="detail-sidebar">\n`;
const sidebarIndex = code.indexOf(sidebarStart) + sidebarStart.length;

code = code.substring(0, sidebarIndex) + heroText + sectionsText + code.substring(sidebarIndex);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('DetailUmkm.jsx restructured successfully!');
