"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Trophy, 
  Users, 
  Crown,
  Wallet,
  Gamepad2,
  Star,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const panelLinks = [
  { href: "/panel", label: "Profilim", icon: User },
  { href: "/panel/puanlar", label: "Puanlarım", icon: Trophy },
  { href: "/panel/referanslar", label: "Referanslarım", icon: Users },
  { href: "/panel/vip", label: "VIP Üyelik", icon: Crown },
];

const quickLinks = [
  { href: "/oyunlar", label: "Oyunlar", icon: Gamepad2 },
  { href: "/harca", label: "Puan Harca", icon: Wallet },
  { href: "/sosyal", label: "Sosyal Ödüller", icon: Star },
];

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-surface-subtle">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-line p-4 hidden lg:block">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-brand-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-ink tracking-tight">Hesabım</span>
        </div>

        <nav className="space-y-1">
          {panelLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700 shadow-brand-sm/0"
                  : "text-ink-muted hover:text-primary-700 hover:bg-surface-subtle"
              )}
            >
              <link.icon className="w-4.5 h-4.5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-line">
          <p className="text-[11px] text-ink-soft uppercase tracking-wider px-3.5 mb-2 font-semibold">Hızlı Erişim</p>
          <nav className="space-y-1">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-ink-muted hover:text-primary-700 hover:bg-surface-subtle transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-line">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-ink-muted hover:text-primary-700 hover:bg-surface-subtle transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-line p-2 overflow-x-auto">
        <nav className="flex gap-2">
          {panelLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                pathname === link.href
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-surface-subtle text-ink-muted border-line"
              )}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow lg:ml-0 mt-12 lg:mt-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
