"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl md:text-8xl font-black gradient-text tracking-tight">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-ink mt-4 tracking-tight">
          Sayfa Bulunamadı
        </h2>
        <p className="text-ink-muted mt-2 max-w-md mx-auto text-sm">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
}
