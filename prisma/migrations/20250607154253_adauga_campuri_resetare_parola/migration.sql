BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[UTILIZATOR] ADD [passwordResetExpires] DATETIME,
[passwordResetToken] NVARCHAR(255);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
