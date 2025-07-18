-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "uploaderName" TEXT,
    "uploaderEmail" TEXT,
    "rsvpId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "Rsvp" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("createdAt", "filename", "id", "uploaderEmail", "uploaderName") SELECT "createdAt", "filename", "id", "uploaderEmail", "uploaderName" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE INDEX "Photo_createdAt_idx" ON "Photo"("createdAt");
CREATE INDEX "Photo_uploaderName_idx" ON "Photo"("uploaderName");
CREATE INDEX "Photo_rsvpId_idx" ON "Photo"("rsvpId");
CREATE TABLE "new_Rsvp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "plusOne" BOOLEAN NOT NULL DEFAULT false,
    "plusOneName" TEXT,
    "dietaryRestrictions" TEXT,
    "message" TEXT,
    "editToken" TEXT NOT NULL,
    "uploadToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Rsvp" ("createdAt", "dietaryRestrictions", "editToken", "email", "id", "message", "name", "plusOne", "plusOneName", "updatedAt") SELECT "createdAt", "dietaryRestrictions", "editToken", "email", "id", "message", "name", "plusOne", "plusOneName", "updatedAt" FROM "Rsvp";
DROP TABLE "Rsvp";
ALTER TABLE "new_Rsvp" RENAME TO "Rsvp";
CREATE UNIQUE INDEX "Rsvp_editToken_key" ON "Rsvp"("editToken");
CREATE UNIQUE INDEX "Rsvp_uploadToken_key" ON "Rsvp"("uploadToken");
CREATE INDEX "Rsvp_email_idx" ON "Rsvp"("email");
CREATE INDEX "Rsvp_editToken_idx" ON "Rsvp"("editToken");
CREATE INDEX "Rsvp_uploadToken_idx" ON "Rsvp"("uploadToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
