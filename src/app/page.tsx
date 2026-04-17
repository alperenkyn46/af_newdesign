import { HeroSlider } from "@/components/sections/hero-slider";
import { SiteCard } from "@/components/cards/site-card";
import { BonusCardCompact } from "@/components/cards/bonus-card-compact";
import { LiveStats } from "@/components/sections/live-stats";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Trophy,
  Gift,
  Send,
  Flame,
  Star,
  CheckCircle2,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Timer,
} from "lucide-react";

type TierTone = "amber" | "fuchsia" | "sky";
type IconType = React.ComponentType<{ className?: string }>;

const TIER_TONES: Record<
  TierTone,
  {
    panelBg: string;
    panelBorder: string;
    glowA: string;
    glowB: string;
    iconWrap: string;
    titleColor: string;
    countChip: string;
    tagline: string;
    highlight: string;
    ribbon: string;
  }
> = {
  amber: {
    panelBg: "bg-gradient-to-br from-amber-50/80 via-white to-white",
    panelBorder: "border-amber-200/70",
    glowA: "bg-amber-200/50",
    glowB: "bg-orange-100/60",
    iconWrap:
      "bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_8px_20px_rgba(249,115,22,0.28)]",
    titleColor: "text-amber-800",
    countChip: "bg-amber-100 text-amber-800 border-amber-200",
    tagline: "text-amber-700/80",
    highlight: "text-amber-700",
    ribbon: "bg-gradient-to-b from-amber-400 to-orange-500",
  },
  fuchsia: {
    panelBg: "bg-gradient-to-br from-fuchsia-50/80 via-white to-white",
    panelBorder: "border-fuchsia-200/70",
    glowA: "bg-fuchsia-200/50",
    glowB: "bg-purple-100/60",
    iconWrap:
      "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_8px_20px_rgba(192,38,211,0.28)]",
    titleColor: "text-fuchsia-800",
    countChip: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    tagline: "text-fuchsia-700/80",
    highlight: "text-fuchsia-700",
    ribbon: "bg-gradient-to-b from-fuchsia-500 to-purple-600",
  },
  sky: {
    panelBg: "bg-gradient-to-br from-sky-50/80 via-white to-white",
    panelBorder: "border-sky-200/70",
    glowA: "bg-sky-200/50",
    glowB: "bg-blue-100/60",
    iconWrap:
      "bg-gradient-to-br from-sky-500 to-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.28)]",
    titleColor: "text-sky-800",
    countChip: "bg-sky-100 text-sky-800 border-sky-200",
    tagline: "text-sky-700/80",
    highlight: "text-sky-700",
    ribbon: "bg-gradient-to-b from-sky-500 to-blue-600",
  },
};

