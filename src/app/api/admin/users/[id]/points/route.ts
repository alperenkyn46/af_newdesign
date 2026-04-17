import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserVipLevel } from "@/lib/vip";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { amount, reason } = await request.json();

  if (!amount || !reason) {
    return NextResponse.json({ error: "Miktar ve sebep gerekli" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // Update user points
  await prisma.user.update({
    where: { id },
    data: { totalPoints: { increment: amount } },
  });

  // Create point record
  await prisma.point.create({
    data: {
      userId: id,
      amount,
      reason: `Admin: ${reason}`,
    },
  });

  // Update VIP level based on new points
  const newVipLevel = await updateUserVipLevel(id);

  return NextResponse.json({ success: true, newVipLevel });
}
