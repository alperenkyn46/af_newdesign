import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, points, probability, color } = await request.json();

  const count = await prisma.wheelPrize.count();

  const prize = await prisma.wheelPrize.create({
    data: {
      name,
      points,
      probability,
      color,
      order: count,
    },
  });

  return NextResponse.json(prize);
}
