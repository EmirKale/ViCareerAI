# CareerAI — Product Requirements Document (PRD)

> **Versiyon:** 1.0  
> **Tarih:** Şubat 2026  
> **Durum:** Geliştirmeye Hazır

---

## 1. Ürün Özeti

CareerAI, iş arayanların CV oluşturmasını, motivasyon mektubu yazmasını ve kendine uygun iş ilanlarını keşfetmesini sağlayan yapay zeka destekli bir web uygulamasıdır. Kullanıcılar uygulamayı ücretsiz kullanabilir; gelişmiş özelliklere erişmek için Pro plana geçiş yapabilir.

### Hedef Kullanıcı

- Profesyonel bir CV oluşturmak isteyen iş arayanlar
- İş başvurusu için motivasyon mektubu yazmak isteyen kullanıcılar
- "Hangi işe başvurmalıyım?" sorusuna yanıt arayan kariyer değiştiriciler ve mezunlar

---

## 2. Fiyatlandırma Modeli

### Free (Ücretsiz)
- Ayda **2 CV** oluşturma
- Ayda **2 motivasyon mektubu** oluşturma
- **3 temel şablon** erişimi
- **5 iş ilanı analizi** (manuel ekleme)
- Temel iş önerileri

### Pro (Ücretli)
- **Aylık:** $9.99 / ay
- **Yıllık:** $79.99 / yıl (~%33 indirim)
- **İçerik:** Sınırsız CV, motivasyon mektubu, iş analizi
- Tüm şablonlara erişim
- LinkedIn'den otomatik içerik çekme
- Gelişmiş ATS skoru ve optimizasyon
- Dış kaynaklardan iş ilanı çekme (LinkedIn, Indeed)
- Skill gap analizi
- Öncelikli destek

> **Uygulama Notu:** Ödeme altyapısı için **Stripe** kullanılacak. Yıllık plan checkout sırasında vurgulansın, varsayılan seçenek olsun.

---

## 3. Teknik Stack (Önerilen)

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SEO, SSR, modern React ekosistemi |
| Styling | Tailwind CSS + shadcn/ui | Hızlı geliştirme, tutarlı UI |
| Backend | Next.js API Routes (serverless) | Ayrı backend gerektirmez, maliyet düşük |
| Veritabanı | PostgreSQL via **Supabase** | Auth + DB tek pakette, ücretsiz tier yeterli |
| Authentication | Supabase Auth | Google OAuth + Email/Password hazır |
| AI | OpenAI GPT-4o API | CV içerik önerisi, mektup üretimi, iş analizi |
| PDF Export | `react-pdf` / `@react-pdf/renderer` | Client-side PDF, şablon esnekliği |
| Job Data | LinkedIn API + Indeed Publisher API | Dış ilan çekme |
| Hosting | **Vercel** (frontend + API) + Supabase | Ücretsiz başlangıç, kolay scale |
| Payments | **Stripe** | Abonelik yönetimi |
| i18n | `next-intl` | TR/EN çoklu dil desteği |

---

## 4. Uygulama Mimarisi

```
/app
  /(auth)
    /login
    /register
    /callback          ← Google OAuth redirect
  /(dashboard)
    /dashboard         ← Ana sayfa özeti
    /cv
      /new             ← Yeni CV oluştur
      /[id]/edit       ← CV düzenle
      /history         ← Kaydedilmiş CV'ler
    /cover-letter
      /new             ← Yeni mektup oluştur
      /[id]/edit
    /jobs
      /discover        ← AI önerileri + dış kaynaklar
      /[id]/analyze    ← İlan analizi
      /tracker         ← Başvuru takip listesi
    /profile           ← Profil & Ayarlar
  /pricing             ← Fiyatlandırma sayfası (public)
  /landing             ← Landing page (public)
```

---

## 5. Kimlik Doğrulama & Kullanıcı Yönetimi

### Giriş Yöntemleri
- **Google OAuth** (tek tıkla giriş)
- **E-posta + Şifre** (doğrulama e-postası gönderilir)

