"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  ExternalLink
} from "lucide-react";
import Image from "next/image";

interface DepositProof {
  id: string;
  imageUrl: string;
  amount: string | null;
  status: string;
  points: number;
  createdAt: string;
  user: { name: string; email: string; telegramUsername: string | null };
  site: { name: string; logo: string };
}

export default function AdminDepositProofsPage() {
  const [proofs, setProofs] = useState<DepositProof[]>([]);
  const [filter, setFilter] = useState("pending");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadProofs();
  }, []);

  const loadProofs = async () => {
    const res = await fetch("/api/admin/deposit-proofs");
    const data = await res.json();
    setProofs(data.proofs || []);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/deposit-proofs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadProofs();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = proofs.filter(p => 
    filter === "all" ? true : p.status === filter
  );

  const stats = {
    pending: proofs.filter(p => p.status === "pending").length,
    approved: proofs.filter(p => p.status === "approved").length,
    rejected: proofs.filter(p => p.status === "rejected").length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          <span className="hidden sm:inline">Para Yatırma</span> Kanıtları
        </h1>
        <p className="text-ink-muted mt-1 sm:mt-2 text-sm sm:text-base">Kullanıcıların gönderdiği ekran görüntülerini yönetin</p>
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
          <p className="text-xl sm:text-3xl font-bold text-ink tabular-nums">{stats.approved}</p>
          <p className="text-ink-muted text-xs sm:text-base">Onaylanan</p>
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
          { value: "pending", label: "Bekleyen" },
          { value: "approved", label: "Onaylanan" },
          { value: "rejected", label: "Reddedilen" },
          { value: "all", label: "Tümü" },
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

      {/* Proofs Grid */}
      {filtered.length === 0 ? (
        <Card className="text-center py-8 sm:py-12">
          <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-ink-faint mx-auto mb-3 sm:mb-4" />
          <p className="text-ink-muted text-sm sm:text-base">Kanıt bulunamadı</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filtered.map((proof) => (
            <Card key={proof.id} className="overflow-hidden p-0">
              {/* Image */}
              <div 
                className="relative h-36 sm:h-48 cursor-pointer"
                onClick={() => setSelectedImage(proof.imageUrl)}
              >
                <Image
                  src={proof.imageUrl}
                  alt="Proof"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className={`absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-card ${
                  proof.status === "approved" ? "bg-emerald-600 text-white" :
                  proof.status === "rejected" ? "bg-red-600 text-white" :
                  "bg-amber-500 text-white"
                }`}>
                  {proof.status === "approved" && <><CheckCircle className="w-3 h-3" /> <span className="hidden sm:inline">Onaylı</span></>}
                  {proof.status === "rejected" && <><XCircle className="w-3 h-3" /> <span className="hidden sm:inline">Reddedildi</span></>}
                  {proof.status === "pending" && <><Clock className="w-3 h-3" /> <span className="hidden sm:inline">Bekliyor</span></>}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-line overflow-hidden flex-shrink-0">
                    <Image src={proof.site.logo} alt={proof.site.name} fill className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-ink font-medium text-xs sm:text-sm truncate">{proof.site.name}</p>
                    {proof.amount && <p className="text-emerald-600 text-xs font-medium">{proof.amount}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-2 sm:mb-3 text-xs sm:text-sm">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-ink-soft mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-ink truncate">{proof.user.name}</p>
                    <p className="text-ink-soft text-xs truncate">{proof.user.email}</p>
                    {proof.user.telegramUsername && (
                      <p className="text-primary-600 text-xs truncate">{proof.user.telegramUsername}</p>
                    )}
                  </div>
                </div>

                <p className="text-ink-soft text-xs mb-2 sm:mb-3">
                  {new Date(proof.createdAt).toLocaleString("tr-TR")}
                </p>

                {/* Actions */}
                {proof.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleUpdateStatus(proof.id, "rejected")}
                      disabled={updating === proof.id}
                    >
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-600" />
                      Reddet
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleUpdateStatus(proof.id, "approved")}
                      disabled={updating === proof.id}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      +{proof.points}p
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
