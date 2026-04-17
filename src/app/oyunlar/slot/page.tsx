"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Minus, Plus, Trophy, Zap } from "lucide-react";
import Link from "next/link";

const PAYOUTS = [
  { symbols: "🍒🍒🍒", multiplier: "3x" },
  { symbols: "🍋🍋🍋", multiplier: "5x" },
  { symbols: "🍊🍊🍊", multiplier: "8x" },
  { symbols: "🍇🍇🍇", multiplier: "10x" },
  { symbols: "⭐⭐⭐", multiplier: "15x" },
  { symbols: "💎💎💎", multiplier: "25x" },
  { symbols: "7️⃣7️⃣7️⃣", multiplier: "50x" },
];

export default function SlotPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [symbols, setSymbols] = useState(["❓", "❓", "❓"]);
  const [result, setResult] = useState<{
    winAmount: number;
    multiplier: number;
    netResult: number;
    newBalance: number;
    vipMultiplier: number;
  } | null>(null);
  const [animatingSlots, setAnimatingSlots] = useState([false, false, false]);

  const balance = session?.user?.totalPoints || 0;
  const minBet = 10;
  const maxBet = Math.min(1000, balance);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/oyunlar/slot");
    }
  }, [status, router]);

  const handleSpin = async () => {
    if (spinning || bet > balance) return;

    setSpinning(true);
    setResult(null);
    setAnimatingSlots([true, true, true]);

    const allSymbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣"];
    
    // Animate slots
    const interval = setInterval(() => {
      setSymbols([
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
      ]);
    }, 100);

    try {
      const res = await fetch("/api/games/slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet }),
      });
      const data = await res.json();

      if (res.ok) {
        // Stop slots one by one
        setTimeout(() => {
          setAnimatingSlots([false, true, true]);
          setSymbols(prev => [data.symbols[0], prev[1], prev[2]]);
        }, 1000);

        setTimeout(() => {
          setAnimatingSlots([false, false, true]);
          setSymbols(prev => [prev[0], data.symbols[1], prev[2]]);
        }, 1500);

        setTimeout(() => {
          clearInterval(interval);
          setAnimatingSlots([false, false, false]);
          setSymbols(data.symbols);
          setResult(data);
          setSpinning(false);
          update(); // Update session with new balance
        }, 2000);
      } else {
        clearInterval(interval);
        setSpinning(false);
        alert(data.error);
      }
    } catch {
      clearInterval(interval);
      setSpinning(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

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
          <h1 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
            Slot Makinesi
          </h1>
          <p className="text-ink-muted mt-2 text-sm">
            Şansını dene, puanlarını katla
          </p>
        </div>

        <Card className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span className="text-ink-muted text-sm">Bakiye</span>
            </div>
            <span className="text-xl font-bold text-ink tabular-nums">
              {result?.newBalance ?? balance} Puan
            </span>
          </div>
        </Card>

        <Card className="p-6 md:p-8 mb-5">
          {/* Reels */}
          <div className="flex justify-center gap-3 mb-6">
            {symbols.map((symbol, idx) => (
              <div
                key={idx}
                className={`w-24 h-24 rounded-2xl bg-surface-subtle border-2 flex items-center justify-center text-5xl transition-all ${
                  animatingSlots[idx] ? "animate-pulse" : ""
                } ${
                  result && result.winAmount > 0
                    ? "border-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                    : "border-line-strong"
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>

          {result && (
            <div
              className={`text-center mb-5 p-4 rounded-xl border ${
                result.netResult > 0
                  ? "bg-emerald-50 border-emerald-200"
                  : result.netResult < 0
                    ? "bg-red-50 border-red-200"
                    : "bg-surface-subtle border-line"
              }`}
            >
              {result.netResult > 0 ? (
                <>
                  <p className="text-emerald-700 font-bold text-xl">KAZANDINIZ</p>
                  <p className="text-ink text-lg mt-1 font-semibold">
                    +{result.winAmount} Puan ({result.multiplier}x)
                  </p>
                  {result.vipMultiplier > 1 && (
                    <p className="text-amber-600 text-xs flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      VIP {result.vipMultiplier}x çarpan uygulandı
                    </p>
                  )}
                </>
              ) : result.netResult < 0 ? (
                <p className="text-red-600 font-bold">
                  Kaybettiniz: {result.netResult} Puan
                </p>
              ) : (
                <p className="text-ink-muted">Berabere</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={() => setBet(Math.max(minBet, bet - 10))}
              disabled={spinning || bet <= minBet}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="px-6 py-2.5 rounded-xl bg-surface-subtle border border-line">
              <span className="text-xl font-bold text-ink tabular-nums">
                {bet}
              </span>
              <span className="text-ink-soft text-sm ml-1">Puan</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => setBet(Math.min(maxBet, bet + 10))}
              disabled={spinning || bet >= maxBet}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mb-5">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBet(Math.min(amount, maxBet))}
                disabled={spinning || amount > balance}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  bet === amount
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-surface-subtle text-ink-muted border-line hover:border-primary-300 hover:text-primary-700"
                } ${amount > balance ? "opacity-50" : ""}`}
              >
                {amount}
              </button>
            ))}
          </div>

          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleSpin}
            disabled={spinning || bet > balance}
          >
            {spinning ? (
              "Dönüyor..."
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Çevir
              </>
            )}
          </Button>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-ink mb-4">
            Ödeme Tablosu
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PAYOUTS.map((payout, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-line"
              >
                <span className="text-lg">{payout.symbols}</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {payout.multiplier}
                </span>
              </div>
            ))}
          </div>
          <p className="text-ink-soft text-xs mt-4">
            * İki eşleşen sembol 0.5x kazandırır
          </p>
        </Card>
      </div>
    </div>
  );
}
