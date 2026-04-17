import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [prizes, settingsData] = await Promise.all([
    prisma.wheelPrize.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findFirst(),
  ]);

  const settings = {
    dailyBonusBase: settingsData?.dailyBonusBase || 10,
    slotMinBet: settingsData?.slotMinBet || 10,
    slotMaxBet: settingsData?.slotMaxBet || 1000,
    pointsPerTelegram: settingsData?.pointsPerTelegram || 50,
    pointsPerInstagram: settingsData?.pointsPerInstagram || 30,
    pointsPerTwitter: settingsData?.pointsPerTwitter || 30,
    pointsPerYoutube: settingsData?.pointsPerYoutube || 40,
  };

  return NextResponse.json({ prizes, settings });
}
