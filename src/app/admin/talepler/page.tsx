"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

interface Redemption {
  id: string;
  points: number;
  amount: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  site: { name: string; logo: string };
}

export default function AdminRedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadRedemptions();
  }, []);

  const loadRedemptions = async () => {
    const res = await fetch("/api/admin/redemptions");
    const data = await res.json();
    setRedemptions(data.redemptions || []);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/redemptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadRedemptions();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = redemptions.filter(r => 
    filter === "all" ? true : r.status === filter
  );

  const stats = {
    pending: redemptions.filter(r => r.status === "pending").length,
    completed: redemptions.filter(r => r.status === "completed").length,
    rejected: redemptions.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          <span className="hidden sm:inline">Puan Çevirme</span> Talepleri
        </h1>
        <p className="text-ink-muted mt-1 sm:mt-2 text-sm sm:text-base">Kullanıcıların bakiye çevirme taleplerini yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="text-center p-3 sm:p-4">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-bold text-ink tabular-nums">{stats.pending}</p>
          <p className="text-ink-muted text-xs sm:text-base">Bekleyen</p>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-bold text-ink tabular-nums">{stats.completed}</p>
          <p className="text-ink-muted text-xs sm:text-base">Tamamlanan</p>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-bold text-ink tabular-nums">{stats.rejected}</p>
          <p className="text-ink-muted text-xs sm:text-base">Reddedilen</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
        {[
          { value: "all", label: "Tümü" },
          { value: "pending", label: "Bekleyen" },
          { value: "completed", label: "Tamamlanan" },
          { value: "rejected", label: "Reddedilen" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
              filter === f.value
                ? "bg-primary-600 text-white border-primary-600 shadow-accent"
                : "bg-white text-ink-muted border-line hover:text-primary-700 hover:border-primary-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Redemptions List */}
      <Card className="p-3 sm:p-4 lg:p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-ink-faint mx-auto mb-3 sm:mb-4" />
            <p className="text-ink-muted text-sm sm:text-base">Talep bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((redemption) => (
              <div
                key={redemption.id}
                className="flex flex-col p-3 sm:p-4 rounded-xl bg-surface-subtle border border-line gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white border border-line overflow-hidden flex-shrink-0">
                    <Image src={redemption.site.logo} alt={redemption.site.name} fill className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-ink font-medium text-sm sm:text-base">{redemption.site.name}</p>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-ink-muted truncate">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{redemption.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mt-1">
                      <span className="text-amber-600 font-medium">{redemption.points} puan</span>
                      <ArrowRight className="w-3 h-3 text-ink-soft" />
                      <span className="text-emerald-600 font-medium">{redemption.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-line-soft">
                  {redemption.status === "pending" ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => handleUpdateStatus(redemption.id, "rejected")}
                        disabled={updating === redemption.id}
                      >
                        <XCircle className="w-4 h-4 text-red-600 mr-1" />
                        Reddet
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => handleUpdateStatus(redemption.id, "completed")}
                        disabled={updating === redemption.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Onayla
                      </Button>
                    </>
                  ) : (
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${
                      redemption.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {redemption.status === "completed" ? (
                        <><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Tamamlandı</>
                      ) : (
                        <><XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Reddedildi</>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
