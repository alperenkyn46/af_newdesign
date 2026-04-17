"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Gamepad2, Save, Loader2, Trash2, Upload, X } from "lucide-react";

interface BettingSite {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url: string;
  description: string;
  rating: number;
  features: string;
  isFeatured: boolean;
  sponsorTier: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bonuses: number;
    redemptions: number;
    depositProofs: number;
  };
}

export default function EditSitePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    url: "",
    description: "",
    rating: "4.5",
    features: "",
    isFeatured: false,
    sponsorTier: "premium",
    order: "0",
    isActive: true,
  });
  const [siteStats, setSiteStats] = useState<BettingSite["_count"] | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch(`/api/admin/sites/${params.id}`);
        if (res.ok) {
          const site: BettingSite = await res.json();
          setFormData({
            name: site.name,
            slug: site.slug,
            logo: site.logo,
            url: site.url,
            description: site.description,
            rating: site.rating.toString(),
            features: site.features,
            isFeatured: site.isFeatured,
            sponsorTier: site.sponsorTier,
            order: site.order.toString(),
            isActive: site.isActive,
          });
          setSiteStats(site._count || null);
        } else {
          router.push("/admin/siteler");
        }
      } catch (error) {
        console.error("Error fetching site:", error);
        router.push("/admin/siteler");
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/sites/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: parseFloat(formData.rating),
          order: parseInt(formData.order),
        }),
      });

      if (res.ok) {
        router.push("/admin/siteler");
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/sites/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/siteler");
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "uploads/sites");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, logo: data.url });
      } else {
        const error = await res.json();
        alert(error.error || "Yükleme başarısız");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Dosya yüklenirken hata oluştu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/siteler"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-5 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 tracking-tight">
          <Gamepad2 className="w-6 h-6 text-primary-600" />
          Site Düzenle
        </h1>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Siteyi Sil
        </Button>
      </div>

      {/* Site İstatistikleri */}
      {siteStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-ink-muted text-sm">Bonuslar</p>
            <p className="text-2xl font-bold text-ink tabular-nums">{siteStats.bonuses}</p>
          </Card>
          <Card className="text-center">
            <p className="text-ink-muted text-sm">Çevirmeler</p>
            <p className="text-2xl font-bold text-ink tabular-nums">{siteStats.redemptions}</p>
          </Card>
          <Card className="text-center">
            <p className="text-ink-muted text-sm">Yatırım Kanıtları</p>
            <p className="text-2xl font-bold text-ink tabular-nums">{siteStats.depositProofs}</p>
          </Card>
          <Card className="text-center">
            <p className="text-ink-muted text-sm">Logo Önizleme</p>
            {formData.logo && (
              <div className="w-12 h-12 mx-auto mt-2 rounded-lg bg-surface-subtle border border-line p-1">
                <Image
                  src={formData.logo}
                  alt={formData.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </Card>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Site Adı"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={generateSlug}
              placeholder="Örn: Betboo"
              required
            />
            <Input
              label="Slug (URL)"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Örn: betboo"
              required
            />
          </div>

          {/* Logo Upload Section */}
          <div className="p-4 rounded-xl bg-surface-subtle border border-line">
            <p className="text-sm font-medium text-ink mb-3">Site Logosu</p>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <Image
                      src={formData.logo}
                      alt="Logo"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Gamepad2 className="w-7 h-7 text-ink-faint" />
                  )}
                </div>
                {formData.logo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-card"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Upload Options */}
              <div className="flex-grow space-y-3">
                {/* File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line bg-white text-ink-muted hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer text-sm font-medium ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Dosya Yükle
                      </>
                    )}
                  </label>
                  <span className="text-xs text-ink-soft ml-2">PNG, JPG, SVG (max 5MB)</span>
                </div>

                {/* URL Input */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-soft">veya</span>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="Logo URL girin..."
                    className="flex-grow px-3 py-2 rounded-lg bg-white border border-line text-ink text-sm placeholder-ink-faint focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Input
              label="Site URL (Affiliate Link)"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink placeholder-ink-faint focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition"
              placeholder="Site hakkında kısa açıklama..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Puan (0-5)"
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
            />
            <Input
              label="Sıra"
              name="order"
              type="number"
              min="0"
              value={formData.order}
              onChange={handleChange}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                Durum
              </label>
              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value === "true" })
                }
                className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                One Cikanlarda Goster
              </label>
              <select
                name="isFeatured"
                value={formData.isFeatured ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.value === "true" })
                }
                className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              >
                <option value="true">Evet</option>
                <option value="false">Hayir</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                Sponsor Etiketi
              </label>
              <select
                name="sponsorTier"
                value={formData.sponsorTier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              >
                <option value="premium">Premium Sponsor</option>
                <option value="vip">VIP Sponsor</option>
                <option value="diamond">Diamond Sponsor</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">
              Özellikler (virgülle ayırın)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink placeholder-ink-faint focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition"
              placeholder="Canlı Bahis, Casino, Slot, Hızlı Ödeme, 7/24 Destek"
            />
            <p className="text-xs text-ink-soft mt-1">
              Site detay sayfasında gösterilecek özellikler
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/siteler">
              <Button type="button" variant="ghost">
                İptal
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={saving}>
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-line rounded-2xl p-6 max-w-md w-full mx-4 shadow-card">
            <h3 className="text-xl font-bold text-ink mb-4">Siteyi Sil</h3>
            <p className="text-ink-muted mb-6">
              <strong className="text-ink">{formData.name}</strong> sitesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            {siteStats && (siteStats.bonuses > 0 || siteStats.redemptions > 0 || siteStats.depositProofs > 0) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-700 text-sm">
                  Bu siteye bağlı {siteStats.bonuses} bonus, {siteStats.redemptions} çevirme talebi ve {siteStats.depositProofs} yatırım kanıtı bulunuyor. Silme işlemi bunları da silecektir.
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
