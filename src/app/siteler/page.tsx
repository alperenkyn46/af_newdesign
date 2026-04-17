import { prisma } from "@/lib/prisma";
import { SiteCard } from "@/components/cards/site-card";
import {
  Trophy,
  Search,
  Crown,
  Star,
  Gem,
  Sparkles,
  TrendingUp,
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
      <div
        className={`absolute -top-16 -left-16 w-48 h-48 ${t.glowA} rounded-full blur-3xl pointer-events-none`}
        aria-hidden="true"
      />
      <div
        className={`absolute -bottom-20 -right-16 w-56 h-56 ${t.glowB} rounded-full blur-3xl pointer-events-none`}
        aria-hidden="true"
      />
      <div
        className={`absolute top-5 bottom-5 left-0 w-1 rounded-r-full ${t.ribbon}`}
        aria-hidden="true"
      />

      <div className="relative">
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

async function getSites() {
  const sites = await prisma.bettingSite.findMany({
    where: { isActive: true },
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

export const metadata = {
  title: "Bahis Siteleri - SlotBuse",
  description:
    "En güvenilir bahis siteleri listesi. Detaylı incelemeler ve özel bonuslar.",
};

export default async function SitesPage() {
  const sites = await getSites();
  const premiumSites = sites.filter((site) => site.sponsorTier === "premium");
  const vipSites = sites.filter((site) => site.sponsorTier === "vip");
  const diamondSites = sites.filter((site) => site.sponsorTier === "diamond");

  return (
    <div className="min-h-screen py-10 md:py-14 bg-surface-subtle">
      <div className="container mx-auto px-4 relative">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"
          style={{ backgroundSize: "32px 32px" }}
          aria-hidden="true"
        />
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center gap-3 tracking-tight relative">
            <Trophy className="w-8 h-8 text-primary-600" />
            Bahis Siteleri
          </h1>
          <p className="text-ink-muted mt-2 max-w-2xl relative">
            Türkiye&apos;nin en güvenilir bahis sitelerini inceleyin. Detaylı
            değerlendirmeler, kullanıcı yorumları ve özel bonuslar.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-line rounded-2xl shadow-soft p-4 mb-8 relative">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
              <input
                type="text"
                placeholder="Site ara..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-subtle border border-line text-ink placeholder-ink-faint focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
            <select className="px-4 py-2.5 rounded-xl bg-surface-subtle border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
              <option value="">Tüm Kategoriler</option>
              <option value="casino">Casino</option>
              <option value="spor">Spor Bahis</option>
              <option value="slot">Slot</option>
            </select>
            <select className="px-4 py-2.5 rounded-xl bg-surface-subtle border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all">
              <option value="rating">Puana Göre</option>
              <option value="name">İsme Göre</option>
              <option value="newest">En Yeni</option>
            </select>
          </div>
        </div>

        {/* Sites Grid */}
        {sites.length > 0 ? (
          <div className="space-y-6 relative">
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
          <div className="text-center py-16 bg-white rounded-2xl border border-line shadow-soft relative">
            <Trophy className="w-14 h-14 text-ink-faint mx-auto" />
            <h3 className="text-lg font-semibold text-ink mt-4">
              Henüz site eklenmemiş
            </h3>
            <p className="text-ink-muted mt-1">Yakında yeni siteler eklenecek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
