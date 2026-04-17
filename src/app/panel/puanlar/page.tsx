import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

async function getUserPoints(userId: string) {
  const points = await prisma.point.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPoints: true },
  });

  return { points, totalPoints: user?.totalPoints || 0 };
}

export default async function PointsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris?callbackUrl=/panel/puanlar");
  }

  const { points, totalPoints } = await getUserPoints(session.user.id);

  return (
    <div className="min-h-screen py-8 md:py-10">
      <div className="container mx-auto px-4">
        <Link
          href="/panel"
          className="inline-flex items-center gap-1.5 text-ink-muted hover:text-primary-700 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Panele Dön
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 tracking-tight">
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
            Puanlarım
          </h1>
          <Card className="px-5 py-3 md:w-auto">
            <p className="text-ink-soft text-xs uppercase tracking-wide font-medium">Toplam Puan</p>
            <p className="text-2xl font-bold text-primary-700 tabular-nums">
              {formatNumber(totalPoints)}
            </p>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-ink mb-5">Puan Geçmişi</h2>

          {points.length > 0 ? (
            <div className="space-y-2">
              {points.map((point) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        point.amount > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {point.amount > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm truncate">{point.reason}</p>
                      <p className="text-ink-soft text-xs">
                        {formatDate(point.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-base tabular-nums ${
                      point.amount > 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {point.amount > 0 ? "+" : ""}
                    {point.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-ink-faint mx-auto" />
              <p className="text-ink-muted mt-3 text-sm">Henüz puan kazanılmamış</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
