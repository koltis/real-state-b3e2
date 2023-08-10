-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'España',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "cp" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyFee" (
    "id" SERIAL NOT NULL,
    "feeId" TEXT NOT NULL,

    CONSTRAINT "AgencyFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyFees" (
    "id" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AgencyFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "ownerPrice" DOUBLE PRECISION NOT NULL,
    "agencyFeesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgencyFee_feeId_key" ON "AgencyFee"("feeId");

-- AddForeignKey
ALTER TABLE "AgencyFee" ADD CONSTRAINT "AgencyFee_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "AgencyFees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_agencyFeesId_fkey" FOREIGN KEY ("agencyFeesId") REFERENCES "AgencyFees"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
