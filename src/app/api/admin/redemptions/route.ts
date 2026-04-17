import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redemptions = await prisma.redemption.findMany({
    include: {
      user: { select: { name: true, email: true } },
      site: { select: { name: true, logo: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ redemptions });
}
