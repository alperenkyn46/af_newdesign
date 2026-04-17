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
    const site = await prisma.bettingSite.findUnique({
      where: { id: params.id },
      include: {
        bonuses: true,
        _count: {
          select: { bonuses: true, redemptions: true, depositProofs: true },
        },
      },
    });

    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Site getirilirken hata oluştu" },
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

    const site = await prisma.bettingSite.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        logo: body.logo,
        url: body.url,
        description: body.description,
        rating: body.rating,
        features: body.features,
        isFeatured: body.isFeatured,
        sponsorTier: body.sponsorTier,
        order: body.order,
        isActive: body.isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/siteler");
    revalidatePath(`/siteler/${body.slug}`);

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Site güncellenirken hata oluştu" },
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
    await prisma.bettingSite.delete({
      where: { id: params.id },
    });

    revalidatePath("/");
    revalidatePath("/siteler");

    return NextResponse.json({ message: "Site silindi" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Site silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
