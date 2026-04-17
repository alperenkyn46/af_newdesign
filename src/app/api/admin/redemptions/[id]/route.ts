import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const redemption = await prisma.redemption.update({
    where: { id },
    data: { status },
  });

  // If rejected, refund points
  if (status === "rejected") {
    await prisma.user.update({
      where: { id: redemption.userId },
      data: { totalPoints: { increment: redemption.points } },
    });

    await prisma.point.create({
      data: {
        userId: redemption.userId,
        amount: redemption.points,
        reason: "Reddedilen çevirme talebi iadesi",
      },
    });
  }

  return NextResponse.json({ success: true });
}
