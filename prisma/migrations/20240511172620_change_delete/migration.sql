/*
  Warnings:

  - The `deleted` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deleted",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deleted",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
