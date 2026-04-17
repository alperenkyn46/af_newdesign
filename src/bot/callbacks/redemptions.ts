import { Telegraf } from "telegraf";
import { adminOnly, prisma } from "../index";

export function setupRedemptionCallbacks(bot: Telegraf) {
  bot.action(/^redeem_approve_(.+)$/, adminOnly(async (ctx) => {
    const id = (ctx.match as RegExpMatchArray)[1];

    const redemption = await prisma.redemption.findUnique({
      where: { id },
      include: { user: { select: { name: true } }, site: { select: { name: true } } },
    });

    if (!redemption) {
      await ctx.answerCbQuery("Talep bulunamadı");
      return;
    }

    if (redemption.status !== "pending") {
      await ctx.answerCbQuery(`Bu talep zaten ${redemption.status === "approved" ? "onaylandı" : "reddedildi"}`);
      return;
    }

    await prisma.redemption.update({
      where: { id },
      data: { status: "approved" },
    });

    await ctx.answerCbQuery("✅ Talep onaylandı");
    await ctx.reply(
      `✅ *Çevirme Talebi Onaylandı*\n\n` +
      `👤 ${redemption.user.name}\n` +
      `🌐 ${redemption.site.name}\n` +
      `💰 ${redemption.points} puan → ${redemption.amount}`,
      { parse_mode: "Markdown" }
    );
  }));

  bot.action(/^redeem_reject_(.+)$/, adminOnly(async (ctx) => {
    const id = (ctx.match as RegExpMatchArray)[1];

    const redemption = await prisma.redemption.findUnique({
      where: { id },
      include: { user: { select: { name: true } }, site: { select: { name: true } } },
    });

    if (!redemption) {
      await ctx.answerCbQuery("Talep bulunamadı");
      return;
    }

    if (redemption.status !== "pending") {
      await ctx.answerCbQuery(`Bu talep zaten ${redemption.status === "approved" ? "onaylandı" : "reddedildi"}`);
      return;
    }

    await prisma.redemption.update({
      where: { id },
      data: { status: "rejected" },
    });

    await prisma.user.update({
      where: { id: redemption.userId },
      data: { totalPoints: { increment: redemption.points } },
    });

    await prisma.point.create({
      data: {
        userId: redemption.userId,
        amount: redemption.points,
        reason: "Reddedilen çevirme talebi iadesi",
      },
    });

    await ctx.answerCbQuery("❌ Talep reddedildi, puan iade edildi");
    await ctx.reply(
      `❌ *Çevirme Talebi Reddedildi*\n\n` +
      `👤 ${redemption.user.name}\n` +
      `🌐 ${redemption.site.name}\n` +
      `💰 ${redemption.points} puan iade edildi`,
      { parse_mode: "Markdown" }
    );
  }));
}
