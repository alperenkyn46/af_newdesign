import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import { setupCommands } from "./commands";
import { setupCallbacks } from "./callbacks";
import { setupNotifications } from "./notifications";
import { isInSiteAddFlow, handleSiteAddMessage } from "./conversations/site-add";

const prisma = new PrismaClient();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_IDS = (process.env.TELEGRAM_ADMIN_IDS || "").split(",").map((id) => id.trim()).filter(Boolean);

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set");
  process.exit(1);
}

if (ADMIN_CHAT_IDS.length === 0) {
  console.error("TELEGRAM_ADMIN_IDS is not set");
  process.exit(1);
}

console.log("🔧 Bot yapılandırılıyor...");

const bot = new Telegraf(BOT_TOKEN);

export function isAdmin(chatId: number | string): boolean {
  return ADMIN_CHAT_IDS.includes(String(chatId));
}

export function getAdminChatIds(): string[] {
  return ADMIN_CHAT_IDS;
}

export { prisma, bot };

export function adminOnly(handler: (ctx: any) => Promise<void>) {
  return async (ctx: any) => {
    if (!isAdmin(ctx.chat?.id)) {
      return ctx.reply("⛔ Bu komutu kullanma yetkiniz yok.");
    }
    return handler(ctx);
  };
}

setupCommands(bot);
setupCallbacks(bot);

bot.on("message", async (ctx) => {
  if (!isAdmin(ctx.chat?.id)) return;

  if (isInSiteAddFlow(ctx.chat!.id)) {
    await handleSiteAddMessage(ctx);
    return;
  }
});

bot.catch((err: any) => {
  console.error("Bot error:", err);
});

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Veritabanı bağlantısı başarılı");

    setupNotifications(bot, prisma);

    bot.launch().then(() => {
      console.log("🤖 SlotBuse Admin Bot başlatıldı!");
    });

    console.log("🚀 Bot başlatılıyor...");
  } catch (err) {
    console.error("❌ Bot başlatılırken hata:", err);
    process.exit(1);
  }
}

main();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
