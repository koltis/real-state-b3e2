/*
  Warnings:

  - The primary key for the `AgencyFees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AgencyFees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `agencyFeesId` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `feeId` on the `AgencyFee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AgencyFee" DROP CONSTRAINT "AgencyFee_feeId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_agencyFeesId_fkey";

-- AlterTable
ALTER TABLE "AgencyFee" DROP COLUMN "feeId",
ADD COLUMN     "feeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AgencyFees" DROP CONSTRAINT "AgencyFees_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AgencyFees_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "agencyFeesId",
ADD COLUMN     "agencyFeesId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "AgencyFee_feeId_key" ON "AgencyFee"("feeId");

-- AddForeignKey
ALTER TABLE "AgencyFee" ADD CONSTRAINT "AgencyFee_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "AgencyFees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_agencyFeesId_fkey" FOREIGN KEY ("agencyFeesId") REFERENCES "AgencyFees"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
