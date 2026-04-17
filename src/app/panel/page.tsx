import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import Link from "next/link";
import { 
  User, 
  Trophy, 
  Users, 
  Gift,
  TrendingUp,
  Calendar
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      points: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      referralsMade: {
        include: {
          referred: {
            select: { name: true, createdAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { referralsMade: true },
      },
    },
  });
  return user;
}

export default async function UserPanelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris?callbackUrl=/panel");
  }

  const user = await getUserData(session.user.id);

  if (!user) {
    redirect("/giris");
  }

  const stats = [
    {
      icon: Trophy,
      label: "Toplam Puan",
      value: formatNumber(user.totalPoints),
      tint: "bg-amber-50 text-amber-700",
    },
    {
      icon: Users,
      label: "Referanslar",
      value: user._count.referralsMade.toString(),
      tint: "bg-primary-50 text-primary-700",
    },
    {
      icon: Gift,
      label: "Kazanılan Bonus",
      value: formatNumber(user._count.referralsMade * 100),
      tint: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Calendar,
      label: "Üyelik",
      value: formatDate(user.createdAt),
      tint: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="min-h-screen py-8 md:py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-brand-sm">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink tracking-tight">
                Hoşgeldin, {user.name}
              </h1>
              <p className="text-ink-muted text-sm">{user.email}</p>
            </div>
          </div>
          {session.user.isAdmin && (
            <Link href="/admin">
              <Button variant="secondary">Admin Paneli</Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.tint}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-ink-soft text-xs font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-ink tabular-nums truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Code */}
          <Card>
            <h2 className="text-lg font-bold text-ink mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Referans Kodun
            </h2>
            <p className="text-ink-muted text-sm mb-4">
              Arkadaşlarını davet et, her kayıt için 100 puan kazan
            </p>

            <div className="flex gap-3">
              <div className="flex-grow px-4 py-3 rounded-xl bg-surface-subtle border border-line font-mono text-lg text-ink tracking-wide">
                {user.referralCode}
              </div>
              <CopyButton
                text={`${process.env.NEXT_PUBLIC_SITE_URL || "https://betvip.com"}/kayit?ref=${user.referralCode}`}
              />
            </div>

            <div className="mt-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
              <p className="text-sm text-ink-muted">
                Davet linkin:{" "}
                <span className="text-primary-700 font-mono break-all">
                  {process.env.NEXT_PUBLIC_SITE_URL || "https://betvip.com"}/kayit?ref={user.referralCode}
                </span>
              </p>
            </div>
          </Card>

          {/* Recent Points */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Son Puanlar
              </h2>
              <Link href="/panel/puanlar">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                </Button>
              </Link>
            </div>

            {user.points.length > 0 ? (
              <div className="space-y-2">
                {user.points.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line"
                  >
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm truncate">
                        {point.reason}
                      </p>
                      <p className="text-ink-soft text-xs">
                        {formatDate(point.createdAt)}
                      </p>
                    </div>
                    <span className="text-emerald-700 font-bold tabular-nums">
                      +{point.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-muted text-center py-8 text-sm">
                Henüz puan kazanılmamış
              </p>
            )}
          </Card>

          {/* Recent Referrals */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                Son Referanslar
              </h2>
              <Link href="/panel/referanslar">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                </Button>
              </Link>
            </div>

            {user.referralsMade.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.referralsMade.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                        <User className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-ink font-medium text-sm truncate">
                          {referral.referred.name}
                        </p>
                        <p className="text-ink-soft text-xs">
                          {formatDate(referral.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-sm tabular-nums shrink-0 ml-2">
                      +{referral.pointsEarned}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-muted text-center py-8 text-sm">
                Henüz referans yok. Arkadaşlarını davet et!
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
