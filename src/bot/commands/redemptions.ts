import { Markup } from "telegraf";
import { prisma } from "../index";

export async function handleRedemptions(ctx: any) {
  const redemptions = await prisma.redemption.findMany({
    where: { status: "pending" },
    include: {
      user: { select: { name: true, email: true } },
      site: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  if (redemptions.length === 0) {
    return ctx.reply("✅ Bekleyen çevirme talebi yok!");
  }

  let text = `💱 *Bekleyen Çevirme Talepleri* (${redemptions.length})\n\n`;

  redemptions.forEach((r, idx) => {
    text += `${idx + 1}. *${r.user.name}*\n`;
    text += `   🌐 ${r.site.name} | 💰 ${r.points} puan → ${r.amount}\n`;
    text += `   📅 ${r.createdAt.toLocaleDateString("tr-TR")}\n\n`;
  });

  const buttons = redemptions.slice(0, 8).map((r) => [
    Markup.button.callback(
      `✅ Onayla: ${r.user.name} (${r.points}p)`,
      `redeem_approve_${r.id}`
    ),
    Markup.button.callback("❌", `redeem_reject_${r.id}`),
  ]);

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons),
  });
}
