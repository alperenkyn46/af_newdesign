"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Flame,
  Percent,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTimeRemaining } from "@/lib/utils";

interface BonusCardProps {
  id: string;
  title: string;
  description: string;
  code?: string | null;
  value: string;
  type: string;
  siteName: string;
  siteUrl: string;
  expiresAt?: Date | null;
}

export function BonusCard({
  title,
  description,
  code,
  value,
  type,
  siteName,
  siteUrl,
  expiresAt,
}: BonusCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!expiresAt || !mounted) return;

    setTimeLeft(getTimeRemaining(new Date(expiresAt)));

    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(new Date(expiresAt)));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, mounted]);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "hoşgeldin":
      case "hosgeldin":
        return {
          chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          valueAccent: "text-emerald-700",
          icon: Sparkles,
        };
      case "freespin":
        return {
          chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
          iconBg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
          valueAccent: "text-fuchsia-700",
          icon: Sparkles,
        };
      case "yatırım":
      case "yatirim":
        return {
          chip: "bg-sky-50 text-sky-700 border-sky-200",
          iconBg: "bg-sky-50 text-sky-700 border-sky-200",
          valueAccent: "text-sky-700",
          icon: Percent,
        };
      case "kayıp":
      case "kayip":
        return {
          chip: "bg-orange-50 text-orange-700 border-orange-200",
          iconBg: "bg-orange-50 text-orange-700 border-orange-200",
          valueAccent: "text-orange-700",
          icon: Gift,
        };
      case "vip":
        return {
          chip: "bg-amber-50 text-amber-700 border-amber-200",
          iconBg: "bg-amber-50 text-amber-700 border-amber-200",
          valueAccent: "text-amber-700",
          icon: Crown,
        };
      default:
        return {
          chip: "bg-primary-50 text-primary-700 border-primary-200",
          iconBg: "bg-primary-50 text-primary-700 border-primary-200",
          valueAccent: "text-primary-700",
          icon: Gift,
        };
    }
  };

  const typeStyle = getTypeStyle(type);
  const TypeIcon = typeStyle.icon;
  const isUrgent = mounted && timeLeft && timeLeft.days < 3;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-white border shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 ${
        isUrgent ? "border-orange-300" : "border-line"
      }`}
    >
      {isUrgent && (
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-white animate-pulse" />
          <span className="text-white text-sm font-bold tracking-wide">
            Son Fırsat
          </span>
        </div>
      )}

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyle.chip}`}
            >
              <TypeIcon className="w-3 h-3" />
              {type}
            </span>
            <h3 className="text-lg font-semibold text-ink mt-3 line-clamp-1">
              {title}
            </h3>
            <p className="text-ink-soft text-sm mt-0.5">{siteName}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${typeStyle.iconBg}`}
          >
            <Gift className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-surface-subtle border border-line">
          <p
            className={`text-3xl md:text-4xl font-black tracking-tight ${typeStyle.valueAccent}`}
          >
            {value}
          </p>
          <p className="text-ink-muted text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {mounted && timeLeft && (
          <div
            className={`flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border ${
              isUrgent
                ? "bg-orange-50 border-orange-200 text-orange-700"
                : "bg-surface-subtle border-line text-ink-muted"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium tabular-nums">
              {timeLeft.days > 0 && `${timeLeft.days}g `}
              {timeLeft.hours}s {timeLeft.minutes}d {timeLeft.seconds}sn kaldı
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-5">
          {code && (
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-subtle border border-dashed border-line-strong text-ink hover:border-primary-400 hover:text-primary-700 transition-all group"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium text-sm">
                    Kopyalandı
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-ink-soft group-hover:text-primary-700 transition-colors" />
                  <span className="font-mono font-bold text-sm">{code}</span>
                </>
              )}
            </button>
          )}
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={code ? "" : "flex-1"}
          >
            <Button
              variant="primary"
              className={`${code ? "" : "w-full"} group/btn`}
            >
              <span>Bonusu Al</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
