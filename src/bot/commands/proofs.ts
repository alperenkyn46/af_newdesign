import { Markup } from "telegraf";
import { prisma } from "../index";

export async function handleProofs(ctx: any) {
  const proofs = await prisma.depositProof.findMany({
    where: { status: "pending" },
    include: {
      user: { select: { name: true, email: true, telegramUsername: true } },
      site: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (proofs.length === 0) {
    return ctx.reply("✅ Bekleyen yatırım kanıtı yok!");
  }

  for (const proof of proofs) {
    const text =
      `📸 *Yatırım Kanıtı*\n\n` +
      `👤 *${proof.user.name}* (${proof.user.email})\n` +
      (proof.user.telegramUsername ? `📱 @${proof.user.telegramUsername}\n` : "") +
      `🌐 Site: ${proof.site.name}\n` +
      `💰 Tutar: ${proof.amount || "Belirtilmemiş"}\n` +
      `🏆 Puan: ${proof.points}\n` +
      `📅 ${proof.createdAt.toLocaleDateString("tr-TR")}`;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Onayla", `proof_approve_${proof.id}`),
        Markup.button.callback("❌ Reddet", `proof_reject_${proof.id}`),
      ],
    ]);

    try {
      const imageUrl = proof.imageUrl.startsWith("http")
        ? proof.imageUrl
        : `${process.env.NEXTAUTH_URL}${proof.imageUrl}`;

      await ctx.replyWithPhoto(imageUrl, {
        caption: text,
        parse_mode: "Markdown",
        ...keyboard,
      });
    } catch {
      await ctx.reply(text + `\n\n🖼️ Fotoğraf: ${proof.imageUrl}`, {
        parse_mode: "Markdown",
        ...keyboard,
      });
    }
  }
}
