"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Star, 
  CheckCircle, 
  Gift, 
  Percent, 
  Zap,
  Trophy,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface VipLevel {
  id?: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  bonusMultiplier: number;
  dailyBonus: number;
  wheelBonus: number;
  slotBonus: number;
  color: string;
}

interface VipData {
  currentLevel: string;
  totalPoints: number;
  levels: VipLevel[];
  currentLevelData: VipLevel;
  nextLevel: {
    name: string;
    minPoints: number;
  } | null;
  pointsToNext: number;
  progress: number;
}

function getLevelBenefits(level: VipLevel) {
  const benefits = [
    `Günlük ödül: ${level.dailyBonus} puan`,
    `Çark çevir: ${level.wheelBonus > 0 ? `+${level.wheelBonus} puan bonus` : "Standart ödüller"}`,
    `Slot: ${level.bonusMultiplier}x çarpan${level.slotBonus > 0 ? ` (+${level.slotBonus}%)` : ""}`,
  ];

  if (level.name === "silver") {
    benefits.push("Özel rozetler");
  } else if (level.name === "gold") {
    benefits.push("Öncelikli destek");
    benefits.push("Özel promosyonlar");
  } else if (level.name === "platinum") {
    benefits.push("VIP destek hattı");
    benefits.push("Haftalık bonus");
    benefits.push("Özel etkinlikler");
  }

  return benefits;
}

export default function VipPage() {
  const [data, setData] = useState<VipData | null>(null);

  useEffect(() => {
    fetch("/api/user/vip").then((res) => res.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

  const gradientColors: Record<string, string> = {
    bronze: "from-amber-600 to-amber-400",
    silver: "from-slate-400 to-slate-300",
    gold: "from-amber-500 to-yellow-400",
    platinum: "from-sky-400 to-indigo-400",
  };

  const levelIcons: Record<string, React.ReactNode> = {
    bronze: <Star className="w-5 h-5" />,
    silver: <Star className="w-5 h-5" />,
    gold: <Crown className="w-5 h-5" />,
    platinum: <Sparkles className="w-5 h-5" />,
  };

  const getLevelGradient = (levelName: string) =>
    gradientColors[levelName] || "from-violet-500 to-purple-500";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center justify-center gap-2.5 tracking-tight">
          <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
          VIP Programı
        </h1>
        <p className="text-ink-muted mt-2 text-sm">
          Puan kazanarak VIP seviyenizi yükseltin, daha fazla avantaj elde edin
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${getLevelGradient(
            data.currentLevel
          )} opacity-[0.07]`}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getLevelGradient(
                  data.currentLevel
                )} flex items-center justify-center text-white shadow-card`}
              >
                {levelIcons[data.currentLevel]}
              </div>
              <div>
                <p className="text-ink-soft text-xs uppercase tracking-wide font-medium">
                  Mevcut Seviye
                </p>
                <h2 className="text-xl font-bold text-ink capitalize">
                  {data.currentLevel}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-ink-soft text-xs uppercase tracking-wide font-medium">
                Toplam Puan
              </p>
              <p className="text-xl font-bold text-ink tabular-nums">
                {data.totalPoints}
              </p>
            </div>
          </div>

          {data.nextLevel && (
            <>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-ink-muted">
                  Sonraki:{" "}
                  <span className="text-ink capitalize font-semibold">
                    {data.nextLevel.name}
                  </span>
                </span>
                <span className="text-primary-700 font-medium tabular-nums">
                  {data.pointsToNext} puan kaldı
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getLevelGradient(
                    data.currentLevel
                  )} transition-all duration-500`}
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.levels.map((level) => {
          const isActive = level.name === data.currentLevel;
          const isLocked = level.minPoints > data.totalPoints;

          return (
            <Card
              key={level.name}
              className={`relative overflow-hidden ${
                isActive ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-white" : ""
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Aktif
                  </span>
                </div>
              )}

              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getLevelGradient(
                  level.name
                )} flex items-center justify-center text-white mb-3 ${
                  isLocked ? "opacity-40" : ""
                }`}
              >
                {levelIcons[level.name]}
              </div>

              <h3
                className={`text-base font-bold capitalize ${
                  isLocked ? "text-ink-faint" : "text-ink"
                }`}
              >
                {level.name}
              </h3>
              <p className="text-ink-soft text-xs mb-3">
                {level.minPoints}+ puan
              </p>

              <div className="space-y-1.5">
                {getLevelBenefits(level).map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs">
                    <CheckCircle
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        isLocked ? "text-ink-faint" : "text-emerald-600"
                      }`}
                    />
                    <span className={isLocked ? "text-ink-faint" : "text-ink-muted"}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="text-lg font-bold text-ink mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
          Puan Kazanma Yolları
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-surface-subtle border border-line">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-ink text-sm">Günlük Ödül</h4>
            <p className="text-ink-muted text-xs mt-0.5">Her gün 10-50 puan</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle border border-line">
            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center mb-2.5">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-ink text-sm">Çark Çevir</h4>
            <p className="text-ink-muted text-xs mt-0.5">5-100+ puan</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle border border-line">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-ink text-sm">Slot Oyunu</h4>
            <p className="text-ink-muted text-xs mt-0.5">Bahis x50&apos;ye kadar</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle border border-line">
            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-2.5">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-ink text-sm">Sosyal Medya</h4>
            <p className="text-ink-muted text-xs mt-0.5">Takip et, puan kazan</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/oyunlar">
            <Button variant="primary">
              Oyunlara Git
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
