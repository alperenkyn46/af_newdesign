import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bonuses = await prisma.bonus.findMany({
      where: { isActive: true },
      include: {
        site: {
          select: {
            name: true,
            url: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ bonuses });
  } catch (error) {
    console.error("Error fetching bonuses:", error);
    return NextResponse.json({ bonuses: [] });
  }
}
