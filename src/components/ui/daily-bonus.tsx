"use client";

import { useState, useEffect } from "react";
import { Gift, Clock, ArrowRight, X } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

export function DailyBonus() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();

      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-b border-orange-200/60">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center shadow-accent">
              <Gift className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-ink font-semibold text-sm">
                Günün Fırsatı · %150 Hoşgeldin Bonusu
              </p>
              <p className="text-ink-soft text-xs">
                İlk yatırımına özel, sadece bugün geçerli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <div className="flex gap-0.5 font-mono text-xs">
                <span className="bg-white border border-orange-200 px-1.5 py-0.5 rounded text-ink font-semibold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-orange-600">:</span>
                <span className="bg-white border border-orange-200 px-1.5 py-0.5 rounded text-ink font-semibold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-orange-600">:</span>
                <span className="bg-white border border-orange-200 px-1.5 py-0.5 rounded text-ink font-semibold">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            <Link href="/siteler">
              <Button variant="gold" size="sm" className="whitespace-nowrap">
                Hemen Al
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1.5 right-1.5 text-ink-soft hover:text-ink transition-colors p-1"
        aria-label="Kapat"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
