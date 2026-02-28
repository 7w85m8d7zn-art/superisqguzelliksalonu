# Marlenqa Couture - Kurulum Talimatları

## Projeyi Başlatma

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

Tarayıcıda açın: `http://localhost:3000`

### 3. Üretim İçin Build Et
```bash
npm run build
npm start
```

## Teknoloji Stack

- **Next.js 14** - App Router
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar

## Proje Yapısı

```
/app                 # Next.js App Router sayfaları
├── layout.tsx       # Root layout
├── page.tsx         # Ana sayfa
├── koleksiyonlar/   # Koleksiyon sayfası
├── urun/[slug]/     # Model detay sayfası
└── globals.css      # Global stiller

/src
├── components/      # React bileşenleri
├── data/           # Mock veri
└── lib/            # Utility fonksiyonları
```

## Öne Çıkan Sayfalar

- **Ana Sayfa** - Hero, öne çıkan Model, neden biz, showroom bilgisi
- **Koleksiyon Sayfası** - Filtreleme, arama, sıralama
- **Model Detay** - Galeri, özellikleri, CTA butonları
- **Mobil Sticky Buttons** - WhatsApp ve Randevu butonları

## Özelleştirme

### WhatsApp Numarası Güncelleme
Projede kullanılan WhatsApp numarası `05306249382` olarak ayarlandı. `Header.tsx`, `Footer.tsx`, `StickyButtons.tsx` ve `ShowroomSection.tsx` dosyalarını kontrol edebilirsiniz.

### Renk Özelleştirmesi
`tailwind.config.ts` dosyasında tema renklerini değiştirin.

### Model Verileri
`src/data/products.ts` dosyasında Modeli yönetin.
