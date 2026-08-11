const fs = require('fs');

let code = fs.readFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', 'utf8');

// Compress Price margin
code = code.replace(
  "marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)'",
  "marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)'"
);

// Compress Description margin
code = code.replace(
  "marginBottom: '20px', fontWeight: 400 }}>",
  "marginBottom: '16px', fontWeight: 400 }}>"
);

// Compress Price Table margins
code = code.replace(
  "marginBottom: '24px' }}>",
  "marginBottom: '16px' }}>"
);
code = code.replace(
  "padding: '16px', border: '1px solid rgba(0,0,0,0.05)'",
  "padding: '12px', border: '1px solid rgba(0,0,0,0.05)'"
);
code = code.replace(
  "gap: '8px', marginBottom: '16px' }}>",
  "gap: '8px', marginBottom: '12px' }}>"
);

// Compress WA Box
code = code.replace(
  "padding: '24px'\n                }}>",
  "padding: '16px'\n                }}>"
);
code = code.replace(
  "margin: '0 0 8px 0' }}>",
  "margin: '0 0 4px 0' }}>"
);
code = code.replace(
  "margin: '0 0 20px 0', lineHeight: 1.5 }}>",
  "margin: '0 0 12px 0', lineHeight: 1.4, fontSize: '13px' }}>"
);
code = code.replace(
  "padding: '14px',",
  "padding: '12px',"
);

// Re-add marginTop: auto to WA box so IF it is shorter, it docks to the bottom.
// Wait, the user's issue is it's too long! But just in case we shrunk it enough,
// we want it to align perfectly with the bottom of the left image.
// And since they said "skip UX ini", they don't want sticky. They just want it aligned at the bottom!
code = code.replace(
  "padding: '16px'\n                }}>",
  "padding: '16px',\n                  marginTop: 'auto'\n                }}>"
);

fs.writeFileSync('c:/laragon/www/umkmbaruu2/src/pages/DetailUmkm.jsx', code, 'utf8');
console.log('Compressed margins and added marginTop auto');