function TierPanel({
  tone,
  icon: Icon,
  title,
  tagline,
  count,
  highlightLabel,
  highlightIcon: HighlightIcon,
  children,
}: {
  tone: TierTone;
  icon: IconType;
  title: string;
  tagline: string;
  count: number;
  highlightLabel?: string;
  highlightIcon?: IconType;
  children: React.ReactNode;
}) {
  const t = TIER_TONES[tone];
  return (
    <div
      className={`relative rounded-3xl border ${t.panelBg} ${t.panelBorder} p-4 sm:p-5 md:p-6 overflow-hidden shadow-soft`}
    >
      {/* Decorative glows */}
      <div
        className={`absolute -top-16 -left-16 w-48 h-48 ${t.glowA} rounded-full blur-3xl pointer-events-none`}
        aria-hidden="true"
      />
      <div
        className={`absolute -bottom-20 -right-16 w-56 h-56 ${t.glowB} rounded-full blur-3xl pointer-events-none`}
        aria-hidden="true"
      />
      {/* Left ribbon */}
      <div
        className={`absolute top-5 bottom-5 left-0 w-1 rounded-r-full ${t.ribbon}`}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Tier header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${t.iconWrap}`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-base md:text-lg font-bold tracking-tight ${t.titleColor}`}
                >
                  {title}
                </h3>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border tabular-nums ${t.countChip}`}
                >
                  {count} Site
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${t.tagline}`}>{tagline}</p>
            </div>
          </div>
          {highlightLabel && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${t.highlight}`}
            >
              {HighlightIcon && <HighlightIcon className="w-3.5 h-3.5" />}
              {highlightLabel}
            </span>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

async function getFeaturedSites() {
  const sites = await prisma.bettingSite.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      bonuses: {
        where: { isActive: true },
        take: 1,
      },
    },
    orderBy: { order: "asc" },
  });
  return sites;
}

async function getLatestBonuses() {
  const bonuses = await prisma.bonus.findMany({
    where: { isActive: true, showInLatest: true },
    include: {
      site: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return bonuses;
}

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst({
    select: {
      kickLink: true,
      eventChannelLink: true,
    },
  });

  return {
    kickLink: settings?.kickLink || "/sosyal",
    eventChannelLink: settings?.eventChannelLink || "/sosyal",
  };
}

export default async function HomePage() {
  const [sites, bonuses, siteSettings] = await Promise.all([
    getFeaturedSites(),
    getLatestBonuses(),
    getSiteSettings(),
  ]);
  const premiumSites = sites.filter((site) => site.sponsorTier === "premium");
  const vipSites = sites.filter((site) => site.sponsorTier === "vip");
  const diamondSites = sites.filter((site) => site.sponsorTier === "diamond");

  return (
    <div className="min-h-screen">
      <HeroSlider />

      <LiveStats />

      {/* Featured Sites Section */}
      <section className="relative py-14 md:py-20 bg-surface-subtle border-y border-line overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"
          style={{ backgroundSize: "32px 32px" }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5" />
                En Popüler
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
                Öne Çıkan Siteler
              </h2>
              <p className="text-ink-muted mt-2 text-sm md:text-base">
                Lisanslı, güvenilir ve yüksek bonus veren bahis platformlarını
                üç kademeye ayırdık. Seviyeni seç, hemen kazanmaya başla.
              </p>
            </div>

            <div className="flex items-stretch gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-line shadow-soft">
                <div>
                  <p className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">
                    Toplam
                  </p>
                  <p className="text-lg font-bold text-ink tabular-nums leading-none mt-0.5">
                    {sites.length}
                  </p>
                </div>
                <div className="w-px h-8 bg-line" />
                <div>
                  <p className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">
                    Doğrulanmış
                  </p>
                  <p className="text-lg font-bold text-emerald-600 leading-none mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    {sites.length}
                  </p>
                </div>
              </div>
              <Link href="/siteler" className="self-center">
                <Button variant="secondary">
                  Tümü
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {sites.length > 0 ? (
            <div className="space-y-6">
              {/* Premium Tier Panel */}
              {premiumSites.length > 0 && (
                <TierPanel
                  tone="amber"
                  icon={Crown}
                  title="Premium Sponsor"
                  tagline="En yüksek güvence, en büyük bonuslar"
                  count={premiumSites.length}
                  highlightLabel="En Çok Tercih Edilen"
                  highlightIcon={Sparkles}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {premiumSites.map((site, idx) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        name={site.name}
                        slug={site.slug}
                        logo={site.logo}
                        url={site.url}
                        description={site.description}
                        rating={site.rating}
                        features={site.features.split(",")}
                        bonus={
                          site.bonuses[0]
                            ? {
                                title: site.bonuses[0].title,
                                value: site.bonuses[0].value,
                              }
                            : undefined
                        }
                        featured={idx === 0}
                        sponsorTier={site.sponsorTier}
                      />
                    ))}
                  </div>
                </TierPanel>
              )}

              {/* VIP Tier Panel */}
              {vipSites.length > 0 && (
                <TierPanel
                  tone="fuchsia"
                  icon={Star}
                  title="VIP Sponsor"
                  tagline="Özel kampanyalar ve yüksek çarpanlar"
                  count={vipSites.length}
                  highlightLabel="Avantajlı Paketler"
                  highlightIcon={TrendingUp}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {vipSites.map((site, idx) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        name={site.name}
                        slug={site.slug}
                        logo={site.logo}
                        url={site.url}
                        description={site.description}
                        rating={site.rating}
                        features={site.features.split(",")}
                        bonus={
                          site.bonuses[0]
                            ? {
                                title: site.bonuses[0].title,
                                value: site.bonuses[0].value,
                              }
                            : undefined
                        }
                        featured={idx === 0}
                        sponsorTier={site.sponsorTier}
                      />
                    ))}
                  </div>
                </TierPanel>
              )}

              {/* Diamond Tier Panel */}
              {diamondSites.length > 0 && (
                <TierPanel
                  tone="sky"
                  icon={Gem}
                  title="Diamond Sponsor"
                  tagline="Elit platformlar, sürekli kazanç imkânı"
                  count={diamondSites.length}
                  highlightLabel="Elit Seviye"
                  highlightIcon={Sparkles}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {diamondSites.map((site, idx) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        name={site.name}
                        slug={site.slug}
                        logo={site.logo}
                        url={site.url}
                        description={site.description}
                        rating={site.rating}
                        features={site.features.split(",")}
                        bonus={
                          site.bonuses[0]
                            ? {
                                title: site.bonuses[0].title,
                                value: site.bonuses[0].value,
                              }
                            : undefined
                        }
                        featured={idx === 0}
                        sponsorTier={site.sponsorTier}
                      />
                    ))}
                  </div>
                </TierPanel>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-line shadow-soft">
              <Trophy className="w-10 h-10 text-ink-faint mx-auto" />
              <p className="text-ink-muted mt-3">Henüz site eklenmemiş</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Bonuses Section */}
      <section className="relative py-14 md:py-20 bg-white overflow-hidden">
        {/* Decorative glows */}
        <div
          className="absolute -top-24 -left-24 w-[360px] h-[360px] bg-primary-100/60 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-orange-100/70 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[11px] font-bold tracking-widest uppercase">
                <Gift className="w-3.5 h-3.5" />
                Güncel Fırsatlar
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
                Güncel Bonuslar
              </h2>
              <p className="text-ink-muted mt-2 text-sm md:text-base">
                Haftanın en yüksek değerli bonus ve promosyonları. Saatlik
                güncellenir, kaçırmadan kullan.
              </p>
            </div>

            <div className="flex items-stretch gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-line shadow-soft">
                <Timer className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">
                    Aktif
                  </p>
                  <p className="text-lg font-bold text-ink tabular-nums leading-none mt-0.5">
                    {bonuses.length}+
                  </p>
                </div>
              </div>
              <Link href="/bonuslar" className="self-center">
                <Button variant="secondary">
                  Tümü
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {bonuses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {bonuses.map((bonus) => (
                <BonusCardCompact
                  key={bonus.id}
                  id={bonus.id}
                  title={bonus.title}
                  value={bonus.value}
                  type={bonus.type}
                  siteName={bonus.site.name}
                  siteUrl={bonus.site.url}
                  expiresAt={bonus.expiresAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-subtle rounded-2xl border border-line">
              <Gift className="w-10 h-10 text-ink-faint mx-auto" />
              <p className="text-ink-muted mt-3">Henüz bonus eklenmemiş</p>
            </div>
          )}
        </div>
      </section>

      {/* Games Section */}
      <section className="py-14 md:py-20 bg-white border-y border-line">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
              <Flame className="w-7 h-7 text-orange-500" />
              Oyunlar & Ödüller
            </h2>
            <p className="text-ink-muted mt-2 text-sm md:text-base">
              Her gün puan kazan, şansını dene
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Günlük Ödül",
                description:
                  "Her gün giriş yap, seri bonus kazan. 7 gün üst üste 185 puan.",
                icon: "🎁",
                tint: "bg-emerald-50 border-emerald-200 text-emerald-700",
                href: "/oyunlar/gunluk",
              },
              {
                title: "Çark Çevir",
                description: "Günde bir kez çark çevir, 5-100 puan arası kazan.",
                icon: "🎡",
                tint: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
                href: "/oyunlar/cark",
              },
              {
                title: "Slot Makinesi",
                description: "Puanlarını kat. 50x'e kadar kazanç şansı.",
                icon: "🎰",
                tint: "bg-amber-50 border-amber-200 text-amber-700",
                href: "/oyunlar/slot",
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="group">
                <div className="bg-white border border-line rounded-2xl p-6 text-center hover:shadow-card hover:-translate-y-1 transition-all h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border ${item.tint}`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-ink-muted text-sm mb-4">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary-700 font-semibold text-sm group-hover:gap-2 transition-all">
                    Oyna <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/oyunlar">
              <Button variant="primary" size="lg">
                Tüm Oyunları Gör
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Benefits Section */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-white border border-line shadow-card p-8 md:p-12">
            <div className="absolute -top-20 -left-20 w-[280px] h-[280px] bg-amber-100 rounded-full blur-[80px] opacity-70" />
            <div className="absolute -bottom-20 -right-20 w-[240px] h-[240px] bg-primary-100 rounded-full blur-[80px] opacity-70" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-4">
                  <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span className="text-amber-700 text-xs font-bold tracking-wide">
                    VIP PROGRAM
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-ink mb-3 tracking-tight">
                  VIP Üyelere Özel Ayrıcalıklar
                </h2>
                <p className="text-ink-muted mb-6 leading-relaxed">
                  Puan topla, seviye atla ve özel bonusların kilidini aç. VIP
                  üyelerimiz her zaman bir adım önde.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {[
                    "Özel bonus kodları ve promosyonlar",
                    "Öncelikli müşteri desteği",
                    "Haftalık ve aylık ödüller",
                    "Özel turnuva davetiyeleri",
                    "Kişiye özel teklifler",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-ink-muted text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/panel/vip">
                  <Button variant="gold" size="lg">
                    VIP Detayları
                    <Star className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    level: "Bronze",
                    points: "0-500",
                    bonus: "%10",
                    tone: "text-amber-700 bg-amber-50 border-amber-200",
                  },
                  {
                    level: "Silver",
                    points: "500-2000",
                    bonus: "%25",
                    tone: "text-ink bg-surface-subtle border-line-strong",
                  },
                  {
                    level: "Gold",
                    points: "2000-5000",
                    bonus: "%50",
                    tone: "text-amber-700 bg-amber-50 border-amber-200",
                  },
                  {
                    level: "Platinum",
                    points: "5000+",
                    bonus: "%100",
                    tone: "text-sky-700 bg-sky-50 border-sky-200",
                  },
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 text-center border ${tier.tone} hover:-translate-y-0.5 transition-transform cursor-pointer`}
                  >
                    <div className="text-lg font-bold mb-1">{tier.level}</div>
                    <p className="text-ink-soft text-xs mb-2">
                      {tier.points} puan
                    </p>
                    <p className="text-emerald-700 font-bold text-sm">
                      {tier.bonus} Bonus
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12">
            <div className="absolute -top-10 -right-10 w-[320px] h-[320px] bg-white/15 rounded-full blur-[60px]" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Telegram Kanalımıza Katıl
                </h2>
                <p className="text-white/85 mt-2 text-sm md:text-base">
                  Özel bonuslar, anlık bildirimler ve VIP fırsatları için
                  Telegram kanalımıza katıl.
                </p>
              </div>
              <a
                href="https://t.me/slotbusesohbet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:bg-white/95 transition-all shadow-pop">
                  <Send className="w-5 h-5" />
                  Kanala Katıl
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section with Points */}
      <section className="py-14 md:py-20 bg-white border-t border-line">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
              Takip Et, Puan Kazan
            </h2>
            <p className="text-ink-muted mt-2 text-sm md:text-base">
              Sosyal medya hesaplarımızı takip edin, puan kazanın
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Telegram */}
            <Link
              href="/sosyal"
              className="group bg-white border border-line rounded-2xl p-5 text-center hover:border-[#229ED9]/40 hover:shadow-card transition-all relative"
            >
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                +50 Puan
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/20 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-[#229ED9]" />
              </div>
              <h3 className="text-ink font-semibold mt-3 text-sm">Telegram</h3>
              <p className="text-ink-soft text-xs mt-0.5">@SlotBuse</p>
              <span className="inline-block mt-3 text-xs text-[#229ED9] font-medium group-hover:underline">
                Katıl & Kazan →
              </span>
            </Link>

            {/* Instagram */}
            <Link
              href="/sosyal"
              className="group bg-white border border-line rounded-2xl p-5 text-center hover:border-[#E4405F]/40 hover:shadow-card transition-all relative"
            >
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                +30 Puan
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#833AB4]/10 via-[#E4405F]/10 to-[#FCAF45]/10 border border-[#E4405F]/20 flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-[#E4405F]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="text-ink font-semibold mt-3 text-sm">Instagram</h3>
              <p className="text-ink-soft text-xs mt-0.5">@SlotBuse</p>
              <span className="inline-block mt-3 text-xs text-[#E4405F] font-medium group-hover:underline">
                Takip Et & Kazan →
              </span>
            </Link>

            {/* Kick */}
            <Link
              href={siteSettings.kickLink}
              className="group bg-white border border-line rounded-2xl p-5 text-center hover:border-emerald-400/50 hover:shadow-card transition-all relative"
            >
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                +30 Puan
              </div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-[#53FC18]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15zm6.2 3.8a.8.8 0 0 0-.8.8v6.8c0 .44.36.8.8.8h1.6a.8.8 0 0 0 .8-.8v-2.2l2.6 2.7a.8.8 0 0 0 .58.25h2.1a.8.8 0 0 0 .57-1.36l-3.25-3.28 3.05-2.9a.8.8 0 0 0-.55-1.38h-2.17a.8.8 0 0 0-.55.22L11.6 11V9.1a.8.8 0 0 0-.8-.8H9.2z" />
                </svg>
              </div>
              <h3 className="text-ink font-semibold mt-3 text-sm">Kick</h3>
              <p className="text-ink-soft text-xs mt-0.5">@slotbuse</p>
              <span className="inline-block mt-3 text-xs text-emerald-700 font-medium group-hover:underline">
                Takip Et & Kazan →
              </span>
            </Link>

            {/* Event Channel */}
            <Link
              href={siteSettings.eventChannelLink}
              className="group bg-white border border-line rounded-2xl p-5 text-center hover:border-amber-400/50 hover:shadow-card transition-all relative"
            >
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                +30 Puan
              </div>
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-ink font-semibold mt-3 text-sm">
                Etkinlik Kanalımız
              </h3>
              <p className="text-ink-soft text-xs mt-0.5">@slotbuse</p>
              <span className="inline-block mt-3 text-xs text-amber-700 font-medium group-hover:underline">
                Katıl & Kazan →
              </span>
            </Link>

            {/* YouTube */}
            <Link
              href="/sosyal"
              className="group bg-white border border-line rounded-2xl p-5 text-center hover:border-[#FF0000]/40 hover:shadow-card transition-all relative"
            >
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                +40 Puan
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#FF0000]/5 border border-[#FF0000]/20 flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-[#FF0000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <h3 className="text-ink font-semibold mt-3 text-sm">YouTube</h3>
              <p className="text-ink-soft text-xs mt-0.5">SlotBuse</p>
              <span className="inline-block mt-3 text-xs text-[#FF0000] font-medium group-hover:underline">
                Abone Ol & Kazan →
              </span>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link href="/sosyal">
              <Button variant="secondary">
                Tüm Ödülleri Gör
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
