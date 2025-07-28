/*
  Warnings:

  - You are about to alter the column `Imagine` on the `PRODUS` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `NVarChar(255)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[PRODUS] ALTER COLUMN [Imagine] NVARCHAR(255) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
