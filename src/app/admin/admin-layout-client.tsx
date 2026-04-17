"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Gift, 
  Users, 
  Settings,
  Trophy,
  ArrowLeft,
  CircleDot,
  Wallet,
  Image,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, shortLabel: "Ana" },
  { href: "/admin/siteler", label: "Bahis Siteleri", icon: Gamepad2, shortLabel: "Siteler" },
  { href: "/admin/bonuslar", label: "Bonuslar", icon: Gift, shortLabel: "Bonus" },
  { href: "/admin/vip", label: "VIP Seviyeleri", icon: Crown, shortLabel: "VIP" },
  { href: "/admin/oyunlar", label: "Oyunlar", icon: CircleDot, shortLabel: "Oyun" },
  { href: "/admin/talepler", label: "Çevirme Talepleri", icon: Wallet, shortLabel: "Talep" },
  { href: "/admin/kanitlar", label: "Yatırım Kanıtları", icon: Image, shortLabel: "Kanıt" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users, shortLabel: "Üye" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings, shortLabel: "Ayar" },
];

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-surface-subtle">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-line p-4 hidden lg:block flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-brand-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-ink tracking-tight">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-ink-muted hover:text-primary-700 hover:bg-surface-subtle"
              )}
            >
              <link.icon className="w-4.5 h-4.5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-line">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-ink-muted hover:text-primary-700 hover:bg-surface-subtle transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-20 bg-white/95 backdrop-blur border-b border-line">
        <div className="flex items-center justify-between p-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-brand-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-ink text-sm">Admin Panel</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-ink-muted hover:text-primary-700 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Çıkış</span>
          </Link>
        </div>

        {/* Mobile Navigation - Scrollable */}
        <div className="px-2 pt-4 pb-3 overflow-x-auto">
          <nav className="flex gap-1.5 w-max min-w-full">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[60px] border",
                  pathname === link.href
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-surface-subtle text-ink-muted border-line"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{link.shortLabel}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full min-w-0 mt-0 p-3 sm:p-4 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
