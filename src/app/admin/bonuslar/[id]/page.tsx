"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gift, Loader2, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Site {
  id: string;
  name: string;
}

interface BonusResponse {
  id: string;
  siteId: string;
  title: string;
  code: string | null;
  description: string;
  type: string;
  value: string;
  minDeposit: string | null;
  wagering: string | null;
  expiresAt: string | null;
  showInLatest: boolean;
  isActive: boolean;
}

export default function EditBonusPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    const fetchData = async () => {
      try {
        const [bonusRes, sitesRes] = await Promise.all([
          fetch(`/api/admin/bonuses/${params.id}`),
          fetch("/api/admin/sites"),
        ]);

        if (!bonusRes.ok) {
          router.push("/admin/bonuslar");
          return;
        }

        const bonus: BonusResponse = await bonusRes.json();
        const allSites: Site[] = sitesRes.ok ? await sitesRes.json() : [];

        setSites(allSites);
        setFormData({
          siteId: bonus.siteId,
          title: bonus.title,
          code: bonus.code || "",
          description: bonus.description,
          type: bonus.type,
          value: bonus.value,
          minDeposit: bonus.minDeposit || "",
          wagering: bonus.wagering || "",
          expiresAt: bonus.expiresAt ? bonus.expiresAt.slice(0, 16) : "",
          showInLatest: bonus.showInLatest,
          isActive: bonus.isActive,
        });
      } catch (error) {
        console.error("Error fetching bonus:", error);
        router.push("/admin/bonuslar");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/bonuses/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code || null,
          minDeposit: formData.minDeposit || null,
          wagering: formData.wagering || null,
          expiresAt: formData.expiresAt
            ? new Date(formData.expiresAt).toISOString()
            : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/bonuslar");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating bonus:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/bonuses/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/bonuslar");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting bonus:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const bonusTypes = ["Hoşgeldin", "FreeSpin", "Yatırım", "Kayıp", "VIP", "Özel"];

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
        href="/admin/bonuslar"
        className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-5 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 tracking-tight">
          <Gift className="w-6 h-6 text-primary-600" />
          Bonus Düzenle
        </h1>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Bonusu Sil
        </Button>
      </div>

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
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true",
                }))
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
                setFormData((prev) => ({
                  ...prev,
                  showInLatest: e.target.value === "true",
                }))
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
            <Button type="submit" variant="primary" disabled={saving}>
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </form>
      </Card>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-line rounded-2xl p-6 max-w-md w-full mx-4 shadow-card">
            <h3 className="text-xl font-bold text-ink mb-4">Bonusu Sil</h3>
            <p className="text-ink-muted mb-6">
              Bu bonusu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
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
