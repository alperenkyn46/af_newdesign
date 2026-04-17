import { Telegraf } from "telegraf";
import { adminOnly } from "../index";
import { setupMenuCallbacks } from "./menu";
import { setupSiteCallbacks } from "./sites";
import { setupBonusCallbacks } from "./bonuses";
import { setupUserCallbacks } from "./users";
import { setupRedemptionCallbacks } from "./redemptions";
import { setupProofCallbacks } from "./proofs";

export function setupCallbacks(bot: Telegraf) {
  setupMenuCallbacks(bot);
  setupSiteCallbacks(bot);
  setupBonusCallbacks(bot);
  setupUserCallbacks(bot);
  setupRedemptionCallbacks(bot);
  setupProofCallbacks(bot);
}