### Kullanıcı Veri Modeli (Supabase)

```sql
users (Supabase Auth tarafından yönetilir)
  - id (uuid)
  - email
  - created_at

profiles
  - id (uuid, FK → users.id)
  - full_name
  - plan: enum('free', 'pro')
  - plan_expires_at (timestamp, nullable)
  - stripe_customer_id
  - preferred_language: enum('tr', 'en')
  - created_at
  - updated_at
```

### Oturum Yönetimi
- JWT tabanlı (Supabase Auth)
- Refresh token otomatik yönetimi
- Oturum süresi: 7 gün (yenilenebilir)

---

## 6. Özellik Detayları

### 6.1 CV Oluşturucu

#### 6.1.1 LinkedIn'den Otomatik İçerik Çekme
- Kullanıcı LinkedIn profil URL'sini yapıştırır
- Sistem LinkedIn API (veya kullanıcıdan indirilen LinkedIn veri dosyası .zip) ile profil verisini ayrıştırır
- Deneyim, eğitim, beceriler otomatik doldurulur
- Kullanıcı çekilen veriyi onaylar / düzenler

> **Not:** LinkedIn API kısıtlamaları nedeniyle alternatif olarak kullanıcının LinkedIn'den indirdiği `data export` ZIP dosyasını yüklemesi de desteklenebilir. Her iki yöntem sunulacak.

#### 6.1.2 Şablonlar
Minimum **6 şablon** (3 ücretsiz, 3 Pro):

| Şablon Adı | Tier | Açıklama |
|---|---|---|
| Classic | Free | Tek sütun, kurumsal |
| Modern | Free | İki sütun, renkli başlık |
| Minimal | Free | Temiz, beyaz ağırlıklı |
| Executive | Pro | Premium kurumsal |
| Creative | Pro | Tasarım odaklı meslekler için |
| Tech | Pro | Yazılımcılar için, skills ön planda |

#### 6.1.3 CV Bölümleri (Sürükle-Bırak Sıralama)
- Kişisel Bilgiler (isim, iletişim, LinkedIn, GitHub, website)
- Özet / Profil (AI önerisi ile)
- İş Deneyimi (şirket, pozisyon, tarih, görev maddeleri — AI ile madde önerisi)
- Eğitim
- Beceriler (seviye göstergesi ile)
- Projeler
- Sertifikalar & Kurslar
- Diller
- Gönüllülük / Hobiler (opsiyonel)

#### 6.1.4 AI İçerik Önerisi
- Her bölümde "✨ AI ile İyileştir" butonu
- Kullanıcının yazdığı ham metni alır, GPT-4o ile profesyonelleştirir
- Alternatif 3 versiyon sunar, kullanıcı birini seçer
- "Pozisyona Göre Özelleştir" modu: kullanıcı hedef iş unvanını girer, içerik o pozisyona göre optimize edilir

#### 6.1.5 ATS Uyumlu PDF Çıktısı
- Gerçek zamanlı önizleme (sağ panel)
- Tek tıkla PDF indirme
- ATS Skoru göstergesi (0-100): anahtar kelime yoğunluğu, format temizliği, bölüm eksiksizliği
- ATS skoru düşükse iyileştirme önerileri listelenir

#### 6.1.6 Kayıt & Versiyon
- Her CV kaydedilir, tekrar düzenlenebilir
- CV versiyonlama: aynı CV'nin farklı versiyonları (farklı pozisyonlar için özelleştirilmiş)

---

### 6.2 Motivasyon Mektubu Oluşturucu

#### Akış
1. Kullanıcı hedef pozisyonu ve şirket adını girer
2. İlan metnini yapıştırır (opsiyonel ama önerilir)
3. Ton seçer: **Formal / Dengeli / Samimi**
4. Dil seçer: **Türkçe / İngilizce**
5. "Oluştur" butonuna basar
6. AI, kullanıcının CV verisini + ilan metnini + tonu birleştirerek kişiselleştirilmiş mektup üretir
7. Kullanıcı inline düzenleme yapabilir (rich text editor)
8. PDF veya `.docx` olarak indirir

