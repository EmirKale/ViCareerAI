const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let changedCorners = 0;

function processFile(file) {
    if (!file.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace corners
    const oldSvg = `<svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M6,15 L6,6 L15,6"/><path d="M85,6 L94,6 L94,15"/><path d="M94,85 L94,94 L85,94"/><path d="M15,94 L6,94 L6,85"/></svg>`;
    const newSvg = `<svg className="corners" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M2,12 L2,2 L12,2"/><path d="M88,2 L98,2 L98,12"/><path d="M98,88 L98,98 L88,98"/><path d="M12,98 L2,98 L2,88"/></svg>`;
    
    if (content.includes(oldSvg)) {
        content = content.split(oldSvg).join(newSvg);
        changedCorners++;
    }

    if (file.includes('discover') && content.includes('class="dline"')) {
        content = content.replace('class="dline"', 'className="dline"');
        content = content.replace('class="dline"', 'className="dline"'); // it might have two
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
    }
}

const dirsToScan = ['app/[locale]/(dashboard)', 'components/dashboard'];

dirsToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkDir(dir, processFile);
    }
});

console.log('Fixed corners in ' + changedCorners + ' locations.');

// Fix globals.css for black icons
const globalsPath = 'app/[locale]/globals.css';
if (fs.existsSync(globalsPath)) {
    let globalsCSS = fs.readFileSync(globalsPath, 'utf8');
    if (!globalsCSS.includes('.icon {')) {
        globalsCSS += `\n/* Fix black SVG icons */\n.icon {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n`;
        fs.writeFileSync(globalsPath, globalsCSS, 'utf8');
        console.log('Added .icon global styles to globals.css');
    }
}
