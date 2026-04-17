import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya türü kontrolü
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Geçersiz dosya türü. PNG, JPG, GIF, SVG veya WebP yükleyebilirsiniz." 
      }, { status: 400 });
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "Dosya boyutu 5MB'dan büyük olamaz" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${originalName}`;

    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), "public", folder);
    await mkdir(uploadDir, { recursive: true });

    // Dosyayı kaydet
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Public URL döndür
    const url = `/${folder}/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
