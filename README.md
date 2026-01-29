# 🚀 SAVTEK - Savunma Teknolojileri Topluluğu Web Sitesi

Konya Teknik Üniversitesi Savunma Teknolojileri Topluluğu'nun resmi web sitesi.

## 📋 Özellikler

### ✨ Ana Özellikler

- 🎨 Modern ve responsive tasarım
- 📱 Mobil uyumlu (admin panel desktop-only)
- 🔐 Güvenli admin paneli
- 📝 İçerik yönetim sistemi (CMS)
- 📧 İletişim formu (EmailJS entegrasyonu)
- 🔍 SEO optimizasyonu
- ♿ Erişilebilirlik (WCAG uyumlu)
- 🍪 KVKK uyumlu cookie consent

### 🛠️ Teknik Özellikler

- ⚡ React 19 + Vite
- 🎭 Framer Motion animasyonları
- 🗺️ React Router v7
- 📦 Code splitting ve lazy loading
- 🔒 Güvenlik header'ları
- 📊 Google Analytics entegrasyonu
- 🖼️ Image optimization (WebP desteği)

### 🔐 Admin Panel Özellikleri

- ✅ CRUD işlemleri (Takımlar, Etkinlikler, Ekip, Sponsorlar)
- 📝 Admin log sistemi
- 🗑️ Soft delete (geri alınabilir silme)
- ☑️ Toplu işlemler (bulk operations)
- 📋 İşlem geçmişi görüntüleme

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum

1. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

2. **Environment variables oluşturun:**

   ```bash
   # .env dosyası oluşturun
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_ADMIN_PASSWORD=your_secure_password
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

3. **Development server'ı başlatın:**

   ```bash
   npm run dev
   ```

4. **Production build:**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel (Önerilen)

1. GitHub repository'nizi Vercel'e bağlayın
2. Environment variables ekleyin (Settings > Environment Variables)
3. Otomatik deploy edilir - `vercel.json` hazır

### Netlify

1. GitHub repository'nizi Netlify'e bağlayın
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables ekleyin
5. `public/_headers` otomatik kullanılır

**Önemli:** Production'da `sitemap.xml` ve `robots.txt` içindeki domain'i güncelleyin!

## 📚 Dokümantasyon

- **[SETUP.md](./SETUP.md)** - Detaylı kurulum rehberi (EmailJS, Admin şifre, GA)

## 🗂️ Proje Yapısı

```
savtek-site/
├── public/              # Statik dosyalar
│   ├── robots.txt      # SEO için
│   ├── sitemap.xml     # SEO için
│   └── _headers        # Netlify güvenlik header'ları
├── src/
│   ├── components/     # React component'leri
│   ├── pages/          # Sayfa component'leri
│   ├── styles/         # CSS dosyaları
│   └── utils/          # Utility fonksiyonları
├── vercel.json         # Vercel deployment config
└── vite.config.js      # Vite yapılandırması
```

## 🔑 Önemli Notlar

### Environment Variables

- `.env` dosyasını **ASLA** Git'e commit etmeyin
- Production'da güçlü bir admin şifresi kullanın
- EmailJS bilgilerinizi [EmailJS](https://www.emailjs.com/)'den alın

### Admin Panel

- Admin panel sadece desktop'ta çalışır (mobilde engellenir)
- Varsayılan demo şifre: `admin123` (sadece development'ta)
- Production'da environment variable'dan şifre alınır

### Deployment

- **Vercel:** `vercel.json` dosyası hazır
- **Netlify:** `public/_headers` dosyası hazır
- Her iki platform için güvenlik header'ları yapılandırılmış

## 🛡️ Güvenlik

- ✅ Content Security Policy (CSP) - `vercel.json` ve `public/_headers` hazır
- ✅ X-Frame-Options, X-Content-Type-Options
- ✅ Admin log sistemi
- ✅ Soft delete (veri kaybını önler)
- ✅ Environment variable ile şifre yönetimi

## 📊 SEO

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Dinamik sayfa başlıkları

## ♿ Erişilebilirlik

- ✅ WCAG 2.1 AA uyumluluğu
- ✅ Keyboard navigation
- ✅ Screen reader desteği
- ✅ Skip to content link
- ✅ Reduced motion desteği
- ✅ High contrast mode desteği

## 📝 Lisans

© 2025 SAVTEK - Tüm hakları saklıdır.

## 📞 İletişim

- **E-posta:** savtek@ktun.edu.tr
- **Web:** [savtek.ktun.edu.tr](https://savtek.ktun.edu.tr)

---

**Geliştirici Notları:**

- Tüm özellikler production-ready
- Site yayına hazır durumda
- Detaylı kurulum için [SETUP.md](./SETUP.md) dosyasına bakın
