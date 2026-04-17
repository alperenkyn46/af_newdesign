"use client";

import Image from "next/image";
import { Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteCardProps {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url: string;
  description: string;
  rating: number;
  features: string[];
  bonus?: {
    title: string;
    value: string;
  };
  featured?: boolean;
  sponsorTier?: string;
}

export function SiteCard({
  name,
  logo,
  url,
  description,
  rating,
  bonus,
  sponsorTier = "premium",
}: SiteCardProps) {
  // Tier -> light-theme color tokens. Structure of the card is preserved.
  const tierBadgeClass =
    sponsorTier === "diamond"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : sponsorTier === "vip"
        ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  const tierBorderClass =
    sponsorTier === "diamond"
      ? "border-sky-200 hover:border-sky-300"
      : sponsorTier === "vip"
        ? "border-fuchsia-200 hover:border-fuchsia-300"
        : "border-amber-200 hover:border-amber-300";

  const tierCtaClass =
    sponsorTier === "diamond"
      ? "bg-gradient-to-r from-sky-500 to-blue-600 shadow-brand-sm"
      : sponsorTier === "vip"
        ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-[0_6px_16px_rgba(192,38,211,0.22)]"
        : "bg-gradient-accent shadow-accent";

  const tierLabel =
    sponsorTier === "diamond"
      ? "Diamond"
      : sponsorTier === "vip"
        ? "VIP"
        : "Premium";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300",
        "bg-white border shadow-soft hover:shadow-card hover:-translate-y-0.5",
        tierBorderClass
      )}
    >
      {/* Top: Badge + Rating */}
      <div className="flex items-center justify-between px-3 pt-3">
        <span
          className={cn(
            "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border",
            tierBadgeClass
          )}
        >
          {tierLabel}
        </span>
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-xs text-amber-600 font-semibold">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-4 sm:py-5">
        <div className="relative w-full h-10 sm:h-12 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Bonus Text */}
      <div className="px-3 pb-2 text-center flex-grow">
        {bonus ? (
          <>
            <p className="text-xs sm:text-sm font-bold text-ink leading-tight">
              {bonus.value}
            </p>
            <p className="text-[10px] sm:text-xs text-ink-soft mt-0.5 line-clamp-1">
              {bonus.title}
            </p>
          </>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-ink leading-tight line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-3 pb-3 pt-1">
        <div
          className={cn(
            "w-full py-2 rounded-xl text-center text-xs sm:text-sm font-bold text-white transition-all duration-300 group-hover:brightness-105",
            tierCtaClass
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            Siteye Git
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  );
}
