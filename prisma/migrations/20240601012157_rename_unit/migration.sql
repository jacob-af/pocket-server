-- This is an empty migration.
ALTER TABLE "Touch"
    RENAME COLUMN "User" TO "user";
ALTER TABLE "ArchivedTouch"
    RENAME COLUMN "User" TO "user";
ALTER TABLE "Stock"
    RENAME COLUMN "User" TO "user";