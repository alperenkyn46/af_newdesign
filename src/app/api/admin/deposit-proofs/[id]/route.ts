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

  const proof = await prisma.depositProof.findUnique({
    where: { id },
  });

  if (!proof) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 });
  }

  // Eğer onaylanıyorsa ve daha önce onaylanmamışsa puan ver
  if (status === "approved" && proof.status !== "approved") {
    await prisma.user.update({
      where: { id: proof.userId },
      data: { totalPoints: { increment: proof.points } },
    });

    await prisma.point.create({
      data: {
        userId: proof.userId,
        amount: proof.points,
        reason: "Para yatırma kanıtı onaylandı",
      },
    });
  }

  // Eğer reddediliyorsa ve daha önce onaylanmışsa puanı geri al
  if (status === "rejected" && proof.status === "approved") {
    await prisma.user.update({
      where: { id: proof.userId },
      data: { totalPoints: { decrement: proof.points } },
    });

    await prisma.point.create({
      data: {
        userId: proof.userId,
        amount: -proof.points,
        reason: "Para yatırma kanıtı reddedildi (iade)",
      },
    });
  }

  await prisma.depositProof.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
