"use client";

import { useEffect, useState } from "react";
import { Trophy, Zap } from "lucide-react";

const winnerNames = [
  "Ahm**K", "Meh**T", "Ali**Y", "Fat**S", "Mus**E",
  "Ser**N", "Cem**B", "Can**D", "Efe**M", "Bur**A",
  "Sel**K", "Kar**O", "Oya**H", "Nil**G", "Ber**Z",
  "Emr**C", "Tun**R", "Gök**L", "Hay**P", "Cem**V"
];

const sites = ["Betboo", "Bets10", "Mobilbahis", "Superbetin", "1xBet", "Tipobet"];
const games = ["Sweet Bonanza", "Gates of Olympus", "Big Bass", "Canlı Rulet", "Blackjack", "Aviator", "Crazy Time"];

const initialWins = [
  { name: "Ahm**K", site: "Betboo", game: "Sweet Bonanza", amount: 12500 },
  { name: "Meh**T", site: "Bets10", game: "Gates of Olympus", amount: 8750 },
  { name: "Ali**Y", site: "Mobilbahis", game: "Aviator", amount: 25000 },
  { name: "Fat**S", site: "Superbetin", game: "Canlı Rulet", amount: 5200 },
  { name: "Mus**E", site: "1xBet", game: "Blackjack", amount: 18900 },
];

function generateWin() {
  const name = winnerNames[Math.floor(Math.random() * winnerNames.length)];
  const site = sites[Math.floor(Math.random() * sites.length)];
  const game = games[Math.floor(Math.random() * games.length)];
  const amount = Math.floor(Math.random() * 50000) + 500;
  return { name, site, game, amount };
}

export function LiveTicker() {
  const [wins, setWins] = useState(initialWins);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setWins((prev) => {
        const newWins = [...prev];
        newWins.shift();
        newWins.push(generateWin());
        return newWins;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <div className="bg-emerald-50 border-b border-emerald-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-9">
          <div className="flex items-center gap-1.5 pr-4 border-r border-emerald-200 flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-bold tracking-wide">
              CANLI
            </span>
          </div>

          <div className="overflow-hidden flex-grow">
            <div className="flex animate-ticker">
              {[...wins, ...wins].map((win, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-6 whitespace-nowrap"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-ink-muted">
                    <span className="text-ink font-semibold">{win.name}</span>{" "}
                    {win.site}&apos;de {win.game} oyununda{" "}
                    <span className="text-emerald-700 font-bold">
                      {win.amount.toLocaleString("tr-TR")} ₺
                    </span>{" "}
                    kazandı
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