#### Mektup Yapısı (AI tarafından otomatik)
- Açılış (dikkat çekici, pozisyona özel)
- Neden bu şirket / pozisyon (şirkete özel detay)
- Neden ben (CV'den alınan güçlü deneyimler)
- Kapanış (aksiyon çağrısı)

#### Kayıt
- Oluşturulan mektuplar kaydedilir
- Kullanıcı geçmiş mektuplara erişebilir, kopyalayabilir

---

### 6.3 İş Eşleştirme & Analiz

#### 6.3.1 Manuel İlan Ekleme & Analiz
- Kullanıcı iş ilanı URL'si veya metnini yapıştırır
- Sistem ilanı ayrıştırır: pozisyon, şirket, gereksinimler, beceriler
- CV ile karşılaştırılır:
  - **Eşleşme Skoru** (0-100%)
  - **Güçlü Yönler:** İlanda aranan ve kullanıcıda olan beceriler
  - **Eksik Beceriler (Skill Gap):** İlanda aranan ama kullanıcıda olmayan
  - **Öğrenme Önerisi:** Eksik beceriler için kurs/kaynak önerisi (Coursera, Udemy, YouTube)
- "Bu İlan İçin CV Oluştur" → mevcut CV'yi ilan odaklı optimize eder
- "Bu İlan İçin Mektup Oluştur" → tek tıkla mektup üretir

#### 6.3.2 Dış Kaynaklardan İlan Çekme (Pro)
- LinkedIn Jobs API entegrasyonu
- Indeed Publisher API entegrasyonu
- Kullanıcı filtreler: konum, uzak/hibrit/ofis, sektör, deneyim seviyesi, maaş aralığı
- Sonuçlar eşleşme skoruna göre sıralanır

#### 6.3.3 AI Tabanlı İlan Önerileri
- Kullanıcının CV'si analiz edilir
- Güçlü olduğu alanlar tespit edilir
- "Senin için önerilen ilanlar" listesi oluşturulur
- Her ilan için eşleşme yüzdesi gösterilir

#### 6.3.4 Başvuru Takip Listesi (Tracker)
Kullanıcı başvurduğu ilanları listede takip eder:

| Sütun | Açıklama |
|---|---|
| Şirket | Şirket adı |
| Pozisyon | Başvurulan pozisyon |
| Başvuru Tarihi | |
| Durum | Başvuruldu / Mülakat / Teklif / Reddedildi |
| Notlar | Serbest metin |
| CV | Hangi CV versiyonu kullanıldı |
| Mektup | Hangi mektup versiyonu kullanıldı |

- Drag & drop ile durum güncelleme (Kanban görünüm opsiyonel)
- Başvuru istatistikleri özeti (toplam, aktif, mülakat oranı)

---

### 6.4 Dashboard (Ana Sayfa)

Kullanıcı giriş yaptıktan sonra gördüğü ekran:

- **Hoş geldin kartı:** "Bugün ne yapmak istersin?"
- **Hızlı aksiyonlar:** CV Oluştur / Mektup Yaz / İş Ara
- **Özet kartları:**
  - Kaydedilmiş CV sayısı
  - Oluşturulan mektup sayısı
  - Aktif başvuru sayısı
  - Plan durumu (Free / Pro + kalan hak)
- **Önerilen ilanlar:** AI tabanlı 3-5 ilan kartı
- **Son aktiviteler:** Son düzenlenen CV / mektup

---

### 6.5 Profil & Ayarlar

- Ad, soyad güncelleme
- E-posta değiştirme
- Şifre değiştirme
- Dil tercihi (TR/EN)
- Bildirim tercihleri
- Plan bilgisi & yükseltme CTA
- Hesabı sil (GDPR uyumlu, tüm veriyi sil)
- Faturalandırma geçmişi (Stripe Customer Portal bağlantısı)

---

## 7. Çoklu Dil (i18n)

- Desteklenen diller: **Türkçe (tr)** ve **İngilizce (en)**
- Kullanıcı dil tercihini profil ayarlarından değiştirebilir
- Tarayıcı dili otomatik algılanır, ilk girişte varsayılan olarak ayarlanır
- `next-intl` kütüphanesi kullanılır
- Tüm UI metinleri çeviri dosyalarında tutulur (`/messages/tr.json`, `/messages/en.json`)
- AI çıktıları (CV içeriği, mektup) kullanıcının seçtiği dilde üretilir

---

## 8. Veritabanı Şeması

```sql
-- CV'ler
cvs
  - id (uuid, PK)
  - user_id (uuid, FK → profiles.id)
  - title (string) -- Kullanıcının verdiği isim
  - template_id (string)
  - content (jsonb) -- Tüm CV içeriği
  - ats_score (int, nullable)
  - language (enum: 'tr', 'en')
  - created_at
  - updated_at

-- Motivasyon Mektupları
cover_letters
  - id (uuid, PK)
  - user_id (uuid, FK)
  - cv_id (uuid, FK, nullable) -- Hangi CV baz alındı
  - title (string)
  - company_name (string)
  - position (string)
  - tone (enum: 'formal', 'balanced', 'friendly')
  - language (enum: 'tr', 'en')
  - content (text)
  - created_at
  - updated_at

-- İş İlanları
job_listings
  - id (uuid, PK)
  - user_id (uuid, FK)
  - title (string)
  - company (string)
  - description (text)
  - source_url (string, nullable)
  - source (enum: 'manual', 'linkedin', 'indeed')
  - match_score (int, nullable)
  - skill_gap (jsonb, nullable)
  - created_at

-- Başvuru Takibi
job_applications
  - id (uuid, PK)
  - user_id (uuid, FK)
  - job_listing_id (uuid, FK, nullable)
  - company (string)
  - position (string)
  - applied_at (date)
  - status (enum: 'applied', 'interview', 'offer', 'rejected', 'withdrawn')
  - cv_id (uuid, FK, nullable)
  - cover_letter_id (uuid, FK, nullable)
  - notes (text, nullable)
  - created_at
  - updated_at

-- Kullanım Kotası (Free plan için)
usage_quotas
  - id (uuid, PK)
  - user_id (uuid, FK, unique)
  - cv_count_this_month (int, default 0)
  - cover_letter_count_this_month (int, default 0)
  - job_analysis_count_this_month (int, default 0)
  - reset_at (timestamp) -- Her ay 1'i sıfırlanır
```

---

## 9. API Rotaları

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session

GET    /api/cv               ← Kullanıcının tüm CV'leri
POST   /api/cv               ← Yeni CV oluştur
GET    /api/cv/:id
PUT    /api/cv/:id
DELETE /api/cv/:id
POST   /api/cv/:id/export-pdf
POST   /api/cv/:id/ats-score
POST   /api/cv/import-linkedin  ← LinkedIn veri dosyası parse
POST   /api/cv/ai-suggest       ← AI içerik önerisi

GET    /api/cover-letter
POST   /api/cover-letter       ← AI ile oluştur
GET    /api/cover-letter/:id
PUT    /api/cover-letter/:id
DELETE /api/cover-letter/:id
POST   /api/cover-letter/:id/export-pdf

GET    /api/jobs               ← İlan listesi (önerilen + manuel)
POST   /api/jobs               ← Manuel ilan ekle
GET    /api/jobs/:id
POST   /api/jobs/:id/analyze   ← CV ile karşılaştır
POST   /api/jobs/search        ← LinkedIn/Indeed'den çek (Pro)

GET    /api/applications
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id

GET    /api/profile
PUT    /api/profile

POST   /api/stripe/create-checkout  ← Pro satın alma
POST   /api/stripe/webhook          ← Ödeme olayları
GET    /api/stripe/portal           ← Fatura yönetimi
```

---

## 10. Kullanıcı Akışları (User Flows)

### Yeni Kullanıcı Akışı
1. Landing page → "Ücretsiz Başla"
2. Kayıt (Google veya e-posta)
3. Onboarding: "Ne yapmak istiyorsunuz?" → CV / Mektup / İş Ara
4. İlk CV oluşturucu açılır → adım adım wizard
5. Dashboard'a yönlendirilir

### CV Oluşturma Akışı
1. "Yeni CV" → Şablon seç
2. Seçenek: LinkedIn'den içe aktar / Sıfırdan başla
3. Bölümleri doldur (AI önerileri ile)
4. Sağda gerçek zamanlı önizleme
5. ATS skoru görüntüle, önerileri uygula
6. PDF indir veya kaydet

### İlan Analiz Akışı
1. "İlan Ekle" → URL veya metin yapıştır
2. İlan ayrıştırılır, kullanıcı onaylar
3. Eşleşme raporu gösterilir (skor, güçlü / eksik)
4. "Bu İlan İçin CV Oluştur" → CV optimizer açılır
5. "Mektup Oluştur" → tek adımda mektup

---

## 11. Güvenlik & GDPR

- Tüm veriler kullanıcı bazlı izole (Row Level Security — Supabase RLS)
- Şifreler Supabase Auth tarafından hash'lenir (bcrypt)
- API rotaları JWT ile korunur
- "Hesabımı Sil" özelliği: tüm kullanıcı verisi 30 gün içinde silinir
- Kullanıcıya veri dışa aktarma hakkı tanınır (GDPR)
- Stripe, kart bilgisi tarafımızda saklamaz

---

## 12. Non-Functional Gereksinimler

| Gereksinim | Hedef |
|---|---|
| Sayfa yüklenme süresi | < 2 saniye (LCP) |
| AI yanıt süresi | < 8 saniye |
| PDF oluşturma süresi | < 3 saniye |
| Mobil uyumluluk | Tam responsive (tablet & mobile) |
| Tarayıcı desteği | Chrome, Firefox, Safari, Edge (son 2 versiyon) |
| Uptime hedefi | %99.5 |
| Accessibility | WCAG 2.1 AA uyumlu |

---

## 13. MVP Kapsam Sınırı

MVP'de olması gerekenler (Phase 1):

- ✅ Kullanıcı kaydı ve girişi (Google + e-posta)
- ✅ CV oluşturucu (3 şablon, AI öneri, PDF export)
- ✅ Motivasyon mektubu (AI ile, ton seçimi, düzenleyici)
- ✅ Manuel ilan ekleme & analiz
- ✅ Dashboard
- ✅ Başvuru takip listesi (basit tablo görünümü)
- ✅ Free / Pro plan ayrımı + Stripe entegrasyonu
- ✅ TR/EN dil desteği

MVP'de olmayacaklar (Phase 2+):

- ❌ LinkedIn/Indeed API canlı ilan çekme
- ❌ LinkedIn otomatik profil import (API kısıtlaması nedeniyle ZIP upload Phase 2)
- ❌ Kanban görünüm (tracker)
- ❌ Mobil uygulama

---

## 14. Tasarım Yönergeleri

- **Ton:** Profesyonel ama modern, sıcak
- **Renk paleti:** Önerilir: Navy Blue (#1E3A5F) + Electric Blue (#3B82F6) + Beyaz + açık gri arka plan
- **Tipografi:** Inter veya Geist (okunabilirlik öncelikli)
- **Komponent kütüphanesi:** shadcn/ui (Radix UI tabanlı, accessible)
- **İkonlar:** Lucide React
- **Dark mode:** Phase 2

---

## 15. Başarı Metrikleri

| Metrik | 3 Ay Hedefi |
|---|---|
| Kayıtlı kullanıcı | 1.000 |
| Oluşturulan CV sayısı | 3.000 |
| Free → Pro dönüşüm oranı | %5+ |
| Aylık aktif kullanıcı (MAU) | 500 |
| Ortalama oturum süresi | 8+ dakika |

---

*Bu doküman, Antigravity tarafından uygulama geliştirme sürecinde referans alınacak teknik ve fonksiyonel gereksinimleri içermektedir.*
