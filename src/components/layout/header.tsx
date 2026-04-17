"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Trophy,
  Gift,
  Home,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/site-settings-context";

const navLinks = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/siteler", label: "Bahis Siteleri", icon: Gamepad2 },
  { href: "/bonuslar", label: "Bonuslar", icon: Gift },
  { href: "/oyunlar", label: "Oyunlar", icon: Trophy },
  { href: "/sizden-gelenler", label: "Sizden Gelenler", icon: Gift },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { siteName, siteLogo } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-line shadow-soft"
          : "bg-white/80 backdrop-blur border-line/80"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {siteLogo ? (
              <Image
                src={siteLogo}
                alt={siteName}
                width={48}
                height={48}
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl object-contain"
              />
            ) : (
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-brand-sm">
                <Trophy className="w-5 h-5 lg:w-5.5 lg:h-5.5 text-white" />
              </div>
            )}
            <span className="text-[1.35rem] lg:text-2xl font-bold text-ink tracking-tight">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-primary-700 hover:bg-primary-50 transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-9 h-9 rounded-full bg-surface-muted animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-line hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-ink font-medium">
                    {session.user?.name}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-xl shadow-pop py-1.5">
                    <Link
                      href="/panel"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-ink-soft" />
                      Profilim
                    </Link>
                    <Link
                      href="/panel/puanlar"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Trophy className="w-4 h-4 text-ink-soft" />
                      Puanlarım
                    </Link>
                    <Link
                      href="/panel/vip"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Gift className="w-4 h-4 text-ink-soft" />
                      VIP Üyelik
                    </Link>
                    <Link
                      href="/harca"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Gamepad2 className="w-4 h-4 text-ink-soft" />
                      Puan Harca
                    </Link>
                    {session.user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-ink-soft" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1.5 border-line" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/giris">
                  <Button variant="ghost">Giriş Yap</Button>
                </Link>
                <Link href="/kayit">
                  <Button variant="primary">Kayıt Ol</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink rounded-lg hover:bg-surface-muted"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-line">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-surface-subtle border border-line text-ink-muted hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-line">
              {session ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/panel"
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-surface-subtle border border-line text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs font-medium">Profilim</span>
                  </Link>
                  <Link
                    href="/panel/vip"
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Trophy className="w-5 h-5" />
                    <span className="text-xs font-medium">VIP Üyelik</span>
                  </Link>
                  <Link
                    href="/harca"
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span className="text-xs font-medium">Puan Harca</span>
                  </Link>
                  {session.user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-xs font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all col-span-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs font-medium">Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/kayit" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
