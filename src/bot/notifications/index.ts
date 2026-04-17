import { Telegraf, Markup } from "telegraf";
import { PrismaClient } from "@prisma/client";
import { getAdminChatIds } from "../index";

let lastRedemptionCheck = new Date();
let lastProofCheck = new Date();

export function setupNotifications(bot: Telegraf, prisma: PrismaClient) {
  const POLL_INTERVAL = 30_000; // 30 saniyede bir kontrol

  async function checkNewRedemptions() {
    try {
      const newRedemptions = await prisma.redemption.findMany({
        where: {
          status: "pending",
          createdAt: { gt: lastRedemptionCheck },
        },
        include: {
          user: { select: { name: true, email: true } },
          site: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      lastRedemptionCheck = new Date();

      for (const r of newRedemptions) {
        const text =
          `🔔 *Yeni Çevirme Talebi!*\n\n` +
          `👤 ${r.user.name} (${r.user.email})\n` +
          `🌐 ${r.site.name}\n` +
          `💰 ${r.points} puan → ${r.amount}\n` +
          `📅 ${r.createdAt.toLocaleDateString("tr-TR")}`;

        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Onayla", `redeem_approve_${r.id}`),
            Markup.button.callback("❌ Reddet", `redeem_reject_${r.id}`),
          ],
        ]);

        for (const chatId of getAdminChatIds()) {
          try {
            await bot.telegram.sendMessage(chatId, text, {
              parse_mode: "Markdown",
              ...keyboard,
            });
          } catch (err) {
            console.error(`Failed to send notification to ${chatId}:`, err);
          }
        }
      }
    } catch (err) {
      console.error("Error checking new redemptions:", err);
    }
  }

  async function checkNewProofs() {
    try {
      const newProofs = await prisma.depositProof.findMany({
        where: {
          status: "pending",
          createdAt: { gt: lastProofCheck },
        },
        include: {
          user: { select: { name: true, email: true, telegramUsername: true } },
          site: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      lastProofCheck = new Date();

      for (const proof of newProofs) {
        const text =
          `🔔 *Yeni Yatırım Kanıtı!*\n\n` +
          `👤 ${proof.user.name} (${proof.user.email})\n` +
          (proof.user.telegramUsername ? `📱 @${proof.user.telegramUsername}\n` : "") +
          `🌐 ${proof.site.name}\n` +
          `💰 Tutar: ${proof.amount || "Belirtilmemiş"}\n` +
          `🏆 Puan: ${proof.points}`;

        const keyboard = Markup.inlineKeyboard([
          [
            Markup.button.callback("✅ Onayla", `proof_approve_${proof.id}`),
            Markup.button.callback("❌ Reddet", `proof_reject_${proof.id}`),
          ],
        ]);

        for (const chatId of getAdminChatIds()) {
          try {
            const imageUrl = proof.imageUrl.startsWith("http")
              ? proof.imageUrl
              : `${process.env.NEXTAUTH_URL}${proof.imageUrl}`;

            await bot.telegram.sendPhoto(chatId, imageUrl, {
              caption: text,
              parse_mode: "Markdown",
              ...keyboard,
            });
          } catch {
            try {
              await bot.telegram.sendMessage(
                chatId,
                text + `\n\n🖼️ ${proof.imageUrl}`,
                { parse_mode: "Markdown", ...keyboard }
              );
            } catch (err) {
              console.error(`Failed to send proof notification to ${chatId}:`, err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error checking new proofs:", err);
    }
  }

  setInterval(checkNewRedemptions, POLL_INTERVAL);
  setInterval(checkNewProofs, POLL_INTERVAL);

  console.log(`📢 Bildirim sistemi başlatıldı (${POLL_INTERVAL / 1000}s aralıkla)`);
}
