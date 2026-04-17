"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Gift, 
  ExternalLink,
  Trophy,
  Star
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  points: number;
  link: string | null;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
};

const PLATFORM_COLORS: Record<string, string> = {
  telegram: "hover:border-[#229ED9] hover:bg-sky-50",
  instagram: "hover:border-[#E4405F] hover:bg-pink-50",
  twitter: "hover:border-ink hover:bg-surface-muted",
  youtube: "hover:border-[#FF0000] hover:bg-red-50",
};

const PLATFORM_TEXT_COLORS: Record<string, string> = {
  telegram: "text-[#229ED9]",
  instagram: "text-[#E4405F]",
  twitter: "text-ink",
  youtube: "text-[#FF0000]",
};

export default function SocialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimedNow, setClaimedNow] = useState<{ platform: string; points: number } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/sosyal");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/social/follow")
        .then(res => res.json())
        .then(data => {
          setPlatforms(data.platforms);
          setFollows(data.follows);
        });
    }
  }, [session]);

  const handleClaim = async (platform: string, link: string | null) => {
    if (link) {
      window.open(link, "_blank");
    }

    setClaiming(platform);

    // Simüle edilen 3 saniye bekleme
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const res = await fetch("/api/social/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });

      const data = await res.json();
      if (res.ok) {
        setFollows(prev => [...prev, platform]);
        setClaimedNow({ platform, points: data.points });
        setTimeout(() => setClaimedNow(null), 3000);
      }
    } finally {
      setClaiming(null);
    }
  };

  const totalEarned = platforms.filter(p => follows.includes(p.id)).reduce((sum, p) => sum + p.points, 0);
  const totalPossible = platforms.reduce((sum, p) => sum + p.points, 0);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
            Sosyal Medya Ödülleri
          </h1>
          <p className="text-ink-muted mt-3 text-sm">
            Bizi sosyal medyada takip edin, puan kazanın
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-ink-muted text-sm">Toplam Kazanılan</span>
            <span className="text-ink font-bold tabular-nums text-sm">
              {totalEarned} / {totalPossible} Puan
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all"
              style={{ width: `${(totalEarned / totalPossible) * 100}%` }}
            />
          </div>
        </Card>

        {claimedNow && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white border border-line px-8 py-6 rounded-2xl shadow-pop animate-scaleIn">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-ink font-bold text-lg">
                    +{claimedNow.points} Puan
                  </p>
                  <p className="text-ink-muted text-sm">
                    {claimedNow.platform} takip bonusu
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {platforms.map((platform) => {
            const isFollowed = follows.includes(platform.id);
            const isClaiming = claiming === platform.id;

            return (
              <Card
                key={platform.id}
                className={`transition-all duration-300 ${
                  isFollowed ? "opacity-60" : PLATFORM_COLORS[platform.id]
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isFollowed
                        ? "bg-surface-muted text-ink-faint"
                        : `bg-surface-subtle ${PLATFORM_TEXT_COLORS[platform.id]}`
                    }`}
                  >
                    {PLATFORM_ICONS[platform.id]}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3
                      className={`font-semibold text-sm ${
                        isFollowed ? "text-ink-faint" : "text-ink"
                      }`}
                    >
                      {platform.name}
                    </h3>
                    <p
                      className={`text-xs ${
                        isFollowed ? "text-ink-faint" : "text-ink-muted"
                      }`}
                    >
                      {isFollowed
                        ? "Takip edildi"
                        : `Takip et, ${platform.points} puan kazan`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${
                        isFollowed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-primary-50 text-primary-700 border-primary-200"
                      }`}
                    >
                      {isFollowed ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        `+${platform.points}`
                      )}
                    </div>

                    {!isFollowed && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleClaim(platform.id, platform.link)}
                        disabled={isClaiming}
                      >
                        {isClaiming ? (
                          "Kontrol..."
                        ) : (
                          <>
                            Takip Et
                            <ExternalLink className="w-3.5 h-3.5 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 fill-amber-400" />
            <div>
              <h4 className="font-semibold text-ink text-sm">Nasıl Çalışır?</h4>
              <ul className="text-ink-muted text-sm mt-2 space-y-1">
                <li>• &quot;Takip Et&quot; butonuna tıklayın</li>
                <li>• Açılan sayfada hesabı takip edin</li>
                <li>• Puanınız otomatik olarak hesabınıza eklenir</li>
                <li>• Her platform için tek seferlik bonus alabilirsiniz</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
