"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  ExternalLink,
  Clock,
  Sparkles,
  Percent,
  Crown,
  Flame,
} from "lucide-react";
import { cn, getTimeRemaining } from "@/lib/utils";

interface BonusCardCompactProps {
  id: string;
  title: string;
  value: string;
  type: string;
  siteName: string;
  siteUrl: string;
  expiresAt?: Date | null;
}

export function BonusCardCompact({
  value,
  type,
  siteName,
  siteUrl,
  expiresAt,
}: BonusCardCompactProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!expiresAt || !mounted) return;
    setTimeLeft(getTimeRemaining(new Date(expiresAt)));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(new Date(expiresAt)));
    }, 60000);
    return () => clearInterval(timer);
  }, [expiresAt, mounted]);

  const style = getTypeStyle(type);
  const Icon = style.icon;
  const isUrgent = mounted && timeLeft && timeLeft.days < 2;

  return (
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300",
        "bg-white border shadow-soft hover:shadow-card hover:-translate-y-0.5",
        isUrgent ? "border-orange-300 hover:border-orange-400" : style.border
      )}
    >
      {/* Top: Badge + Timer / Urgent */}
      <div className="flex items-center justify-between px-3 pt-3">
        <span
          className={cn(
            "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border",
            style.badge
          )}
        >
          {type}
        </span>
        {isUrgent ? (
          <span className="flex items-center gap-1 text-orange-600">
            <Flame className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Son Fırsat
            </span>
          </span>
        ) : mounted && timeLeft ? (
          <span className="flex items-center gap-0.5 text-ink-soft">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] font-semibold tabular-nums">
              {timeLeft.days > 0
                ? `${timeLeft.days}g`
                : `${timeLeft.hours}s`}
            </span>
          </span>
        ) : null}
      </div>

      {/* Icon Tile */}
      <div className="flex items-center justify-center px-4 py-4 sm:py-5">
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            style.iconBg
          )}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Value + Site Name */}
      <div className="px-3 pb-2 text-center flex-grow">
        <p
          className={cn(
            "text-base sm:text-lg font-black leading-tight tracking-tight",
            style.valueColor
          )}
        >
          {value}
        </p>
        <p className="text-[10px] sm:text-xs text-ink-soft mt-1 line-clamp-1">
          {siteName}
        </p>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3 pt-1">
        <div
          className={cn(
            "w-full py-2 rounded-xl text-center text-xs sm:text-sm font-bold text-white transition-all duration-300 group-hover:brightness-105",
            style.cta
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            Bonusu Al
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  );
}

function getTypeStyle(type: string) {
  switch (type.toLowerCase()) {
    case "hoşgeldin":
    case "hosgeldin":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        border: "border-emerald-200 hover:border-emerald-300",
        iconBg: "bg-emerald-100 border border-emerald-200 text-emerald-700",
        valueColor: "text-emerald-700",
        cta: "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_6px_16px_rgba(16,185,129,0.25)]",
        icon: Sparkles,
      };
    case "freespin":
      return {
        badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
        border: "border-fuchsia-200 hover:border-fuchsia-300",
        iconBg: "bg-fuchsia-100 border border-fuchsia-200 text-fuchsia-700",
        valueColor: "text-fuchsia-700",
        cta: "bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-[0_6px_16px_rgba(192,38,211,0.25)]",
        icon: Sparkles,
      };
    case "yatırım":
    case "yatirim":
      return {
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        border: "border-sky-200 hover:border-sky-300",
        iconBg: "bg-sky-100 border border-sky-200 text-sky-700",
        valueColor: "text-sky-700",
        cta: "bg-gradient-to-r from-sky-500 to-blue-600 shadow-brand-sm",
        icon: Percent,
      };
    case "kayıp":
    case "kayip":
      return {
        badge: "bg-orange-50 text-orange-700 border-orange-200",
        border: "border-orange-200 hover:border-orange-300",
        iconBg: "bg-orange-100 border border-orange-200 text-orange-700",
        valueColor: "text-orange-700",
        cta: "bg-gradient-accent shadow-accent",
        icon: Gift,
      };
    case "vip":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        border: "border-amber-200 hover:border-amber-300",
        iconBg: "bg-amber-100 border border-amber-200 text-amber-700",
        valueColor: "text-amber-700",
        cta: "bg-gradient-gold shadow-[0_6px_16px_rgba(234,88,12,0.28)]",
        icon: Crown,
      };
    default:
      return {
        badge: "bg-primary-50 text-primary-700 border-primary-200",
        border: "border-primary-200 hover:border-primary-300",
        iconBg: "bg-primary-100 border border-primary-200 text-primary-700",
        valueColor: "text-primary-700",
        cta: "bg-gradient-primary shadow-brand-sm",
        icon: Gift,
      };
  }
}
