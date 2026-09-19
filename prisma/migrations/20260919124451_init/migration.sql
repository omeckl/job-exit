-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."WorkMode" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "public"."DisplayMode" AS ENUM ('FIRST_NAME', 'FULL_NAME');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "photoUrl" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'hu',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoginToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "redirectTo" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Listing" (
    "id" TEXT NOT NULL,
    "ref" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "hiddenByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "contentDeleted" BOOLEAN NOT NULL DEFAULT false,
    "displayMode" "public"."DisplayMode" NOT NULL DEFAULT 'FIRST_NAME',
    "title" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "seniority" TEXT,
    "experienceNeeded" TEXT,
    "employmentType" TEXT,
    "schedule" TEXT,
    "hasReports" BOOLEAN NOT NULL DEFAULT false,
    "reportCount" INTEGER,
    "travel" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "workMode" "public"."WorkMode" NOT NULL,
    "officeDays" INTEGER,
    "remoteLimit" TEXT,
    "workLanguages" TEXT[],
    "listingLanguage" TEXT NOT NULL,
    "lastWorkingDay" TIMESTAMP(3) NOT NULL,
    "salary" TEXT,
    "benefits" TEXT[],
    "tasks" TEXT[],
    "techTags" TEXT[],
    "goodParts" TEXT,
    "hardParts" TEXT,
    "teamSize" TEXT,
    "reportsTo" TEXT,
    "companyName" TEXT,
    "companyUrl" TEXT,
    "companyDescription" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "applicantPrompt" TEXT,
    "dealbreakers" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "foundSuccessor" BOOLEAN,
    "closedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "salaryExpectation" TEXT,
    "noticePeriod" TEXT,
    "handoverMessage" TEXT,
    "handoverSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TechTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "TechTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginToken_tokenHash_key" ON "public"."LoginToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "public"."Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_ref_key" ON "public"."Listing"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "public"."Listing"("slug");

-- CreateIndex
CREATE INDEX "Listing_status_createdAt_idx" ON "public"."Listing"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Application_listingId_createdAt_idx" ON "public"."Application"("listingId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Application_listingId_applicantId_key" ON "public"."Application"("listingId", "applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "TechTag_name_key" ON "public"."TechTag"("name");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "public"."City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_country_key" ON "public"."City"("name", "country");

-- AddForeignKey
ALTER TABLE "public"."LoginToken" ADD CONSTRAINT "LoginToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
