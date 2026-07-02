const fs = require('fs');
const file = 'app/[locale]/(dashboard)/cover-letter/new/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'import { useSearchParams, useRouter } from "next/navigation";',
    'import { useSearchParams, useRouter } from "next/navigation";\nimport { useTranslations, useLocale } from "next-intl";'
);

content = content.replace(
    'export default function NewCoverLetterPage() {',
    'export default function NewCoverLetterPage() {\n    const t = useTranslations("CoverLetter");\n    const locale = useLocale();'
);

content = content.replace('language: "tr",', 'language: locale === "tr" ? "tr" : "en",');
content = content.replace('language: data.language || "tr",', 'language: data.language || (locale === "tr" ? "tr" : "en"),');

content = content.replace(/toast\.error\("Mektup yüklenemedi\."\);/, 'toast.error(t("toastErrGeneral"));');
content = content.replace(/toast\.error\("Lütfen en azından pozisyon ve şirket adını girin\."\);/, 'toast.error(t("toastErrFill"));');
content = content.replace(/toast\.error\(data\.error \|\| "Cover letter limitinize ulaştınız\."\);/, 'toast.error(data.error || t("toastErrQuota"));');
content = content.replace(/toast\.error\(data\.error \|\| "Bir hata oluştu\."\);/, 'toast.error(data.error || t("toastErrGeneral"));');
content = content.replace(/toast\.success\("Mektup başarıyla oluşturuldu ve otomatik kaydedildi!"\);/, 'toast.success(t("toastSuccess"));');
content = content.replace(/toast\.success\("Mektup panoya kopyalandı!"\);/, 'toast.success(t("toastCopied"));');
content = content.replace(/toast\.info\("PDF hazırlanıyor, lütfen bekleyin\.\.\."\);/, 'toast.info(t("toastPdfPrep"));');
content = content.replace(/toast\.success\("PDF başarıyla indirildi!"\);/, 'toast.success(t("toastPdfDone"));');
content = content.replace(/toast\.error\("PDF oluşturulurken hata oluştu\."\);/, 'toast.error(t("toastPdfErr"));');
content = content.replace(/toast\.info\("Giriş yapmadığınız için çalışmalarınız tarayıcıda geçici tutulmaktadır\."\);/, 'toast.info(t("toastSaveUnauth"));');
content = content.replace(/toast\.error\(data\.error \|\| "Mektup kaydedilemedi\."\);/, 'toast.error(data.error || t("toastSaveErr"));');
content = content.replace(/toast\.success\("Mektup başarıyla güncellendi!"\);/, 'toast.success(t("toastSaveSuccess"));');
content = content.replace(/toast\.error\("Kaydetme işlemi sırasında hata oluştu\."\);/, 'toast.error(t("toastSaveFail"));');

content = content.replace(/<div className="peyebrow">MOTİVASYON MEKTUBU<\/div>/, '<div className="peyebrow">{t("title")}</div>');
content = content.replace(/<h1>GPT-4o ile dakikalar içinde mektup yaz<\/h1>/, '<h1>{t("heroTitle")}</h1>');
content = content.replace(/<p>Kişiselleştirilmiş ve ATS uyumlu mektubunu oluştur\.<\/p>/, '<p>{t("heroDesc")}</p>');
content = content.replace(/MEKTUP KOTASI <span className="val">/, '{t("quotaLabel")} <span className="val">');
content = content.replace(/PRO&apos;YA GEÇ/g, '{t("goPro")}');
content = content.replace(/<h3 style={{ marginBottom: '22px' }}>Mektup Bilgileri<\/h3>/, "<h3 style={{ marginBottom: '22px' }}>{t('letterInfo')}</h3>");
content = content.replace(/<label>Hedef Pozisyon \*<\/label>/, '<label>{t("position")}</label>');
content = content.replace(/placeholder="Örn: Senior Frontend Developer"/, 'placeholder={t("positionPh")}');
content = content.replace(/<label>Şirket Adı \*<\/label>/, '<label>{t("company")}</label>');
content = content.replace(/placeholder="Örn: Google Türkiye"/, 'placeholder={t("companyPh")}');
content = content.replace(/<label>Sektör \(isteğe bağlı\)<\/label>/, '<label>{t("industry")}</label>');
content = content.replace(/placeholder="Örn: Teknoloji, Finans, E-ticaret"/, 'placeholder={t("industryPh")}');
content = content.replace(/<label>Dil<\/label>/, '<label>{t("language")}</label>');
content = content.replace(/<label>Ton \/ Üslup<\/label>/, '<label>{t("tone")}</label>');
content = content.replace(/>Profesyonel</, '>{t("professional")}<');
content = content.replace(/>Samimi</, '>{t("friendly")}<');
content = content.replace(/>Özgüvenli</, '>{t("confident")}<');
content = content.replace(/>Yaratıcı</, '>{t("creative")}<');
content = content.replace(/<label>Hakkında Notlar <span style={{ textTransform: 'none', color: 'var\(--dashboard-text-dim\)' }}>\(AI bu bilgileri kullanır\)<\/span><\/label>/, '<label>{t("notes")} <span style={{ textTransform: "none", color: "var(--dashboard-text-dim)" }}>{t("notesSub")}</span></label>');
content = content.replace(/placeholder="Örn: 5 yıl React deneyimi, startup çıkışlı, Agile ekiplerde çalıştım\.\.\."/, 'placeholder={t("notesPh")}');
content = content.replace(/Mektup Oluşturuluyor\.\.\./, '{t("generating")}');
content = content.replace(/Limit Doldu - Pro&apos;ya Geçin/, '{t("limitReached")}');
content = content.replace(/✦ YAPAY ZEKA İLE OLUŞTUR/, '✦ {t("generateBtn")}');
content = content.replace(/<h3 style={{ margin: 0 }}>Oluşturulan Mektup<\/h3>/, '<h3 style={{ margin: 0 }}>{t("outputTitle")}</h3>');
content = content.replace(/✓ AI tarafından oluşturuldu/, '{t("generatedByAI")}');
content = content.replace(/<div className="o-title">Mektubun burada görünecek<\/div>/, '<div className="o-title">{t("emptyOutputTitle")}</div>');
content = content.replace(/<div className="o-sub">Bilgileri doldurup yapay zekayı çalıştır\.<\/div>/, '<div className="o-sub">{t("emptyOutputDesc")}</div>');
content = content.replace(/<div className="o-title">AI mektubunuzu yazıyor\.\.\.<\/div>/, '<div className="o-title">{t("aiWorkingTitle")}</div>');
content = content.replace(/<div className="o-sub">Bu işlem 5-15 saniye sürebilir<\/div>/, '<div className="o-sub">{t("aiWorkingDesc")}</div>');
content = content.replace(/Kopyala<\/button>/, '{t("copy")}</button>');
content = content.replace(/Kaydet\n/, '{t("save")}\n');
content = content.replace(/PDF İndir<\/button>/, '{t("downloadPDF")}</button>');

fs.writeFileSync(file, content);
console.log('CoverLetter page updated.');
