const fs = require('fs');
const path = require('path');

const OLD_PATH = '/admin';
const NEW_PATH = '/panel-rahasia-gkidul';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && /\.(jsx|js)$/.test(file)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Replace /admin with /panel-rahasia-gkidul
            // Need to be careful to match it exactly in strings or URLs
            // E.g. '/admin/dashboard' -> '/panel-rahasia-gkidul/dashboard'
            // E.g. '/admin' -> '/panel-rahasia-gkidul'
            const newContent = content.replace(/'\/admin(\/|')/g, (match, p1) => {
                return `'${NEW_PATH}${p1}`;
            }).replace(/"\/admin(\/|")/g, (match, p1) => {
                return `"${NEW_PATH}${p1}`;
            }).replace(/`\/admin(\/|`)/g, (match, p1) => {
                return `\`${NEW_PATH}${p1}`;
            });

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done.');
