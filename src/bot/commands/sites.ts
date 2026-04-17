import { Markup } from "telegraf";
import { prisma } from "../index";

export async function handleSites(ctx: any) {
  const sites = await prisma.bettingSite.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { bonuses: true } } },
  });

  if (sites.length === 0) {
    return ctx.reply("🌐 Henüz site eklenmemiş.");
  }

  let text = "🌐 *Bahis Siteleri*\n\n";

  sites.forEach((site, idx) => {
    const status = site.isActive ? "✅" : "❌";
    const featured = site.isFeatured ? "⭐" : "";
    text += `${idx + 1}. ${status} ${featured} *${site.name}*\n`;
    text += `   ⭐ ${site.rating} | 🎁 ${site._count.bonuses} bonus | Sıra: ${site.order}\n`;
    text += `   Tier: ${site.sponsorTier}\n\n`;
  });

  const buttons = sites.map((site) => [
    Markup.button.callback(`📝 ${site.name}`, `site_detail_${site.id}`),
  ]);

  buttons.push([Markup.button.callback("➕ Yeni Site Ekle", "site_add")]);

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons),
  });
}

export async function handleSiteDetail(ctx: any, siteId: string) {
  const site = await prisma.bettingSite.findUnique({
    where: { id: siteId },
    include: {
      _count: { select: { bonuses: true, redemptions: true, depositProofs: true } },
    },
  });

  if (!site) {
    return ctx.reply("❌ Site bulunamadı.");
  }

  const status = site.isActive ? "✅ Aktif" : "❌ Pasif";
  const featured = site.isFeatured ? "⭐ Evet" : "Hayır";

  const text =
    `🌐 *${site.name}*\n\n` +
    `📎 Slug: \`${site.slug}\`\n` +
    `🔗 URL: ${site.url}\n` +
    `📝 ${site.description}\n\n` +
    `⭐ Puan: ${site.rating}\n` +
    `📊 Durum: ${status}\n` +
    `🏆 Öne Çıkan: ${featured}\n` +
    `🏷️ Tier: ${site.sponsorTier}\n` +
    `📋 Sıra: ${site.order}\n\n` +
    `🎁 Bonuslar: ${site._count.bonuses}\n` +
    `💱 Çevirmeler: ${site._count.redemptions}\n` +
    `📸 Kanıtlar: ${site._count.depositProofs}`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        site.isActive ? "❌ Pasife Al" : "✅ Aktife Al",
        `site_toggle_${site.id}`
      ),
      Markup.button.callback(
        site.isFeatured ? "⭐ Öne Çıkarma" : "⭐ Öne Çıkar",
        `site_featured_${site.id}`
      ),
    ],
    [
      Markup.button.callback("🗑️ Sil", `site_delete_${site.id}`),
      Markup.button.callback("◀️ Geri", "menu_sites"),
    ],
  ]);

  if (site.logo) {
    try {
      await ctx.replyWithPhoto(site.logo.startsWith("http") ? site.logo : `${process.env.NEXTAUTH_URL}${site.logo}`, {
        caption: text,
        parse_mode: "Markdown",
        ...keyboard,
      });
    } catch {
      await ctx.reply(text, { parse_mode: "Markdown", ...keyboard });
    }
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...keyboard });
  }
}
