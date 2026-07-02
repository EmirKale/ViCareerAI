const fs = require('fs');
const file = 'app/[locale]/(dashboard)/jobs/tracker/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace toasts
content = content.replace(/toast\.error\("Şirket adı ve Pozisyon alanları zorunludur\."\);/, 'toast.error(t("toastErrManual"));');
content = content.replace(/toast\.success\("İş ilanı başarıyla kaydedildi!"\);/, 'toast.success(t("toastSuccessManual"));');
content = content.replace(/toast\.error\("Lütfen geçerli bir iş ilanı metni veya URL girin\."\);/, 'toast.error(t("toastErrAi"));');
content = content.replace(/toast\.success\("İlan AI tarafından başarıyla analiz edildi ve kaydedildi!"\);/, 'toast.success(t("toastSuccessAi"));');

// Hardcoded UI text
content = content.replace(/<div className="peyebrow">BAŞVURU TAKİBİ<\/div>/, '<div className="peyebrow">{t("titleTop")}</div>');
content = content.replace(/<h1>Başvuru Board&apos;u<\/h1>/, '<h1>{t("title")}</h1>');
content = content.replace(/<p>Sürükle-bırak ile iş başvuru süreçlerini görsel olarak yönet\.<\/p>/, '<p>{t("desc")}</p>');
content = content.replace(/✦ AI İlan Ekle/, '{t("addAi")}');
content = content.replace(/\+ Manuel Ekle/, '{t("addManual")}');

content = content.replace(/<h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 5v14M5 12h14"\/><\/svg>Manuel İlan Ekle<\/h3>/, '<h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 5v14M5 12h14"/></svg>{t("modalManualTitle")}</h3>');
content = content.replace(/<p className="sub">Başvurmak istediğin veya takip ettiğin iş ilanının detaylarını gir\.<\/p>/, '<p className="sub">{t("modalManualDesc")}</p>');
content = content.replace(/<label>Şirket Adı \*<\/label>/, '<label>{t("companyLabel")}</label>');
content = content.replace(/placeholder="Örn: Google"/, 'placeholder={t("companyPh")}');
content = content.replace(/<label>Pozisyon \/ Rol \*<\/label>/, '<label>{t("positionLabel")}</label>');
content = content.replace(/placeholder="Örn: Frontend Developer"/, 'placeholder={t("positionPh")}');
content = content.replace(/<label>Lokasyon<\/label>/, '<label>{t("locationLabel")}</label>');
content = content.replace(/placeholder="Örn: İstanbul \/ Uzaktan"/, 'placeholder={t("locationPh")}');
content = content.replace(/<label>Uygulama Tarihi<\/label>/, '<label>{t("dateLabel")}</label>');
content = content.replace(/<label>Notlar<\/label>/, '<label>{t("notesLabel")}</label>');
content = content.replace(/placeholder="İlan detayları, mülakat notları veya önemli detaylar\.\.\."/, 'placeholder={t("notesPh")}');
content = content.replace(/>İptal<\/button>/g, '>{t("cancel")}</button>');
content = content.replace(/KAYDEDİLİYOR\.\.\./, '{t("saving")}');
content = content.replace(/\+ İlanı Kaydet/, '{t("saveBtn")}');

content = content.replace(/<h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 2l2\.5 6\.5L21 9l-5 4\.5L17\.5 21 12 17l-5\.5 4L8 13\.5 3 9l6\.5-\.5z"\/><\/svg>AI ile İlan Ekle<\/h3>/, '<h3><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>{t("modalAiTitle")}</h3>');
content = content.replace(/<p className="sub">İş ilanının URL bağlantısını veya ilan detay metnini yapıştır\. Yapay zeka şirket, pozisyon ve konum bilgilerini otomatik çıkarıp panonuza ekleyecek\.<\/p>/, '<p className="sub">{t("modalAiDesc")}</p>');
content = content.replace(/<label>İlan URL veya Detay Metni<\/label>/, '<label>{t("urlLabel")}</label>');
content = content.replace(/placeholder="Örn: linkedin\.com\/jobs\/view\/\.\.\. veya ilan açıklaması\.\.\."/, 'placeholder={t("urlPh")}');
content = content.replace(/ANALİZ EDİLİYOR\.\.\./, '{t("analyzing")}');
content = content.replace(/✦ AI ile Analiz Et & Ekle/, '{t("analyzeBtn")}');

fs.writeFileSync(file, content);
console.log('Tracker page updated.');
