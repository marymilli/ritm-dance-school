import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const db = new Database(fileURLToPath(new URL('./dev.db', import.meta.url)));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS "Teacher" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "direction" TEXT NOT NULL, "experience" INTEGER NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "ClassSession" ("id" TEXT NOT NULL PRIMARY KEY, "direction" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "startsAt" DATETIME NOT NULL, "durationMin" INTEGER NOT NULL, "level" TEXT NOT NULL, "room" TEXT NOT NULL, "capacity" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'ACTIVE', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "ClassSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "Booking" ("id" TEXT NOT NULL PRIMARY KEY, "number" TEXT NOT NULL, "classSessionId" TEXT NOT NULL, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "phoneNormalized" TEXT NOT NULL, "email" TEXT, "comment" TEXT, "consent" BOOLEAN NOT NULL, "status" TEXT NOT NULL DEFAULT 'NEW', "requestKey" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Booking_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "Notification" ("id" TEXT NOT NULL PRIMARY KEY, "bookingId" TEXT NOT NULL, "payload" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "attempts" INTEGER NOT NULL DEFAULT 0, "lastError" TEXT, "failNextDemo" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "AdminUser" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "AdminSession" ("id" TEXT NOT NULL PRIMARY KEY, "tokenHash" TEXT NOT NULL, "csrfToken" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" DATETIME NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS "DemoSetting" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "failNextNotification" BOOLEAN NOT NULL DEFAULT false, "updatedAt" DATETIME NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_number_key" ON "Booking"("number");
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_requestKey_key" ON "Booking"("requestKey");
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_classSessionId_phoneNormalized_key" ON "Booking"("classSessionId", "phoneNormalized");
CREATE UNIQUE INDEX IF NOT EXISTS "Notification_bookingId_key" ON "Notification"("bookingId");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX IF NOT EXISTS "ClassSession_startsAt_idx" ON "ClassSession"("startsAt");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
`);
db.close();
console.log('SQLite-схема подготовлена.');
