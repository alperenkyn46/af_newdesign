"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save, CheckCircle, Upload, Trophy, X, Loader2 } from "lucide-react";
import NextImage from "next/image";

interface SiteSettings {
  id: string;
  siteName: string;
  siteLogo: string | null;
  siteDescription: string;
  telegramLink: string | null;
  instagramLink: string | null;
  twitterLink: string | null;
  kickLink: string | null;
  eventChannelLink: string | null;
  youtubeLink: string | null;
  footerTelegramLink: string | null;
  footerInstagramLink: string | null;
  footerKickLink: string | null;
  footerDiscordLink: string | null;
  footerEventLink: string | null;
  footerYoutubeLink: string | null;
  contactEmail: string | null;
  pointsPerSignup: number;
  pointsPerReferral: number;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch((err) => console.error("Settings fetch error:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads/logo");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, siteLogo: data.url });
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
    if (!settings) return;
    setSettings({ ...settings, siteLogo: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-ink-muted">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 tracking-tight">
        <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
        Site Ayarları
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* General Settings */}
        <Card className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-ink mb-4 sm:mb-6">Genel Ayarlar</h2>
          
          {/* Logo Preview & Upload */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm font-medium text-ink mb-3">Site Logosu</p>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Preview */}
              <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden">
                  {settings.siteLogo ? (
                    <NextImage
                      src={settings.siteLogo}
                      alt="Site Logo"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                      <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  )}
                </div>
                {settings.siteLogo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Upload Options */}
              <div className="flex-grow w-full sm:w-auto space-y-4">
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
                    className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-line bg-white text-ink-muted hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer text-sm sm:text-base ${
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
                  <p className="text-xs text-ink-soft mt-2">
                    PNG, JPG, GIF, SVG veya WebP. Max 5MB.
                  </p>
                </div>

                {/* URL Input */}
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                    <span className="px-2 text-xs text-ink-soft bg-surface-subtle">veya URL girin</span>
                  </div>
                  <div className="pt-3 border-t border-line">
                    <Input
                      label=""
                      name="siteLogo"
                      value={settings.siteLogo || ""}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Site Adı"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
            <Input
              label="İletişim Email"
              name="contactEmail"
              type="email"
              value={settings.contactEmail || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 sm:mt-6">
            <Input
              label="Site Açıklaması"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Footer Links */}
        <Card className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-ink mb-4 sm:mb-6">Footer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Footer Telegram"
              name="footerTelegramLink"
              value={settings.footerTelegramLink || ""}
              onChange={handleChange}
              placeholder="https://t.me/kanal"
            />
            <Input
              label="Footer Instagram"
              name="footerInstagramLink"
              value={settings.footerInstagramLink || ""}
              onChange={handleChange}
              placeholder="https://instagram.com/kullanici"
            />
            <Input
              label="Footer Kick"
              name="footerKickLink"
              value={settings.footerKickLink || ""}
              onChange={handleChange}
              placeholder="https://kick.com/kullanici"
            />
            <Input
              label="Footer Discord"
              name="footerDiscordLink"
              value={settings.footerDiscordLink || ""}
              onChange={handleChange}
              placeholder="https://discord.gg/davetkodu"
            />
            <Input
              label="Footer Etkinlik"
              name="footerEventLink"
              value={settings.footerEventLink || ""}
              onChange={handleChange}
              placeholder="https://t.me/etkinlikkanali"
            />
            <Input
              label="Footer YouTube"
              name="footerYoutubeLink"
              value={settings.footerYoutubeLink || ""}
              onChange={handleChange}
              placeholder="https://youtube.com/kanal"
            />
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-ink mb-4 sm:mb-6">Sosyal Medya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Telegram"
              name="telegramLink"
              value={settings.telegramLink || ""}
              onChange={handleChange}
              placeholder="https://t.me/kanal"
            />
            <Input
              label="Instagram"
              name="instagramLink"
              value={settings.instagramLink || ""}
              onChange={handleChange}
              placeholder="https://instagram.com/kullanici"
            />
            <Input
              label="Kick"
              name="kickLink"
              value={settings.kickLink || ""}
              onChange={handleChange}
              placeholder="https://kick.com/kullanici"
            />
            <Input
              label="Etkinlik Kanalı"
              name="eventChannelLink"
              value={settings.eventChannelLink || ""}
              onChange={handleChange}
              placeholder="https://t.me/kanal veya etkinlik linki"
            />
            <Input
              label="YouTube"
              name="youtubeLink"
              value={settings.youtubeLink || ""}
              onChange={handleChange}
              placeholder="https://youtube.com/kanal"
            />
          </div>
        </Card>

        {/* Points Settings */}
        <Card className="p-3 sm:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-ink mb-4 sm:mb-6">Puan Ayarları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Kayıt Bonusu (Puan)"
              name="pointsPerSignup"
              type="number"
              min="0"
              value={settings.pointsPerSignup}
              onChange={handleChange}
            />
            <Input
              label="Referans Bonusu (Puan)"
              name="pointsPerReferral"
              type="number"
              min="0"
              value={settings.pointsPerReferral}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
          {saved && (
            <span className="flex items-center gap-2 text-emerald-600 text-sm sm:text-base font-medium">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Kaydedildi!
            </span>
          )}
          <Button type="submit" variant="primary" disabled={loading} className="w-full sm:w-auto">
            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
