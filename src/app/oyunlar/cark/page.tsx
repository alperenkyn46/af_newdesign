"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Trophy } from "lucide-react";
import Link from "next/link";

interface Prize {
  id: string;
  name: string;
  points: number;
  color: string;
}

export default function WheelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{ canSpin: boolean; prizes: Prize[]; lastPrize: string | null } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ prize: string; points: number; vipBonus: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/oyunlar/cark");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/games/wheel").then(res => res.json()).then(setData);
    }
  }, [session]);

  const handleSpin = async () => {
    if (!data?.canSpin || spinning) return;

    setSpinning(true);
    setResult(null);

    try {
      const res = await fetch("/api/games/wheel", { method: "POST" });
      const spinResult = await res.json();

      if (res.ok) {
        const prizeCount = data.prizes.length;
        const sliceAngle = 360 / prizeCount;
        const targetAngle = 360 - (spinResult.prizeIndex * sliceAngle) - (sliceAngle / 2);
        const spins = 5 + Math.random() * 3;
        const finalRotation = rotation + (spins * 360) + targetAngle;

        setRotation(finalRotation);

        setTimeout(() => {
          setResult(spinResult);
          setData(prev => prev ? { ...prev, canSpin: false } : null);
          setSpinning(false);
        }, 4000);
      } else {
        setSpinning(false);
      }
    } catch {
      setSpinning(false);
    }
  };

  if (status === "loading" || !data) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
    </div>;
  }

  const prizes = data.prizes;
  const sliceAngle = 360 / prizes.length;

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/oyunlar" className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-6 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Oyunlara Dön
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">Çark Çevir</h1>
          <p className="text-ink-muted mt-2 text-sm">Günde bir kez şansını dene</p>
        </div>

        {/* Wheel */}
        <Card className="p-8 mb-6">
          <div className="relative w-72 h-72 mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-amber-500 drop-shadow" />
            </div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full relative overflow-hidden border-4 border-amber-400 shadow-card"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
              }}
            >
              {prizes.map((prize, idx) => (
                <div
                  key={prize.id}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${idx * sliceAngle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan((sliceAngle * Math.PI) / 360)}% 0%)`,
                  }}
                >
                  <div
                    className="w-full h-full flex items-start justify-center pt-4"
                    style={{ backgroundColor: prize.color }}
                  >
                    <span
                      className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap"
                      style={{ transform: `rotate(${sliceAngle / 2}deg) translateY(20px)` }}
                    >
                      {prize.points}P
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center z-10 shadow-accent border-4 border-white">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-8">
            {result ? (
              <div className="py-4">
                <h3 className="text-xl font-bold text-ink mb-1">Tebrikler</h3>
                <p className="text-4xl font-black text-emerald-600 mb-1">+{result.points} Puan</p>
                {result.vipBonus > 0 && (
                  <p className="text-amber-600 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    +{result.vipBonus} VIP Bonus
                  </p>
                )}
              </div>
            ) : data.canSpin ? (
              <Button
                variant="gold"
                size="lg"
                onClick={handleSpin}
                disabled={spinning}
                className="min-w-[200px]"
              >
                {spinning ? "Dönüyor..." : "Çarkı Çevir"}
              </Button>
            ) : (
              <div className="py-4">
                <p className="text-ink-muted text-sm">Bugün çark hakkınızı kullandınız</p>
                <p className="text-ink font-bold mt-2">Son ödül: {data.lastPrize}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Prize List */}
        <Card>
          <h3 className="text-base font-semibold text-ink mb-4">Ödüller</h3>
          <div className="grid grid-cols-2 gap-2">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle border border-line"
              >
                <div
                  className="w-3 h-3 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: prize.color }}
                />
                <span className="text-ink-muted text-sm">{prize.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
