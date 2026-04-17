import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bonuses = await prisma.bonus.findMany({
    orderBy: { createdAt: "desc" },
    include: { site: true },
  });

  return NextResponse.json(bonuses);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const bonus = await prisma.bonus.create({
      data: {
        siteId: body.siteId,
        title: body.title,
        code: body.code,
        description: body.description,
        type: body.type,
        value: body.value,
        minDeposit: body.minDeposit,
        wagering: body.wagering,
        expiresAt: body.expiresAt,
        showInLatest: body.showInLatest,
        isActive: body.isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/bonuslar");
    return NextResponse.json(bonus, { status: 201 });
  } catch (error) {
    console.error("Error creating bonus:", error);
    return NextResponse.json(
      { error: "Bonus oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
