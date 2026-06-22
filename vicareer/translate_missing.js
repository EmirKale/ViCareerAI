const fs = require('fs');

const trPath = 'messages/tr.json';
const enPath = 'messages/en.json';

let tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

en.Interview.showResume = "Show Resume";
tr.Interview.showResume = "CV'yi Göster";

fs.writeFileSync(trPath, JSON.stringify(tr, null, 4), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(en, null, 4), 'utf8');
console.log('Added showResume translations');
