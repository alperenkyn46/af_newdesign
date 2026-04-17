import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_VIP_LEVELS = [
  { name: "bronze", minPoints: 0, maxPoints: 499, bonusMultiplier: 1.0, dailyBonus: 10, wheelBonus: 0, slotBonus: 0, color: "#CD7F32" },
  { name: "silver", minPoints: 500, maxPoints: 1999, bonusMultiplier: 1.25, dailyBonus: 15, wheelBonus: 10, slotBonus: 10, color: "#C0C0C0" },
  { name: "gold", minPoints: 2000, maxPoints: 4999, bonusMultiplier: 1.5, dailyBonus: 25, wheelBonus: 25, slotBonus: 25, color: "#FFD700" },
  { name: "platinum", minPoints: 5000, maxPoints: 999999, bonusMultiplier: 2.0, dailyBonus: 50, wheelBonus: 50, slotBonus: 50, color: "#E5E4E2" },
];

async function getVipLevels() {
  const dbLevels = await prisma.vipLevel.findMany({
    orderBy: { minPoints: "asc" },
  });

  if (dbLevels.length === 0) {
    return DEFAULT_VIP_LEVELS;
  }

  return dbLevels;
}

function determineVipLevel(totalPoints: number, levels: typeof DEFAULT_VIP_LEVELS) {
  let currentLevel = levels[0];
  for (const level of levels) {
    if (totalPoints >= level.minPoints) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totalPoints: true, vipLevel: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const levels = await getVipLevels();
  
  // Otomatik seviye güncelleme
  const correctLevel = determineVipLevel(user.totalPoints, levels);
  
  if (correctLevel.name !== user.vipLevel) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { vipLevel: correctLevel.name },
    });
    user.vipLevel = correctLevel.name;
  }

  const currentLevel = levels.find(l => l.name === user.vipLevel) || levels[0];
  const nextLevel = levels.find(l => l.minPoints > user.totalPoints);
  
  const pointsToNext = nextLevel ? nextLevel.minPoints - user.totalPoints : 0;
  const progress = nextLevel 
    ? ((user.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 
    : 100;

  return NextResponse.json({
    currentLevel: user.vipLevel,
    totalPoints: user.totalPoints,
    levels: levels,
    currentLevelData: currentLevel,
    nextLevel: nextLevel || null,
    pointsToNext,
    progress: Math.min(progress, 100),
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totalPoints: true, vipLevel: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const levels = await getVipLevels();
  const correctLevel = determineVipLevel(user.totalPoints, levels);

  if (correctLevel.name !== user.vipLevel) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { vipLevel: correctLevel.name },
    });

    return NextResponse.json({ 
      levelChanged: true, 
      oldLevel: user.vipLevel, 
      newLevel: correctLevel.name 
    });
  }

  return NextResponse.json({ levelChanged: false, currentLevel: user.vipLevel });
}
