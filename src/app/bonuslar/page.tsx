import { prisma } from "@/lib/prisma";
import { BonusCard } from "@/components/cards/bonus-card";
import { Gift, Filter } from "lucide-react";

async function getBonuses() {
  const bonuses = await prisma.bonus.findMany({
    where: { isActive: true },
    include: {
      site: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return bonuses;
}

export const metadata = {
  title: "Bonuslar - SlotBuse",
  description: "Güncel bonus kodları, promosyonlar ve özel fırsatlar.",
};

export default async function BonusesPage() {
  const bonuses = await getBonuses();

  const bonusTypes = ["Tümü", "Hoşgeldin", "FreeSpin", "Yatırım", "Kayıp", "VIP"];

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center gap-3 tracking-tight">
            <Gift className="w-8 h-8 text-primary-600" />
            Bonuslar & Promosyonlar
          </h1>
          <p className="text-ink-muted mt-2 max-w-2xl">
            En güncel bonus kodları ve promosyonları keşfedin. Özel fırsatları
            kaçırmayın.
          </p>
        </div>

        <div className="bg-white border border-line rounded-2xl shadow-soft p-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-ink-soft" />
            {bonusTypes.map((type, idx) => (
              <button
                key={type}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  idx === 0
                    ? "bg-primary-600 text-white shadow-brand-sm"
                    : "bg-surface-subtle text-ink-muted border border-line hover:border-primary-300 hover:text-primary-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {bonuses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bonuses.map((bonus) => (
              <BonusCard
                key={bonus.id}
                id={bonus.id}
                title={bonus.title}
                description={bonus.description}
                code={bonus.code}
                value={bonus.value}
                type={bonus.type}
                siteName={bonus.site.name}
                siteUrl={bonus.site.url}
                expiresAt={bonus.expiresAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-line shadow-soft">
            <Gift className="w-14 h-14 text-ink-faint mx-auto" />
            <h3 className="text-lg font-semibold text-ink mt-4">
              Henüz bonus eklenmemiş
            </h3>
            <p className="text-ink-muted mt-1">
              Yakında yeni bonuslar eklenecek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
