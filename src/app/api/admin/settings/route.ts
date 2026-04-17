import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          siteName: "BetVIP",
          siteDescription: "En iyi bahis siteleri ve bonuslar",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Boş string'leri null'a çevir
    const siteLogo = body.siteLogo?.trim() || null;
    const telegramLink = body.telegramLink?.trim() || null;
    const instagramLink = body.instagramLink?.trim() || null;
    const twitterLink = body.twitterLink?.trim() || null;
    const kickLink = body.kickLink?.trim() || null;
    const eventChannelLink = body.eventChannelLink?.trim() || null;
    const youtubeLink = body.youtubeLink?.trim() || null;
    const footerTelegramLink = body.footerTelegramLink?.trim() || null;
    const footerInstagramLink = body.footerInstagramLink?.trim() || null;
    const footerKickLink = body.footerKickLink?.trim() || null;
    const footerDiscordLink = body.footerDiscordLink?.trim() || null;
    const footerEventLink = body.footerEventLink?.trim() || null;
    const footerYoutubeLink = body.footerYoutubeLink?.trim() || null;
    const contactEmail = body.contactEmail?.trim() || null;

    const settings = await prisma.siteSettings.upsert({
      where: { id: body.id || "default" },
      update: {
        siteName: body.siteName || "BetVIP",
        siteLogo,
        siteDescription: body.siteDescription || "En iyi bahis siteleri ve bonuslar",
        telegramLink,
        instagramLink,
        twitterLink,
        kickLink,
        eventChannelLink,
        youtubeLink,
        footerTelegramLink,
        footerInstagramLink,
        footerKickLink,
        footerDiscordLink,
        footerEventLink,
        footerYoutubeLink,
        contactEmail,
        pointsPerSignup: body.pointsPerSignup || 50,
        pointsPerReferral: body.pointsPerReferral || 100,
      },
      create: {
        id: "default",
        siteName: body.siteName || "BetVIP",
        siteLogo,
        siteDescription: body.siteDescription || "En iyi bahis siteleri ve bonuslar",
        telegramLink,
        instagramLink,
        twitterLink,
        kickLink,
        eventChannelLink,
        youtubeLink,
        footerTelegramLink,
        footerInstagramLink,
        footerKickLink,
        footerDiscordLink,
        footerEventLink,
        footerYoutubeLink,
        contactEmail,
        pointsPerSignup: body.pointsPerSignup || 50,
        pointsPerReferral: body.pointsPerReferral || 100,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}
