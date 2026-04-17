import { Markup } from "telegraf";
import { prisma } from "../index";

export async function handleUsers(ctx: any) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      totalPoints: true,
      vipLevel: true,
      isAdmin: true,
      createdAt: true,
      _count: { select: { referralsMade: true } },
    },
  });

  if (users.length === 0) {
    return ctx.reply("👥 Henüz kullanıcı yok.");
  }

  const totalUsers = await prisma.user.count();

  let text = `👥 *Kullanıcılar* (${totalUsers} toplam)\n\n`;

  users.forEach((user, idx) => {
    const admin = user.isAdmin ? "👑" : "";
    const vip = user.vipLevel.toUpperCase();
    text += `${idx + 1}. ${admin} *${user.name}*\n`;
    text += `   📧 ${user.email}\n`;
    text += `   💰 ${user.totalPoints} puan | 🏆 ${vip}\n`;
    text += `   👥 ${user._count.referralsMade} referans\n\n`;
  });

  text += "\n🔍 Kullanıcı aramak için: /ara `isim veya email`";

  const buttons = users.slice(0, 5).map((user) => [
    Markup.button.callback(
      `👤 ${user.name} (${user.totalPoints}p)`,
      `user_detail_${user.id}`
    ),
  ]);

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons),
  });
}

export async function handleUserSearch(ctx: any) {
  const searchTerm = ctx.message.text.replace("/ara", "").trim();

  if (!searchTerm) {
    return ctx.reply("🔍 Kullanım: /ara `isim veya email`", { parse_mode: "Markdown" });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { telegramUsername: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      totalPoints: true,
      vipLevel: true,
    },
  });

  if (users.length === 0) {
    return ctx.reply(`🔍 "${searchTerm}" için sonuç bulunamadı.`);
  }

  let text = `🔍 *"${searchTerm}" Arama Sonuçları*\n\n`;

  users.forEach((user, idx) => {
    text += `${idx + 1}. *${user.name}* - ${user.email}\n`;
    text += `   💰 ${user.totalPoints} puan | 🏆 ${user.vipLevel}\n\n`;
  });

  const buttons = users.map((user) => [
    Markup.button.callback(
      `👤 ${user.name} (${user.totalPoints}p)`,
      `user_detail_${user.id}`
    ),
  ]);

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons),
  });
}
