import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const levels = await prisma.vipLevel.findMany({
    orderBy: { minPoints: "asc" },
  });

  return NextResponse.json(levels);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const level = await prisma.vipLevel.create({
    data: {
      name: body.name.toLowerCase(),
      minPoints: body.minPoints,
      maxPoints: body.maxPoints,
      bonusMultiplier: body.bonusMultiplier,
      dailyBonus: body.dailyBonus,
      wheelBonus: body.wheelBonus,
      slotBonus: body.slotBonus,
      color: body.color,
    },
  });

  return NextResponse.json(level, { status: 201 });
}
