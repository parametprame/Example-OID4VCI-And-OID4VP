-- CreateTable
CREATE TABLE "Holder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CredentialOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" TEXT NOT NULL,
    "holderId" TEXT,
    CONSTRAINT "CredentialOffer_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Holder_id_key" ON "Holder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Holder_address_key" ON "Holder"("address");
