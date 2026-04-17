"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Gift,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/hero-banner-1.png",
    tag: "TÜRKİYE'NİN #1 BAHİS REHBERİ",
    tagTone: "primary" as const,
    title: "Güvenilir Bahis Siteleri",
    titleHighlight: "Tek Çatı Altında",
    description:
      "Lisanslı sitelerden seçilmiş bonuslar, detaylı incelemeler ve güvenilir yönlendirmeler.",
    features: ["Güncel bonuslar", "Detaylı incelemeler", "Güvenli siteler"],
    cta: { text: "Siteleri Keşfet", href: "/siteler" },
    ctaSecondary: { text: "Üye Ol", href: "/kayit" },
  },
  {
    id: 2,
    image: "/images/hero-banner-2.png",
    tag: "VIP PROGRAM",
    tagTone: "gold" as const,
    title: "VIP Ayrıcalıklarla",
    titleHighlight: "Bir Adım Öndesin",
    description:
      "Özel bonuslar, öncelikli destek ve kişiye özel fırsatlarla premium deneyim.",
    features: ["Özel etkinlikler", "VIP masalar", "Kişisel danışman"],
    cta: { text: "VIP Ol", href: "/panel/vip" },
    ctaSecondary: { text: "Detaylar", href: "/panel/vip" },
  },
  {
    id: 3,
    image: "/images/hero-banner-3.png",
    tag: "BÜYÜK ÖDÜL HAVUZU",
    tagTone: "accent" as const,
    title: "Jackpot",
    titleHighlight: "Seni Bekliyor",
    description:
      "Slot, çark ve günlük ödüllerle her gün puan kazan, harca ve kazançlı çık.",
    features: ["Slot oyunları", "Çark çevir", "Günlük bonuslar"],
    cta: { text: "Şansını Dene", href: "/oyunlar" },
    ctaSecondary: { text: "Oyunlara Git", href: "/oyunlar" },
  },
];

const tagStyles: Record<"primary" | "gold" | "accent", string> = {
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  gold: "bg-amber-50 text-amber-700 border-amber-200",
  accent: "bg-orange-50 text-orange-700 border-orange-200",
};

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden pb-16 md:pb-0"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-4 pt-10 md:pt-16 pb-20 md:pb-24">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Content */}
          <div
            key={`content-${slide.id}`}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${tagStyles[slide.tagTone]} animate-fadeIn`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {slide.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Canlı
              </span>
            </div>

            <div className="animate-slideUp">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight">
                {slide.title}
                <span className="block mt-1 gradient-text">
                  {slide.titleHighlight}
                </span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg mt-5 max-w-xl leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* Feature pills */}
            <div
              className="flex flex-wrap gap-2 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              {slide.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-line text-sm text-ink-muted"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex gap-3 pt-2 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <Link href={slide.cta.href}>
                <Button variant="primary" size="lg" className="group">
                  {slide.cta.text}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href={slide.ctaSecondary.href}>
                <Button variant="secondary" size="lg">
                  {slide.ctaSecondary.text}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="hidden md:flex items-center gap-5 pt-3 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-ink-soft">Güvenli & Lisanslı</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-ink-soft">Anında ödeme</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
                <span className="text-xs text-ink-soft">4.9 / 5.0 memnuniyet</span>
              </div>
            </div>
          </div>

          {/* Right: Visual + Stats Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-line shadow-pop">
              {slide.image && (
                <div className="relative aspect-[4/3] w-full bg-surface-muted">
                  <Image
                    src={slide.image}
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                </div>
              )}

              {/* Overlayed stats pill grid */}
              <div className="grid grid-cols-2 gap-3 p-4 md:p-5 border-t border-line bg-white">
                {[
                  {
                    icon: Gift,
                    value: "100+",
                    label: "Aktif Bonus",
                    tint: "text-emerald-700 bg-emerald-50",
                  },
                  {
                    icon: ShieldCheck,
                    value: "%100",
                    label: "Lisans Kontrolü",
                    tint: "text-primary-700 bg-primary-50",
                  },
                  {
                    icon: Zap,
                    value: "7/24",
                    label: "Canlı Destek",
                    tint: "text-orange-700 bg-orange-50",
                  },
                  {
                    icon: Star,
                    value: "4.9/5",
                    label: "Memnuniyet",
                    tint: "text-amber-700 bg-amber-50",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-line p-3 bg-surface-subtle"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.tint}`}
                    >
                      <stat.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-ink leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-ink-soft mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating highlight tag */}
            <div className="hidden md:flex absolute -top-4 -left-4 items-center gap-2 px-3 py-2 rounded-xl bg-white border border-line shadow-card">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-ink">
                847 kullanıcı şu an aktif
              </span>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-between mt-10 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border border-line shadow-soft flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border border-line shadow-soft flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-1 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / slides.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs font-mono text-ink-soft tabular-nums">
              <span className="text-ink font-bold">
                {String(currentSlide + 1).padStart(2, "0")}
              </span>
              <span className="mx-1">/</span>
              <span>{String(slides.length).padStart(2, "0")}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-6 h-2 bg-primary-600"
                    : "w-2 h-2 bg-line-strong hover:bg-ink-faint"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
