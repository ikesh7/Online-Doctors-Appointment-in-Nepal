/*
  Warnings:

  - The `status` column on the `LabTest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `service_name` on the `Services` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Services` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `patient_id` to the `LabTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK', 'VACATION', 'PERSONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('PENDING', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('GENERAL', 'LABORATORY');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'LABORATORY';

-- DropIndex
DROP INDEX "LabTest_service_id_key";

-- AlterTable
ALTER TABLE "LabTest" ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "resultNote" TEXT,
ALTER COLUMN "test_date" DROP NOT NULL,
ALTER COLUMN "result" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "physician_id" TEXT;

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "service_name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "department" "Department" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tat" INTEGER,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" "LeaveType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "modifiedStartDate" TIMESTAMP(3),
    "modifiedEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
