-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "credential" BLOB NOT NULL,
    "holderId" TEXT,
    CONSTRAINT "Credential_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
