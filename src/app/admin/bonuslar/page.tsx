import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gift, Plus, Edit, Clock, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteBonusButton } from "./delete-bonus-button";

async function getBonuses() {
  const bonuses = await prisma.bonus.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      site: {
        select: { name: true, slug: true },
      },
    },
  });
  return bonuses;
}

export default async function AdminBonusesPage() {
  const bonuses = await getBonuses();

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
          Bonuslar
        </h1>
        <Link href="/admin/bonuslar/ekle">
          <Button variant="primary" className="text-sm sm:text-base w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Yeni Bonus Ekle
          </Button>
        </Link>
      </div>

      {bonuses.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {bonuses.map((bonus) => (
            <Card key={bonus.id} className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-brand-sm">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <div className="flex-grow min-w-0 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-ink">
                      {bonus.title}
                    </h3>
                    {bonus.isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                        Pasif
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 text-xs font-medium">
                      {bonus.type}
                    </span>
                  </div>
                  <p className="text-ink-muted text-xs sm:text-sm mt-1">
                    {bonus.site.name} • {bonus.value}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-ink-soft">
                    {bonus.code && (
                      <span className="font-mono bg-surface-subtle border border-line px-2 py-0.5 rounded text-xs text-ink">
                        {bonus.code}
                      </span>
                    )}
                    {bonus.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {formatDate(bonus.expiresAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-line-soft mt-2 sm:mt-0">
                  <Link
                    href={`/siteler/${bonus.site.slug}`}
                    className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-primary-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span className="text-xs sm:hidden">Görüntüle</span>
                  </Link>
                  <Link
                    href={`/admin/bonuslar/${bonus.id}`}
                    className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-primary-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span className="text-xs sm:hidden">Düzenle</span>
                  </Link>
                  <DeleteBonusButton bonusId={bonus.id} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8 sm:py-12">
          <Gift className="w-12 h-12 sm:w-14 sm:h-14 text-ink-faint mx-auto" />
          <h3 className="text-lg sm:text-xl font-semibold text-ink mt-4">
            Henüz bonus eklenmemiş
          </h3>
          <p className="text-ink-muted mt-2 text-sm">
            İlk bonusu ekleyin.
          </p>
          <Link href="/admin/bonuslar/ekle" className="inline-block mt-6">
            <Button variant="primary" className="text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Bonus Ekle
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
