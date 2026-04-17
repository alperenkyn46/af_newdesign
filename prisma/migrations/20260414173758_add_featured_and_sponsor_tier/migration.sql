-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "telegramUsername" TEXT,
    "referralCode" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "vipLevel" TEXT NOT NULL DEFAULT 'bronze',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingSite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "features" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sponsorTier" TEXT NOT NULL DEFAULT 'premium',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BettingSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonus" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "minDeposit" TEXT,
    "wagering" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelSpin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WheelSpin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bet" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "winAmount" INTEGER NOT NULL,
    "symbols" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlotGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VipLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "bonusMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "dailyBonus" INTEGER NOT NULL DEFAULT 10,
    "wheelBonus" INTEGER NOT NULL DEFAULT 0,
    "slotBonus" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#CD7F32',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VipLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelPrize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "probability" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WheelPrize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepositProof" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "amount" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "points" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'BetVIP',
    "siteLogo" TEXT,
    "siteDescription" TEXT NOT NULL DEFAULT 'En iyi bahis siteleri ve bonuslar',
    "telegramLink" TEXT,
    "instagramLink" TEXT,
    "twitterLink" TEXT,
    "youtubeLink" TEXT,
    "contactEmail" TEXT,
    "pointsPerSignup" INTEGER NOT NULL DEFAULT 50,
    "pointsPerReferral" INTEGER NOT NULL DEFAULT 100,
    "pointsPerTelegram" INTEGER NOT NULL DEFAULT 50,
    "pointsPerInstagram" INTEGER NOT NULL DEFAULT 30,
    "pointsPerTwitter" INTEGER NOT NULL DEFAULT 30,
    "pointsPerYoutube" INTEGER NOT NULL DEFAULT 40,
    "pointsPerDeposit" INTEGER NOT NULL DEFAULT 100,
    "dailyBonusBase" INTEGER NOT NULL DEFAULT 10,
    "slotMinBet" INTEGER NOT NULL DEFAULT 10,
    "slotMaxBet" INTEGER NOT NULL DEFAULT 1000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "BettingSite_slug_key" ON "BettingSite"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredId_key" ON "Referral"("referredId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReward_userId_date_key" ON "DailyReward"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WheelSpin_userId_date_key" ON "WheelSpin"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SocialFollow_userId_platform_key" ON "SocialFollow"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "VipLevel_name_key" ON "VipLevel"("name");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "BettingSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReward" ADD CONSTRAINT "DailyReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelSpin" ADD CONSTRAINT "WheelSpin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialFollow" ADD CONSTRAINT "SocialFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotGame" ADD CONSTRAINT "SlotGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "BettingSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositProof" ADD CONSTRAINT "DepositProof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositProof" ADD CONSTRAINT "DepositProof_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "BettingSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
