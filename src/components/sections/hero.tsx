"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: Trophy, value: "50+", label: "Bahis Sitesi" },
  { icon: Gift, value: "100+", label: "Aktif Bonus" },
  { icon: Users, value: "10K+", label: "Üye" },
  { icon: TrendingUp, value: "₺1M+", label: "Kazanç" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">Türkiye&apos;nin #1 Bahis Rehberi</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            En İyi{" "}
            <span className="gradient-text">Bahis Siteleri</span>
            <br />
            ve{" "}
            <span className="gradient-text">Özel Bonuslar</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
            Güvenilir bahis siteleri, güncel bonus kodları ve özel promosyonlar. 
            Hemen üye ol, puan kazan ve ödülleri kap!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/siteler">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                <Trophy className="w-5 h-5 mr-2" />
                Siteleri Keşfet
              </Button>
            </Link>
            <Link href="/kayit">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                <Gift className="w-5 h-5 mr-2" />
                Üye Ol & Kazan
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl p-6 text-center hover:border-primary-500/40 transition-all"
              >
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto" />
                <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
