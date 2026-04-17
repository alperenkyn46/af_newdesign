"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trophy, Mail, Lock, User, Gift, AlertCircle, CheckCircle, Send } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telegramUsername: "",
    password: "",
    confirmPassword: "",
    referralCode: refCode,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          telegramUsername: formData.telegramUsername,
          password: formData.password,
          referralCode: formData.referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/giris");
        }, 2000);
      }
    } catch {
      setError("Kayıt sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center p-7">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-1">Kayıt Başarılı</h2>
          <p className="text-ink-muted text-sm">
            Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-7">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-brand">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Kayıt Ol</h1>
          <p className="text-ink-muted mt-1 text-sm">Hemen üye ol, 50 puan kazan</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="name"
              placeholder="Adınız"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="email"
              type="email"
              placeholder="Email adresiniz"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="telegramUsername"
              placeholder="Telegram kullanıcı adınız (@kullaniciadi)"
              value={formData.telegramUsername}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="password"
              type="password"
              placeholder="Şifreniz (min. 6 karakter)"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
            <Input
              name="referralCode"
              placeholder="Davet kodu (opsiyonel)"
              value={formData.referralCode}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-ink-muted text-sm">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/giris"
              className="text-primary-700 font-medium hover:text-primary-800 hover:underline"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
