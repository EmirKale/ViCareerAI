const fs = require('fs');
const file = 'components/dashboard/LetterHistoryClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\|\| "Bu mektubu silmek istediğinize emin misiniz\?"/g, '');
content = content.replace(/\|\| "Mektup silindi"/g, '');
content = content.replace(/\|\| "Silme işlemi başarısız"/g, '');
content = content.replace(/\|\| "PDF hazırlanıyor\.\.\."/g, '');
content = content.replace(/\|\| "PDF indirildi!"/g, '');
content = content.replace(/\|\| "PDF oluşturulamadı\."/g, '');

content = content.replace(/return `\$\{mins\} dakika önce`;/, 'return `${mins} ${t("minsAgo")}`;');
content = content.replace(/return `\$\{hours\} saat önce`;/, 'return `${hours} ${t("hoursAgo")}`;');
content = content.replace(/return `\$\{days\} gün önce`;/, 'return `${days} ${t("daysAgo")}`;');

content = content.replace(/\|\| "YENİ MEKTUP YAZ"/g, '');
content = content.replace(/\|\| "İsimsiz Mektup"/g, '|| t("unnamedLetter")');

fs.writeFileSync(file, content);
console.log('LetterHistoryClient updated.');
