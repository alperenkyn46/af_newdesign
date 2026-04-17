"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle,
  Trophy,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

interface Site {
  id: string;
  name: string;
  logo: string;
  url: string;
}

interface Option {
  points: number;
  amount: string;
}

interface Redemption {
  id: string;
  points: number;
  amount: string;
  status: string;
  createdAt: string;
  site: { name: string; logo: string };
}

export default function RedeemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/harca");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/redeem")
        .then(res => res.json())
        .then(data => {
          setSites(data.sites);
          setOptions(data.options);
          setRedemptions(data.redemptions);
        });
    }
  }, [session]);

  const handleRedeem = async () => {
    if (!selectedSite || !selectedOption) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: selectedSite,
          points: selectedOption.points,
          amount: selectedOption.amount,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedSite(null);
          setSelectedOption(null);
          // Refresh data
          fetch("/api/redeem").then(res => res.json()).then(data => {
            setRedemptions(data.redemptions);
          });
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const balance = session?.user?.totalPoints || 0;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink-soft">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
            <Wallet className="w-8 h-8 text-primary-600" />
            Puan Harca
          </h1>
          <p className="text-ink-muted mt-3 text-sm">
            Puanlarını bahis sitelerinde bakiyeye çevir
          </p>
        </div>

        <Card className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span className="text-ink-muted text-sm">Mevcut Bakiye</span>
            </div>
            <span className="text-xl font-bold text-ink tabular-nums">
              {balance} Puan
            </span>
          </div>
        </Card>

        {success ? (
          <Card className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">Talebiniz Alındı</h2>
            <p className="text-ink-muted text-sm">
              Bakiye transferiniz en kısa sürede işleme alınacaktır.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <h3 className="text-base font-semibold text-ink mb-4">
                1. Site Seçin
              </h3>
              <div className="space-y-2">
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                      selectedSite === site.id
                        ? "bg-primary-50 border-primary-500"
                        : "bg-surface-subtle border-line hover:border-primary-300"
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-lg bg-white border border-line overflow-hidden shrink-0">
                      <Image
                        src={site.logo}
                        alt={site.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="font-medium text-ink text-sm">
                      {site.name}
                    </span>
                    {selectedSite === site.id && (
                      <CheckCircle className="w-4 h-4 text-primary-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-ink mb-4">
                2. Miktar Seçin
              </h3>
              <div className="space-y-2">
                {options.map((option) => {
                  const canAfford = balance >= option.points;
                  return (
                    <button
                      key={option.points}
                      onClick={() => canAfford && setSelectedOption(option)}
                      disabled={!canAfford}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                        selectedOption?.points === option.points
                          ? "bg-primary-50 border-primary-500"
                          : canAfford
                            ? "bg-surface-subtle border-line hover:border-primary-300"
                            : "bg-surface-subtle border-line opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="text-ink font-medium text-sm tabular-nums">
                          {option.points} Puan
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-ink-soft" />
                        <span className="text-emerald-700 font-bold text-sm">
                          {option.amount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedSite && selectedOption && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-5"
                  onClick={handleRedeem}
                  disabled={loading}
                >
                  {loading ? "İşleniyor..." : "Bakiyeye Çevir"}
                </Button>
              )}
            </Card>
          </div>
        )}

        <Card className="max-w-2xl mx-auto mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-ink text-sm">Nasıl Çalışır?</h4>
              <ul className="text-ink-muted text-sm mt-2 space-y-1">
                <li>• Site ve miktar seçin, talebi gönderin</li>
                <li>• Talebiniz en geç 24 saat içinde işleme alınır</li>
                <li>• Bakiyeniz seçtiğiniz siteye yatırılır</li>
                <li>• Bakiye için sitede hesabınızın olması gerekir</li>
              </ul>
            </div>
          </div>
        </Card>

        {redemptions.length > 0 && (
          <Card className="max-w-2xl mx-auto mt-6">
            <h3 className="text-base font-semibold text-ink mb-4">
              İşlem Geçmişi
            </h3>
            <div className="space-y-2">
              {redemptions.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-lg bg-white border border-line overflow-hidden shrink-0">
                      <Image
                        src={r.site.logo}
                        alt={r.site.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm truncate">
                        {r.site.name}
                      </p>
                      <p className="text-ink-soft text-xs">
                        {r.points} puan → {r.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {r.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Bekliyor
                      </span>
                    )}
                    {r.status === "completed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Tamamlandı
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Reddedildi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
