# ✅ Site Hazırlık Kontrol Listesi

## 🔴 ZORUNLU (Site Çalışması İçin)

### 1. Bağımlılıkları Yükle

```bash
npm install
```

✅ Yapıldı mı? → `node_modules` klasörü var mı kontrol edin

### 2. .env Dosyası Oluştur

Proje kök dizininde `.env` dosyası oluşturun:

```env
# EmailJS (İletişim formu için ZORUNLU)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Admin Şifre (Production için ZORUNLU)
VITE_ADMIN_PASSWORD=your_secure_password

# Google Analytics (OPSİYONEL)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

⚠️ **ÖNEMLİ:** `.env` dosyası yoksa:

- İletişim formu çalışmaz
- Admin şifre varsayılan `admin123` olur (sadece development'ta)

### 3. EmailJS Kurulumu

1. [EmailJS.com](https://www.emailjs.com/) → Ücretsiz hesap oluştur
2. Email Service ekle (Gmail, Outlook, vb.)
3. Email Template oluştur
4. API Keys'den Public Key al
5. `.env` dosyasına ekle

### 4. Domain Güncellemeleri (Production İçin)

- `public/sitemap.xml` → Domain'i güncelle
- `public/robots.txt` → Domain'i güncelle

---

## 🟡 ÖNERİLEN (Production İçin)

- [ ] Admin şifresini güçlü bir şifre ile değiştir
- [ ] Google Analytics ID ekle
- [ ] `sitemap.xml` domain'ini güncelle
- [ ] `robots.txt` domain'ini güncelle

---

## ✅ Site Hazır mı?

### Development (Local)

✅ **Evet, hazır** - `.env` olmadan da çalışır:

- Admin şifre: `admin123` (varsayılan)
- İletişim formu çalışmaz (EmailJS bilgileri yok)

### Production (Canlı)

⚠️ **Kısmen hazır** - Şunları yapmalısınız:

1. `.env` dosyası oluştur
2. EmailJS bilgilerini ekle
3. Güçlü admin şifresi belirle
4. Domain'leri güncelle

---

## 🧪 Test Et

```bash
# Development
npm run dev

# Production build test
npm run build
npm run preview
```

---

**Sonraki Adım:** `.env` dosyasını oluşturup EmailJS bilgilerini ekleyin!
