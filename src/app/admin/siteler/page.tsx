import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Plus, Edit, Star, ExternalLink } from "lucide-react";
import { DeleteSiteButton } from "./delete-site-button";

async function getSites() {
  const sites = await prisma.bettingSite.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { bonuses: true },
      },
    },
  });
  return sites;
}

export default async function AdminSitesPage() {
  const sites = await getSites();

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
          Bahis Siteleri
        </h1>
        <Link href="/admin/siteler/ekle">
          <Button variant="primary" className="text-sm sm:text-base w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Yeni Site Ekle
          </Button>
        </Link>
      </div>

      {sites.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {sites.map((site) => (
            <Card key={site.id} className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-surface-subtle border border-line p-1.5 sm:p-2 flex-shrink-0">
                  <Image
                    src={site.logo}
                    alt={site.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-grow min-w-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-ink">
                      {site.name}
                    </h3>
                    {site.isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                        Pasif
                      </span>
                    )}
                  </div>
                  <p className="text-ink-muted text-xs sm:text-sm mt-1 line-clamp-1">
                    {site.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-ink-soft">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400" />
                      {site.rating.toFixed(1)}
                    </span>
                    <span>{site._count.bonuses} bonus</span>
                    <span>Sıra: {site.order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-line-soft mt-2 sm:mt-0">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-primary-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span className="text-xs sm:hidden">Görüntüle</span>
                  </a>
                  <Link
                    href={`/admin/siteler/${site.id}`}
                    className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-primary-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span className="text-xs sm:hidden">Düzenle</span>
                  </Link>
                  <DeleteSiteButton siteId={site.id} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8 sm:py-12">
          <Gamepad2 className="w-12 h-12 sm:w-14 sm:h-14 text-ink-faint mx-auto" />
          <h3 className="text-lg sm:text-xl font-semibold text-ink mt-4">
            Henüz site eklenmemiş
          </h3>
          <p className="text-ink-muted mt-2 text-sm">
            İlk bahis sitesini ekleyin.
          </p>
          <Link href="/admin/siteler/ekle" className="inline-block mt-6">
            <Button variant="primary" className="text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Site Ekle
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
