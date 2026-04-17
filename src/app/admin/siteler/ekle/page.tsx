"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Gamepad2, Save, Upload, X, Loader2 } from "lucide-react";

export default function AddSitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    setLoading(true);

    try {
      const res = await fetch("/api/admin/sites", {
        method: "POST",
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
      setLoading(false);
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

  return (
    <div>
      <Link
        href="/admin/siteler"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-5 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 mb-7 tracking-tight">
        <Gamepad2 className="w-6 h-6 text-primary-600" />
        Yeni Site Ekle
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex-grow space-y-3">
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
              rows={3}
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

          <Input
            label="Özellikler (virgülle ayırın)"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Canlı Bahis, Casino, Slot, Hızlı Ödeme"
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-line">
            <Link href="/admin/siteler">
              <Button type="button" variant="ghost">
                İptal
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
