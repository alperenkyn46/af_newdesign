"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  CheckCircle, 
  Trophy,
  Image as ImageIcon,
  X,
  Gift,
  Star,
  Calendar
} from "lucide-react";
import Image from "next/image";

interface Site {
  id: string;
  name: string;
  logo: string;
}

interface DepositProof {
  id: string;
  imageUrl: string;
  amount: string | null;
  status: string;
  createdAt: string;
  user: { name: string };
  site: { name: string; logo: string };
}

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-ink transition-colors z-10 shadow-pop"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-white shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Yatırım kanıtı"
          width={1200}
          height={900}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

function ProofCard({ proof, onImageClick }: { proof: DepositProof; onImageClick: (url: string) => void }) {
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 bg-white border border-line shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-emerald-200">
      <div className="flex items-center justify-between px-3 pt-3">
        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
          Onaylı
        </span>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-ink-soft" />
          <span className="text-[10px] sm:text-xs text-ink-soft">
            {new Date(proof.createdAt).toLocaleDateString("tr-TR")}
          </span>
        </div>
      </div>

      <div
        className="relative mx-3 mt-2 rounded-xl overflow-hidden cursor-pointer border border-line"
        onClick={() => onImageClick(proof.imageUrl)}
      >
        <div className="relative w-full h-28 sm:h-36">
          <Image
            src={proof.imageUrl}
            alt="Yatırım kanıtı"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
              <ImageIcon className="w-4 h-4 text-ink" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 text-center flex-grow">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <div className="relative w-4 h-4 rounded-full bg-surface-subtle border border-line overflow-hidden flex-shrink-0">
            <Image src={proof.site.logo} alt={proof.site.name} fill className="object-contain p-0.5" />
          </div>
          <span className="text-[10px] sm:text-xs text-ink-muted truncate">{proof.site.name}</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-ink truncate">{proof.user.name}</p>
        {proof.amount && (
          <p className="text-[10px] sm:text-xs text-emerald-700 font-semibold mt-0.5">
            {proof.amount.includes("TL") ? proof.amount : `${proof.amount} TL`}
          </p>
        )}
      </div>

      <div className="px-3 pb-3 pt-0">
        <div className="w-full py-1.5 rounded-xl text-center text-[10px] sm:text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
          <span className="flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            +100 Puan Kazandı
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SizdenGelenlerPage() {
  const { data: session } = useSession();
  const [proofs, setProofs] = useState<DepositProof[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/deposit-proofs").then(res => res.json()).then(data => {
      setProofs(data.proofs || []);
    });

    fetch("/api/redeem").then(res => res.json()).then(data => {
      setSites(data.sites || []);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSite || !session) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("siteId", selectedSite);
    formData.append("amount", amount);

    try {
      const res = await fetch("/api/deposit-proofs", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setFile(null);
        setPreview(null);
        setSelectedSite("");
        setAmount("");
        setTimeout(() => {
          setSuccess(false);
          setShowUpload(false);
        }, 3000);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
            <Trophy className="w-8 h-8 text-emerald-600" />
            Sizden Gelenler
          </h1>
          <p className="text-ink-muted mt-3 max-w-2xl mx-auto text-sm">
            Sponsorlarımıza yaptığınız yatırımların ekran görüntüsünü paylaşın,
            <span className="text-emerald-700 font-semibold"> 100 puan </span> kazanın
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2 text-sm">Nasıl Çalışır?</h3>
              <ol className="text-ink-muted text-sm space-y-1 list-decimal list-inside">
                <li>Sitemizden bir sponsorumuza gidin ve para yatırın</li>
                <li>Para yatırdığınıza dair ekran görüntüsü alın</li>
                <li>Aşağıdaki butona tıklayarak görüntüyü yükleyin</li>
                <li>Onaylandıktan sonra 100 puan kazanın</li>
              </ol>
            </div>
          </div>
        </Card>

        {session ? (
          <div className="max-w-2xl mx-auto mb-10">
            {!showUpload ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Ekran Görüntüsü Yükle
              </Button>
            ) : success ? (
              <Card className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-1">Yükleme Başarılı</h3>
                <p className="text-ink-muted text-sm">
                  Görüntünüz incelemeye alındı. Onaylandığında puanınız hesabınıza
                  eklenecek.
                </p>
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-ink">Yeni Kanıt Yükle</h3>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Site Seçin
                    </label>
                    <select
                      value={selectedSite}
                      onChange={(e) => setSelectedSite(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-line text-ink focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                    >
                      <option value="">Site seçin...</option>
                      {sites.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Yatırılan Miktar (opsiyonel)"
                    placeholder="örn: 500 TL"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Ekran Görüntüsü
                    </label>
                    {preview ? (
                      <div className="relative">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-xl border border-line"
                        />
                        <button
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-line shadow-card flex items-center justify-center text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-line hover:border-primary-400 hover:bg-primary-50/40 cursor-pointer transition-colors">
                        <ImageIcon className="w-9 h-9 text-ink-faint mb-2" />
                        <span className="text-ink-muted text-sm">
                          Görüntü seçmek için tıklayın
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleUpload}
                    disabled={!file || !selectedSite || uploading}
                  >
                    {uploading ? "Yükleniyor..." : "Gönder"}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto mb-10 text-center py-8">
            <p className="text-ink-muted text-sm">
              Ekran görüntüsü yüklemek için{" "}
              <a href="/giris" className="text-primary-700 font-medium hover:underline">
                giriş yapın
              </a>
            </p>
          </Card>
        )}

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-5 flex items-center gap-2 tracking-tight">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Son Paylaşımlar
          </h2>

          {proofs.length === 0 ? (
            <Card className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-ink-faint mx-auto mb-3" />
              <p className="text-ink-muted text-sm">
                Henüz paylaşım yok. İlk sen paylaş!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {proofs.map((proof) => (
                <ProofCard
                  key={proof.id}
                  proof={proof}
                  onImageClick={setModalImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalImage && (
        <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}
