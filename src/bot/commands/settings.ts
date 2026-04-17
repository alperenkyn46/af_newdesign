import { prisma } from "../index";

export async function handleSettings(ctx: any) {
  let settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    return ctx.reply("⚙️ Henüz ayar yapılmamış.");
  }

  const text =
    `⚙️ *Site Ayarları*\n\n` +
    `📛 Site Adı: *${settings.siteName}*\n` +
    `📝 Açıklama: ${settings.siteDescription}\n\n` +
    `*Sosyal Linkler:*\n` +
    `📱 Telegram: ${settings.telegramLink || "-"}\n` +
    `📸 Instagram: ${settings.instagramLink || "-"}\n` +
    `🐦 Twitter: ${settings.twitterLink || "-"}\n` +
    `📺 YouTube: ${settings.youtubeLink || "-"}\n` +
    `🎬 Kick: ${settings.kickLink || "-"}\n\n` +
    `*Puan Ayarları:*\n` +
    `📝 Kayıt: ${settings.pointsPerSignup}\n` +
    `👥 Referans: ${settings.pointsPerReferral}\n` +
    `📱 Telegram: ${settings.pointsPerTelegram}\n` +
    `📸 Instagram: ${settings.pointsPerInstagram}\n` +
    `🐦 Twitter: ${settings.pointsPerTwitter}\n` +
    `📺 YouTube: ${settings.pointsPerYoutube}\n` +
    `💰 Yatırım: ${settings.pointsPerDeposit}\n\n` +
    `*Oyun Ayarları:*\n` +
    `🎁 Günlük Bonus: ${settings.dailyBonusBase}\n` +
    `🎰 Min Bahis: ${settings.slotMinBet}\n` +
    `🎰 Max Bahis: ${settings.slotMaxBet}`;

  await ctx.reply(text, { parse_mode: "Markdown" });
}
