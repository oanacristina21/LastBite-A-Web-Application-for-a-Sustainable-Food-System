BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UTILIZATOR] (
    [IdUtilizator] INT NOT NULL IDENTITY(1,1),
    [Email] NVARCHAR(255) NOT NULL,
    [Parola] NVARCHAR(255) NOT NULL,
    [Nr_Telefon] NVARCHAR(20) NOT NULL,
    [IdLocalitate] INT NOT NULL,
    CONSTRAINT [UTILIZATOR_pkey] PRIMARY KEY CLUSTERED ([IdUtilizator]),
    CONSTRAINT [UTILIZATOR_Email_key] UNIQUE NONCLUSTERED ([Email]),
    CONSTRAINT [UTILIZATOR_Nr_Telefon_key] UNIQUE NONCLUSTERED ([Nr_Telefon])
);

-- CreateTable
CREATE TABLE [dbo].[CLIENT] (
    [IdUtilizator] INT NOT NULL,
    [Nume] NVARCHAR(100) NOT NULL,
    [Prenume] NVARCHAR(100) NOT NULL,
    CONSTRAINT [CLIENT_pkey] PRIMARY KEY CLUSTERED ([IdUtilizator])
);

-- CreateTable
CREATE TABLE [dbo].[RESTAURANT] (
    [IdRestaurant] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(1000) NOT NULL,
    [Adresa] NVARCHAR(1000) NOT NULL,
    [IdUtilizator] INT NOT NULL,
    [IdLocalitate] INT NOT NULL,
    CONSTRAINT [RESTAURANT_pkey] PRIMARY KEY CLUSTERED ([IdRestaurant]),
    CONSTRAINT [RESTAURANT_IdUtilizator_key] UNIQUE NONCLUSTERED ([IdUtilizator])
);

-- CreateTable
CREATE TABLE [dbo].[COMANDA] (
    [IdComanda] INT NOT NULL IDENTITY(1,1),
    [NrComanda] NVARCHAR(50) NOT NULL,
    [DataComanda] DATETIME2 NOT NULL,
    [StatusComanda] NVARCHAR(50) NOT NULL,
    [AdresaColectare] NVARCHAR(255) NOT NULL,
    [IdClient] INT NOT NULL,
    [IdRestaurant] INT NOT NULL,
    CONSTRAINT [COMANDA_pkey] PRIMARY KEY CLUSTERED ([IdComanda]),
    CONSTRAINT [COMANDA_IdClient_IdRestaurant_DataComanda_key] UNIQUE NONCLUSTERED ([IdClient],[IdRestaurant],[DataComanda]),
    CONSTRAINT [COMANDA_NrComanda_DataComanda_key] UNIQUE NONCLUSTERED ([NrComanda],[DataComanda])
);

-- CreateTable
CREATE TABLE [dbo].[COMANDA_PRODUS] (
    [IdComandaProdus] INT NOT NULL IDENTITY(1,1),
    [IdComanda] INT NOT NULL,
    [IdProdus] INT NOT NULL,
    [CantitateComandata] INT NOT NULL,
    [PretFinal] DECIMAL(10,2),
    CONSTRAINT [COMANDA_PRODUS_pkey] PRIMARY KEY CLUSTERED ([IdComandaProdus])
);

-- CreateTable
CREATE TABLE [dbo].[PRODUS] (
    [IdProdus] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(200) NOT NULL,
    [Descriere] NVARCHAR(max),
    [Pret_Initial] DECIMAL(10,2) NOT NULL,
    [DataInregistrare] DATETIME2 NOT NULL,
    [DataProducere] DATE,
    [DataExpirare] DATE NOT NULL,
    [IdCategorie] INT NOT NULL,
    [IdRestaurant] INT NOT NULL,
    [Imagine] NVARCHAR(1000),
    CONSTRAINT [PRODUS_pkey] PRIMARY KEY CLUSTERED ([IdProdus]),
    CONSTRAINT [PRODUS_Denumire_IdRestaurant_key] UNIQUE NONCLUSTERED ([Denumire],[IdRestaurant])
);

-- CreateTable
CREATE TABLE [dbo].[OFERTA] (
    [IdOferta] INT NOT NULL IDENTITY(1,1),
    [DataInceput] DATE NOT NULL,
    [DataSfarsit] DATE NOT NULL,
    [Reducere] DECIMAL(5,2) NOT NULL,
    [IdProdus] INT NOT NULL,
    [IdRestaurant] INT NOT NULL,
    CONSTRAINT [OFERTA_pkey] PRIMARY KEY CLUSTERED ([IdOferta]),
    CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataInceput_key] UNIQUE NONCLUSTERED ([IdProdus],[IdRestaurant],[DataInceput]),
    CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataSfarsit_key] UNIQUE NONCLUSTERED ([IdProdus],[IdRestaurant],[DataSfarsit])
);

