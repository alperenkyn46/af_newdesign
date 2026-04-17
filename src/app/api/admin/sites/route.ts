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

  const sites = await prisma.bettingSite.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const site = await prisma.bettingSite.create({
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

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Site oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
}
