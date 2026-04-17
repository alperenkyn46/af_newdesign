"use client";

import { useState, useEffect } from "react";
import {
  X,
  Gift,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Percent,
  Zap,
  Star,
  Crown,
  Tag,
} from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface Bonus {
  id: string;
  title: string;
  description: string;
  code: string | null;
  value: string;
  type: string;
  expiresAt: string | null;
  site: {
    name: string;
    url: string;
  };
}

const TYPE_STYLES: Record<
  string,
  {
    chip: string;
    ring: string;
    icon: React.ElementType;
  }
> = {
  Hoşgeldin: {
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ring: "ring-emerald-200",
    icon: Gift,
  },
  FreeSpin: {
    chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    ring: "ring-fuchsia-200",
    icon: Zap,
  },
  Yatırım: {
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    ring: "ring-sky-200",
    icon: Percent,
  },
  Kayıp: {
    chip: "bg-orange-50 text-orange-700 border-orange-200",
    ring: "ring-orange-200",
    icon: Star,
  },
  VIP: {
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    ring: "ring-amber-200",
    icon: Crown,
  },
};

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenBonusPopup");

    if (!hasSeenPopup) {
      fetch("/api/bonuses")
        .then((res) => res.json())
        .then((data) => {
          if (data.bonuses && data.bonuses.length > 0) {
            setBonuses(data.bonuses);
            setTimeout(() => setIsOpen(true), 2000);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || bonuses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bonuses.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bonuses.length]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenBonusPopup", "true");
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + bonuses.length) % bonuses.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % bonuses.length);
  };

  const getTimeLeft = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} gün kaldı` : "Son gün!";
  };

  if (!isOpen || bonuses.length === 0) return null;

  const currentBonus = bonuses[currentIndex];
  const typeStyle = TYPE_STYLES[currentBonus.type] || TYPE_STYLES["Hoşgeldin"];
  const TypeIcon = typeStyle.icon;
  const timeLeft = getTimeLeft(currentBonus.expiresAt);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg animate-scaleIn">
        <div
          className={`relative overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ${typeStyle.ring} border border-line`}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-ink-soft hover:text-ink z-10 transition-colors p-1 rounded-md hover:bg-surface-muted"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="relative bg-gradient-primary px-5 py-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">
                Güncel Bonuslar
              </h2>
            </div>
            <p className="text-white/85 text-sm mt-0.5">
              Kaçırılmayacak fırsatlar seni bekliyor
            </p>
          </div>

          <div className="relative p-6">
            <div className="relative">
              {bonuses.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-line shadow-soft flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all z-10"
                    aria-label="Önceki"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-line shadow-soft flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all z-10"
                    aria-label="Sonraki"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="text-center px-4">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold mb-3 ${typeStyle.chip}`}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  {currentBonus.type}
                </div>

                <p className="text-ink-soft text-sm mb-1">
                  {currentBonus.site.name}
                </p>

                <h3 className="text-xl font-bold text-ink mb-2">
                  {currentBonus.title}
                </h3>

                <div className="text-4xl font-black gradient-text mb-3">
                  {currentBonus.value}
                </div>

                <p className="text-ink-muted text-sm mb-4">
                  {currentBonus.description}
                </p>

                <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
                  {currentBonus.code && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-dashed border-primary-300">
                      <Tag className="w-3.5 h-3.5 text-primary-700" />
                      <span className="text-primary-700 font-mono text-sm font-bold">
                        {currentBonus.code}
                      </span>
                    </div>
                  )}
                  {timeLeft && (
                    <div className="flex items-center gap-1.5 text-orange-600 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeLeft}</span>
                    </div>
                  )}
                </div>

                <a
                  href={currentBonus.site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                >
                  <Button variant="primary" size="lg" className="w-full mb-3">
                    Bonusu Al
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            {bonuses.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {bonuses.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-6 bg-primary-600"
                        : "w-1.5 bg-line-strong hover:bg-ink-faint"
                    }`}
                    aria-label={`Bonus ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              <Link
                href="/bonuslar"
                onClick={handleClose}
                className="text-primary-700 text-sm hover:underline inline-flex items-center gap-1 font-medium"
              >
                Tüm bonusları gör
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <button
              onClick={handleClose}
              className="block w-full text-ink-soft text-xs hover:text-ink-muted transition-colors mt-3"
            >
              Daha sonra hatırlat
            </button>

            <p className="text-ink-faint text-[11px] text-center mt-3">
              * 18 yaş ve üzeri için geçerlidir. Şartlar ve koşullar uygulanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
