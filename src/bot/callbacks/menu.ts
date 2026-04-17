import { Telegraf } from "telegraf";
import { adminOnly } from "../index";
import { handleStats } from "../commands/stats";
import { handleSites } from "../commands/sites";
import { handleBonuses } from "../commands/bonuses";
import { handleUsers } from "../commands/users";
import { handleRedemptions } from "../commands/redemptions";
import { handleProofs } from "../commands/proofs";
import { handleSettings } from "../commands/settings";
import { handleStart } from "../commands/start";

export function setupMenuCallbacks(bot: Telegraf) {
  bot.action("menu_stats", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleStats(ctx);
  }));

  bot.action("menu_sites", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleSites(ctx);
  }));

  bot.action("menu_bonuses", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleBonuses(ctx);
  }));

  bot.action("menu_users", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsers(ctx);
  }));

  bot.action("menu_redemptions", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleRedemptions(ctx);
  }));

  bot.action("menu_proofs", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleProofs(ctx);
  }));

  bot.action("menu_settings", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleSettings(ctx);
  }));

  bot.action("menu_main", adminOnly(async (ctx) => {
    await ctx.answerCbQuery();
    await handleStart(ctx);
  }));
}
