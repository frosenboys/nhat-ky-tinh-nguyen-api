-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GLOBAL', 'USER', 'GROUP');

-- CreateTable
CREATE TABLE "User" (
    "studentId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "unionGroup" VARCHAR(100),
    "fullName" VARCHAR(100),
    "position" VARCHAR(50),
    "avatarUrl" VARCHAR(255),
    "points" INTEGER NOT NULL DEFAULT 0,
    "points_1" INTEGER NOT NULL DEFAULT 0,
    "points_2" INTEGER NOT NULL DEFAULT 0,
    "points_3" INTEGER NOT NULL DEFAULT 0,
    "points_4" INTEGER NOT NULL DEFAULT 0,
    "points_5" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "MissionSubmission" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "missionId" INTEGER,
    "imageLink" TEXT,
    "note" TEXT,
    "status" TEXT DEFAULT 'pending',

    CONSTRAINT "MissionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Missions" (
    "id" SERIAL NOT NULL,
    "missionName" TEXT NOT NULL,
    "joined" INTEGER DEFAULT 0,
    "status" VARCHAR(30),
    "marked" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'GLOBAL',
    "content" TEXT NOT NULL,
    "from" VARCHAR(50),
    "studentId" TEXT,
    "unionGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digiMap" (
    "id" SERIAL NOT NULL,
    "pinName" TEXT,
    "joined" INTEGER,
    "pinLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digiMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main_news" (
    "id" SERIAL NOT NULL,
    "link" TEXT,
    "image" TEXT,

    CONSTRAINT "main_news_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissionSubmission" ADD CONSTRAINT "MissionSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
