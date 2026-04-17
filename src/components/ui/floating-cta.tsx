"use client";

import { useState, useEffect } from "react";
import { Gamepad2, ChevronUp } from "lucide-react";
import Link from "next/link";

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Floating */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 hidden sm:block ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 items-end">
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full bg-white border border-line shadow-card flex items-center justify-center text-ink-muted hover:text-primary-700 hover:border-primary-300 transition-all"
              aria-label="Yukarı çık"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          <Link href="/siteler">
            <button className="group relative">
              <span className="absolute inset-0 rounded-full bg-gradient-accent opacity-40 blur-lg group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-accent text-white font-semibold shadow-accent hover:brightness-105 transition-all">
                <Gamepad2 className="w-4.5 h-4.5" />
                Hemen Oyna
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
        <div className="bg-white/95 backdrop-blur border-t border-line p-3">
          <Link href="/siteler" className="block">
            <button className="w-full py-3 rounded-xl bg-gradient-accent text-white font-semibold flex items-center justify-center gap-2 shadow-accent">
              <Gamepad2 className="w-5 h-5" />
              Hemen Oyna & Kazan
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
