import { Markup } from "telegraf";

export async function handleStart(ctx: any) {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("📊 İstatistikler", "menu_stats"),
      Markup.button.callback("🌐 Siteler", "menu_sites"),
    ],
    [
      Markup.button.callback("🎁 Bonuslar", "menu_bonuses"),
      Markup.button.callback("👥 Kullanıcılar", "menu_users"),
    ],
    [
      Markup.button.callback("💱 Çevirme Talepleri", "menu_redemptions"),
      Markup.button.callback("📸 Yatırım Kanıtları", "menu_proofs"),
    ],
    [
      Markup.button.callback("⚙️ Ayarlar", "menu_settings"),
    ],
  ]);

  await ctx.reply(
    "🤖 *SlotBuse Admin Bot*\n\n" +
    "Hoş geldiniz! Aşağıdaki menüden işlem seçin veya komut kullanın:\n\n" +
    "📊 /stats - İstatistikler\n" +
    "🌐 /siteler - Site yönetimi\n" +
    "🎁 /bonuslar - Bonus yönetimi\n" +
    "👥 /kullanicilar - Kullanıcılar\n" +
    "🔍 /ara `isim` - Kullanıcı ara\n" +
    "💱 /talepler - Çevirme talepleri\n" +
    "📸 /kanitlar - Yatırım kanıtları\n" +
    "⚙️ /ayarlar - Site ayarları",
    { parse_mode: "Markdown", ...keyboard }
  );
}
