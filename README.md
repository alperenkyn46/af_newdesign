# BetVIP - Bahis Affiliate Web Sitesi

Modern, koyu temalı bahis affiliate web sitesi. Next.js 14, TypeScript, Tailwind CSS ve Prisma ile geliştirilmiştir.

## Özellikler

- 🎨 Modern koyu tema tasarımı (glassmorphism, gradientler)
- 🔐 Kullanıcı giriş/kayıt sistemi (NextAuth.js)
- 🎰 Bahis siteleri listesi ve detay sayfaları
- 🎁 Bonus ve promosyon yönetimi
- 📊 Puan sistemi
- 👥 Referans (arkadaş davet) sistemi
- 🛠️ Admin paneli
- 📱 Responsive tasarım
- 🔗 Sosyal medya entegrasyonu

## Teknoloji Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite
- **Auth:** NextAuth.js
- **Icons:** Lucide React

## Kurulum

1. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

2. Veritabanını oluşturun:
\`\`\`bash
npm run db:push
\`\`\`

3. Örnek verileri ekleyin:
\`\`\`bash
npm run db:seed
\`\`\`

4. Geliştirme sunucusunu başlatın:
\`\`\`bash
npm run dev
\`\`\`

5. Tarayıcıda açın: [http://localhost:3000](http://localhost:3000)

## Admin Girişi

Seed sonrası oluşturulan admin hesabı:
- **Email:** admin@betvip.com
- **Şifre:** admin123

## Proje Yapısı

\`\`\`
src/
├── app/
│   ├── (auth)/           # Giriş/Kayıt sayfaları
│   ├── admin/            # Admin paneli
│   ├── api/              # API routes
│   ├── bonuslar/         # Bonuslar sayfası
│   ├── iletisim/         # İletişim sayfası
│   ├── panel/            # Kullanıcı paneli
│   ├── siteler/          # Bahis siteleri
│   └── page.tsx          # Ana sayfa
├── components/
│   ├── cards/            # Kart bileşenleri
│   ├── layout/           # Header, Footer
│   ├── sections/         # Sayfa bölümleri
│   └── ui/               # UI bileşenleri
├── lib/                  # Yardımcı fonksiyonlar
└── types/                # TypeScript tipleri
\`\`\`

## Ortam Değişkenleri

\`.env\` dosyasında:

\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

## Scriptler

- \`npm run dev\` - Geliştirme sunucusu
- \`npm run build\` - Production build
- \`npm run start\` - Production sunucusu
- \`npm run db:push\` - Veritabanı sync
- \`npm run db:seed\` - Örnek veri ekleme
- \`npm run db:studio\` - Prisma Studio

## Lisans

MIT
