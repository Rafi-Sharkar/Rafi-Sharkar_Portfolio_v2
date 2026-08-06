-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image_url" VARCHAR(1024);

-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN     "story" TEXT,
ADD COLUMN     "title" VARCHAR(255);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "image_url" VARCHAR(1024);
