import { prisma } from "@/lib/prisma";

const DEFAULT_VIP_LEVELS = [
  { name: "bronze", minPoints: 0, maxPoints: 499, bonusMultiplier: 1.0, dailyBonus: 10, wheelBonus: 0, slotBonus: 0, color: "#CD7F32" },
  { name: "silver", minPoints: 500, maxPoints: 1999, bonusMultiplier: 1.25, dailyBonus: 15, wheelBonus: 10, slotBonus: 10, color: "#C0C0C0" },
  { name: "gold", minPoints: 2000, maxPoints: 4999, bonusMultiplier: 1.5, dailyBonus: 25, wheelBonus: 25, slotBonus: 25, color: "#FFD700" },
  { name: "platinum", minPoints: 5000, maxPoints: 999999, bonusMultiplier: 2.0, dailyBonus: 50, wheelBonus: 50, slotBonus: 50, color: "#E5E4E2" },
];

export async function getVipLevels() {
  const dbLevels = await prisma.vipLevel.findMany({
    orderBy: { minPoints: "asc" },
  });

  if (dbLevels.length === 0) {
    return DEFAULT_VIP_LEVELS;
  }

  return dbLevels;
}

export function determineVipLevel(totalPoints: number, levels: typeof DEFAULT_VIP_LEVELS) {
  let currentLevel = levels[0];
  for (const level of levels) {
    if (totalPoints >= level.minPoints) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

export async function updateUserVipLevel(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPoints: true, vipLevel: true },
  });

  if (!user) return null;

  const levels = await getVipLevels();
  const correctLevel = determineVipLevel(user.totalPoints, levels);

  if (correctLevel.name !== user.vipLevel) {
    await prisma.user.update({
      where: { id: userId },
      data: { vipLevel: correctLevel.name },
    });
    return correctLevel.name;
  }

  return user.vipLevel;
}

export async function ensureDefaultVipLevels() {
  const existingLevels = await prisma.vipLevel.count();
  
  if (existingLevels === 0) {
    for (const level of DEFAULT_VIP_LEVELS) {
      await prisma.vipLevel.create({
        data: level,
      });
    }
  }
}
