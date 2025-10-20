/*
  Warnings:

  - Made the column `tiempoRespuesta` on table `sla` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tiempoResolucion` on table `sla` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `especialidad` MODIFY `descripción` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `sla` MODIFY `tiempoRespuesta` VARCHAR(191) NOT NULL,
    MODIFY `tiempoResolucion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ticket` MODIFY `descripcion` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `valoracion` MODIFY `comentario` TEXT NULL;
