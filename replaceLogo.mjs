import fs from 'fs';
import path from 'path';

const svgLogoRegex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]*>[\s]*<text x="0" y="26"[^>]*>ZROXZ<\/text>[\s]*<\/svg>/g;
const newLogoHtml = `<img src="https://i.postimg.cc/C1YbckQK/Chat-GPT-Image-Jun-19-2026-09-02-26-PM.png" alt="Zroxz Logo" style="height: 30px; width: auto; object-fit: contain;">`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'backend' || file.startsWith('.')) continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.match(svgLogoRegex)) {
                content = content.replace(svgLogoRegex, newLogoHtml);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated logo in ${fullPath}`);
            }
        }
    }
}

processDir('d:\\zroxz ui only');
