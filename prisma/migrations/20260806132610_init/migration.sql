-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "jobTitle" VARCHAR(128) NOT NULL,
    "bio" TEXT NOT NULL,
    "profilePic" VARCHAR(1024) NOT NULL,
    "coverPic" VARCHAR(1024) NOT NULL,
    "cvUrl" VARCHAR(1024),
    "githubUrl" VARCHAR(512),
    "linkedinUrl" VARCHAR(512),
    "facebookUrl" VARCHAR(512),
    "instagramUrl" VARCHAR(512),
    "aboutP1" TEXT NOT NULL,
    "aboutP2" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "heroSubtitle" VARCHAR(64) NOT NULL,
    "heroHeading" VARCHAR(255) NOT NULL,
    "heroTagline" TEXT NOT NULL,
    "contactTitle" VARCHAR(255) NOT NULL,
    "contactSubtitle" VARCHAR(255) NOT NULL,
    "mapLabel" VARCHAR(255) NOT NULL,
    "experienceStartDate" DATE NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "level" VARCHAR(64) NOT NULL,
    "category" VARCHAR(32) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactCard" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(16) NOT NULL,
    "label" VARCHAR(64) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "href" VARCHAR(512),
    "color" VARCHAR(32) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContactCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "github_link" VARCHAR(512),
    "live_link" VARCHAR(512),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "issuer" VARCHAR(255),
    "date" DATE,
    "credential_url" VARCHAR(1024),

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(1024) NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
