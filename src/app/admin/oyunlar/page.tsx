"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CircleDot, 
  Plus, 
  Trash2, 
  Save,
  Sparkles,
  Gift,
  Settings
} from "lucide-react";

interface WheelPrize {
  id: string;
  name: string;
  points: number;
  probability: number;
  color: string;
  isActive: boolean;
  order: number;
}

interface GameSettings {
  dailyBonusBase: number;
  slotMinBet: number;
  slotMaxBet: number;
  pointsPerTelegram: number;
  pointsPerInstagram: number;
  pointsPerTwitter: number;
  pointsPerYoutube: number;
}

export default function AdminGamesPage() {
  const [prizes, setPrizes] = useState<WheelPrize[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    dailyBonusBase: 10,
    slotMinBet: 10,
    slotMaxBet: 1000,
    pointsPerTelegram: 50,
    pointsPerInstagram: 30,
    pointsPerTwitter: 30,
    pointsPerYoutube: 40,
  });
  const [saving, setSaving] = useState(false);
  const [newPrize, setNewPrize] = useState({
    name: "",
    points: 10,
    probability: 20,
    color: "#3B82F6",
  });

  useEffect(() => {
    fetch("/api/admin/games").then(res => res.json()).then(data => {
      if (data.prizes) setPrizes(data.prizes);
      if (data.settings) setSettings(data.settings);
    });
  }, []);

  const handleAddPrize = async () => {
    if (!newPrize.name) return;
    
    const res = await fetch("/api/admin/games/wheel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrize),
    });

    if (res.ok) {
      const prize = await res.json();
      setPrizes([...prizes, prize]);
      setNewPrize({ name: "", points: 10, probability: 20, color: "#3B82F6" });
    }
  };

  const handleDeletePrize = async (id: string) => {
    const res = await fetch(`/api/admin/games/wheel/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPrizes(prizes.filter(p => p.id !== id));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/games/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Oyun Yönetimi</h1>
        <p className="text-ink-muted mt-1 sm:mt-2 text-sm sm:text-base">Çark ödülleri ve oyun ayarlarını yönetin</p>
      </div>

      {/* Wheel Prizes */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-ink flex items-center gap-2">
            <CircleDot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Çark Ödülleri
          </h2>
        </div>

        {/* Existing Prizes */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-surface-subtle border border-line"
            >
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 border border-line"
                style={{ backgroundColor: prize.color }}
              />
              <div className="flex-grow min-w-0">
                <p className="text-ink font-medium text-sm sm:text-base truncate">{prize.name}</p>
                <p className="text-ink-soft text-xs sm:text-sm">
                  {prize.points} puan • %{prize.probability}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePrize(prize.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Prize */}
        <div className="border-t border-line pt-4 sm:pt-6">
          <h3 className="text-xs sm:text-sm font-medium text-ink-muted mb-3 sm:mb-4">Yeni Ödül Ekle</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Input
                placeholder="Ödül adı"
                value={newPrize.name}
                onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
              />
            </div>
            <Input
              type="number"
              placeholder="Puan"
              value={newPrize.points}
              onChange={(e) => setNewPrize({ ...newPrize, points: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder="Olasılık %"
              value={newPrize.probability}
              onChange={(e) => setNewPrize({ ...newPrize, probability: parseInt(e.target.value) || 0 })}
            />
            <div>
              <input
                type="color"
                value={newPrize.color}
                onChange={(e) => setNewPrize({ ...newPrize, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer border border-line bg-white"
              />
            </div>
            <Button variant="primary" onClick={handleAddPrize} className="col-span-2 sm:col-span-1 text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Ekle
            </Button>
          </div>
        </div>
      </Card>

      {/* Game Settings */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-ink flex items-center gap-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Oyun Ayarları
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-ink-muted mb-3 sm:mb-4 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Günlük Ödül
            </h3>
            <Input
              label="Temel Günlük Puan"
              type="number"
              value={settings.dailyBonusBase}
              onChange={(e) => setSettings({ ...settings, dailyBonusBase: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-medium text-ink-muted mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Slot Ayarları
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Min Bahis"
                type="number"
                value={settings.slotMinBet}
                onChange={(e) => setSettings({ ...settings, slotMinBet: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Max Bahis"
                type="number"
                value={settings.slotMaxBet}
                onChange={(e) => setSettings({ ...settings, slotMaxBet: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4 sm:pt-6 mt-4 sm:mt-6">
          <h3 className="text-xs sm:text-sm font-medium text-ink-muted mb-3 sm:mb-4">Sosyal Medya Takip Puanları</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Input
              label="Telegram"
              type="number"
              value={settings.pointsPerTelegram}
              onChange={(e) => setSettings({ ...settings, pointsPerTelegram: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Instagram"
              type="number"
              value={settings.pointsPerInstagram}
              onChange={(e) => setSettings({ ...settings, pointsPerInstagram: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Twitter"
              type="number"
              value={settings.pointsPerTwitter}
              onChange={(e) => setSettings({ ...settings, pointsPerTwitter: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="YouTube"
              type="number"
              value={settings.pointsPerYoutube}
              onChange={(e) => setSettings({ ...settings, pointsPerYoutube: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 sm:mt-6">
          <Button variant="primary" onClick={handleSaveSettings} disabled={saving} className="w-full sm:w-auto text-sm sm:text-base">
            <Save className="w-4 h-4 mr-1 sm:mr-2" />
            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
