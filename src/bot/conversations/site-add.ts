import { prisma } from "../index";

interface SiteAddSession {
  step: "name" | "url" | "description" | "tier" | "logo" | "confirm";
  data: {
    name: string;
    slug: string;
    url: string;
    description: string;
    sponsorTier: string;
    logo: string;
  };
}

const sessions = new Map<number, SiteAddSession>();

export function isInSiteAddFlow(chatId: number): boolean {
  return sessions.has(chatId);
}

export function startSiteAddFlow(chatId: number) {
  sessions.set(chatId, {
    step: "name",
    data: { name: "", slug: "", url: "", description: "", sponsorTier: "premium", logo: "" },
  });
}

export function cancelSiteAddFlow(chatId: number) {
  sessions.delete(chatId);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function handleSiteAddMessage(ctx: any): Promise<boolean> {
  const chatId = ctx.chat?.id;
  if (!chatId || !sessions.has(chatId)) return false;

  const session = sessions.get(chatId)!;

  if (ctx.message?.text === "/iptal") {
    sessions.delete(chatId);
    await ctx.reply("❌ Site ekleme iptal edildi.");
    return true;
  }

  switch (session.step) {
    case "name": {
      const name = ctx.message?.text?.trim();
      if (!name) {
        await ctx.reply("❌ Lütfen geçerli bir site adı girin.");
        return true;
      }
      session.data.name = name;
      session.data.slug = generateSlug(name);
      session.step = "url";
      await ctx.reply(
        `✅ Site adı: *${name}*\n\n` +
        `🔗 Şimdi site URL'sini (affiliate link) girin:`,
        { parse_mode: "Markdown" }
      );
      return true;
    }

    case "url": {
      const url = ctx.message?.text?.trim();
      if (!url) {
        await ctx.reply("❌ Lütfen geçerli bir URL girin.");
        return true;
      }
      session.data.url = url;
      session.step = "description";
      await ctx.reply(
        `✅ URL: ${url}\n\n` +
        `📝 Şimdi site açıklamasını girin:`,
      );
      return true;
    }

    case "description": {
      const desc = ctx.message?.text?.trim();
      if (!desc) {
        await ctx.reply("❌ Lütfen bir açıklama girin.");
        return true;
      }
      session.data.description = desc;
      session.step = "tier";

      const { Markup } = await import("telegraf");
      await ctx.reply(
        "🏷️ Sponsor seviyesini seçin:",
        Markup.inlineKeyboard([
          [
            Markup.button.callback("🥇 Premium", "siteadd_tier_premium"),
            Markup.button.callback("💎 VIP", "siteadd_tier_vip"),
            Markup.button.callback("💠 Diamond", "siteadd_tier_diamond"),
          ],
        ])
      );
      return true;
    }

    case "logo": {
      if (ctx.message?.photo) {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const file = await ctx.telegram.getFile(photo.file_id);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

        try {
          const response = await fetch(fileUrl);
          const buffer = Buffer.from(await response.arrayBuffer());

          const { writeFile, mkdir } = await import("fs/promises");
          const path = await import("path");

          const uploadDir = path.join(process.cwd(), "public", "uploads", "sites");
          await mkdir(uploadDir, { recursive: true });

          const ext = file.file_path?.split(".").pop() || "jpg";
          const fileName = `${Date.now()}-${session.data.slug}.${ext}`;
          const filePath = path.join(uploadDir, fileName);

          await writeFile(filePath, buffer);
          session.data.logo = `/uploads/sites/${fileName}`;

          await ctx.reply(`✅ Logo kaydedildi!`);
        } catch (err) {
          console.error("Logo upload error:", err);
          await ctx.reply("❌ Logo yüklenirken hata oluştu. Logosuz devam edilecek.");
        }
      } else if (ctx.message?.text?.trim()) {
        const text = ctx.message.text.trim();
        if (text.startsWith("http")) {
          session.data.logo = text;
        } else {
          await ctx.reply("❌ Geçerli bir URL girin veya fotoğraf gönderin. Atlamak için 'geç' yazın.");
          return true;
        }
      }

      if (ctx.message?.text?.toLowerCase() === "geç" || ctx.message?.text?.toLowerCase() === "gec") {
        session.data.logo = "";
      }

      session.step = "confirm";
      await showConfirmation(ctx, session);
      return true;
    }

    default:
      return false;
  }
}

export async function handleTierSelection(ctx: any, tier: string) {
  const chatId = ctx.chat?.id;
  if (!chatId || !sessions.has(chatId)) return;

  const session = sessions.get(chatId)!;
  session.data.sponsorTier = tier;
  session.step = "logo";

  await ctx.answerCbQuery(`${tier} seçildi`);
  await ctx.reply(
    `✅ Tier: *${tier}*\n\n` +
    `🖼️ Şimdi site logosunu gönderin:\n` +
    `• Fotoğraf olarak gönderin\n` +
    `• Veya logo URL'si girin\n` +
    `• Atlamak için 'geç' yazın`,
    { parse_mode: "Markdown" }
  );
}

async function showConfirmation(ctx: any, session: SiteAddSession) {
  const d = session.data;
  const { Markup } = await import("telegraf");

  const text =
    `📋 *Site Özeti*\n\n` +
    `📛 Ad: *${d.name}*\n` +
    `📎 Slug: ${d.slug}\n` +
    `🔗 URL: ${d.url}\n` +
    `📝 Açıklama: ${d.description}\n` +
    `🏷️ Tier: ${d.sponsorTier}\n` +
    `🖼️ Logo: ${d.logo || "Yok"}\n\n` +
    `Onaylıyor musunuz?`;

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Onayla ve Kaydet", "siteadd_confirm"),
        Markup.button.callback("❌ İptal", "siteadd_cancel"),
      ],
    ]),
  });
}

export async function confirmSiteAdd(ctx: any) {
  const chatId = ctx.chat?.id;
  if (!chatId || !sessions.has(chatId)) {
    await ctx.answerCbQuery("Oturum bulunamadı");
    return;
  }

  const session = sessions.get(chatId)!;
  const d = session.data;

  try {
    const site = await prisma.bettingSite.create({
      data: {
        name: d.name,
        slug: d.slug,
        logo: d.logo,
        url: d.url,
        description: d.description,
        sponsorTier: d.sponsorTier,
        rating: 4.5,
        features: "",
        isActive: true,
        isFeatured: false,
        order: 0,
      },
    });

    sessions.delete(chatId);
    await ctx.answerCbQuery("✅ Site eklendi!");
    await ctx.reply(`✅ *${site.name}* sitesi başarıyla eklendi!`, { parse_mode: "Markdown" });
  } catch (error: any) {
    if (error.code === "P2002") {
      await ctx.answerCbQuery("Hata");
      await ctx.reply("❌ Bu slug zaten kullanılıyor. /iptal yazıp tekrar deneyin.");
    } else {
      console.error("Site create error:", error);
      await ctx.answerCbQuery("Hata");
      await ctx.reply("❌ Site eklenirken hata oluştu.");
    }
    sessions.delete(chatId);
  }
}
