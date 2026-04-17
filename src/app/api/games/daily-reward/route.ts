import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  
  const todayReward = await prisma.dailyReward.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const yesterdayReward = await prisma.dailyReward.findUnique({
    where: { userId_date: { userId: session.user.id, date: yesterdayStr } },
  });

  return NextResponse.json({
    claimed: !!todayReward,
    streak: yesterdayReward?.streak || 0,
    todayPoints: todayReward?.points || 0,
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const existingReward = await prisma.dailyReward.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  if (existingReward) {
    return NextResponse.json({ error: "Bugün zaten ödül aldınız" }, { status: 400 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const yesterdayReward = await prisma.dailyReward.findUnique({
    where: { userId_date: { userId: session.user.id, date: yesterdayStr } },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { vipLevel: true },
  });

  const settings = await prisma.siteSettings.findFirst();
  const basePoints = settings?.dailyBonusBase || 10;

  const vipMultiplier = 
    user?.vipLevel === "platinum" ? 2.0 :
    user?.vipLevel === "gold" ? 1.5 :
    user?.vipLevel === "silver" ? 1.25 : 1.0;

  const streak = yesterdayReward ? yesterdayReward.streak + 1 : 1;
  const streakBonus = Math.min(streak, 7) * 5;
  const points = Math.floor((basePoints + streakBonus) * vipMultiplier);

  await prisma.dailyReward.create({
    data: {
      userId: session.user.id,
      date: today,
      points,
      streak,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { increment: points } },
  });

  await prisma.point.create({
    data: {
      userId: session.user.id,
      amount: points,
      reason: `Günlük ödül (${streak}. gün seri)`,
    },
  });

  return NextResponse.json({ points, streak });
}
