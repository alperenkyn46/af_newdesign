import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLATFORM_POINTS: Record<string, number> = {
  telegram: 50,
  instagram: 30,
  twitter: 30,
  youtube: 40,
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const follows = await prisma.socialFollow.findMany({
    where: { userId: session.user.id },
  });

  const settings = await prisma.siteSettings.findFirst();

  const platforms = [
    { id: "telegram", name: "Telegram", points: settings?.pointsPerTelegram || 50, link: settings?.telegramLink },
    { id: "instagram", name: "Instagram", points: settings?.pointsPerInstagram || 30, link: settings?.instagramLink },
    { id: "twitter", name: "X (Twitter)", points: settings?.pointsPerTwitter || 30, link: settings?.twitterLink },
    { id: "youtube", name: "YouTube", points: settings?.pointsPerYoutube || 40, link: settings?.youtubeLink },
  ];

  return NextResponse.json({
    follows: follows.map(f => f.platform),
    platforms,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { platform } = await request.json();

  if (!PLATFORM_POINTS[platform]) {
    return NextResponse.json({ error: "Geçersiz platform" }, { status: 400 });
  }

  const existingFollow = await prisma.socialFollow.findUnique({
    where: { userId_platform: { userId: session.user.id, platform } },
  });

  if (existingFollow) {
    return NextResponse.json({ error: "Bu platformu zaten takip ettiniz" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.findFirst();
  const points = 
    platform === "telegram" ? settings?.pointsPerTelegram || 50 :
    platform === "instagram" ? settings?.pointsPerInstagram || 30 :
    platform === "twitter" ? settings?.pointsPerTwitter || 30 :
    platform === "youtube" ? settings?.pointsPerYoutube || 40 : 0;

  await prisma.socialFollow.create({
    data: {
      userId: session.user.id,
      platform,
      points,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPoints: { increment: points } },
  });

  await prisma.point.create({
    data: {
      userId: session.user.id,
      amount: points,
      reason: `${platform.charAt(0).toUpperCase() + platform.slice(1)} takip bonusu`,
    },
  });

  return NextResponse.json({ points, platform });
}
