-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" TEXT NOT NULL,
    "publicKey" BLOB NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rsvp" (
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

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "uploaderName" TEXT,
    "uploaderEmail" TEXT,
    "rsvpId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "Rsvp" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_key" ON "Credential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_credentialId_key" ON "Credential"("credentialId");

-- CreateIndex
CREATE INDEX "Credential_credentialId_idx" ON "Credential"("credentialId");

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rsvp_editToken_key" ON "Rsvp"("editToken");

-- CreateIndex
CREATE UNIQUE INDEX "Rsvp_uploadToken_key" ON "Rsvp"("uploadToken");

-- CreateIndex
CREATE INDEX "Rsvp_email_idx" ON "Rsvp"("email");

-- CreateIndex
CREATE INDEX "Rsvp_editToken_idx" ON "Rsvp"("editToken");

-- CreateIndex
CREATE INDEX "Rsvp_uploadToken_idx" ON "Rsvp"("uploadToken");

-- CreateIndex
CREATE INDEX "Photo_createdAt_idx" ON "Photo"("createdAt");

-- CreateIndex
CREATE INDEX "Photo_uploaderName_idx" ON "Photo"("uploaderName");

-- CreateIndex
CREATE INDEX "Photo_rsvpId_idx" ON "Photo"("rsvpId");

