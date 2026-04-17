import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bonus = await prisma.bonus.findUnique({
      where: { id: params.id },
      include: {
        site: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!bonus) {
      return NextResponse.json({ error: "Bonus bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(bonus);
  } catch (error) {
    console.error("Error fetching bonus:", error);
    return NextResponse.json(
      { error: "Bonus getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const bonus = await prisma.bonus.update({
      where: { id: params.id },
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
    return NextResponse.json(bonus);
  } catch (error) {
    console.error("Error updating bonus:", error);
    return NextResponse.json(
      { error: "Bonus güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.bonus.delete({
      where: { id: params.id },
    });

    revalidatePath("/");
    revalidatePath("/bonuslar");
    return NextResponse.json({ message: "Bonus silindi" });
  } catch (error) {
    console.error("Error deleting bonus:", error);
    return NextResponse.json(
      { error: "Bonus silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
