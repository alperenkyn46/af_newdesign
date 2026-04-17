import { prisma } from "../index";

export async function handleStats(ctx: any) {
  const [
    userCount,
    siteCount,
    bonusCount,
    pendingRedemptions,
    pendingProofs,
    todayUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.bettingSite.count({ where: { isActive: true } }),
    prisma.bonus.count({ where: { isActive: true } }),
    prisma.redemption.count({ where: { status: "pending" } }),
    prisma.depositProof.count({ where: { status: "pending" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const totalPoints = await prisma.user.aggregate({
    _sum: { totalPoints: true },
  });

  await ctx.reply(
    "📊 *SlotBuse İstatistikler*\n\n" +
    `👥 Toplam Kullanıcı: *${userCount}*\n` +
    `🆕 Bugün Kayıt: *${todayUsers}*\n` +
    `🌐 Aktif Siteler: *${siteCount}*\n` +
    `🎁 Aktif Bonuslar: *${bonusCount}*\n` +
    `💰 Toplam Puan: *${totalPoints._sum.totalPoints || 0}*\n\n` +
    `⏳ Bekleyen Talepler: *${pendingRedemptions}*\n` +
    `📸 Bekleyen Kanıtlar: *${pendingProofs}*`,
    { parse_mode: "Markdown" }
  );
}
