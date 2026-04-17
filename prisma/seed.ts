import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@betvip.com" },
    update: {},
    create: {
      email: "admin@betvip.com",
      name: "Admin",
      password: hashedPassword,
      referralCode: "ADMIN001",
      isAdmin: true,
      totalPoints: 1000,
    },
  });
  console.log("Admin user created:", admin.email);

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "BetVIP",
      siteDescription: "En iyi bahis siteleri ve bonuslar",
      telegramLink: "https://t.me/betvip",
      instagramLink: "https://instagram.com/betvip",
      twitterLink: "https://twitter.com/betvip",
      youtubeLink: "https://youtube.com/betvip",
      contactEmail: "destek@betvip.com",
      pointsPerSignup: 50,
      pointsPerReferral: 100,
      pointsPerTelegram: 50,
      pointsPerInstagram: 30,
      pointsPerTwitter: 30,
      pointsPerYoutube: 40,
      dailyBonusBase: 10,
      slotMinBet: 10,
      slotMaxBet: 1000,
    },
  });

  // Create VIP levels
  const vipLevels = [
    { name: "bronze", minPoints: 0, maxPoints: 499, bonusMultiplier: 1.0, dailyBonus: 10, wheelBonus: 0, slotBonus: 0, color: "#CD7F32" },
    { name: "silver", minPoints: 500, maxPoints: 1999, bonusMultiplier: 1.25, dailyBonus: 15, wheelBonus: 10, slotBonus: 10, color: "#C0C0C0" },
    { name: "gold", minPoints: 2000, maxPoints: 4999, bonusMultiplier: 1.5, dailyBonus: 25, wheelBonus: 25, slotBonus: 25, color: "#FFD700" },
    { name: "platinum", minPoints: 5000, maxPoints: 999999, bonusMultiplier: 2.0, dailyBonus: 50, wheelBonus: 50, slotBonus: 50, color: "#E5E4E2" },
  ];

  for (const level of vipLevels) {
    await prisma.vipLevel.upsert({
      where: { name: level.name },
      update: level,
      create: level,
    });
    console.log("VIP level created:", level.name);
  }

  // Create wheel prizes
  const wheelPrizes = [
    { name: "5 Puan", points: 5, probability: 30, color: "#6B7280", order: 0 },
    { name: "10 Puan", points: 10, probability: 25, color: "#3B82F6", order: 1 },
    { name: "25 Puan", points: 25, probability: 20, color: "#8B5CF6", order: 2 },
    { name: "50 Puan", points: 50, probability: 15, color: "#EC4899", order: 3 },
    { name: "100 Puan", points: 100, probability: 8, color: "#F59E0B", order: 4 },
    { name: "250 Puan", points: 250, probability: 2, color: "#10B981", order: 5 },
  ];

  for (const prize of wheelPrizes) {
    await prisma.wheelPrize.upsert({
      where: { id: `prize-${prize.order}` },
      update: prize,
      create: { id: `prize-${prize.order}`, ...prize },
    });
    console.log("Wheel prize created:", prize.name);
  }

  // Create betting sites
  const sites = [
    {
      name: "Betboo",
      slug: "betboo",
      logo: "https://placehold.co/100x100/8b5cf6/ffffff?text=BB",
      url: "https://betboo.com",
      description: "Türkiye'nin en güvenilir bahis sitelerinden biri. Yüksek oranlar ve hızlı ödemeler.",
      rating: 4.8,
      features: "Canlı Bahis,Casino,Slot,Hızlı Ödeme",
      order: 1,
    },
    {
      name: "Bets10",
      slug: "bets10",
      logo: "https://placehold.co/100x100/3b82f6/ffffff?text=B10",
      url: "https://bets10.com",
      description: "Geniş spor bahisleri yelpazesi ve yüksek bonus fırsatları.",
      rating: 4.7,
      features: "Spor Bahis,Canlı Casino,Poker,E-Spor",
      order: 2,
    },
    {
      name: "Mobilbahis",
      slug: "mobilbahis",
      logo: "https://placehold.co/100x100/ec4899/ffffff?text=MB",
      url: "https://mobilbahis.com",
      description: "Mobil uyumlu arayüz ve anlık bildirimler ile bahis deneyimi.",
      rating: 4.6,
      features: "Mobil Uygulama,Canlı Bahis,Sanal Bahis,7/24 Destek",
      order: 3,
    },
    {
      name: "Superbetin",
      slug: "superbetin",
      logo: "https://placehold.co/100x100/f59e0b/ffffff?text=SB",
      url: "https://superbetin.com",
      description: "Süper oranlar ve süper bonuslar ile kazanmaya başla.",
      rating: 4.5,
      features: "Yüksek Oranlar,Bonus,Casino,Slot",
      order: 4,
    },
    {
      name: "1xBet",
      slug: "1xbet",
      logo: "https://placehold.co/100x100/06b6d4/ffffff?text=1X",
      url: "https://1xbet.com",
      description: "Dünya genelinde milyonlarca kullanıcıya hizmet veren global bahis devi.",
      rating: 4.4,
      features: "Global,Kripto,Canlı Yayın,Çoklu Dil",
      order: 5,
    },
    {
      name: "Tipobet",
      slug: "tipobet",
      logo: "https://placehold.co/100x100/10b981/ffffff?text=TB",
      url: "https://tipobet.com",
      description: "Türk kullanıcılara özel promosyonlar ve yerel ödeme yöntemleri.",
      rating: 4.3,
      features: "Türk Lirası,Papara,Canlı Destek,Hızlı Kayıt",
      order: 6,
    },
  ];

  for (const site of sites) {
    const createdSite = await prisma.bettingSite.upsert({
      where: { slug: site.slug },
      update: site,
      create: site,
    });
    console.log("Site created:", createdSite.name);
  }

  // Get all sites for bonus creation
  const allSites = await prisma.bettingSite.findMany();

  // Create bonuses
  const bonuses = [
    {
      siteId: allSites[0]?.id,
      title: "Hoşgeldin Bonusu",
      code: "HOSGELDIN100",
      description: "İlk yatırımınıza %100 bonus! Maksimum 1000 TL.",
      type: "Hoşgeldin",
      value: "%100 - 1000 TL",
      minDeposit: "100 TL",
      wagering: "10x",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      siteId: allSites[1]?.id,
      title: "FreeSpin Bonusu",
      code: "FREE50",
      description: "Kayıt ol ve 50 FreeSpin kazan!",
      type: "FreeSpin",
      value: "50 FreeSpin",
      minDeposit: "50 TL",
      wagering: "20x",
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      siteId: allSites[2]?.id,
      title: "Yatırım Bonusu",
      code: "YATIRIM50",
      description: "Her yatırımınıza %50 bonus fırsatı.",
      type: "Yatırım",
      value: "%50 Bonus",
      minDeposit: "200 TL",
      wagering: "8x",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      siteId: allSites[3]?.id,
      title: "Kayıp Bonusu",
      code: null,
      description: "Haftalık kayıplarınızın %15'i iade!",
      type: "Kayıp",
      value: "%15 Kayıp İadesi",
      minDeposit: null,
      wagering: "5x",
      expiresAt: null,
    },
    {
      siteId: allSites[4]?.id,
      title: "VIP Özel Bonus",
      code: "VIP500",
      description: "VIP üyelere özel ekstra bonus!",
      type: "VIP",
      value: "500 TL Bonus",
      minDeposit: "500 TL",
      wagering: "15x",
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  ];

  // Delete existing bonuses first to avoid duplicates
  await prisma.bonus.deleteMany({});
  
  for (const bonus of bonuses) {
    if (bonus.siteId) {
      const createdBonus = await prisma.bonus.create({
        data: bonus,
      });
      console.log("Bonus created:", createdBonus.title);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
