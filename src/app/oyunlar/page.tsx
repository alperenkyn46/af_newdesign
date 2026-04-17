"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gift,
  CircleDot,
  Sparkles,
  Calendar,
  Trophy,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function GamesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyData, setDailyData] = useState<{
    claimed: boolean;
    streak: number;
  } | null>(null);
  const [wheelData, setWheelData] = useState<{ canSpin: boolean } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/oyunlar");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/games/daily-reward")
        .then((res) => res.json())
        .then(setDailyData);
      fetch("/api/games/wheel")
        .then((res) => res.json())
        .then(setWheelData);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

  const games = [
    {
      id: "daily",
      title: "Günlük Ödül",
      description: "Her gün giriş yap, puan kazan. Seri yaparak bonus kazan.",
      icon: Calendar,
      tint: "bg-emerald-50 border-emerald-200 text-emerald-700",
      href: "/oyunlar/gunluk",
      available: !dailyData?.claimed,
      badge: dailyData?.claimed ? "Alındı" : "Hazır",
      badgeTone: dailyData?.claimed
        ? "bg-slate-100 text-slate-600 border-slate-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "wheel",
      title: "Çark Çevir",
      description: "Günde bir kez çark çevir, şansını dene.",
      icon: CircleDot,
      tint: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
      href: "/oyunlar/cark",
      available: wheelData?.canSpin,
      badge: wheelData?.canSpin ? "Çevir" : "Yarın",
      badgeTone: wheelData?.canSpin
        ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
        : "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      id: "slot",
      title: "Slot Makinesi",
      description: "Puanlarını kat, büyük ödüller kazan.",
      icon: Sparkles,
      tint: "bg-amber-50 border-amber-200 text-amber-700",
      href: "/oyunlar/slot",
      available: true,
      badge: "Oyna",
      badgeTone: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
            <Trophy className="w-8 h-8 text-primary-600" />
            Oyunlar & Ödüller
          </h1>
          <p className="text-ink-muted mt-2 max-w-xl mx-auto">
            Günlük ödüller, çark çevir ve slot oyunu ile puan kazan.
          </p>
        </div>

        {session && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              {
                icon: Trophy,
                label: "Toplam Puan",
                value: session.user.totalPoints,
                tint: "bg-primary-50 text-primary-700",
              },
              {
                icon: Star,
                label: "VIP Seviye",
                value: (session.user.vipLevel as string) || "Bronze",
                tint: "bg-amber-50 text-amber-700",
                capitalize: true,
              },
              {
                icon: Zap,
                label: "Gün Serisi",
                value: dailyData?.streak || 0,
                tint: "bg-emerald-50 text-emerald-700",
              },
              {
                icon: Gift,
                label: "Bekleyen Ödül",
                value:
                  [!dailyData?.claimed, wheelData?.canSpin].filter(Boolean)
                    .length,
                tint: "bg-fuchsia-50 text-fuchsia-700",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-line rounded-2xl p-4 shadow-soft"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.tint}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-2xl font-bold text-ink mt-3 ${stat.capitalize ? "capitalize" : ""}`}
                >
                  {stat.value}
                </p>
                <p className="text-ink-soft text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {games.map((game) => (
            <Link key={game.id} href={game.href}>
              <div className="relative h-full bg-white border border-line rounded-2xl p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all group">
                <span
                  className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-bold border ${game.badgeTone}`}
                >
                  {game.badge}
                </span>

                <div
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${game.tint}`}
                >
                  <game.icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-ink mb-1">
                  {game.title}
                </h3>
                <p className="text-ink-muted text-sm mb-5">
                  {game.description}
                </p>

                <Button
                  variant={game.available ? "primary" : "secondary"}
                  className="w-full"
                >
                  {game.available ? "Oyna" : "Bekle"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>
          ))}
        </div>

        <Card className="mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                VIP Avantajları
              </h3>
              <p className="text-ink-muted mt-1 text-sm">
                VIP seviyeniz arttıkça tüm oyunlarda bonus kazanırsınız.
              </p>
            </div>
            <Link href="/panel/vip">
              <Button variant="gold">
                VIP Detayları
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
