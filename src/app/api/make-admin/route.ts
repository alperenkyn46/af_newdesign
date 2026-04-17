import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json();

    // Güvenlik için basit bir anahtar kontrolü
    if (secretKey !== "MAKE_ME_ADMIN_2024") {
      return NextResponse.json({ error: "Geçersiz anahtar" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    return NextResponse.json({ 
      message: `${user.email} artık admin!`,
      success: true 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Kullanıcı bulunamadı veya bir hata oluştu" },
      { status: 500 }
    );
  }
}
