/*
  Warnings:

  - You are about to drop the column `tecnicoId` on the `asignacion` table. All the data in the column will be lost.
  - You are about to drop the `_especialidadtotecnico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tecnico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `Asignacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_especialidadtotecnico` DROP FOREIGN KEY `_EspecialidadToTecnico_A_fkey`;

-- DropForeignKey
ALTER TABLE `_especialidadtotecnico` DROP FOREIGN KEY `_EspecialidadToTecnico_B_fkey`;

-- DropForeignKey
ALTER TABLE `asignacion` DROP FOREIGN KEY `Asignacion_tecnicoId_fkey`;

-- DropForeignKey
ALTER TABLE `tecnico` DROP FOREIGN KEY `Tecnico_estado_DisponibilidadId_fkey`;

-- DropForeignKey
ALTER TABLE `tecnico` DROP FOREIGN KEY `Tecnico_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Asignacion_tecnicoId_fkey` ON `asignacion`;

-- AlterTable
ALTER TABLE `asignacion` DROP COLUMN `tecnicoId`,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ticket` MODIFY `fechaCierre` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `carga_Actual_Trabajo` INTEGER NULL,
    ADD COLUMN `estado_DisponibilidadId` INTEGER NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_especialidadtotecnico`;

-- DropTable
DROP TABLE `tecnico`;

-- CreateTable
CREATE TABLE `_EspecialidadToUsuario` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EspecialidadToUsuario_AB_unique`(`A`, `B`),
    INDEX `_EspecialidadToUsuario_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_estado_DisponibilidadId_fkey` FOREIGN KEY (`estado_DisponibilidadId`) REFERENCES `EstadoDisponibilidad`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asignacion` ADD CONSTRAINT `Asignacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToUsuario` ADD CONSTRAINT `_EspecialidadToUsuario_A_fkey` FOREIGN KEY (`A`) REFERENCES `Especialidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EspecialidadToUsuario` ADD CONSTRAINT `_EspecialidadToUsuario_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
