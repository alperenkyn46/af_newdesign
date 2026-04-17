import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redemptions = await prisma.redemption.findMany({
    where: { userId: session.user.id },
    include: { site: { select: { name: true, logo: true } } },
    orderBy: { createdAt: "desc" },
  });

  const sites = await prisma.bettingSite.findMany({
    where: { isActive: true },
    select: { id: true, name: true, logo: true, url: true },
  });

  // Redemption options
  const options = [
    { points: 500, amount: "5 TL" },
    { points: 1000, amount: "10 TL" },
    { points: 2500, amount: "25 TL" },
    { points: 5000, amount: "50 TL" },
    { points: 10000, amount: "100 TL" },
  ];

  return NextResponse.json({ redemptions, sites, options });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId, points, amount } = await request.json();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totalPoints: true },
  });

  if (!user || user.totalPoints < points) {
    return NextResponse.json({ error: "Yetersiz puan" }, { status: 400 });
  }

  const site = await prisma.bettingSite.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
  }

  await prisma.redemption.create({
    data: {
      userId: session.user.id,
      siteId,
      points,
      amount,
      status: "pending",
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { decrement: points } },
  });

  await prisma.point.create({
    data: {
      userId: session.user.id,
      amount: -points,
      reason: `Bakiye çevirme: ${site.name} - ${amount}`,
    },
  });

  return NextResponse.json({ success: true, message: "Talebiniz alındı" });
}
