import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BonusCard } from "@/components/cards/bonus-card";
import { 
  Star, 
  ExternalLink, 
  ArrowLeft, 
  Check
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getSite(slug: string) {
  const site = await prisma.bettingSite.findUnique({
    where: { slug },
    include: {
      bonuses: {
        where: { isActive: true },
      },
    },
  });
  return site;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const site = await getSite(slug);
  
  if (!site) {
    return { title: "Site Bulunamadı - BetVIP" };
  }

  return {
    title: `${site.name} - İnceleme ve Bonuslar | BetVIP`,
    description: site.description,
  };
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    notFound();
  }

  const features = site.features.split(",");

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/siteler"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Siteler
        </Link>

        {/* Site Header */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-white/10 p-4">
                <Image
                  src={site.logo}
                  alt={site.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">{site.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">{renderStars(site.rating)}</div>
                    <span className="text-xl font-semibold text-white">
                      {site.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">/5</span>
                  </div>
                </div>

                <a href={site.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg">
                    Siteye Git
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              <p className="text-gray-400 mt-4">{site.description}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                {features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm"
                  >
                    <Check className="w-3 h-3" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bonuses */}
        {site.bonuses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {site.name} Bonusları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.bonuses.map((bonus) => (
                <BonusCard
                  key={bonus.id}
                  id={bonus.id}
                  title={bonus.title}
                  description={bonus.description}
                  code={bonus.code}
                  value={bonus.value}
                  type={bonus.type}
                  siteName={site.name}
                  siteUrl={site.url}
                  expiresAt={bonus.expiresAt}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="glass rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white">
            {site.name}&apos;e Hemen Katıl!
          </h3>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">
            Özel bonusları kaçırma, hemen üye ol ve kazanmaya başla.
          </p>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6"
          >
            <Button variant="gold" size="lg">
              Üye Ol & Bonus Al
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
