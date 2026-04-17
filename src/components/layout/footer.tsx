"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Instagram,
  Gamepad2,
  Gift,
  Youtube,
  Send,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings-context";

export function Footer() {
  const {
    siteName,
    siteLogo,
    siteDescription,
    telegramLink,
    instagramLink,
    kickLink,
    eventChannelLink,
    youtubeLink,
    footerTelegramLink,
    footerInstagramLink,
    footerKickLink,
    footerDiscordLink,
    footerEventLink,
    footerYoutubeLink,
  } = useSiteSettings();

  const socialLinks = [
    {
      href: footerTelegramLink || telegramLink || "/sosyal",
      label: "Telegram",
      icon: Send,
    },
    {
      href: footerInstagramLink || instagramLink || "/sosyal",
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: footerKickLink || kickLink || "/sosyal",
      label: "Kick",
      icon: Gamepad2,
    },
    {
      href: footerDiscordLink || "https://discord.com",
      label: "Discord",
      icon: null,
    },
    {
      href: footerEventLink || eventChannelLink || "/sosyal",
      label: "Etkinlik Kanalımız",
      icon: Gift,
    },
    {
      href: footerYoutubeLink || youtubeLink || "/sosyal",
      label: "YouTube",
      icon: Youtube,
    },
  ];

  const quickLinks = [
    { href: "/siteler", label: "Bahis Siteleri" },
    { href: "/bonuslar", label: "Bonuslar" },
    { href: "/oyunlar", label: "Oyunlar" },
    { href: "/sizden-gelenler", label: "Sizden Gelenler" },
    { href: "/iletisim", label: "İletişim" },
  ];

  return (
    <footer className="bg-white border-t border-line">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {siteLogo ? (
                <Image
                  src={siteLogo}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-brand-sm">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold text-ink">{siteName}</span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
              {siteDescription ||
                "Türkiye'nin güvenilir bahis siteleri rehberi. Güncel bonuslar, özel promosyonlar ve daha fazlası."}
            </p>

            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Lisanslı siteler · Doğrulanmış bonuslar</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider text-ink-soft font-semibold mb-4">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-primary-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-wider text-ink-soft font-semibold mb-4">
              Bizi Takip Et
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-surface-subtle text-ink-muted hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all"
                >
                  {link.icon ? (
                    <link.icon className="w-4 h-4" />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3a13.891 13.891 0 0 0-.655 1.35 18.764 18.764 0 0 0-6.46 0A13.86 13.86 0 0 0 8.115 3a19.736 19.736 0 0 0-4.433 1.37C.533 9.046-.32 13.58.099 18.05A19.9 19.9 0 0 0 6.19 21a14.098 14.098 0 0 0 1.308-2.125 12.963 12.963 0 0 1-2.062-.99c.173-.126.343-.257.508-.39a14.103 14.103 0 0 0 12.111 0c.166.133.336.264.509.39-.66.39-1.352.722-2.063.99A14.047 14.047 0 0 0 17.81 21a19.858 19.858 0 0 0 6.092-2.95c.5-5.177-.838-9.67-3.585-13.681ZM8.03 15.33c-1.18 0-2.15-1.085-2.15-2.42 0-1.334.95-2.419 2.15-2.419 1.21 0 2.17 1.095 2.15 2.42 0 1.334-.95 2.419-2.15 2.419Zm7.94 0c-1.18 0-2.15-1.085-2.15-2.42 0-1.334.95-2.419 2.15-2.419 1.21 0 2.17 1.095 2.15 2.42 0 1.334-.94 2.419-2.15 2.419Z" />
                    </svg>
                  )}
                  <span className="text-xs font-medium truncate">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>

            <Link
              href="/iletisim"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800 font-medium"
            >
              <Mail className="w-4 h-4" />
              İletişime Geç
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-line">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-ink-soft text-center md:text-left">
              © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-ink-soft text-center md:text-right">
              18+ | Kumar bağımlılık yapabilir. Lütfen sorumlu oynayın.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
