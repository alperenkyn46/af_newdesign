"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Trophy, Banknote, TrendingUp } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  tint: string;
}

function StatItem({
  icon: Icon,
  value,
  label,
  suffix = "",
  prefix = "",
  tint,
}: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className="bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint} group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-ink tabular-nums leading-none">
            {prefix}
            {displayValue.toLocaleString("tr-TR")}
            {suffix}
          </p>
          <p className="text-[11px] sm:text-xs text-ink-soft mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function LiveStats() {
  const [stats, setStats] = useState({
    users: 12847,
    winners: 3421,
    payout: 2847650,
    activeNow: 847,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 3),
        winners: prev.winners + Math.floor(Math.random() * 2),
        payout: prev.payout + Math.floor(Math.random() * 5000),
        activeNow: Math.max(
          500,
          prev.activeNow + Math.floor(Math.random() * 20) - 10
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">
              Canlı İstatistikler
            </h2>
            <p className="text-ink-muted mt-1 text-sm">
              Platformumuzda gerçek zamanlı veriler
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Güncel · Son 5 sn
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatItem
            icon={Users}
            value={stats.users}
            label="Toplam Üye"
            suffix="+"
            tint="bg-primary-50 text-primary-700"
          />
          <StatItem
            icon={Trophy}
            value={stats.winners}
            label="Bugün Kazanan"
            tint="bg-amber-50 text-amber-700"
          />
          <StatItem
            icon={Banknote}
            value={stats.payout}
            label="Toplam Ödeme"
            prefix="₺"
            tint="bg-emerald-50 text-emerald-700"
          />
          <StatItem
            icon={TrendingUp}
            value={stats.activeNow}
            label="Şu An Aktif"
            tint="bg-orange-50 text-orange-700"
          />
        </div>
      </div>
    </section>
  );
}
