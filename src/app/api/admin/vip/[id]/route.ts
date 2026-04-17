import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const level = await prisma.vipLevel.findUnique({
    where: { id: params.id },
  });

  if (!level) {
    return NextResponse.json({ error: "VIP seviyesi bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(level);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const level = await prisma.vipLevel.update({
    where: { id: params.id },
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

  return NextResponse.json(level);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.vipLevel.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "VIP seviyesi silindi" });
}
