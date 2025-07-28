/*
  Warnings:

  - A unique constraint covering the columns `[CodRidicare]` on the table `COMANDA` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[COMANDA] ADD [CodRidicare] NVARCHAR(100);

-- CreateIndex
ALTER TABLE [dbo].[COMANDA] ADD CONSTRAINT [unq_CodRidicare] UNIQUE NONCLUSTERED ([CodRidicare]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
