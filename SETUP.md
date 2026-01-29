# SAVTEK Site Kurulum Rehberi

Bu dosya, SAVTEK web sitesinin kurulumu ve yapılandırması için gerekli adımları içerir.

## 🔧 Gerekli Ortam Değişkenleri

Proje kök dizininde `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# EmailJS Configuration (Zorunlu - İletişim formu için)
# https://www.emailjs.com/ adresinden ücretsiz hesap oluşturun
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Admin Password (Zorunlu - Production için güvenli şifre kullanın)
# Demo için: admin123 (sadece development modunda gösterilir)
VITE_ADMIN_PASSWORD=your_secure_password_here

# Google Analytics (Opsiyonel - Ziyaretçi takibi için)
# https://analytics.google.com/ adresinden tracking ID alın
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 📧 EmailJS Kurulumu

1. [EmailJS](https://www.emailjs.com/) adresine gidin ve ücretsiz hesap oluşturun
2. Dashboard'dan bir Email Service ekleyin (Gmail, Outlook, vb.)
3. Bir Email Template oluşturun
4. Integration > API Keys bölümünden Public Key'inizi alın
5. `.env` dosyasına Service ID, Template ID ve Public Key'i ekleyin

**Email Template Örnek Formatı:**

```
Konu: Yeni İletişim Formu Mesajı

İsim: {{from_name}}
E-posta: {{from_email}}
Mesaj: {{message}}
```

## 🔐 Admin Şifre Güvenliği

**Development (Geliştirme):**

- Varsayılan şifre: `admin123`
- Login sayfasında gösterilir

**Production (Canlı):**

- Güçlü bir şifre belirleyin (en az 12 karakter, büyük/küçük harf, sayı, özel karakter)
- `.env` dosyasına `VITE_ADMIN_PASSWORD` olarak ekleyin
- Şifre login sayfasında gösterilmez

## 📊 Google Analytics Kurulumu

1. [Google Analytics](https://analytics.google.com/) hesabı oluşturun
2. Yeni bir Property oluşturun
3. Measurement ID'yi kopyalayın (G-XXXXXXXXXX formatında)
4. `.env` dosyasına `VITE_GA_TRACKING_ID` olarak ekleyin

**Not:** Google Analytics opsiyoneldir. Tracking ID eklenmezse, analytics çalışmaz ancak site normal şekilde çalışmaya devam eder.

## 🚀 Kurulum Adımları

1. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

2. **`.env` dosyasını oluşturun:**

   ```bash
   cp .env.example .env
   ```

   (Eğer `.env.example` yoksa, yukarıdaki örneği kullanarak manuel oluşturun)

3. **`.env` dosyasını düzenleyin:**

   - EmailJS bilgilerinizi ekleyin
   - Admin şifresini ayarlayın
   - (Opsiyonel) Google Analytics ID'sini ekleyin

4. **Development server'ı başlatın:**

   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   ```

## 📝 Önemli Notlar

- `.env` dosyasını **ASLA** Git'e commit etmeyin (`.gitignore`'da olmalı)
- Production'da güçlü bir admin şifresi kullanın
- EmailJS ücretsiz planında aylık 200 email limiti vardır
- Google Analytics KVKK uyumluluğu için KVKK Consent banner'ı kullanılmaktadır

## 🔒 Güvenlik

- Admin şifresi environment variable olarak saklanır
- Production'da demo şifre hint'i gösterilmez
- KVKK uyumlu cookie consent banner mevcuttur
- Tüm form gönderimleri EmailJS üzerinden güvenli şekilde yapılır

## 📞 Destek

Sorularınız için: savtek@ktun.edu.tr
