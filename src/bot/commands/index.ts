import { Telegraf } from "telegraf";
import { adminOnly } from "../index";
import { handleStart } from "./start";
import { handleStats } from "./stats";
import { handleSites, handleSiteDetail } from "./sites";
import { handleBonuses } from "./bonuses";
import { handleUsers, handleUserSearch } from "./users";
import { handleRedemptions } from "./redemptions";
import { handleProofs } from "./proofs";
import { handleSettings } from "./settings";

export function setupCommands(bot: Telegraf) {
  bot.command("start", adminOnly(handleStart));
  bot.command("menu", adminOnly(handleStart));
  bot.command("stats", adminOnly(handleStats));
  bot.command("siteler", adminOnly(handleSites));
  bot.command("bonuslar", adminOnly(handleBonuses));
  bot.command("kullanicilar", adminOnly(handleUsers));
  bot.command("ara", adminOnly(handleUserSearch));
  bot.command("talepler", adminOnly(handleRedemptions));
  bot.command("kanitlar", adminOnly(handleProofs));
  bot.command("ayarlar", adminOnly(handleSettings));
}
