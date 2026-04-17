import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const defaultPrizes = [
  { name: "10 Puan", points: 10, probability: 25, color: "#3B82F6" },
  { name: "25 Puan", points: 25, probability: 20, color: "#8B5CF6" },
  { name: "50 Puan", points: 50, probability: 15, color: "#EC4899" },
  { name: "100 Puan", points: 100, probability: 10, color: "#F59E0B" },
  { name: "5 Puan", points: 5, probability: 30, color: "#6B7280" },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const todaySpin = await prisma.wheelSpin.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  let prizes = await prisma.wheelPrize.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  if (prizes.length === 0) {
    prizes = defaultPrizes.map((p, i) => ({ ...p, id: String(i), isActive: true, order: i }));
  }

  return NextResponse.json({
    canSpin: !todaySpin,
    lastPrize: todaySpin?.prize || null,
    lastPoints: todaySpin?.points || 0,
    prizes,
  });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const existingSpin = await prisma.wheelSpin.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  if (existingSpin) {
    return NextResponse.json({ error: "Bugün zaten çark çevirdiniz" }, { status: 400 });
  }

  let prizes = await prisma.wheelPrize.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  if (prizes.length === 0) {
    prizes = defaultPrizes.map((p, i) => ({ ...p, id: String(i), isActive: true, order: i }));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { vipLevel: true },
  });

  const vipBonus = 
    user?.vipLevel === "platinum" ? 50 :
    user?.vipLevel === "gold" ? 25 :
    user?.vipLevel === "silver" ? 10 : 0;

  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
  let random = Math.random() * totalProbability;
  
  let selectedPrize = prizes[0];
  for (const prize of prizes) {
    random -= prize.probability;
    if (random <= 0) {
      selectedPrize = prize;
      break;
    }
  }

  const totalPoints = selectedPrize.points + vipBonus;
  const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);

  await prisma.wheelSpin.create({
    data: {
      userId: session.user.id,
      prize: selectedPrize.name,
      points: totalPoints,
      date: today,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { increment: totalPoints } },
  });

  await prisma.point.create({
    data: {
      userId: session.user.id,
      amount: totalPoints,
      reason: `Çark çevir: ${selectedPrize.name}${vipBonus > 0 ? ` (+${vipBonus} VIP bonus)` : ""}`,
    },
  });

  return NextResponse.json({
    prize: selectedPrize.name,
    points: totalPoints,
    prizeIndex,
    vipBonus,
  });
}
