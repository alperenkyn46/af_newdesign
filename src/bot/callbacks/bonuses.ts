import { Telegraf, Markup } from "telegraf";
import { adminOnly, prisma } from "../index";

export function setupBonusCallbacks(bot: Telegraf) {
  bot.action(/^bd_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    const bonusId = (ctx.match as RegExpMatchArray)[1];

    const bonus = await prisma.bonus.findUnique({
      where: { id: bonusId },
      include: { site: { select: { name: true } } },
    });

    if (!bonus) {
      return ctx.reply("❌ Bonus bulunamadı.");
    }

    const status = bonus.isActive ? "✅ Aktif" : "❌ Pasif";

    const text =
      `🎁 *${bonus.title}*\n\n` +
      `🌐 Site: ${bonus.site.name}\n` +
      `💰 Değer: ${bonus.value}\n` +
      `📋 Tür: ${bonus.type}\n` +
      (bonus.code ? `🔑 Kod: \`${bonus.code}\`\n` : "") +
      `📝 ${bonus.description}\n\n` +
      (bonus.minDeposit ? `💳 Min Yatırım: ${bonus.minDeposit}\n` : "") +
      (bonus.wagering ? `🔄 Çevrim: ${bonus.wagering}\n` : "") +
      `📊 Durum: ${status}\n` +
      (bonus.expiresAt ? `⏰ Son Tarih: ${bonus.expiresAt.toLocaleDateString("tr-TR")}\n` : "");

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          bonus.isActive ? "❌ Pasife Al" : "✅ Aktife Al",
          `bonus_toggle_${bonus.id}`
        ),
        Markup.button.callback("🗑️ Sil", `bonus_delete_${bonus.id}`),
      ],
      [Markup.button.callback("◀️ Geri", "menu_bonuses")],
    ]);

    await ctx.reply(text, { parse_mode: "Markdown", ...keyboard });
  }));

  bot.action(/^bonus_toggle_(.+)$/, adminOnly(async (ctx) => {
    const bonusId = (ctx.match as RegExpMatchArray)[1];
    const bonus = await prisma.bonus.findUnique({ where: { id: bonusId } });
    if (!bonus) {
      await ctx.answerCbQuery("Bonus bulunamadı");
      return;
    }

    await prisma.bonus.update({
      where: { id: bonusId },
      data: { isActive: !bonus.isActive },
    });

    await ctx.answerCbQuery(bonus.isActive ? "❌ Bonus pasife alındı" : "✅ Bonus aktife alındı");
    await ctx.reply(`${bonus.isActive ? "❌" : "✅"} *${bonus.title}* ${bonus.isActive ? "pasife alındı" : "aktife alındı"}.`, { parse_mode: "Markdown" });
  }));

  bot.action(/^bonus_delete_(.+)$/, adminOnly(async (ctx) => {
    const bonusId = (ctx.match as RegExpMatchArray)[1];
    try {
      const bonus = await prisma.bonus.delete({ where: { id: bonusId } });
      await ctx.answerCbQuery("🗑️ Bonus silindi");
      await ctx.reply(`🗑️ *${bonus.title}* bonusu silindi.`, { parse_mode: "Markdown" });
    } catch {
      await ctx.answerCbQuery("Hata oluştu");
    }
  }));
}