-- CreateTable
CREATE TABLE [dbo].[LOCALITATE] (
    [IdLocalitate] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(100) NOT NULL,
    [IdJudet] INT NOT NULL,
    CONSTRAINT [LOCALITATE_pkey] PRIMARY KEY CLUSTERED ([IdLocalitate])
);

-- CreateTable
CREATE TABLE [dbo].[JUDET] (
    [IdJudet] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(100) NOT NULL,
    CONSTRAINT [JUDET_pkey] PRIMARY KEY CLUSTERED ([IdJudet]),
    CONSTRAINT [JUDET_Denumire_key] UNIQUE NONCLUSTERED ([Denumire])
);

-- CreateTable
CREATE TABLE [dbo].[CATEGORIE] (
    [IdCategorie] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(100) NOT NULL,
    CONSTRAINT [CATEGORIE_pkey] PRIMARY KEY CLUSTERED ([IdCategorie]),
    CONSTRAINT [CATEGORIE_Denumire_key] UNIQUE NONCLUSTERED ([Denumire])
);

-- CreateTable
CREATE TABLE [dbo].[NOTIFICARE] (
    [IdNotificare] INT NOT NULL IDENTITY(1,1),
    [Mesaj] NVARCHAR(max) NOT NULL,
    [IdComanda] INT NOT NULL,
    [DataOraNotificare] DATETIME2 NOT NULL CONSTRAINT [NOTIFICARE_DataOraNotificare_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [NOTIFICARE_pkey] PRIMARY KEY CLUSTERED ([IdNotificare])
);

-- CreateTable
CREATE TABLE [dbo].[PLATA] (
    [IdPlata] INT NOT NULL IDENTITY(1,1),
    [SumaTotala] DECIMAL(10,2) NOT NULL,
    [MetodaPlata] NVARCHAR(50) NOT NULL,
    [Status_Plata] NVARCHAR(50) NOT NULL,
    [IdComanda] INT NOT NULL,
    CONSTRAINT [PLATA_pkey] PRIMARY KEY CLUSTERED ([IdPlata]),
    CONSTRAINT [PLATA_IdComanda_key] UNIQUE NONCLUSTERED ([IdComanda])
);

-- CreateTable
CREATE TABLE [dbo].[RECENZIE] (
    [IdRecenzie] INT NOT NULL IDENTITY(1,1),
    [MesajClient] NVARCHAR(max),
    [Rating] INT NOT NULL,
    [RaspunsRestaurant] NVARCHAR(max),
    [DataRecenzie] DATETIME2 NOT NULL CONSTRAINT [RECENZIE_DataRecenzie_df] DEFAULT CURRENT_TIMESTAMP,
    [IdComanda] INT NOT NULL,
    CONSTRAINT [RECENZIE_pkey] PRIMARY KEY CLUSTERED ([IdRecenzie]),
    CONSTRAINT [RECENZIE_IdComanda_key] UNIQUE NONCLUSTERED ([IdComanda])
);

-- CreateTable
CREATE TABLE [dbo].[PREFERINTE_DIETETICE] (
    [IdPreferintaDietetica] INT NOT NULL IDENTITY(1,1),
    [Denumire] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PREFERINTE_DIETETICE_pkey] PRIMARY KEY CLUSTERED ([IdPreferintaDietetica]),
    CONSTRAINT [PREFERINTE_DIETETICE_Denumire_key] UNIQUE NONCLUSTERED ([Denumire])
);

-- CreateTable
CREATE TABLE [dbo].[PRODUS_PREFERINTA] (
    [IdProdusPreferinta] INT NOT NULL IDENTITY(1,1),
    [IdProdus] INT NOT NULL,
    [IdPreferintaDietetica] INT NOT NULL,
    CONSTRAINT [PRODUS_PREFERINTA_pkey] PRIMARY KEY CLUSTERED ([IdProdusPreferinta]),
    CONSTRAINT [PRODUS_PREFERINTA_IdProdus_IdPreferintaDietetica_key] UNIQUE NONCLUSTERED ([IdProdus],[IdPreferintaDietetica])
);

