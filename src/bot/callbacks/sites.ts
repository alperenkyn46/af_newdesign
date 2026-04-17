import { Telegraf, Markup } from "telegraf";
import { adminOnly, prisma } from "../index";
import { handleSiteDetail, handleSites } from "../commands/sites";
import {
  startSiteAddFlow,
  cancelSiteAddFlow,
  handleTierSelection,
  confirmSiteAdd,
} from "../conversations/site-add";

export function setupSiteCallbacks(bot: Telegraf) {
  bot.action(/^site_detail_(.+)$/, adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    const siteId = (ctx.match as RegExpMatchArray)[1];
    await handleSiteDetail(ctx, siteId);
  }));

  bot.action(/^site_toggle_(.+)$/, adminOnly(async (ctx) => {
    const siteId = (ctx.match as RegExpMatchArray)[1];
    const site = await prisma.bettingSite.findUnique({ where: { id: siteId } });
    if (!site) {
      await ctx.answerCbQuery("Site bulunamadı");
      return;
    }

    await prisma.bettingSite.update({
      where: { id: siteId },
      data: { isActive: !site.isActive },
    });

    await ctx.answerCbQuery(site.isActive ? "❌ Site pasife alındı" : "✅ Site aktife alındı");
    await handleSiteDetail(ctx, siteId);
  }));

  bot.action(/^site_featured_(.+)$/, adminOnly(async (ctx) => {
    const siteId = (ctx.match as RegExpMatchArray)[1];
    const site = await prisma.bettingSite.findUnique({ where: { id: siteId } });
    if (!site) {
      await ctx.answerCbQuery("Site bulunamadı");
      return;
    }

    await prisma.bettingSite.update({
      where: { id: siteId },
      data: { isFeatured: !site.isFeatured },
    });

    await ctx.answerCbQuery(site.isFeatured ? "Öne çıkarmadan kaldırıldı" : "⭐ Öne çıkarıldı");
    await handleSiteDetail(ctx, siteId);
  }));

  bot.action(/^site_delete_(.+)$/, adminOnly(async (ctx) => {
    const siteId = (ctx.match as RegExpMatchArray)[1];
    const site = await prisma.bettingSite.findUnique({ where: { id: siteId } });
    if (!site) {
      await ctx.answerCbQuery("Site bulunamadı");
      return;
    }

    await ctx.answerCbQuery();
    await ctx.reply(
      `⚠️ *${site.name}* sitesini silmek istediğinize emin misiniz?`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("🗑️ Evet, Sil", `site_confirm_delete_${siteId}`),
            Markup.button.callback("◀️ İptal", `site_detail_${siteId}`),
          ],
        ]),
      }
    );
  }));

  bot.action(/^site_confirm_delete_(.+)$/, adminOnly(async (ctx) => {
    const siteId = (ctx.match as RegExpMatchArray)[1];
    try {
      await prisma.bettingSite.delete({ where: { id: siteId } });
      await ctx.answerCbQuery("🗑️ Site silindi");
      await ctx.reply("✅ Site başarıyla silindi.");
      await handleSites(ctx);
    } catch {
      await ctx.answerCbQuery("Hata oluştu");
      await ctx.reply("❌ Site silinirken hata oluştu.");
    }
  }));

  // Site add conversation flow
  bot.action("site_add", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    startSiteAddFlow(ctx.chat!.id);
    await ctx.reply(
      "➕ *Yeni Site Ekleme*\n\n" +
      "📛 Site adını girin:\n\n" +
      "_İptal etmek için /iptal yazın_",
      { parse_mode: "Markdown" }
    );
  }));

  // Tier selection callbacks
  bot.action("siteadd_tier_premium", adminOnly(async (ctx) => {
    await handleTierSelection(ctx, "premium");
  }));
  bot.action("siteadd_tier_vip", adminOnly(async (ctx) => {
    await handleTierSelection(ctx, "vip");
  }));
  bot.action("siteadd_tier_diamond", adminOnly(async (ctx) => {
    await handleTierSelection(ctx, "diamond");
  }));

  // Confirm / Cancel
  bot.action("siteadd_confirm", adminOnly(async (ctx) => {
    await confirmSiteAdd(ctx);
  }));
  bot.action("siteadd_cancel", adminOnly(async (ctx) => {
    cancelSiteAddFlow(ctx.chat!.id);
    await ctx.answerCbQuery("İptal edildi");
    await ctx.reply("❌ Site ekleme iptal edildi.");
  }));
}
