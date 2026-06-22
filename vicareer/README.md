# CareerAI 🚀

[![English](https://img.shields.io/badge/Language-English-blue)](#english) [![Türkçe](https://img.shields.io/badge/Language-T%C3%BCrk%C3%A7e-red)](#türkçe)

---

## 🇺🇸 English

**CareerAI** is a modern, AI-powered platform designed to streamline the career development process. It helps users create professional CVs, generate tailored cover letters, and track job applications efficiently.

### ✨ Key Features
- **🤖 AI CV Builder**: Create professional CVs with multiple templates and AI-powered content suggestions.
- **📝 AI Cover Letter Generator**: Generate personalized cover letters based on job descriptions and your profile.
- **📊 Job Application Tracker**: A Kanban-style board to manage and track your job applications in real-time.
- **🌍 Internationalization (i18n)**: Full support for English and Turkish languages.
- **💳 Premium Dashboard**: Track usage limits, manage subscriptions, and view history.
- **🔗 LinkedIn Import**: Easily import your profile data from a LinkedIn CSV file.

### 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Payments**: [LemonSqueezy](https://www.lemonsqueezy.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT-4o)

### 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EmirKale/ViCareerAI.git
   cd ViCareerAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # App Settings
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

   # OpenAI
   OPENAI_API_KEY="your_openai_api_key"

   # LemonSqueezy Payments
   LEMONSQUEEZY_API_KEY="your_lemonsqueezy_api_key"
   LEMONSQUEEZY_STORE_ID="your_lemonsqueezy_store_id"
   LEMONSQUEEZY_WEBHOOK_SECRET="your_lemonsqueezy_webhook_secret"
   NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID="your_lemonsqueezy_variant_id"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🇹🇷 Türkçe

**CareerAI**, kariyer geliştirme sürecini kolaylaştırmak için tasarlanmış modern, yapay zeka destekli bir platformdur. Kullanıcıların profesyonel CV'ler oluşturmasına, kişiselleştirilmiş motivasyon mektupları hazırlamasına ve iş başvurularını verimli bir şekilde takip etmesine yardımcı olur.

### ✨ Temel Özellikler
- **🤖 Yapay Zeka Destekli CV Oluşturucu**: Farklı şablonlar ve yapay zeka içerik önerileri ile profesyonel CV'ler hazırlayın.
- **📝 Yapay Zeka Motivasyon Mektubu Oluşturucu**: İş tanımına ve profilinize göre kişiselleştirilmiş mektuplar oluşturun.
- **📊 İş Takip Sistemi (Kanban)**: İş başvurularınızı gerçek zamanlı olarak Kanban panosu üzerinden yönetin.
- **🌍 Çoklu Dil Desteği (i18n)**: Türkçe ve İngilizce dilleri için tam destek.
- **💳 Premium Panel**: Kullanım limitlerini takip edin, abonelikleri yönetin ve geçmişinizi görüntüleyin.
- **🔗 LinkedIn İçe Aktarma**: Profil verilerinizi LinkedIn CSV dosyasından kolayca aktarın.

### 🛠️ Teknoloji Yığını
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (Veritabanı, Auth, Depolama)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animasyonlar**: [Framer Motion](https://www.framer.com/motion/)
- **Ödemeler**: [LemonSqueezy](https://www.lemonsqueezy.com/)
- **Uluslararasılaştırma**: [next-intl](https://next-intl-docs.vercel.app/)
- **PDF Oluşturma**: [@react-pdf/renderer](https://react-pdf.org/)
- **AI Entegrasyonu**: [OpenAI API](https://openai.com/) (GPT-4o)

### 🚀 Başlangıç

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/EmirKale/ViCareerAI.git
   cd ViCareerAI
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   Ana dizinde bir `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
   ```env
   # Uygulama Ayarları
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="sizin_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sizin_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="sizin_supabase_service_role_key"

   # OpenAI
   OPENAI_API_KEY="sizin_openai_api_key"

   # LemonSqueezy Ödeme Sistemi
   LEMONSQUEEZY_API_KEY="sizin_lemonsqueezy_api_key"
   LEMONSQUEEZY_STORE_ID="sizin_lemonsqueezy_store_id"
   LEMONSQUEEZY_WEBHOOK_SECRET="sizin_lemonsqueezy_webhook_secret"
   NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID="sizin_lemonsqueezy_varyant_id"
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
