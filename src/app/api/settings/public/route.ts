import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst();
  
  return NextResponse.json({
    siteName: settings?.siteName || "BetVIP",
    siteLogo: settings?.siteLogo || null,
    siteDescription: settings?.siteDescription || "En iyi bahis siteleri ve bonuslar",
    telegramLink: settings?.telegramLink,
    instagramLink: settings?.instagramLink,
    twitterLink: settings?.twitterLink,
    kickLink: settings?.kickLink,
    eventChannelLink: settings?.eventChannelLink,
    youtubeLink: settings?.youtubeLink,
    footerTelegramLink: settings?.footerTelegramLink,
    footerInstagramLink: settings?.footerInstagramLink,
    footerKickLink: settings?.footerKickLink,
    footerDiscordLink: settings?.footerDiscordLink,
    footerEventLink: settings?.footerEventLink,
    footerYoutubeLink: settings?.footerYoutubeLink,
    contactEmail: settings?.contactEmail,
  });
}
