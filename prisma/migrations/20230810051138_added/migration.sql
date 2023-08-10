/*
  Warnings:

  - A unique constraint covering the columns `[position,propertyId]` on the table `PropertyImg` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `PropertyImg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `PropertyImg` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyImg" ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PropertyImg_position_propertyId_key" ON "PropertyImg"("position", "propertyId");
