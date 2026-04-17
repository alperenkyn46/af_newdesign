import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  // Onaylanmış deposit proof'ları getir
  const proofs = await prisma.depositProof.findMany({
    where: { status: "approved" },
    include: {
      user: { select: { name: true } },
      site: { select: { name: true, logo: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Kullanıcı adlarını maskele
  const maskedProofs = proofs.map((proof) => ({
    ...proof,
    user: {
      name: maskName(proof.user.name),
    },
  }));

  return NextResponse.json({ proofs: maskedProofs });
}

function maskName(name: string): string {
  if (name.length <= 2) return name[0] + "*";
  return name.slice(0, 2) + "*".repeat(Math.min(name.length - 2, 5));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const siteId = formData.get("siteId") as string;
    const amount = formData.get("amount") as string;

    if (!file || !siteId) {
      return NextResponse.json({ error: "Dosya ve site gerekli" }, { status: 400 });
    }

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "deposits");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${session.user.id}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/deposits/${filename}`;

    // Veritabanına kaydet
    const settings = await prisma.siteSettings.findFirst();
    const pointsPerDeposit = settings?.pointsPerDeposit || 100;

    const proof = await prisma.depositProof.create({
      data: {
        userId: session.user.id,
        siteId,
        imageUrl,
        amount: amount || null,
        points: pointsPerDeposit,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, proofId: proof.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yükleme sırasında hata oluştu" }, { status: 500 });
  }
}
