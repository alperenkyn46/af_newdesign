"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Gift, Save } from "lucide-react";

interface Site {
  id: string;
  name: string;
}

export default function AddBonusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    siteId: "",
    title: "",
    code: "",
    description: "",
    type: "Hoşgeldin",
    value: "",
    minDeposit: "",
    wagering: "",
    expiresAt: "",
    showInLatest: true,
    isActive: true,
  });

  useEffect(() => {
    fetch("/api/admin/sites")
      .then((res) => res.json())
      .then((data) => setSites(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/bonuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code || null,
          minDeposit: formData.minDeposit || null,
          wagering: formData.wagering || null,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/bonuslar");
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const bonusTypes = ["Hoşgeldin", "FreeSpin", "Yatırım", "Kayıp", "VIP", "Özel"];

  return (
    <div>
      <Link
        href="/admin/bonuslar"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-5 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 mb-7 tracking-tight">
        <Gift className="w-6 h-6 text-primary-600" />
        Yeni Bonus Ekle
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                Bahis Sitesi
              </label>
              <select
                name="siteId"
                value={formData.siteId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
                required
              >
                <option value="">Site seçin</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                Bonus Tipi
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              >
                {bonusTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Bonus Başlığı"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Örn: Hoşgeldin Bonusu"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Bonus Değeri"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Örn: %100 - 1000 TL"
              required
            />
            <Input
              label="Bonus Kodu (opsiyonel)"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Örn: BONUS100"
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
              placeholder="Bonus hakkında detaylı açıklama..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Min. Yatırım"
              name="minDeposit"
              value={formData.minDeposit}
              onChange={handleChange}
              placeholder="Örn: 100 TL"
            />
            <Input
              label="Çevrim Şartı"
              name="wagering"
              value={formData.wagering}
              onChange={handleChange}
              placeholder="Örn: 10x"
            />
            <Input
              label="Bitiş Tarihi"
              name="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={handleChange}
            />
          </div>

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

          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">
              Ana Sayfa {" > "} Guncel Bonuslar'da Goster
            </label>
            <select
              name="showInLatest"
              value={formData.showInLatest ? "true" : "false"}
              onChange={(e) =>
                setFormData({ ...formData, showInLatest: e.target.value === "true" })
              }
              className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
            >
              <option value="true">Evet</option>
              <option value="false">Hayir</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/bonuslar">
              <Button type="button" variant="ghost">
                İptal
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={loading}>
              <Save className="w-5 h-5 mr-2" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
