import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import Link from "next/link";
import { ArrowLeft, Users, User, Gift } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

async function getUserReferrals(userId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    include: {
      referred: {
        select: { name: true, email: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  const totalEarned = referrals.reduce((sum, r) => sum + r.pointsEarned, 0);

  return { referrals, referralCode: user?.referralCode || "", totalEarned };
}

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris?callbackUrl=/panel/referanslar");
  }

  const { referrals, referralCode, totalEarned } = await getUserReferrals(
    session.user.id
  );

  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://betvip.com"}/kayit?ref=${referralCode}`;

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

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-ink flex items-center gap-2.5 tracking-tight">
            <Users className="w-6 h-6 text-primary-600" />
            Referanslarım
          </h1>
          <div className="flex gap-3">
            <Card className="px-5 py-3">
              <p className="text-ink-soft text-xs uppercase tracking-wide font-medium">Toplam</p>
              <p className="text-2xl font-bold text-ink tabular-nums">{referrals.length}</p>
            </Card>
            <Card className="px-5 py-3">
              <p className="text-ink-soft text-xs uppercase tracking-wide font-medium">Kazanılan</p>
              <p className="text-2xl font-bold text-primary-700 tabular-nums">
                {formatNumber(totalEarned)}
              </p>
            </Card>
          </div>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-grow">
              <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary-600" />
                Davet Linkin
              </h2>
              <p className="text-ink-muted text-sm mt-1">
                Bu linki paylaş, her kayıt için 100 puan kazan
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-grow md:w-80 px-4 py-2 rounded-xl bg-surface-subtle border border-line text-ink text-sm font-mono"
              />
              <CopyButton text={referralLink} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink mb-5">
            Davet Ettiklerim
          </h2>

          {referrals.length > 0 ? (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-brand-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm truncate">
                        {referral.referred.name}
                      </p>
                      <p className="text-ink-soft text-xs truncate">
                        {referral.referred.email}
                      </p>
                      <p className="text-ink-faint text-xs mt-0.5">
                        Katılım: {formatDate(referral.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-emerald-700 font-bold text-base tabular-nums">
                      +{referral.pointsEarned}
                    </span>
                    <p className="text-ink-soft text-xs">puan</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-ink-faint mx-auto" />
              <h3 className="text-base font-semibold text-ink mt-3">
                Henüz referans yok
              </h3>
              <p className="text-ink-muted mt-1 text-sm">
                Arkadaşlarını davet et ve puan kazanmaya başla
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
