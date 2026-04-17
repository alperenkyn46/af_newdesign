import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const existing = await prisma.siteSettings.findFirst();

  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: {
        dailyBonusBase: data.dailyBonusBase,
        slotMinBet: data.slotMinBet,
        slotMaxBet: data.slotMaxBet,
        pointsPerTelegram: data.pointsPerTelegram,
        pointsPerInstagram: data.pointsPerInstagram,
        pointsPerTwitter: data.pointsPerTwitter,
        pointsPerYoutube: data.pointsPerYoutube,
      },
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        dailyBonusBase: data.dailyBonusBase,
        slotMinBet: data.slotMinBet,
        slotMaxBet: data.slotMaxBet,
        pointsPerTelegram: data.pointsPerTelegram,
        pointsPerInstagram: data.pointsPerInstagram,
        pointsPerTwitter: data.pointsPerTwitter,
        pointsPerYoutube: data.pointsPerYoutube,
      },
    });
  }

  return NextResponse.json({ success: true });
}
