/*
  Warnings:

  - You are about to alter the column `metadata` on the `CredentialOffer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CredentialOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metadata" BLOB NOT NULL,
    "holderId" TEXT,
    CONSTRAINT "CredentialOffer_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CredentialOffer" ("holderId", "id", "metadata") SELECT "holderId", "id", "metadata" FROM "CredentialOffer";
DROP TABLE "CredentialOffer";
ALTER TABLE "new_CredentialOffer" RENAME TO "CredentialOffer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
