/*
  Warnings:

  - You are about to drop the column `descripción` on the `especialidad` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Especialidad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `especialidad` DROP COLUMN `descripción`,
    ADD COLUMN `descripcion` TEXT NOT NULL;
