"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Trophy, 
  Calendar, 
  Mail, 
  Shield, 
  Plus, 
  Minus,
  X,
  Send
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  telegramUsername: string | null;
  totalPoints: number;
  vipLevel: string;
  isAdmin: boolean;
  referralCode: string;
  createdAt: string;
  _count: {
    referralsMade: number;
    points: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsAmount, setPointsAmount] = useState("");
  const [pointsReason, setPointsReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const handleGivePoints = async (isPositive: boolean) => {
    if (!selectedUser || !pointsAmount || !pointsReason) return;
    
    setUpdating(true);
    try {
      const amount = parseInt(pointsAmount) * (isPositive ? 1 : -1);
      await fetch(`/api/admin/users/${selectedUser.id}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: pointsReason }),
      });
      
      loadUsers();
      setSelectedUser(null);
      setPointsAmount("");
      setPointsReason("");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-ink-muted">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2 sm:gap-3 tracking-tight">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          Kullanıcılar
        </h1>
        <div className="text-ink-muted text-sm sm:text-base">
          Toplam: <span className="text-ink font-bold tabular-nums">{users.length}</span>
        </div>
      </div>

      {/* Points Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <Card className="relative w-full max-w-md z-10 mx-2 shadow-card">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-ink-muted hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-bold text-ink mb-4">Puan Ver / Al</h3>
            
            <div className="mb-4 p-3 rounded-xl bg-surface-subtle border border-line">
              <p className="text-ink font-medium text-sm sm:text-base">{selectedUser.name}</p>
              <p className="text-ink-soft text-xs sm:text-sm truncate">{selectedUser.email}</p>
              <p className="text-amber-600 text-sm mt-1 font-medium">
                Mevcut Puan: <span className="tabular-nums">{selectedUser.totalPoints}</span>
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Puan Miktarı"
                type="number"
                placeholder="100"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
              />

              <Input
                label="Açıklama"
                placeholder="Puan verme sebebi..."
                value={pointsReason}
                onChange={(e) => setPointsReason(e.target.value)}
              />

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm sm:text-base"
                  onClick={() => handleGivePoints(false)}
                  disabled={updating || !pointsAmount || !pointsReason}
                >
                  <Minus className="w-4 h-4 mr-1 sm:mr-2" />
                  Puan Al
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-sm sm:text-base"
                  onClick={() => handleGivePoints(true)}
                  disabled={updating || !pointsAmount || !pointsReason}
                >
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  Puan Ver
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {users.length > 0 ? (
        <>
          {/* Desktop Table */}
          <Card className="overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-ink-soft text-xs uppercase tracking-wide border-b border-line">
                    <th className="p-4 font-semibold">Kullanıcı</th>
                    <th className="p-4 font-semibold">Email / Telegram</th>
                    <th className="p-4 font-semibold">Puan / VIP</th>
                    <th className="p-4 font-semibold">Referans</th>
                    <th className="p-4 font-semibold">Kayıt</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-line-soft last:border-0 hover:bg-surface-subtle"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-brand-sm">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-ink font-medium">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-ink-muted text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          {user.telegramUsername && (
                            <span className="flex items-center gap-2 text-primary-600 text-sm">
                              <Send className="w-3 h-3" />
                              {user.telegramUsername}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-amber-600 font-semibold tabular-nums">
                            <Trophy className="w-4 h-4" />
                            {user.totalPoints.toLocaleString()}
                          </span>
                          <span className={`text-xs capitalize px-2 py-0.5 rounded-full w-fit border ${
                            user.vipLevel === "platinum" ? "bg-slate-50 text-slate-700 border-slate-200" :
                            user.vipLevel === "gold" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            user.vipLevel === "silver" ? "bg-slate-50 text-slate-600 border-slate-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {user.vipLevel}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-ink-muted">
                            {user._count.referralsMade} davet
                          </span>
                          <span className="font-mono text-xs bg-surface-subtle border border-line px-2 py-0.5 rounded text-ink-soft">
                            {user.referralCode}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-ink-muted text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 text-xs w-fit font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-surface-subtle text-ink-muted border border-line text-xs font-medium">
                            Kullanıcı
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Trophy className="w-4 h-4 mr-1" />
                          Puan
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-brand-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-ink font-medium truncate">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {user.isAdmin && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 text-xs">
                            <Shield className="w-3 h-3" />
                          </span>
                        )}
                        <span className={`text-xs capitalize px-2 py-0.5 rounded-full border ${
                          user.vipLevel === "platinum" ? "bg-slate-50 text-slate-700 border-slate-200" :
                          user.vipLevel === "gold" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          user.vipLevel === "silver" ? "bg-slate-50 text-slate-600 border-slate-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {user.vipLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="text-ink-muted truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </p>
                      {user.telegramUsername && (
                        <p className="text-primary-600 truncate flex items-center gap-1">
                          <Send className="w-3 h-3 flex-shrink-0" />
                          {user.telegramUsername}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-line-soft">
                      <span className="flex items-center gap-1 text-amber-600 font-semibold text-sm tabular-nums">
                        <Trophy className="w-4 h-4" />
                        {user.totalPoints.toLocaleString()} puan
                      </span>
                      <span className="text-ink-soft text-xs">
                        {user._count.referralsMade} davet
                      </span>
                      <span className="text-ink-soft text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-line-soft">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Trophy className="w-4 h-4 mr-1" />
                    Puan Ver / Al
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-ink-faint mx-auto" />
          <h3 className="text-lg sm:text-xl font-semibold text-ink mt-4">
            Henüz kullanıcı yok
          </h3>
        </Card>
      )}
    </div>
  );
}
