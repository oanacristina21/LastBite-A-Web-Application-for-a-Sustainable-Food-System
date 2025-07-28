BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[COMANDA] DROP CONSTRAINT [COMANDA_IdClient_IdRestaurant_DataComanda_key];

-- DropIndex
ALTER TABLE [dbo].[COMANDA] DROP CONSTRAINT [COMANDA_NrComanda_DataComanda_key];

-- DropIndex
ALTER TABLE [dbo].[OFERTA] DROP CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataInceput_key];

-- DropIndex
ALTER TABLE [dbo].[OFERTA] DROP CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataSfarsit_key];

-- DropIndex
ALTER TABLE [dbo].[STOC] DROP CONSTRAINT [STOC_IdProdus_DataExpirare_key];

-- AlterTable
ALTER TABLE [dbo].[COMANDA] ALTER COLUMN [DataComanda] DATETIMEOFFSET NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[NOTIFICARE] DROP CONSTRAINT [NOTIFICARE_DataOraNotificare_df];
ALTER TABLE [dbo].[NOTIFICARE] ALTER COLUMN [DataOraNotificare] DATETIMEOFFSET NOT NULL;
ALTER TABLE [dbo].[NOTIFICARE] ADD [Citita] BIT NOT NULL CONSTRAINT [NOTIFICARE_Citita_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[OFERTA] ALTER COLUMN [DataInceput] DATETIMEOFFSET NOT NULL;
ALTER TABLE [dbo].[OFERTA] ALTER COLUMN [DataSfarsit] DATETIMEOFFSET NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[PRODUS] ALTER COLUMN [DataProducere] DATETIMEOFFSET NULL;
ALTER TABLE [dbo].[PRODUS] ALTER COLUMN [DataExpirare] DATETIMEOFFSET NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[RECENZIE] DROP CONSTRAINT [RECENZIE_DataRecenzie_df];
ALTER TABLE [dbo].[RECENZIE] ALTER COLUMN [DataRecenzie] DATETIMEOFFSET NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[STOC] ALTER COLUMN [DataExpirare] DATETIMEOFFSET NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[UTILIZATOR] ADD [Activat] BIT NOT NULL CONSTRAINT [UTILIZATOR_Activat_df] DEFAULT 0,
[codExpiraLa] DATETIME2,
[codVerificare] NVARCHAR(10);

-- CreateIndex
ALTER TABLE [dbo].[COMANDA] ADD CONSTRAINT [COMANDA_IdClient_IdRestaurant_DataComanda_key] UNIQUE NONCLUSTERED ([IdClient], [IdRestaurant], [DataComanda]);

-- CreateIndex
ALTER TABLE [dbo].[COMANDA] ADD CONSTRAINT [COMANDA_NrComanda_DataComanda_key] UNIQUE NONCLUSTERED ([NrComanda], [DataComanda]);

-- CreateIndex
ALTER TABLE [dbo].[OFERTA] ADD CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataInceput_key] UNIQUE NONCLUSTERED ([IdProdus], [IdRestaurant], [DataInceput]);

-- CreateIndex
ALTER TABLE [dbo].[OFERTA] ADD CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataSfarsit_key] UNIQUE NONCLUSTERED ([IdProdus], [IdRestaurant], [DataSfarsit]);

-- CreateIndex
ALTER TABLE [dbo].[STOC] ADD CONSTRAINT [STOC_IdProdus_DataExpirare_key] UNIQUE NONCLUSTERED ([IdProdus], [DataExpirare]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
