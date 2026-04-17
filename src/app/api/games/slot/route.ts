import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣"];
const PAYOUTS: Record<string, number> = {
  "🍒🍒🍒": 3,
  "🍋🍋🍋": 5,
  "🍊🍊🍊": 8,
  "🍇🍇🍇": 10,
  "⭐⭐⭐": 15,
  "💎💎💎": 25,
  "7️⃣7️⃣7️⃣": 50,
};

const SYMBOL_WEIGHTS = [30, 25, 20, 15, 6, 3, 1]; // Total: 100

function getRandomSymbol(): string {
  const total = SYMBOL_WEIGHTS.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < SYMBOLS.length; i++) {
    random -= SYMBOL_WEIGHTS[i];
    if (random <= 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
}

function calculateWin(symbols: string[], bet: number, vipMultiplier: number): { multiplier: number; winAmount: number } {
  const key = symbols.join("");
  const baseMultiplier = PAYOUTS[key] || 0;
  
  // Check for two matching symbols (small win)
  let twoMatch = 0;
  if (symbols[0] === symbols[1] || symbols[1] === symbols[2]) {
    twoMatch = 0.5;
  }
  
  const multiplier = baseMultiplier || twoMatch;
  const winAmount = Math.floor(bet * multiplier * vipMultiplier);
  
  return { multiplier, winAmount };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bet } = await request.json();

  const settings = await prisma.siteSettings.findFirst();
  const minBet = settings?.slotMinBet || 10;
  const maxBet = settings?.slotMaxBet || 1000;

  if (!bet || bet < minBet || bet > maxBet) {
    return NextResponse.json({ 
      error: `Bahis ${minBet} ile ${maxBet} puan arasında olmalı` 
    }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totalPoints: true, vipLevel: true },
  });

  if (!user || user.totalPoints < bet) {
    return NextResponse.json({ error: "Yetersiz puan" }, { status: 400 });
  }

  const vipMultiplier = 
    user.vipLevel === "platinum" ? 1.5 :
    user.vipLevel === "gold" ? 1.25 :
    user.vipLevel === "silver" ? 1.1 : 1.0;

  // Generate symbols
  const symbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  const { multiplier, winAmount } = calculateWin(symbols, bet, vipMultiplier);

  const netResult = winAmount - bet;
  const resultType = winAmount > 0 ? (winAmount > bet ? "win" : "partial") : "lose";

  // Update user points
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { increment: netResult } },
  });

  // Log the game
  await prisma.slotGame.create({
    data: {
      userId: session.user.id,
      bet,
      result: resultType,
      winAmount,
      symbols: symbols.join(""),
    },
  });

  // Log point change
  if (netResult !== 0) {
    await prisma.point.create({
      data: {
        userId: session.user.id,
        amount: netResult,
        reason: netResult > 0 
          ? `Slot kazancı: ${symbols.join(" ")} (${multiplier}x)` 
          : `Slot kaybı: ${symbols.join(" ")}`,
      },
    });
  }

  return NextResponse.json({
    symbols,
    multiplier,
    winAmount,
    netResult,
    newBalance: user.totalPoints + netResult,
    vipMultiplier,
  });
}
