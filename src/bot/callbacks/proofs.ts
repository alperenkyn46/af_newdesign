import { Telegraf } from "telegraf";
import { adminOnly, prisma } from "../index";

export function setupProofCallbacks(bot: Telegraf) {
  bot.action(/^proof_approve_(.+)$/, adminOnly(async (ctx) => {
    const id = (ctx.match as RegExpMatchArray)[1];

    const proof = await prisma.depositProof.findUnique({
      where: { id },
      include: { user: { select: { name: true } }, site: { select: { name: true } } },
    });

    if (!proof) {
      await ctx.answerCbQuery("Kanıt bulunamadı");
      return;
    }

    if (proof.status === "approved") {
      await ctx.answerCbQuery("Bu kanıt zaten onaylanmış");
      return;
    }

    if (proof.status !== "approved") {
      await prisma.user.update({
        where: { id: proof.userId },
        data: { totalPoints: { increment: proof.points } },
      });

      await prisma.point.create({
        data: {
          userId: proof.userId,
          amount: proof.points,
          reason: "Para yatırma kanıtı onaylandı",
        },
      });
    }

    await prisma.depositProof.update({
      where: { id },
      data: { status: "approved" },
    });

    await ctx.answerCbQuery("✅ Kanıt onaylandı");
    await ctx.reply(
      `✅ *Yatırım Kanıtı Onaylandı*\n\n` +
      `👤 ${proof.user.name}\n` +
      `🌐 ${proof.site.name}\n` +
      `💰 +${proof.points} puan verildi`,
      { parse_mode: "Markdown" }
    );
  }));

  bot.action(/^proof_reject_(.+)$/, adminOnly(async (ctx) => {
    const id = (ctx.match as RegExpMatchArray)[1];

    const proof = await prisma.depositProof.findUnique({
      where: { id },
      include: { user: { select: { name: true } }, site: { select: { name: true } } },
    });

    if (!proof) {
      await ctx.answerCbQuery("Kanıt bulunamadı");
      return;
    }

    if (proof.status === "rejected") {
      await ctx.answerCbQuery("Bu kanıt zaten reddedilmiş");
      return;
    }

    if (proof.status === "approved") {
      await prisma.user.update({
        where: { id: proof.userId },
        data: { totalPoints: { decrement: proof.points } },
      });

      await prisma.point.create({
        data: {
          userId: proof.userId,
          amount: -proof.points,
          reason: "Para yatırma kanıtı reddedildi (iade)",
        },
      });
    }

    await prisma.depositProof.update({
      where: { id },
      data: { status: "rejected" },
    });

    await ctx.answerCbQuery("❌ Kanıt reddedildi");
    await ctx.reply(
      `❌ *Yatırım Kanıtı Reddedildi*\n\n` +
      `👤 ${proof.user.name}\n` +
      `🌐 ${proof.site.name}`,
      { parse_mode: "Markdown" }
    );
  }));
}
