"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { 
  MessageCircle, 
  Send, 
  Instagram, 
  Youtube,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";

const features = [
  { icon: Clock, title: "7/24 Destek", description: "Her zaman yanınızdayız" },
  { icon: Shield, title: "Güvenli İletişim", description: "Bilgileriniz güvende" },
  { icon: CheckCircle, title: "Hızlı Yanıt", description: "En kısa sürede dönüş" },
];

export default function ContactPage() {
  const { telegramLink, instagramLink, youtubeLink } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const resolvedTelegramLink = telegramLink || "https://t.me/Slotbuseduyuruu";
  const contactMethods = [
    {
      icon: Send,
      title: "Telegram",
      description: "7/24 anlık destek",
      link: resolvedTelegramLink,
      buttonText: "Telegram'a Git",
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: instagramLink || "#", label: "Instagram" },
    { icon: Youtube, href: youtubeLink || "#", label: "YouTube" },
    { icon: Send, href: resolvedTelegramLink, label: "Telegram" },
  ].filter((link) => link.href !== "#");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-ink flex items-center justify-center gap-3 tracking-tight">
            <MessageCircle className="w-8 h-8 text-primary-600" />
            İletişim
          </h1>
          <p className="text-ink-muted mt-3 max-w-2xl mx-auto text-sm">
            Sorularınız, önerileriniz veya işbirliği teklifleri için bizimle
            iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {features.map((feature, idx) => (
            <Card key={idx} className="text-center">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 mx-auto flex items-center justify-center">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-ink mt-3">
                {feature.title}
              </h3>
              <p className="text-ink-muted text-sm mt-1">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink">Bize Ulaşın</h2>

            {contactMethods.map((method, idx) => (
              <Card key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-brand-sm">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-semibold text-ink">
                    {method.title}
                  </h3>
                  <p className="text-ink-muted text-sm">{method.description}</p>
                </div>
                <a href={method.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm">
                    {method.buttonText}
                  </Button>
                </a>
              </Card>
            ))}

            <div className="mt-6">
              <h3 className="text-base font-semibold text-ink mb-3">
                Sosyal Medya
              </h3>
              <div className="flex gap-2.5">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white border border-line flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-soft"
                    title={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <h2 className="text-xl font-bold text-ink mb-5">Mesaj Gönderin</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-ink mt-4">
                  Mesajınız Alındı
                </h3>
                <p className="text-ink-muted mt-1 text-sm">
                  En kısa sürede size dönüş yapacağız.
                </p>
                <Button
                  variant="secondary"
                  className="mt-5"
                  onClick={() => setSubmitted(false)}
                >
                  Yeni Mesaj
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Adınız"
                  placeholder="Adınızı girin"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Konu"
                  placeholder="Mesaj konusu"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-ink">
                    Mesajınız
                  </label>
                  <textarea
                    placeholder="Mesajınızı yazın..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-line text-ink placeholder-ink-faint focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Gönder
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
