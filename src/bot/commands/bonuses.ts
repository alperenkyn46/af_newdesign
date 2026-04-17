import { Markup } from "telegraf";
import { prisma } from "../index";

function cleanButtonText(text: string, maxLen: number = 40): string {
  return text.replace(/[*_`\[\]()~>#+\-=|{}.!]/g, "").trim().slice(0, maxLen) || "Bonus";
}

export async function handleBonuses(ctx: any) {
  const bonuses = await prisma.bonus.findMany({
    include: { site: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  if (bonuses.length === 0) {
    return ctx.reply("🎁 Henüz bonus eklenmemiş.");
  }

  let text = "🎁 Son Bonuslar\n\n";

  bonuses.forEach((bonus, idx) => {
    const status = bonus.isActive ? "✅" : "❌";
    text += `${idx + 1}. ${status} ${bonus.title}\n`;
    text += `   🌐 ${bonus.site.name} | 💰 ${bonus.value}\n`;
    if (bonus.code) text += `   🔑 Kod: ${bonus.code}\n`;
    text += "\n";
  });

  const buttons = bonuses.slice(0, 8).map((bonus) => [
    Markup.button.callback(
      cleanButtonText(`${bonus.isActive ? "✅" : "❌"} ${bonus.site.name} - ${bonus.title}`),
      `bd_${bonus.id}`
    ),
  ]);

  await ctx.reply(text, Markup.inlineKeyboard(buttons));
}
