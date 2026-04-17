"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SiteSettings {
  siteName: string;
  siteLogo?: string | null;
  siteDescription: string;
  telegramLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  kickLink?: string;
  eventChannelLink?: string;
  youtubeLink?: string;
  footerTelegramLink?: string;
  footerInstagramLink?: string;
  footerKickLink?: string;
  footerDiscordLink?: string;
  footerEventLink?: string;
  footerYoutubeLink?: string;
  contactEmail?: string;
}

const defaultSettings: SiteSettings = {
  siteName: "BetVIP",
  siteLogo: null,
  siteDescription: "En iyi bahis siteleri ve bonuslar",
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          siteName: data.siteName || defaultSettings.siteName,
          siteLogo: data.siteLogo || null,
          siteDescription: data.siteDescription || defaultSettings.siteDescription,
          telegramLink: data.telegramLink,
          instagramLink: data.instagramLink,
          twitterLink: data.twitterLink,
          kickLink: data.kickLink,
          eventChannelLink: data.eventChannelLink,
          youtubeLink: data.youtubeLink,
          footerTelegramLink: data.footerTelegramLink,
          footerInstagramLink: data.footerInstagramLink,
          footerKickLink: data.footerKickLink,
          footerDiscordLink: data.footerDiscordLink,
          footerEventLink: data.footerEventLink,
          footerYoutubeLink: data.footerYoutubeLink,
          contactEmail: data.contactEmail,
        });
      })
      .catch(() => {
        // Hata durumunda varsayılan değerleri kullan
      });
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
