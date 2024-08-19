/*
  Warnings:

  - Added the required column `metadata` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "credential" BLOB NOT NULL,
    "metadata" BLOB NOT NULL,
    "holderId" TEXT,
    CONSTRAINT "Credential_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Credential" ("credential", "holderId", "id") SELECT "credential", "holderId", "id" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE TABLE "new_CredentialOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" BLOB NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "holderId" TEXT,
    CONSTRAINT "CredentialOffer_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CredentialOffer" ("holderId", "id", "metadata") SELECT "holderId", "id", "metadata" FROM "CredentialOffer";
DROP TABLE "CredentialOffer";
ALTER TABLE "new_CredentialOffer" RENAME TO "CredentialOffer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
