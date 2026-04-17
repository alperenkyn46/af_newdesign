import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Gamepad2, 
  Gift, 
  Trophy,
  TrendingUp,
  Calendar
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

async function getDashboardStats() {
  const [
    usersCount,
    sitesCount,
    bonusesCount,
    totalPoints,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.bettingSite.count({ where: { isActive: true } }),
    prisma.bonus.count({ where: { isActive: true } }),
    prisma.point.aggregate({ _sum: { amount: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, totalPoints: true },
    }),
  ]);

  return {
    usersCount,
    sitesCount,
    bonusesCount,
    totalPoints: totalPoints._sum.amount || 0,
    recentUsers,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      icon: Users,
      label: "Toplam Kullanıcı",
      value: formatNumber(stats.usersCount),
      color: "text-primary-700",
      bgColor: "bg-primary-50",
    },
    {
      icon: Gamepad2,
      label: "Aktif Site",
      value: formatNumber(stats.sitesCount),
      color: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      icon: Gift,
      label: "Aktif Bonus",
      value: formatNumber(stats.bonusesCount),
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Trophy,
      label: "Toplam Puan",
      value: formatNumber(stats.totalPoints),
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="max-w-full overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6 sm:mb-8 tracking-tight">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="text-center sm:text-left min-w-0">
                <p className="text-ink-soft text-xs sm:text-sm font-medium">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-ink tabular-nums">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Users */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-5 sm:h-5 text-primary-600" />
            Son Kayıt Olanlar
          </h2>
        </div>

        {stats.recentUsers.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-ink-soft text-xs uppercase tracking-wide border-b border-line">
                    <th className="pb-3 font-semibold">Kullanıcı</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Puan</th>
                    <th className="pb-3 font-semibold">Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-line-soft last:border-0">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-brand-sm">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-ink font-medium text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-ink-muted text-sm">{user.email}</td>
                      <td className="py-3.5">
                        <span className="text-emerald-700 font-semibold tabular-nums">
                          {user.totalPoints}
                        </span>
                      </td>
                      <td className="py-3.5 text-ink-muted text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-ink-faint" />
                          {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="p-3 rounded-xl bg-surface-subtle border border-line">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-ink font-medium text-sm truncate">{user.name}</p>
                      <p className="text-ink-soft text-xs truncate">{user.email}</p>
                    </div>
                    <span className="text-emerald-700 font-bold text-sm tabular-nums">{user.totalPoints}</span>
                  </div>
                  <div className="flex items-center gap-1 text-ink-soft text-xs pl-11">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-ink-muted text-center py-8 text-sm">Henüz kullanıcı yok</p>
        )}
      </Card>
    </div>
  );
}