-- CreateTable
CREATE TABLE [dbo].[STOC] (
    [IdStoc] INT NOT NULL IDENTITY(1,1),
    [Cant_Disp] INT NOT NULL,
    [DataExpirare] DATE NOT NULL,
    [IdProdus] INT NOT NULL,
    CONSTRAINT [STOC_pkey] PRIMARY KEY CLUSTERED ([IdStoc]),
    CONSTRAINT [STOC_IdProdus_DataExpirare_key] UNIQUE NONCLUSTERED ([IdProdus],[DataExpirare])
);

-- AddForeignKey
ALTER TABLE [dbo].[UTILIZATOR] ADD CONSTRAINT [UTILIZATOR_IdLocalitate_fkey] FOREIGN KEY ([IdLocalitate]) REFERENCES [dbo].[LOCALITATE]([IdLocalitate]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CLIENT] ADD CONSTRAINT [CLIENT_IdUtilizator_fkey] FOREIGN KEY ([IdUtilizator]) REFERENCES [dbo].[UTILIZATOR]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RESTAURANT] ADD CONSTRAINT [RESTAURANT_IdUtilizator_fkey] FOREIGN KEY ([IdUtilizator]) REFERENCES [dbo].[UTILIZATOR]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RESTAURANT] ADD CONSTRAINT [RESTAURANT_IdLocalitate_fkey] FOREIGN KEY ([IdLocalitate]) REFERENCES [dbo].[LOCALITATE]([IdLocalitate]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[COMANDA] ADD CONSTRAINT [COMANDA_IdClient_fkey] FOREIGN KEY ([IdClient]) REFERENCES [dbo].[CLIENT]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[COMANDA] ADD CONSTRAINT [COMANDA_IdRestaurant_fkey] FOREIGN KEY ([IdRestaurant]) REFERENCES [dbo].[RESTAURANT]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[COMANDA_PRODUS] ADD CONSTRAINT [COMANDA_PRODUS_IdComanda_fkey] FOREIGN KEY ([IdComanda]) REFERENCES [dbo].[COMANDA]([IdComanda]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[COMANDA_PRODUS] ADD CONSTRAINT [COMANDA_PRODUS_IdProdus_fkey] FOREIGN KEY ([IdProdus]) REFERENCES [dbo].[PRODUS]([IdProdus]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PRODUS] ADD CONSTRAINT [PRODUS_IdCategorie_fkey] FOREIGN KEY ([IdCategorie]) REFERENCES [dbo].[CATEGORIE]([IdCategorie]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PRODUS] ADD CONSTRAINT [PRODUS_IdRestaurant_fkey] FOREIGN KEY ([IdRestaurant]) REFERENCES [dbo].[RESTAURANT]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OFERTA] ADD CONSTRAINT [OFERTA_IdProdus_fkey] FOREIGN KEY ([IdProdus]) REFERENCES [dbo].[PRODUS]([IdProdus]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OFERTA] ADD CONSTRAINT [OFERTA_IdRestaurant_fkey] FOREIGN KEY ([IdRestaurant]) REFERENCES [dbo].[RESTAURANT]([IdUtilizator]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[LOCALITATE] ADD CONSTRAINT [LOCALITATE_IdJudet_fkey] FOREIGN KEY ([IdJudet]) REFERENCES [dbo].[JUDET]([IdJudet]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[NOTIFICARE] ADD CONSTRAINT [NOTIFICARE_IdComanda_fkey] FOREIGN KEY ([IdComanda]) REFERENCES [dbo].[COMANDA]([IdComanda]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PLATA] ADD CONSTRAINT [PLATA_IdComanda_fkey] FOREIGN KEY ([IdComanda]) REFERENCES [dbo].[COMANDA]([IdComanda]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RECENZIE] ADD CONSTRAINT [RECENZIE_IdComanda_fkey] FOREIGN KEY ([IdComanda]) REFERENCES [dbo].[COMANDA]([IdComanda]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PRODUS_PREFERINTA] ADD CONSTRAINT [PRODUS_PREFERINTA_IdProdus_fkey] FOREIGN KEY ([IdProdus]) REFERENCES [dbo].[PRODUS]([IdProdus]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PRODUS_PREFERINTA] ADD CONSTRAINT [PRODUS_PREFERINTA_IdPreferintaDietetica_fkey] FOREIGN KEY ([IdPreferintaDietetica]) REFERENCES [dbo].[PREFERINTE_DIETETICE]([IdPreferintaDietetica]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[STOC] ADD CONSTRAINT [STOC_IdProdus_fkey] FOREIGN KEY ([IdProdus]) REFERENCES [dbo].[PRODUS]([IdProdus]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
