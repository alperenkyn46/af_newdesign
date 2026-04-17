import { prisma } from "@/lib/prisma";
import { SiteCard } from "@/components/cards/site-card";
import { Trophy, Search } from "lucide-react";

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

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center gap-3 tracking-tight">
            <Trophy className="w-8 h-8 text-primary-600" />
            Bahis Siteleri
          </h1>
          <p className="text-ink-muted mt-2 max-w-2xl">
            Türkiye&apos;nin en güvenilir bahis sitelerini inceleyin. Detaylı
            değerlendirmeler, kullanıcı yorumları ve özel bonuslar.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-line rounded-2xl shadow-soft p-4 mb-8">
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
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {sites.map((site, idx) => (
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
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-line shadow-soft">
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
