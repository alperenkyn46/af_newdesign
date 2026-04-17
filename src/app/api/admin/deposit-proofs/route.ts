import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proofs = await prisma.depositProof.findMany({
    include: {
      user: { select: { name: true, email: true, telegramUsername: true } },
      site: { select: { name: true, logo: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ proofs });
}
