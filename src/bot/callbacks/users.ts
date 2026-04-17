import { Telegraf, Markup } from "telegraf";
import { adminOnly, prisma } from "../index";

async function updateUserVipLevel(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPoints: true, vipLevel: true },
  });
  if (!user) return null;

  const levels = await prisma.vipLevel.findMany({ orderBy: { minPoints: "asc" } });
  const defaults = [
    { name: "bronze", minPoints: 0 },
    { name: "silver", minPoints: 500 },
    { name: "gold", minPoints: 2000 },
    { name: "platinum", minPoints: 5000 },
  ];
  const vipLevels = levels.length > 0 ? levels : defaults;

  let currentLevel = vipLevels[0];
  for (const level of vipLevels) {
    if (user.totalPoints >= level.minPoints) {
      currentLevel = level;
    }
  }

  if (currentLevel.name !== user.vipLevel) {
    await prisma.user.update({
      where: { id: userId },
      data: { vipLevel: currentLevel.name },
    });
    return currentLevel.name;
  }
  return user.vipLevel;
}

export function setupUserCallbacks(bot: Telegraf) {
  bot.action(/^user_detail_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    const userId = (ctx.match as RegExpMatchArray)[1];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { referralsMade: true, points: true, redemptions: true, depositProofs: true } },
      },
    });

    if (!user) {
      return ctx.reply("❌ Kullanıcı bulunamadı.");
    }

    const text =
      `👤 *${user.name}*\n\n` +
      `📧 Email: ${user.email}\n` +
      (user.telegramUsername ? `📱 Telegram: @${user.telegramUsername}\n` : "") +
      `💰 Puan: *${user.totalPoints}*\n` +
      `🏆 VIP: *${user.vipLevel.toUpperCase()}*\n` +
      `👑 Admin: ${user.isAdmin ? "Evet" : "Hayır"}\n` +
      `🔗 Referans Kodu: \`${user.referralCode}\`\n\n` +
      `📊 *İstatistikler:*\n` +
      `👥 Referanslar: ${user._count.referralsMade}\n` +
      `💳 Puan İşlemleri: ${user._count.points}\n` +
      `💱 Çevirme Talepleri: ${user._count.redemptions}\n` +
      `📸 Yatırım Kanıtları: ${user._count.depositProofs}\n\n` +
      `📅 Kayıt: ${user.createdAt.toLocaleDateString("tr-TR")}`;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("💰 +100 Puan", `user_points_${userId}_100`),
        Markup.button.callback("💰 +500 Puan", `user_points_${userId}_500`),
      ],
      [
        Markup.button.callback("💰 +1000 Puan", `user_points_${userId}_1000`),
        Markup.button.callback("💰 -100 Puan", `user_points_${userId}_-100`),
      ],
      [Markup.button.callback("◀️ Geri", "menu_users")],
    ]);

    await ctx.reply(text, { parse_mode: "Markdown", ...keyboard });
  }));

  bot.action(/^user_points_(.+)_(-?\d+)$/, adminOnly(async (ctx) => {
    const userId = (ctx.match as RegExpMatchArray)[1];
    const amount = parseInt((ctx.match as RegExpMatchArray)[2]);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      await ctx.answerCbQuery("Kullanıcı bulunamadı");
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { totalPoints: { increment: amount } },
    });

    await prisma.point.create({
      data: {
        userId,
        amount,
        reason: `Admin: Telegram bot ile ${amount > 0 ? "eklendi" : "çıkarıldı"}`,
      },
    });

    await updateUserVipLevel(userId);

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    await ctx.answerCbQuery(`${amount > 0 ? "+" : ""}${amount} puan verildi`);
    await ctx.reply(
      `✅ *${user.name}* kullanıcısına *${amount > 0 ? "+" : ""}${amount}* puan verildi.\n` +
      `💰 Yeni toplam: *${updatedUser?.totalPoints}* puan`,
      { parse_mode: "Markdown" }
    );
  }));
}
