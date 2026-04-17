"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Crown, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Star,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface VipLevel {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  bonusMultiplier: number;
  dailyBonus: number;
  wheelBonus: number;
  slotBonus: number;
  color: string;
}

const defaultLevels = [
  { name: "bronze", minPoints: 0, maxPoints: 499, bonusMultiplier: 1.0, dailyBonus: 10, wheelBonus: 0, slotBonus: 0, color: "#CD7F32" },
  { name: "silver", minPoints: 500, maxPoints: 1999, bonusMultiplier: 1.25, dailyBonus: 15, wheelBonus: 10, slotBonus: 10, color: "#C0C0C0" },
  { name: "gold", minPoints: 2000, maxPoints: 4999, bonusMultiplier: 1.5, dailyBonus: 25, wheelBonus: 25, slotBonus: 25, color: "#FFD700" },
  { name: "platinum", minPoints: 5000, maxPoints: 999999, bonusMultiplier: 2.0, dailyBonus: 50, wheelBonus: 50, slotBonus: 50, color: "#E5E4E2" },
];

export default function AdminVipPage() {
  const [levels, setLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    minPoints: 0,
    maxPoints: 0,
    bonusMultiplier: 1.0,
    dailyBonus: 10,
    wheelBonus: 0,
    slotBonus: 0,
    color: "#CD7F32",
  });

  const fetchLevels = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/vip");
    const data = await res.json();
    setLevels(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleEdit = (level: VipLevel) => {
    setEditingId(level.id);
    setFormData({
      name: level.name,
      minPoints: level.minPoints,
      maxPoints: level.maxPoints,
      bonusMultiplier: level.bonusMultiplier,
      dailyBonus: level.dailyBonus,
      wheelBonus: level.wheelBonus,
      slotBonus: level.slotBonus,
      color: level.color,
    });
  };

  const handleSave = async () => {
    if (editingId) {
      await fetch(`/api/admin/vip/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setEditingId(null);
    fetchLevels();
  };

  const handleAdd = async () => {
    await fetch("/api/admin/vip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowAddModal(false);
    setFormData({
      name: "",
      minPoints: 0,
      maxPoints: 0,
      bonusMultiplier: 1.0,
      dailyBonus: 10,
      wheelBonus: 0,
      slotBonus: 0,
      color: "#CD7F32",
    });
    fetchLevels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu VIP seviyesini silmek istediğinize emin misiniz?")) return;
    
    await fetch(`/api/admin/vip/${id}`, {
      method: "DELETE",
    });
    fetchLevels();
  };

  const handleCreateDefaults = async () => {
    if (!confirm("Varsayılan VIP seviyelerini oluşturmak istediğinize emin misiniz? Mevcut seviyeler etkilenmez.")) return;
    
    for (const level of defaultLevels) {
      await fetch("/api/admin/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(level),
      });
    }
    fetchLevels();
  };

  const levelIcons: Record<string, React.ReactNode> = {
    bronze: <Star className="w-5 h-5" />,
    silver: <Star className="w-5 h-5" />,
    gold: <Crown className="w-5 h-5" />,
    platinum: <Sparkles className="w-5 h-5" />,
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
          VIP Seviyeleri
        </h1>
        <div className="flex gap-2 sm:gap-3">
          {levels.length === 0 && (
            <Button variant="ghost" onClick={handleCreateDefaults} className="text-sm sm:text-base">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Varsayılanları</span> Oluştur
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Yeni</span> Seviye
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-muted">Yükleniyor...</div>
      ) : levels.length === 0 ? (
        <Card className="text-center py-12">
          <Crown className="w-16 h-16 text-ink-faint mx-auto" />
          <h3 className="text-xl font-semibold text-ink mt-4">
            VIP seviyeleri tanımlanmamış
          </h3>
          <p className="text-ink-muted mt-2">
            Varsayılan seviyeleri oluşturun veya yeni ekleyin.
          </p>
          <Button variant="primary" className="mt-6" onClick={handleCreateDefaults}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Varsayılanları Oluştur
          </Button>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {levels.map((level) => (
            <Card key={level.id} className="p-3 sm:p-4 lg:p-6">
              {editingId === level.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Input
                      label="Seviye Adı"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Min Puan"
                      type="number"
                      value={formData.minPoints}
                      onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) })}
                    />
                    <Input
                      label="Max Puan"
                      type="number"
                      value={formData.maxPoints}
                      onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Renk</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer border border-line bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Input
                      label="Çarpan"
                      type="number"
                      step="0.05"
                      value={formData.bonusMultiplier}
                      onChange={(e) => setFormData({ ...formData, bonusMultiplier: parseFloat(e.target.value) })}
                    />
                    <Input
                      label="Günlük"
                      type="number"
                      value={formData.dailyBonus}
                      onChange={(e) => setFormData({ ...formData, dailyBonus: parseInt(e.target.value) })}
                    />
                    <Input
                      label="Çark"
                      type="number"
                      value={formData.wheelBonus}
                      onChange={(e) => setFormData({ ...formData, wheelBonus: parseInt(e.target.value) })}
                    />
                    <Input
                      label="Slot (%)"
                      type="number"
                      value={formData.slotBonus}
                      onChange={(e) => setFormData({ ...formData, slotBonus: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)} className="text-sm">
                      <X className="w-4 h-4 mr-1" />
                      İptal
                    </Button>
                    <Button variant="primary" onClick={handleSave} className="text-sm">
                      <Save className="w-4 h-4 mr-1" />
                      Kaydet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Level Info */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-card"
                      style={{ backgroundColor: level.color }}
                    >
                      {levelIcons[level.name] || <Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-ink capitalize">
                        {level.name}
                      </h3>
                      <p className="text-ink-muted text-xs sm:text-sm tabular-nums">
                        {level.minPoints.toLocaleString()} - {level.maxPoints.toLocaleString()} puan
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid (Mobile) + Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 sm:flex sm:gap-6 text-center">
                      <div>
                        <p className="text-xs text-ink-soft">Çarpan</p>
                        <p className="text-ink font-semibold text-sm sm:text-base tabular-nums">{level.bonusMultiplier}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft">Günlük</p>
                        <p className="text-ink font-semibold text-sm sm:text-base tabular-nums">{level.dailyBonus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft">Çark</p>
                        <p className="text-ink font-semibold text-sm sm:text-base tabular-nums">+{level.wheelBonus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft">Slot</p>
                        <p className="text-ink font-semibold text-sm sm:text-base tabular-nums">+{level.slotBonus}%</p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:ml-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-line-soft">
                      <button
                        onClick={() => handleEdit(level)}
                        className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-primary-700 transition-colors flex items-center justify-center gap-1 sm:gap-0"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:hidden">Düzenle</span>
                      </button>
                      <button
                        onClick={() => handleDelete(level.id)}
                        className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-red-50 text-ink-muted hover:text-red-600 transition-colors flex items-center justify-center gap-1 sm:gap-0"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:hidden">Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Bilgi Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-ink mb-1 sm:mb-2 text-sm sm:text-base">Bonus Çarpanı</h4>
          <p className="text-ink-muted text-xs sm:text-sm">
            Oyunlarda kazanılan puanların çarpanı. Örn: 1.5x = %50 daha fazla puan.
          </p>
        </Card>
        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-ink mb-1 sm:mb-2 text-sm sm:text-base">Günlük Bonus</h4>
          <p className="text-ink-muted text-xs sm:text-sm">
            Her gün alınan baz günlük ödül puanı.
          </p>
        </Card>
        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-ink mb-1 sm:mb-2 text-sm sm:text-base">Çark & Slot Bonusu</h4>
          <p className="text-ink-muted text-xs sm:text-sm">
            Çark çevirme ve slot oyunlarında eklenen ekstra puan/yüzde.
          </p>
        </Card>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white border border-line rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
            <h3 className="text-lg sm:text-xl font-bold text-ink mb-4 sm:mb-6">Yeni VIP Seviyesi</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Input
                  label="Seviye Adı"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: diamond"
                />
                <Input
                  label="Min Puan"
                  type="number"
                  value={formData.minPoints}
                  onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) })}
                />
                <Input
                  label="Max Puan"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Input
                  label="Çarpan"
                  type="number"
                  step="0.05"
                  value={formData.bonusMultiplier}
                  onChange={(e) => setFormData({ ...formData, bonusMultiplier: parseFloat(e.target.value) })}
                />
                <Input
                  label="Günlük"
                  type="number"
                  value={formData.dailyBonus}
                  onChange={(e) => setFormData({ ...formData, dailyBonus: parseInt(e.target.value) })}
                />
                <Input
                  label="Çark"
                  type="number"
                  value={formData.wheelBonus}
                  onChange={(e) => setFormData({ ...formData, wheelBonus: parseInt(e.target.value) })}
                />
                <Input
                  label="Slot (%)"
                  type="number"
                  value={formData.slotBonus}
                  onChange={(e) => setFormData({ ...formData, slotBonus: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Renk
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer border border-line bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-6">
              <Button
                variant="ghost"
                className="flex-1 text-sm sm:text-base"
                onClick={() => setShowAddModal(false)}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-sm sm:text-base"
                onClick={handleAdd}
              >
                Ekle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
