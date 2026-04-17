import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateReferralCode } from "@/lib/utils";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  telegramUsername: z.string().min(2, "Telegram kullanıcı adı gerekli"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  referralCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, telegramUsername, password, referralCode } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kayıtlı" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userReferralCode = generateReferralCode();

    const settings = await prisma.siteSettings.findFirst();
    const pointsPerSignup = settings?.pointsPerSignup ?? 50;
    const pointsPerReferral = settings?.pointsPerReferral ?? 100;

    const cleanTelegramUsername = telegramUsername.startsWith("@") 
      ? telegramUsername 
      : `@${telegramUsername}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        telegramUsername: cleanTelegramUsername,
        password: hashedPassword,
        referralCode: userReferralCode,
        totalPoints: pointsPerSignup,
        points: {
          create: {
            amount: pointsPerSignup,
            reason: "Kayıt bonusu",
          },
        },
      },
    });

    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            pointsEarned: pointsPerReferral,
          },
        });

        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            totalPoints: { increment: pointsPerReferral },
          },
        });

        await prisma.point.create({
          data: {
            userId: referrer.id,
            amount: pointsPerReferral,
            reason: `Referans bonusu: ${user.name}`,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Kayıt başarılı", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
