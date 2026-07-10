/*
  Warnings:

  - You are about to drop the column `currentPeriondEnd` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "currentPeriondEnd",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
