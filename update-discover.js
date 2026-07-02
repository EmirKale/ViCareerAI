const fs = require('fs');
const file = 'app/[locale]/(dashboard)/jobs/discover/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"AWS S3 ve EC2 hakkında temel seviye bilgi edin\."/, 't("mockRec1")');
content = content.replace(/"Frontend testing için Jest dökümantasyonunu incele\."/, 't("mockRec2")');

fs.writeFileSync(file, content);
console.log('Discover page updated.');
