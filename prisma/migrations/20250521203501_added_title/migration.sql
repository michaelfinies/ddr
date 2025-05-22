/*
  Warnings:

  - Added the required column `title` to the `ReadingLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingLog" ADD COLUMN     "title" TEXT NOT NULL;
