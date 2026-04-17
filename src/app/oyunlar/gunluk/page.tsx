"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Gift,
  Zap,
  CheckCircle,
  ArrowLeft,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function DailyRewardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{
    claimed: boolean;
    streak: number;
    todayPoints: number;
  } | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [result, setResult] = useState<{
    points: number;
    streak: number;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/oyunlar/gunluk");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/games/daily-reward")
        .then((res) => res.json())
        .then(setData);
    }
  }, [session]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/games/daily-reward", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setData((prev) =>
          prev ? { ...prev, claimed: true, streak: data.streak } : null
        );
      }
    } finally {
      setClaiming(false);
    }
  };

  if (status === "loading" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

  const streakDays = [1, 2, 3, 4, 5, 6, 7];
  const baseRewards = [10, 15, 20, 25, 30, 35, 50];

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/oyunlar"
          className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Oyunlara Dön
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Günlük Ödül
          </h1>
          <p className="text-ink-muted mt-2 text-sm">
            Her gün giriş yap, seri bonus kazan
          </p>
        </div>

        <Card className="mb-6">
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            7 Günlük Seri
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {streakDays.map((day, idx) => {
              const isCompleted = idx < data.streak;
              const isCurrent = idx === data.streak;
              return (
                <div
                  key={day}
                  className={`relative p-2.5 rounded-xl text-center transition-all border ${
                    isCompleted
                      ? "bg-emerald-50 border-emerald-200"
                      : isCurrent
                        ? "bg-primary-50 border-primary-200 ring-1 ring-primary-300"
                        : "bg-surface-subtle border-line"
                  }`}
                >
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-emerald-600 absolute -top-1.5 -right-1.5 bg-white rounded-full" />
                  )}
                  <p
                    className={`text-[10px] font-medium ${
                      isCompleted
                        ? "text-emerald-700"
                        : isCurrent
                          ? "text-primary-700"
                          : "text-ink-soft"
                    }`}
                  >
                    Gün {day}
                  </p>
                  <p
                    className={`text-sm font-bold mt-0.5 ${
                      isCompleted
                        ? "text-emerald-700"
                        : isCurrent
                          ? "text-primary-700"
                          : "text-ink-muted"
                    }`}
                  >
                    +{baseRewards[idx]}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-ink-soft text-sm mt-4">
            7 gün üst üste giriş yap, toplam{" "}
            <span className="text-emerald-700 font-bold">185 puan</span> kazan
          </p>
        </Card>

        <Card className="text-center">
          {result ? (
            <div className="py-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-1">Tebrikler</h3>
              <p className="text-4xl font-black text-emerald-600 mb-1">
                +{result.points} Puan
              </p>
              <p className="text-ink-muted text-sm">{result.streak}. gün serisi</p>
              {session?.user?.vipLevel &&
                session.user.vipLevel !== "bronze" && (
                  <p className="text-amber-600 text-sm mt-2 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    VIP bonus dahil
                  </p>
                )}
            </div>
          ) : data.claimed ? (
            <div className="py-6">
              <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-line flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-ink-soft" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">
                Bugünkü ödülünüzü aldınız
              </h3>
              <p className="text-ink-muted text-sm">Yarın tekrar gelin.</p>
              <p className="text-emerald-700 font-bold mt-3 text-sm">
                Mevcut seri: {data.streak} gün
              </p>
            </div>
          ) : (
            <div className="py-6">
              <Gift className="w-14 h-14 text-emerald-600 mx-auto mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-ink mb-1">
                Günlük ödülünüz hazır
              </h3>
              <p className="text-ink-muted text-sm mb-5">
                {data.streak > 0
                  ? `${data.streak}. gün serinizi devam ettirin`
                  : "Yeni bir seri başlatın"}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleClaim}
                disabled={claiming}
              >
                {claiming ? "Alınıyor..." : "Ödülü Al"}
                <Gift className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
