USE [master]
GO
/****** Object:  Database [LastBite]    Script Date: 7/6/2025 10:03:08 PM ******/
CREATE DATABASE [LastBite]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LastBite', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\LastBite.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LastBite_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\LastBite_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [LastBite] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LastBite].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LastBite] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LastBite] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LastBite] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LastBite] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LastBite] SET ARITHABORT OFF 
GO
ALTER DATABASE [LastBite] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LastBite] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LastBite] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LastBite] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LastBite] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LastBite] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LastBite] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LastBite] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LastBite] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LastBite] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LastBite] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LastBite] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LastBite] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LastBite] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LastBite] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LastBite] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LastBite] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LastBite] SET RECOVERY FULL 
GO
ALTER DATABASE [LastBite] SET  MULTI_USER 
GO
ALTER DATABASE [LastBite] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LastBite] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LastBite] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LastBite] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LastBite] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [LastBite] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'LastBite', N'ON'
GO
ALTER DATABASE [LastBite] SET QUERY_STORE = OFF
GO
USE [LastBite]
GO
/****** Object:  Table [dbo].[_prisma_migrations]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[_prisma_migrations](
	[id] [varchar](36) NOT NULL,
	[checksum] [varchar](64) NOT NULL,
	[finished_at] [datetimeoffset](7) NULL,
	[migration_name] [nvarchar](250) NOT NULL,
	[logs] [nvarchar](max) NULL,
	[rolled_back_at] [datetimeoffset](7) NULL,
	[started_at] [datetimeoffset](7) NOT NULL,
	[applied_steps_count] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ADMIN]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ADMIN](
	[IdAdmin] [int] IDENTITY(1,1) NOT NULL,
	[IdUtilizator] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[IdAdmin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CATEGORIE]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CATEGORIE](
	[IdCategorie] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](100) NOT NULL,
 CONSTRAINT [CATEGORIE_pkey] PRIMARY KEY CLUSTERED 
(
	[IdCategorie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLIENT]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLIENT](
	[IdUtilizator] [int] NOT NULL,
	[Nume] [nvarchar](100) NOT NULL,
	[Prenume] [nvarchar](100) NOT NULL,
 CONSTRAINT [CLIENT_pkey] PRIMARY KEY CLUSTERED 
(
	[IdUtilizator] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[COMANDA]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[COMANDA](
	[IdComanda] [int] IDENTITY(1,1) NOT NULL,
	[NrComanda] [nvarchar](50) NOT NULL,
	[DataComanda] [datetimeoffset](7) NOT NULL,
	[StatusComanda] [nvarchar](50) NOT NULL,
	[AdresaColectare] [nvarchar](255) NOT NULL,
	[IdClient] [int] NOT NULL,
	[IdRestaurant] [int] NOT NULL,
	[CodRidicare] [nvarchar](100) NULL,
 CONSTRAINT [COMANDA_pkey] PRIMARY KEY CLUSTERED 
(
	[IdComanda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[COMANDA_PRODUS]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[COMANDA_PRODUS](
	[IdComandaProdus] [int] IDENTITY(1,1) NOT NULL,
	[IdComanda] [int] NOT NULL,
	[IdProdus] [int] NOT NULL,
	[CantitateComandata] [int] NOT NULL,
	[PretFinal] [decimal](10, 2) NULL,
 CONSTRAINT [COMANDA_PRODUS_pkey] PRIMARY KEY CLUSTERED 
(
	[IdComandaProdus] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[JUDET]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JUDET](
	[IdJudet] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](100) NOT NULL,
 CONSTRAINT [JUDET_pkey] PRIMARY KEY CLUSTERED 
(
	[IdJudet] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LOCALITATE]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LOCALITATE](
	[IdLocalitate] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](100) NOT NULL,
	[IdJudet] [int] NOT NULL,
 CONSTRAINT [LOCALITATE_pkey] PRIMARY KEY CLUSTERED 
(
	[IdLocalitate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NOTIFICARE]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTIFICARE](
	[IdNotificare] [int] IDENTITY(1,1) NOT NULL,
	[Mesaj] [nvarchar](max) NOT NULL,
	[IdComanda] [int] NOT NULL,
	[DataOraNotificare] [datetimeoffset](7) NOT NULL,
	[Destinatar] [nvarchar](50) NULL,
	[Citita] [bit] NOT NULL,
 CONSTRAINT [NOTIFICARE_pkey] PRIMARY KEY CLUSTERED 
(
	[IdNotificare] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OFERTA]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OFERTA](
	[IdOferta] [int] IDENTITY(1,1) NOT NULL,
	[DataInceput] [datetimeoffset](7) NOT NULL,
	[DataSfarsit] [datetimeoffset](7) NOT NULL,
	[Reducere] [decimal](5, 2) NOT NULL,
	[IdProdus] [int] NOT NULL,
	[IdRestaurant] [int] NOT NULL,
 CONSTRAINT [OFERTA_pkey] PRIMARY KEY CLUSTERED 
(
	[IdOferta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PLATA]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PLATA](
	[IdPlata] [int] IDENTITY(1,1) NOT NULL,
	[SumaTotala] [decimal](10, 2) NOT NULL,
	[MetodaPlata] [nvarchar](50) NOT NULL,
	[Status_Plata] [nvarchar](50) NOT NULL,
	[IdComanda] [int] NOT NULL,
	[StripePaymentId] [nvarchar](255) NULL,
	[StripeSessionId] [nvarchar](255) NULL,
 CONSTRAINT [PLATA_pkey] PRIMARY KEY CLUSTERED 
(
	[IdPlata] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PREFERINTE_DIETETICE]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PREFERINTE_DIETETICE](
	[IdPreferintaDietetica] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](100) NOT NULL,
 CONSTRAINT [PREFERINTE_DIETETICE_pkey] PRIMARY KEY CLUSTERED 
(
	[IdPreferintaDietetica] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRODUS]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRODUS](
	[IdProdus] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](200) NOT NULL,
	[Descriere] [nvarchar](max) NULL,
	[Pret_Initial] [decimal](10, 2) NOT NULL,
	[DataInregistrare] [datetime2](7) NOT NULL,
	[DataProducere] [datetimeoffset](7) NULL,
	[DataExpirare] [datetimeoffset](7) NOT NULL,
	[IdCategorie] [int] NOT NULL,
	[IdRestaurant] [int] NOT NULL,
	[Imagine] [nvarchar](255) NULL,
 CONSTRAINT [PRODUS_pkey] PRIMARY KEY CLUSTERED 
(
	[IdProdus] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRODUS_PREFERINTA]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRODUS_PREFERINTA](
	[IdProdusPreferinta] [int] IDENTITY(1,1) NOT NULL,
	[IdProdus] [int] NOT NULL,
	[IdPreferintaDietetica] [int] NOT NULL,
 CONSTRAINT [PRODUS_PREFERINTA_pkey] PRIMARY KEY CLUSTERED 
(
	[IdProdusPreferinta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RECENZIE]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RECENZIE](
	[IdRecenzie] [int] IDENTITY(1,1) NOT NULL,
	[MesajClient] [nvarchar](max) NULL,
	[Rating] [int] NOT NULL,
	[RaspunsRestaurant] [nvarchar](max) NULL,
	[DataRecenzie] [datetimeoffset](7) NOT NULL,
	[IdComanda] [int] NOT NULL,
 CONSTRAINT [RECENZIE_pkey] PRIMARY KEY CLUSTERED 
(
	[IdRecenzie] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RESTAURANT]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RESTAURANT](
	[IdRestaurant] [int] IDENTITY(1,1) NOT NULL,
	[Denumire] [nvarchar](1000) NOT NULL,
	[Adresa] [nvarchar](1000) NOT NULL,
	[IdUtilizator] [int] NOT NULL,
	[IdLocalitate] [int] NOT NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
 CONSTRAINT [RESTAURANT_pkey] PRIMARY KEY CLUSTERED 
(
	[IdRestaurant] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[STOC]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[STOC](
	[IdStoc] [int] IDENTITY(1,1) NOT NULL,
	[Cant_Disp] [int] NOT NULL,
	[IdProdus] [int] NOT NULL,
	[DataValab] [datetimeoffset](7) NOT NULL,
 CONSTRAINT [STOC_pkey] PRIMARY KEY CLUSTERED 
(
	[IdStoc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UTILIZATOR]    Script Date: 7/6/2025 10:03:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UTILIZATOR](
	[IdUtilizator] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Parola] [nvarchar](255) NOT NULL,
	[Nr_Telefon] [nvarchar](20) NOT NULL,
	[IdLocalitate] [int] NOT NULL,
	[passwordResetExpires] [datetime] NULL,
	[passwordResetToken] [nvarchar](255) NULL,
 CONSTRAINT [UTILIZATOR_pkey] PRIMARY KEY CLUSTERED 
(
	[IdUtilizator] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'29e2ba22-b69e-4ae6-b18a-b4142854d120', N'26241035ae77b08b1cb2512dd61d8dafaa63479ccac250995310d594c77fb75d', CAST(N'2025-06-16T17:38:13.2008414+00:00' AS DateTimeOffset), N'20250609175547_add_destinatar_column', NULL, NULL, CAST(N'2025-06-16T17:38:13.1956769+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'32d6d127-85ce-4e99-89bc-6cdd0aee76cc', N'080f2a53a280aeb64a2ba3c9791def5284666b9e5eb54259ac9f8ff24a38a575', CAST(N'2025-06-16T17:38:13.1769753+00:00' AS DateTimeOffset), N'20250527224106_init', NULL, NULL, CAST(N'2025-06-16T17:38:13.1445768+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'34688a2f-08a2-4882-b234-c146f66019e3', N'27b8bf0b81efc6e82bdd8c164058a78500e31366f87957f2efe982b49c1abaf9', CAST(N'2025-06-16T17:38:13.1870074+00:00' AS DateTimeOffset), N'20250607154253_adauga_campuri_resetare_parola', NULL, NULL, CAST(N'2025-06-16T17:38:13.1837365+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'44b0a3dc-5367-4498-8346-8b81c4ff44c6', N'17fd2fb1e27fc75c4481392b76e29974d5c981f4eaa1c1f3b97f38316b51b386', CAST(N'2025-06-16T17:38:13.1951619+00:00' AS DateTimeOffset), N'20250608110615_comanda', NULL, NULL, CAST(N'2025-06-16T17:38:13.1915163+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'5ae1393b-e1ff-4026-a26a-79b4e99e6fab', N'2c5fcff4eefc4aa56b40df392a652256ff8bf0aeb2e2dcc6144888a9934f6a9a', CAST(N'2025-06-16T17:38:13.1910862+00:00' AS DateTimeOffset), N'20250608103629_actualizare', NULL, NULL, CAST(N'2025-06-16T17:38:13.1874750+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'c15a113f-55ae-4185-91a3-cd7b8de02c38', N'4faf7e486242d22773aeee681f56fb3c69b86399d5caa43440fcc0b78e8bf8b3', CAST(N'2025-06-16T17:38:13.2263345+00:00' AS DateTimeOffset), N'20250615133400_adauga_campuri_verificare', NULL, NULL, CAST(N'2025-06-16T17:38:13.2013911+00:00' AS DateTimeOffset), 1)
INSERT [dbo].[_prisma_migrations] ([id], [checksum], [finished_at], [migration_name], [logs], [rolled_back_at], [started_at], [applied_steps_count]) VALUES (N'fe492677-948b-47af-a496-ac2a9fd9a69e', N'c0a1b779069210442e8fb774096ec6bae8ecec9adda224c1deb3d3b299a7d122', CAST(N'2025-06-16T17:38:13.1832547+00:00' AS DateTimeOffset), N'20250527233207_adauga_camp_imagine', NULL, NULL, CAST(N'2025-06-16T17:38:13.1788699+00:00' AS DateTimeOffset), 1)
GO
SET IDENTITY_INSERT [dbo].[ADMIN] ON 

INSERT [dbo].[ADMIN] ([IdAdmin], [IdUtilizator]) VALUES (1, 2)
SET IDENTITY_INSERT [dbo].[ADMIN] OFF
GO
SET IDENTITY_INSERT [dbo].[CATEGORIE] ON 

INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (4, N'Bauturi')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (6, N'Burger')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (7, N'Deserturi')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (3, N'Fructe si Legume')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (8, N'Mic Dejun')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (5, N'Pizza')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (2, N'Produse de cofetarie')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (10, N'Salate')
INSERT [dbo].[CATEGORIE] ([IdCategorie], [Denumire]) VALUES (9, N'Supe/Ciorbe')
SET IDENTITY_INSERT [dbo].[CATEGORIE] OFF
GO
INSERT [dbo].[CLIENT] ([IdUtilizator], [Nume], [Prenume]) VALUES (2, N'Mihail', N'Cristina')
INSERT [dbo].[CLIENT] ([IdUtilizator], [Nume], [Prenume]) VALUES (3, N'Mihail', N'Nicoleta')
GO
SET IDENTITY_INSERT [dbo].[COMANDA] ON 

INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1, N'CMD-1750101408753', CAST(N'2025-06-16T19:16:48.7530000+00:00' AS DateTimeOffset), N'Anulata', N'Strada Exemplu', 3, 1, N'RID-OTTA0WSHZ')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (2, N'CMD-1750101453618', CAST(N'2025-06-16T19:17:33.6180000+00:00' AS DateTimeOffset), N'Anulata', N'Strada Exemplu', 3, 1, N'RID-K930G7EPT')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (3, N'CMD-1750102115028', CAST(N'2025-06-16T19:28:35.0280000+00:00' AS DateTimeOffset), N'Finalizata', N'Strada Exemplu', 3, 1, N'RID-4QJAMQZ1W')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (4, N'CMD-1750250262691', CAST(N'2025-06-18T12:37:42.6910000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-0BWPXZDD2')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1005, N'CMD-1750340699266', CAST(N'2025-06-19T13:44:59.2660000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-MRGI8HWBE')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1006, N'CMD-1750517354203', CAST(N'2025-06-21T14:49:14.2030000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-QB70SS2EO')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1007, N'CMD-1750517376382', CAST(N'2025-06-21T14:49:36.3820000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-EKZLOURQE')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1008, N'CMD-1750517728124', CAST(N'2025-06-21T14:55:28.1240000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-E9RMFMRQ4')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1009, N'CMD-1750518890220', CAST(N'2025-06-21T15:14:50.2200000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-JFGONGT3V')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1010, N'CMD-1750518898244', CAST(N'2025-06-21T15:14:58.2440000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-N27PN4C5U')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1011, N'CMD-1750518997122', CAST(N'2025-06-21T15:16:37.1220000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-2VU7S3AR6')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1012, N'CMD-1750520410852', CAST(N'2025-06-21T15:40:10.8520000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-L6N4HUUET')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1013, N'CMD-1750587130842', CAST(N'2025-06-22T10:12:10.8420000+00:00' AS DateTimeOffset), N'Finalizata', N'Soseaua Constantei, nr 81', 3, 2, N'RID-NE8JRMEFK')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1014, N'CMD-1751444750124', CAST(N'2025-07-02T08:25:50.1240000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-B81PWUH9U')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1015, N'CMD-1751446782182', CAST(N'2025-07-02T08:59:42.1820000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-L8D1O40RP')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1016, N'CMD-1751457414331', CAST(N'2025-07-02T11:56:54.3310000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-DHY63LEY7')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1017, N'CMD-1751460562436', CAST(N'2025-07-02T12:49:22.4360000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-KI27TWCLG')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1018, N'CMD-1751544601925', CAST(N'2025-07-03T12:10:01.9250000+00:00' AS DateTimeOffset), N'Anulata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-UU0WEXNN6')
INSERT [dbo].[COMANDA] ([IdComanda], [NrComanda], [DataComanda], [StatusComanda], [AdresaColectare], [IdClient], [IdRestaurant], [CodRidicare]) VALUES (1019, N'CMD-1751740329951', CAST(N'2025-07-05T18:32:09.9510000+00:00' AS DateTimeOffset), N'Finalizata', N'Piata Ovidiu, Nr. 7', 3, 1, N'RID-8LT66JKKX')
SET IDENTITY_INSERT [dbo].[COMANDA] OFF
GO
SET IDENTITY_INSERT [dbo].[COMANDA_PRODUS] ON 

INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1, 3, 1, 1, CAST(30.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (2, 4, 1, 1, CAST(42.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1002, 1005, 2, 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1003, 1011, 1, 3, CAST(40.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1004, 1012, 1, 1, CAST(40.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1005, 1013, 3, 2, CAST(13.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1006, 1014, 4, 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1007, 1015, 2, 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1008, 1015, 4, 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1009, 1016, 2, 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1010, 1016, 4, 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1011, 1017, 4, 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1012, 1018, 2, 1, CAST(2.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1013, 1018, 5, 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[COMANDA_PRODUS] ([IdComandaProdus], [IdComanda], [IdProdus], [CantitateComandata], [PretFinal]) VALUES (1014, 1019, 1, 1, CAST(30.00 AS Decimal(10, 2)))
SET IDENTITY_INSERT [dbo].[COMANDA_PRODUS] OFF
GO
SET IDENTITY_INSERT [dbo].[JUDET] ON 

INSERT [dbo].[JUDET] ([IdJudet], [Denumire]) VALUES (1, N'Constanta')
SET IDENTITY_INSERT [dbo].[JUDET] OFF
GO
SET IDENTITY_INSERT [dbo].[LOCALITATE] ON 

INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (1, N'Constanta', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (2, N'Mangalia', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (3, N'Medgidia', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (4, N'Navodari', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (5, N'Cernavoda', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (6, N'Ovidiu', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (7, N'Murfatlar', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (8, N'Eforie Nord', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (9, N'Eforie Sud', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (10, N'Techirghiol', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (11, N'Costinesti', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (12, N'2 Mai', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (13, N'Vama Veche', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (14, N'Lumina', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (15, N'Valu lui Traian', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (16, N'Cumpana', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (17, N'Agigea', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (18, N'Poarta Alba', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (19, N'Mihail Kogalniceanu', 1)
INSERT [dbo].[LOCALITATE] ([IdLocalitate], [Denumire], [IdJudet]) VALUES (20, N'Lazu', 1)
SET IDENTITY_INSERT [dbo].[LOCALITATE] OFF
GO
SET IDENTITY_INSERT [dbo].[NOTIFICARE] ON 

INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1, N'Ai primit o nouă comandă cu ID-ul CMD-1750101408753.', 1, CAST(N'2025-06-16T19:16:48.7600000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (2, N'Comanda ta cu numărul CMD-1750101408753 a fost plasată cu succes.', 1, CAST(N'2025-06-16T19:16:48.7600000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (3, N'Ai primit o nouă comandă cu ID-ul CMD-1750101453618.', 2, CAST(N'2025-06-16T19:17:33.6220000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (4, N'Comanda ta cu numărul CMD-1750101453618 a fost plasată cu succes.', 2, CAST(N'2025-06-16T19:17:33.6220000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (5, N'Comanda ta cu numărul CMD-1750101453618 a fost anulată.', 2, CAST(N'2025-06-16T19:26:45.6020000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (6, N'Comanda ta cu numărul CMD-1750101408753 a fost anulată.', 1, CAST(N'2025-06-16T19:26:48.6140000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (7, N'Ai primit o nouă comandă cu ID-ul CMD-1750102115028.', 3, CAST(N'2025-06-16T19:28:35.0340000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (8, N'Comanda ta cu numărul CMD-1750102115028 a fost plasată cu succes.', 3, CAST(N'2025-06-16T19:28:35.0340000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (9, N'Comanda ta cu numărul CMD-1750102115028 a fost confirmată de restaurant.', 3, CAST(N'2025-06-16T20:31:46.2600000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (10, N'Comanda ta cu numărul CMD-1750102115028 este în pregătire.', 3, CAST(N'2025-06-16T20:31:56.4610000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (11, N'Comanda ta cu numărul CMD-1750102115028 este gata de ridicat. Cod ridicare: RID-4QJAMQZ1W', 3, CAST(N'2025-06-16T20:31:57.7700000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (12, N'Comanda ta cu ID-ul CMD-1750102115028 a fost finalizată.', 3, CAST(N'2025-06-16T20:32:23.1220000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (13, N'Comanda CMD-1750102115028 a fost finalizată cu succes.', 3, CAST(N'2025-06-16T20:32:23.1220000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (14, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 3, CAST(N'2025-06-16T20:32:50.2400000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (15, N'Ai primit o nouă comandă cu ID-ul CMD-1750250262691.', 4, CAST(N'2025-06-18T12:37:42.7010000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (16, N'Comanda ta cu numărul CMD-1750250262691 a fost plasată cu succes.', 4, CAST(N'2025-06-18T12:37:42.7010000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1015, N'Ai primit o nouă comandă cu ID-ul CMD-1750340699266.', 1005, CAST(N'2025-06-19T13:44:59.2730000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1016, N'Comanda ta cu numărul CMD-1750340699266 a fost plasată cu succes.', 1005, CAST(N'2025-06-19T13:44:59.2730000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1017, N'Comanda ta cu numărul CMD-1750250262691 a fost anulată.', 4, CAST(N'2025-06-19T16:05:22.2660000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1018, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 3, CAST(N'2025-06-19T17:27:15.3460000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1019, N'Restaurantul Pizzico Restaurant a răspuns la recenzia ta: „Ne bucuram sa auzim asta!”', 3, CAST(N'2025-06-19T19:15:03.2720000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1020, N'Comanda ta cu numărul CMD-1750340699266 a fost confirmată de restaurant.', 1005, CAST(N'2025-06-20T07:00:13.2560000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1021, N'Comanda ta cu numărul CMD-1750340699266 este în pregătire.', 1005, CAST(N'2025-06-20T07:00:16.3300000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1022, N'Comanda ta cu numărul CMD-1750340699266 este gata de ridicat. Cod ridicare: RID-MRGI8HWBE', 1005, CAST(N'2025-06-20T07:00:18.4620000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1023, N'Comanda ta cu ID-ul CMD-1750340699266 a fost finalizată.', 1005, CAST(N'2025-06-20T08:45:07.9260000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1024, N'Comanda CMD-1750340699266 a fost finalizată cu succes.', 1005, CAST(N'2025-06-20T08:45:07.9260000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1025, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 1005, CAST(N'2025-06-20T08:46:29.1680000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1026, N'Restaurantul Pizzico Restaurant a răspuns la recenzia ta: „Ne bucuram sa auzim.”', 1005, CAST(N'2025-06-20T08:46:43.6460000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1027, N'Ai primit o nouă comandă cu ID-ul CMD-1750517354203.', 1006, CAST(N'2025-06-21T14:49:14.2330000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1028, N'Comanda ta cu numărul CMD-1750517354203 a fost plasată cu succes.', 1006, CAST(N'2025-06-21T14:49:14.2330000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1029, N'Ai primit o nouă comandă cu ID-ul CMD-1750517376382.', 1007, CAST(N'2025-06-21T14:49:36.3920000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1030, N'Comanda ta cu numărul CMD-1750517376382 a fost plasată cu succes.', 1007, CAST(N'2025-06-21T14:49:36.3920000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1031, N'Ai primit o nouă comandă cu ID-ul CMD-1750517728124.', 1008, CAST(N'2025-06-21T14:55:28.2540000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1032, N'Comanda ta cu numărul CMD-1750517728124 a fost plasată cu succes.', 1008, CAST(N'2025-06-21T14:55:28.2540000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1033, N'Ai primit o nouă comandă cu ID-ul CMD-1750518890220.', 1009, CAST(N'2025-06-21T15:14:50.2690000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1034, N'Comanda ta cu numărul CMD-1750518890220 a fost plasată cu succes.', 1009, CAST(N'2025-06-21T15:14:50.2690000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1035, N'Ai primit o nouă comandă cu ID-ul CMD-1750518898244.', 1010, CAST(N'2025-06-21T15:14:58.2520000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1036, N'Comanda ta cu numărul CMD-1750518898244 a fost plasată cu succes.', 1010, CAST(N'2025-06-21T15:14:58.2520000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1037, N'Ai primit o nouă comandă cu ID-ul CMD-1750518997122.', 1011, CAST(N'2025-06-21T15:16:37.1460000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1038, N'Comanda ta cu numărul CMD-1750518997122 a fost plasată cu succes.', 1011, CAST(N'2025-06-21T15:16:37.1460000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1039, N'Ai primit o nouă comandă cu ID-ul CMD-1750520410852.', 1012, CAST(N'2025-06-21T15:40:10.8760000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1040, N'Comanda ta cu numărul CMD-1750520410852 a fost plasată cu succes.', 1012, CAST(N'2025-06-21T15:40:10.8760000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1041, N'Ai primit o nouă comandă cu ID-ul CMD-1750587130842.', 1013, CAST(N'2025-06-22T10:12:10.8550000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1042, N'Comanda ta cu numărul CMD-1750587130842 a fost plasată cu succes.', 1013, CAST(N'2025-06-22T10:12:10.8550000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1043, N'Comanda ta cu numărul CMD-1750587130842 a fost confirmată de restaurant.', 1013, CAST(N'2025-06-22T10:13:49.8390000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1044, N'Comanda ta cu numărul CMD-1750587130842 este în pregătire.', 1013, CAST(N'2025-06-22T10:13:54.1390000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1045, N'Comanda ta cu numărul CMD-1750587130842 este gata de ridicat. Cod ridicare: RID-NE8JRMEFK', 1013, CAST(N'2025-06-22T10:13:56.9450000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1046, N'Comanda ta cu ID-ul CMD-1750587130842 a fost finalizată.', 1013, CAST(N'2025-06-22T10:14:18.8430000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1047, N'Comanda CMD-1750587130842 a fost finalizată cu succes.', 1013, CAST(N'2025-06-22T10:14:18.8430000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1048, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 1013, CAST(N'2025-06-22T10:17:04.4010000+00:00' AS DateTimeOffset), N'restaurant', 0)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1049, N'Ai primit o nouă comandă cu ID-ul CMD-1751444750124.', 1014, CAST(N'2025-07-02T08:25:50.1540000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1050, N'Comanda ta cu numărul CMD-1751444750124 a fost plasată cu succes.', 1014, CAST(N'2025-07-02T08:25:50.1540000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1051, N'Comanda ta cu numărul CMD-1751444750124 a fost confirmată de restaurant.', 1014, CAST(N'2025-07-02T08:33:23.6460000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1052, N'Comanda ta cu numărul CMD-1751444750124 este în pregătire.', 1014, CAST(N'2025-07-02T08:33:25.8770000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1053, N'Comanda ta cu numărul CMD-1751444750124 este gata de ridicat. Cod ridicare: RID-B81PWUH9U', 1014, CAST(N'2025-07-02T08:33:27.4890000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1054, N'Comanda ta cu numărul CMD-1751444750124 a fost finalizată. Mulțumim că ai folosit serviciile noastre!', 1014, CAST(N'2025-07-02T08:52:20.3870000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1055, N'Comanda ta cu numărul CMD-1750520410852 a fost finalizată. Mulțumim că ai folosit serviciile noastre!', 1012, CAST(N'2025-07-02T08:52:25.1290000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1056, N'Ai primit o nouă comandă cu ID-ul CMD-1751446782182.', 1015, CAST(N'2025-07-02T08:59:42.2260000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1057, N'Comanda ta cu numărul CMD-1751446782182 a fost plasată cu succes.', 1015, CAST(N'2025-07-02T08:59:42.2260000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1058, N'Comanda ta cu numărul CMD-1751446782182 a fost confirmată de restaurant.', 1015, CAST(N'2025-07-02T09:01:08.0160000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1059, N'Comanda ta cu numărul CMD-1751446782182 este în pregătire.', 1015, CAST(N'2025-07-02T09:01:11.3000000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1060, N'Comanda ta cu numărul CMD-1751446782182 este gata de ridicat. Cod ridicare: RID-L8D1O40RP', 1015, CAST(N'2025-07-02T09:01:14.2060000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1061, N'Comanda ta cu ID-ul CMD-1751446782182 a fost finalizată.', 1015, CAST(N'2025-07-02T09:01:33.7630000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1062, N'Comanda CMD-1751446782182 a fost finalizată cu succes.', 1015, CAST(N'2025-07-02T09:01:33.7630000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1063, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 1015, CAST(N'2025-07-02T09:02:32.9200000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1064, N'Restaurantul Pizzico Restaurant a răspuns la recenzia ta: „ne bucuram sa auzim asta”', 1015, CAST(N'2025-07-02T09:03:25.0660000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1065, N'Ai primit o nouă comandă cu ID-ul CMD-1751457414331.', 1016, CAST(N'2025-07-02T11:56:54.3570000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1066, N'Comanda ta cu numărul CMD-1751457414331 a fost plasată cu succes.', 1016, CAST(N'2025-07-02T11:56:54.3570000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1067, N'Ai primit o nouă comandă cu ID-ul CMD-1751460562436.', 1017, CAST(N'2025-07-02T12:49:22.4870000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1068, N'Comanda ta cu numărul CMD-1751460562436 a fost plasată cu succes.', 1017, CAST(N'2025-07-02T12:49:22.4870000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1069, N'Comanda ta cu numărul CMD-1751460562436 a fost confirmată de restaurant.', 1017, CAST(N'2025-07-02T12:51:33.9290000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1070, N'Comanda ta cu numărul CMD-1751460562436 este în pregătire.', 1017, CAST(N'2025-07-02T12:51:46.2440000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1071, N'Comanda ta cu numărul CMD-1751460562436 este gata de ridicat. Cod ridicare: RID-KI27TWCLG', 1017, CAST(N'2025-07-02T12:51:50.3730000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1072, N'Comanda ta cu ID-ul CMD-1751460562436 a fost finalizată.', 1017, CAST(N'2025-07-02T12:52:31.5140000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1073, N'Comanda CMD-1751460562436 a fost finalizată cu succes.', 1017, CAST(N'2025-07-02T12:52:31.5140000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1074, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 1017, CAST(N'2025-07-02T12:53:36.2650000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1075, N'Restaurantul Pizzico Restaurant a răspuns la recenzia ta: „ne bucuram sa auzim.”', 1017, CAST(N'2025-07-02T12:54:03.9270000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1076, N'Comanda CMD-1750517354203 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1006, CAST(N'2025-07-03T10:06:34.2140000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1077, N'Comanda CMD-1750517376382 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1007, CAST(N'2025-07-03T10:06:34.2250000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1078, N'Comanda CMD-1750517728124 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1008, CAST(N'2025-07-03T10:06:34.2320000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1079, N'Comanda CMD-1750518890220 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1009, CAST(N'2025-07-03T10:06:34.2420000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1080, N'Comanda CMD-1750518898244 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1010, CAST(N'2025-07-03T10:06:34.2490000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1081, N'Comanda CMD-1750518997122 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1011, CAST(N'2025-07-03T10:06:34.2750000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1082, N'Comanda CMD-1751457414331 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1016, CAST(N'2025-07-03T10:06:34.2820000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1083, N'Ai primit o nouă comandă cu ID-ul CMD-1751544601925.', 1018, CAST(N'2025-07-03T12:10:01.9430000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1084, N'Comanda ta cu numărul CMD-1751544601925 a fost plasată cu succes.', 1018, CAST(N'2025-07-03T12:10:01.9430000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1085, N'Comanda CMD-1751544601925 a fost anulată automat pentru că nu a fost confirmată în 30 de minute.', 1018, CAST(N'2025-07-03T12:42:41.5390000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1086, N'Ai primit o nouă comandă cu ID-ul CMD-1751740329951.', 1019, CAST(N'2025-07-05T18:32:09.9770000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1087, N'Comanda ta cu numărul CMD-1751740329951 a fost plasată cu succes.', 1019, CAST(N'2025-07-05T18:32:09.9770000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1088, N'Comanda ta cu numărul CMD-1751740329951 a fost confirmată de restaurant.', 1019, CAST(N'2025-07-05T18:32:51.5830000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1089, N'Comanda ta cu numărul CMD-1751740329951 este în pregătire.', 1019, CAST(N'2025-07-05T18:32:54.0660000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1090, N'Comanda ta cu numărul CMD-1751740329951 este gata de ridicat. Cod ridicare: RID-8LT66JKKX', 1019, CAST(N'2025-07-05T18:32:55.6040000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1091, N'Comanda ta cu ID-ul CMD-1751740329951 a fost finalizată.', 1019, CAST(N'2025-07-05T18:33:25.2940000+00:00' AS DateTimeOffset), N'client', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1092, N'Comanda CMD-1751740329951 a fost finalizată cu succes.', 1019, CAST(N'2025-07-05T18:33:25.2940000+00:00' AS DateTimeOffset), N'restaurant', 1)
INSERT [dbo].[NOTIFICARE] ([IdNotificare], [Mesaj], [IdComanda], [DataOraNotificare], [Destinatar], [Citita]) VALUES (1093, N'Ai primit o recenzie nouă de la Nicoleta Mihail.', 1019, CAST(N'2025-07-05T18:33:54.8290000+00:00' AS DateTimeOffset), N'restaurant', 0)
SET IDENTITY_INSERT [dbo].[NOTIFICARE] OFF
GO
SET IDENTITY_INSERT [dbo].[OFERTA] ON 

INSERT [dbo].[OFERTA] ([IdOferta], [DataInceput], [DataSfarsit], [Reducere], [IdProdus], [IdRestaurant]) VALUES (1009, CAST(N'2025-06-22T10:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-06-22T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(12.00 AS Decimal(5, 2)), 3, 12)
INSERT [dbo].[OFERTA] ([IdOferta], [DataInceput], [DataSfarsit], [Reducere], [IdProdus], [IdRestaurant]) VALUES (1011, CAST(N'2025-07-02T08:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-02T18:00:00.0000000+00:00' AS DateTimeOffset), CAST(18.00 AS Decimal(5, 2)), 4, 4)
INSERT [dbo].[OFERTA] ([IdOferta], [DataInceput], [DataSfarsit], [Reducere], [IdProdus], [IdRestaurant]) VALUES (1016, CAST(N'2025-07-03T11:38:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-03T16:38:00.0000000+00:00' AS DateTimeOffset), CAST(15.00 AS Decimal(5, 2)), 5, 4)
INSERT [dbo].[OFERTA] ([IdOferta], [DataInceput], [DataSfarsit], [Reducere], [IdProdus], [IdRestaurant]) VALUES (1017, CAST(N'2025-07-03T11:44:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-03T14:44:00.0000000+00:00' AS DateTimeOffset), CAST(30.00 AS Decimal(5, 2)), 2, 4)
INSERT [dbo].[OFERTA] ([IdOferta], [DataInceput], [DataSfarsit], [Reducere], [IdProdus], [IdRestaurant]) VALUES (1018, CAST(N'2025-07-05T18:30:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-05T19:30:00.0000000+00:00' AS DateTimeOffset), CAST(24.00 AS Decimal(5, 2)), 1, 4)
SET IDENTITY_INSERT [dbo].[OFERTA] OFF
GO
SET IDENTITY_INSERT [dbo].[PLATA] ON 

INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (1, CAST(80.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1006, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (2, CAST(80.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1007, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (3, CAST(80.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1008, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (4, CAST(120.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1009, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (5, CAST(120.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1010, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (6, CAST(120.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1011, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (7, CAST(40.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1012, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (8, CAST(26.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1013, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (9, CAST(20.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1014, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (10, CAST(35.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1015, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (11, CAST(35.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1016, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (12, CAST(20.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1017, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (13, CAST(17.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1018, NULL, NULL)
INSERT [dbo].[PLATA] ([IdPlata], [SumaTotala], [MetodaPlata], [Status_Plata], [IdComanda], [StripePaymentId], [StripeSessionId]) VALUES (14, CAST(30.00 AS Decimal(10, 2)), N'Stripe', N'Platit', 1019, NULL, NULL)
SET IDENTITY_INSERT [dbo].[PLATA] OFF
GO
SET IDENTITY_INSERT [dbo].[PREFERINTE_DIETETICE] ON 

INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (6, N'Bogat in proteine')
INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (3, N'Fara gluten')
INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (4, N'Fara lactoza')
INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (5, N'Scazut in calorii')
INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (2, N'Vegan')
INSERT [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica], [Denumire]) VALUES (1, N'Vegetarian')
SET IDENTITY_INSERT [dbo].[PREFERINTE_DIETETICE] OFF
GO
SET IDENTITY_INSERT [dbo].[PRODUS] ON 

INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (1, N'Pizza Quatro Stagioni', N'Ingrediente: aluat (faina din grau, apa, ulei de floarea soarelui, sare, ulei de masline, drojdie), mozarella (lapte de vaca pasteurizat, cheag, fermenti lactici, sare ) , sos de rosii (rosii decojite, suc de rosii, acidifiant: acid citric, ulei de masline, busuioc, sare).', CAST(54.00 AS Decimal(10, 2)), CAST(N'2025-06-16T19:15:11.2940000' AS DateTime2), CAST(N'2025-07-05T06:30:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-06T06:30:00.0000000+00:00' AS DateTimeOffset), 5, 1, N'/uploads/1750101311292_pizza.png')
INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (2, N'Supa Crema de Linte', N'Ingrediente: linte (linte rosie sau bruna, apa pentru spalat), baza de supa (apa sau supa de legume facuta din: morcov, telina radacina, pastarnac, ceapa, sare), legume pentru aroma (ceapa, morcov, telina apio, usturoi), agent de ingrosare si gust (pasta de tomate sau rosii cuburi din conserva: rosii, suc de rosii, corector de aciditate: acid citric), ulei vegetal (ulei de floarea soarelui sau ulei de masline), condimente (sare, piper negru macinat, cimbru uscat, foaie de dafin, boia de ardei dulce/iute - optional).', CAST(32.00 AS Decimal(10, 2)), CAST(N'2025-06-19T08:22:35.9040000' AS DateTime2), CAST(N'2025-07-03T07:44:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-04T19:44:00.0000000+00:00' AS DateTimeOffset), 9, 1, N'/uploads/1750321355901_6.-Supa-crema-de-linte.jpg')
INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (3, N'Omleta cu sunca', N'Ingrediente: ou, sunca de pui, ulei de masline, branza.', CAST(25.00 AS Decimal(10, 2)), CAST(N'2025-06-22T10:04:17.1390000' AS DateTime2), CAST(N'2025-06-22T07:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-06-23T19:00:00.0000000+00:00' AS DateTimeOffset), 8, 2, N'/uploads/1750586657137_omleta-min.png')
INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (4, N'Shaorma de pui', N'Carne de pui servita in lipie, cu cartofi prajiți crocanti, sosuri savuroase si salata la alegere.', CAST(38.00 AS Decimal(10, 2)), CAST(N'2025-07-02T08:23:15.1930000' AS DateTime2), CAST(N'2025-07-02T07:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-07T19:00:00.0000000+00:00' AS DateTimeOffset), 6, 1, N'/uploads/1751444595190_ChatGPT Image 1 iul. 2025, 18_30_57.png')
INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (5, N'omleta cu sunca', N'dkdsjfjsdjkdsjkfdkfsdjk', CAST(30.00 AS Decimal(10, 2)), CAST(N'2025-07-02T12:57:50.4570000' AS DateTime2), CAST(N'2025-07-02T12:55:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-03T12:56:00.0000000+00:00' AS DateTimeOffset), 8, 1, N'/uploads/1751461070454_omleta-min.png')
INSERT [dbo].[PRODUS] ([IdProdus], [Denumire], [Descriere], [Pret_Initial], [DataInregistrare], [DataProducere], [DataExpirare], [IdCategorie], [IdRestaurant], [Imagine]) VALUES (6, N'shaorma', N'jjkj', CAST(17.00 AS Decimal(10, 2)), CAST(N'2025-07-03T10:01:46.8980000' AS DateTime2), CAST(N'2025-07-03T10:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2025-07-04T10:00:00.0000000+00:00' AS DateTimeOffset), 7, 1, N'/uploads/1751536906895_ChatGPT Image 1 iul. 2025, 18_30_57.png')
SET IDENTITY_INSERT [dbo].[PRODUS] OFF
GO
SET IDENTITY_INSERT [dbo].[PRODUS_PREFERINTA] ON 

INSERT [dbo].[PRODUS_PREFERINTA] ([IdProdusPreferinta], [IdProdus], [IdPreferintaDietetica]) VALUES (1, 2, 2)
INSERT [dbo].[PRODUS_PREFERINTA] ([IdProdusPreferinta], [IdProdus], [IdPreferintaDietetica]) VALUES (2, 2, 5)
INSERT [dbo].[PRODUS_PREFERINTA] ([IdProdusPreferinta], [IdProdus], [IdPreferintaDietetica]) VALUES (3, 3, 6)
INSERT [dbo].[PRODUS_PREFERINTA] ([IdProdusPreferinta], [IdProdus], [IdPreferintaDietetica]) VALUES (4, 5, 6)
SET IDENTITY_INSERT [dbo].[PRODUS_PREFERINTA] OFF
GO
SET IDENTITY_INSERT [dbo].[RECENZIE] ON 

INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (2, N'bun', 5, N'Ne bucuram sa auzim asta!', CAST(N'2025-06-19T17:27:15.3290000+00:00' AS DateTimeOffset), 3)
INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (3, N'Mi-a placut foarte mult.', 5, N'Ne bucuram sa auzim.', CAST(N'2025-06-20T08:46:29.1520000+00:00' AS DateTimeOffset), 1005)
INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (4, N'mi-a placut super mult.', 5, NULL, CAST(N'2025-06-22T10:17:04.3820000+00:00' AS DateTimeOffset), 1013)
INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (5, N'mi-a placut, nota 10', 5, N'ne bucuram sa auzim asta', CAST(N'2025-07-02T09:02:32.9030000+00:00' AS DateTimeOffset), 1015)
INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (6, N'a fost foarte bun', 5, N'ne bucuram sa auzim.', CAST(N'2025-07-02T12:53:36.2530000+00:00' AS DateTimeOffset), 1017)
INSERT [dbo].[RECENZIE] ([IdRecenzie], [MesajClient], [Rating], [RaspunsRestaurant], [DataRecenzie], [IdComanda]) VALUES (7, N'tare', 4, NULL, CAST(N'2025-07-05T18:33:54.8160000+00:00' AS DateTimeOffset), 1019)
SET IDENTITY_INSERT [dbo].[RECENZIE] OFF
GO
SET IDENTITY_INSERT [dbo].[RESTAURANT] ON 

INSERT [dbo].[RESTAURANT] ([IdRestaurant], [Denumire], [Adresa], [IdUtilizator], [IdLocalitate], [Latitude], [Longitude]) VALUES (1, N'Pizzico Restaurant', N'Piata Ovidiu, Nr. 7', 4, 1, 44.1744274, 28.6584719)
INSERT [dbo].[RESTAURANT] ([IdRestaurant], [Denumire], [Adresa], [IdUtilizator], [IdLocalitate], [Latitude], [Longitude]) VALUES (2, N'Aperitivo Restaurant', N'Soseaua Constantei, nr 81', 12, 16, 44.1148038, 28.5600182)
SET IDENTITY_INSERT [dbo].[RESTAURANT] OFF
GO
SET IDENTITY_INSERT [dbo].[STOC] ON 

INSERT [dbo].[STOC] ([IdStoc], [Cant_Disp], [IdProdus], [DataValab]) VALUES (2, 0, 2, CAST(N'2025-07-03T11:52:33.2280000+00:00' AS DateTimeOffset))
INSERT [dbo].[STOC] ([IdStoc], [Cant_Disp], [IdProdus], [DataValab]) VALUES (3, 4, 3, CAST(N'2025-06-22T10:04:17.1610000+00:00' AS DateTimeOffset))
INSERT [dbo].[STOC] ([IdStoc], [Cant_Disp], [IdProdus], [DataValab]) VALUES (4, 3, 4, CAST(N'2025-07-02T08:23:15.2960000+00:00' AS DateTimeOffset))
INSERT [dbo].[STOC] ([IdStoc], [Cant_Disp], [IdProdus], [DataValab]) VALUES (5, 5, 1, CAST(N'2025-07-05T18:30:32.9840000+00:00' AS DateTimeOffset))
INSERT [dbo].[STOC] ([IdStoc], [Cant_Disp], [IdProdus], [DataValab]) VALUES (8, 4, 5, CAST(N'2025-07-03T11:57:17.5520000+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[STOC] OFF
GO
SET IDENTITY_INSERT [dbo].[UTILIZATOR] ON 

INSERT [dbo].[UTILIZATOR] ([IdUtilizator], [Email], [Parola], [Nr_Telefon], [IdLocalitate], [passwordResetExpires], [passwordResetToken]) VALUES (2, N'mihailcristina03@gmail.com', N'$2b$10$Um79NY5O6cCPAeW.EhmB9.pE.E.u5l/MEoCnUrxHAuTRAMjetFYb2', N'0771451431', 16, NULL, NULL)
INSERT [dbo].[UTILIZATOR] ([IdUtilizator], [Email], [Parola], [Nr_Telefon], [IdLocalitate], [passwordResetExpires], [passwordResetToken]) VALUES (3, N'xisomftw@gmail.com', N'$2b$10$9piozfq3WfYSJ6p1Eu0QZOApd2IduvDWZT/1G0QJt/V/aB6FOPLQe', N'0766363436', 15, CAST(N'2025-06-18T14:07:20.403' AS DateTime), N'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzUwMjUyMDQwLCJleHAiOjE3NTAyNTU2NDB9.m-ZGKyFKiQ4qV4UGYI8JbliHQo0KQPf6Ftceq6-dBkg')
INSERT [dbo].[UTILIZATOR] ([IdUtilizator], [Email], [Parola], [Nr_Telefon], [IdLocalitate], [passwordResetExpires], [passwordResetToken]) VALUES (4, N'pizzico@gmail.com', N'$2b$10$ja37Rir6DVPRVTjPh/Pp0ewBt47VQcZQt2knVWrNwVx8BHX0MucKm', N'0765063966', 1, NULL, NULL)
INSERT [dbo].[UTILIZATOR] ([IdUtilizator], [Email], [Parola], [Nr_Telefon], [IdLocalitate], [passwordResetExpires], [passwordResetToken]) VALUES (12, N'aperitivo@gmail.com', N'$2b$10$bf3kA2lauuZTRWGynDHhO.8moUOZeMTyZdUr8NMDKJel7DDycBr/e', N'0787396455', 16, NULL, NULL)
SET IDENTITY_INSERT [dbo].[UTILIZATOR] OFF
GO
/****** Object:  Index [UQ__ADMIN__99101D6C0AFE636E]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[ADMIN] ADD UNIQUE NONCLUSTERED 
(
	[IdUtilizator] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [CATEGORIE_Denumire_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[CATEGORIE] ADD  CONSTRAINT [CATEGORIE_Denumire_key] UNIQUE NONCLUSTERED 
(
	[Denumire] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [COMANDA_IdClient_IdRestaurant_DataComanda_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[COMANDA] ADD  CONSTRAINT [COMANDA_IdClient_IdRestaurant_DataComanda_key] UNIQUE NONCLUSTERED 
(
	[IdClient] ASC,
	[IdRestaurant] ASC,
	[DataComanda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [COMANDA_NrComanda_DataComanda_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[COMANDA] ADD  CONSTRAINT [COMANDA_NrComanda_DataComanda_key] UNIQUE NONCLUSTERED 
(
	[NrComanda] ASC,
	[DataComanda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [unq_CodRidicare]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[COMANDA] ADD  CONSTRAINT [unq_CodRidicare] UNIQUE NONCLUSTERED 
(
	[CodRidicare] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [JUDET_Denumire_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[JUDET] ADD  CONSTRAINT [JUDET_Denumire_key] UNIQUE NONCLUSTERED 
(
	[Denumire] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [OFERTA_IdProdus_IdRestaurant_DataInceput_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[OFERTA] ADD  CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataInceput_key] UNIQUE NONCLUSTERED 
(
	[IdProdus] ASC,
	[IdRestaurant] ASC,
	[DataInceput] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [OFERTA_IdProdus_IdRestaurant_DataSfarsit_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[OFERTA] ADD  CONSTRAINT [OFERTA_IdProdus_IdRestaurant_DataSfarsit_key] UNIQUE NONCLUSTERED 
(
	[IdProdus] ASC,
	[IdRestaurant] ASC,
	[DataSfarsit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [PLATA_IdComanda_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[PLATA] ADD  CONSTRAINT [PLATA_IdComanda_key] UNIQUE NONCLUSTERED 
(
	[IdComanda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [PREFERINTE_DIETETICE_Denumire_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[PREFERINTE_DIETETICE] ADD  CONSTRAINT [PREFERINTE_DIETETICE_Denumire_key] UNIQUE NONCLUSTERED 
(
	[Denumire] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [PRODUS_Denumire_IdRestaurant_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[PRODUS] ADD  CONSTRAINT [PRODUS_Denumire_IdRestaurant_key] UNIQUE NONCLUSTERED 
(
	[Denumire] ASC,
	[IdRestaurant] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [PRODUS_PREFERINTA_IdProdus_IdPreferintaDietetica_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[PRODUS_PREFERINTA] ADD  CONSTRAINT [PRODUS_PREFERINTA_IdProdus_IdPreferintaDietetica_key] UNIQUE NONCLUSTERED 
(
	[IdProdus] ASC,
	[IdPreferintaDietetica] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [RECENZIE_IdComanda_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[RECENZIE] ADD  CONSTRAINT [RECENZIE_IdComanda_key] UNIQUE NONCLUSTERED 
(
	[IdComanda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [RESTAURANT_IdUtilizator_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[RESTAURANT] ADD  CONSTRAINT [RESTAURANT_IdUtilizator_key] UNIQUE NONCLUSTERED 
(
	[IdUtilizator] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [STOC_IdProdus_DataValab_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[STOC] ADD  CONSTRAINT [STOC_IdProdus_DataValab_key] UNIQUE NONCLUSTERED 
(
	[IdProdus] ASC,
	[DataValab] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UTILIZATOR_Email_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[UTILIZATOR] ADD  CONSTRAINT [UTILIZATOR_Email_key] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UTILIZATOR_Nr_Telefon_key]    Script Date: 7/6/2025 10:03:09 PM ******/
ALTER TABLE [dbo].[UTILIZATOR] ADD  CONSTRAINT [UTILIZATOR_Nr_Telefon_key] UNIQUE NONCLUSTERED 
(
	[Nr_Telefon] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[_prisma_migrations] ADD  DEFAULT (getdate()) FOR [started_at]
GO
ALTER TABLE [dbo].[_prisma_migrations] ADD  DEFAULT ((0)) FOR [applied_steps_count]
GO
ALTER TABLE [dbo].[NOTIFICARE] ADD  CONSTRAINT [NOTIFICARE_Citita_df]  DEFAULT ((0)) FOR [Citita]
GO
ALTER TABLE [dbo].[STOC] ADD  CONSTRAINT [STOC_DataValab_df]  DEFAULT (getdate()) FOR [DataValab]
GO
ALTER TABLE [dbo].[ADMIN]  WITH CHECK ADD  CONSTRAINT [FK_Admin_Utilizator] FOREIGN KEY([IdUtilizator])
REFERENCES [dbo].[UTILIZATOR] ([IdUtilizator])
GO
ALTER TABLE [dbo].[ADMIN] CHECK CONSTRAINT [FK_Admin_Utilizator]
GO
ALTER TABLE [dbo].[CLIENT]  WITH CHECK ADD  CONSTRAINT [CLIENT_IdUtilizator_fkey] FOREIGN KEY([IdUtilizator])
REFERENCES [dbo].[UTILIZATOR] ([IdUtilizator])
GO
ALTER TABLE [dbo].[CLIENT] CHECK CONSTRAINT [CLIENT_IdUtilizator_fkey]
GO
ALTER TABLE [dbo].[COMANDA]  WITH CHECK ADD  CONSTRAINT [COMANDA_IdClient_fkey] FOREIGN KEY([IdClient])
REFERENCES [dbo].[CLIENT] ([IdUtilizator])
GO
ALTER TABLE [dbo].[COMANDA] CHECK CONSTRAINT [COMANDA_IdClient_fkey]
GO
ALTER TABLE [dbo].[COMANDA]  WITH CHECK ADD  CONSTRAINT [COMANDA_IdRestaurant_fkey] FOREIGN KEY([IdRestaurant])
REFERENCES [dbo].[RESTAURANT] ([IdRestaurant])
GO
ALTER TABLE [dbo].[COMANDA] CHECK CONSTRAINT [COMANDA_IdRestaurant_fkey]
GO
ALTER TABLE [dbo].[COMANDA_PRODUS]  WITH CHECK ADD  CONSTRAINT [COMANDA_PRODUS_IdComanda_fkey] FOREIGN KEY([IdComanda])
REFERENCES [dbo].[COMANDA] ([IdComanda])
GO
ALTER TABLE [dbo].[COMANDA_PRODUS] CHECK CONSTRAINT [COMANDA_PRODUS_IdComanda_fkey]
GO
ALTER TABLE [dbo].[COMANDA_PRODUS]  WITH CHECK ADD  CONSTRAINT [COMANDA_PRODUS_IdProdus_fkey] FOREIGN KEY([IdProdus])
REFERENCES [dbo].[PRODUS] ([IdProdus])
GO
ALTER TABLE [dbo].[COMANDA_PRODUS] CHECK CONSTRAINT [COMANDA_PRODUS_IdProdus_fkey]
GO
ALTER TABLE [dbo].[LOCALITATE]  WITH CHECK ADD  CONSTRAINT [LOCALITATE_IdJudet_fkey] FOREIGN KEY([IdJudet])
REFERENCES [dbo].[JUDET] ([IdJudet])
GO
ALTER TABLE [dbo].[LOCALITATE] CHECK CONSTRAINT [LOCALITATE_IdJudet_fkey]
GO
ALTER TABLE [dbo].[NOTIFICARE]  WITH CHECK ADD  CONSTRAINT [NOTIFICARE_IdComanda_fkey] FOREIGN KEY([IdComanda])
REFERENCES [dbo].[COMANDA] ([IdComanda])
GO
ALTER TABLE [dbo].[NOTIFICARE] CHECK CONSTRAINT [NOTIFICARE_IdComanda_fkey]
GO
ALTER TABLE [dbo].[OFERTA]  WITH CHECK ADD  CONSTRAINT [OFERTA_IdProdus_fkey] FOREIGN KEY([IdProdus])
REFERENCES [dbo].[PRODUS] ([IdProdus])
GO
ALTER TABLE [dbo].[OFERTA] CHECK CONSTRAINT [OFERTA_IdProdus_fkey]
GO
ALTER TABLE [dbo].[OFERTA]  WITH CHECK ADD  CONSTRAINT [OFERTA_IdRestaurant_fkey] FOREIGN KEY([IdRestaurant])
REFERENCES [dbo].[RESTAURANT] ([IdUtilizator])
GO
ALTER TABLE [dbo].[OFERTA] CHECK CONSTRAINT [OFERTA_IdRestaurant_fkey]
GO
ALTER TABLE [dbo].[PLATA]  WITH CHECK ADD  CONSTRAINT [PLATA_IdComanda_fkey] FOREIGN KEY([IdComanda])
REFERENCES [dbo].[COMANDA] ([IdComanda])
GO
ALTER TABLE [dbo].[PLATA] CHECK CONSTRAINT [PLATA_IdComanda_fkey]
GO
ALTER TABLE [dbo].[PRODUS]  WITH CHECK ADD  CONSTRAINT [PRODUS_IdCategorie_fkey] FOREIGN KEY([IdCategorie])
REFERENCES [dbo].[CATEGORIE] ([IdCategorie])
GO
ALTER TABLE [dbo].[PRODUS] CHECK CONSTRAINT [PRODUS_IdCategorie_fkey]
GO
ALTER TABLE [dbo].[PRODUS]  WITH CHECK ADD  CONSTRAINT [PRODUS_IdRestaurant_fkey] FOREIGN KEY([IdRestaurant])
REFERENCES [dbo].[RESTAURANT] ([IdRestaurant])
GO
ALTER TABLE [dbo].[PRODUS] CHECK CONSTRAINT [PRODUS_IdRestaurant_fkey]
GO
ALTER TABLE [dbo].[PRODUS_PREFERINTA]  WITH CHECK ADD  CONSTRAINT [PRODUS_PREFERINTA_IdPreferintaDietetica_fkey] FOREIGN KEY([IdPreferintaDietetica])
REFERENCES [dbo].[PREFERINTE_DIETETICE] ([IdPreferintaDietetica])
GO
ALTER TABLE [dbo].[PRODUS_PREFERINTA] CHECK CONSTRAINT [PRODUS_PREFERINTA_IdPreferintaDietetica_fkey]
GO
ALTER TABLE [dbo].[PRODUS_PREFERINTA]  WITH CHECK ADD  CONSTRAINT [PRODUS_PREFERINTA_IdProdus_fkey] FOREIGN KEY([IdProdus])
REFERENCES [dbo].[PRODUS] ([IdProdus])
GO
ALTER TABLE [dbo].[PRODUS_PREFERINTA] CHECK CONSTRAINT [PRODUS_PREFERINTA_IdProdus_fkey]
GO
ALTER TABLE [dbo].[RECENZIE]  WITH CHECK ADD  CONSTRAINT [RECENZIE_IdComanda_fkey] FOREIGN KEY([IdComanda])
REFERENCES [dbo].[COMANDA] ([IdComanda])
GO
ALTER TABLE [dbo].[RECENZIE] CHECK CONSTRAINT [RECENZIE_IdComanda_fkey]
GO
ALTER TABLE [dbo].[RESTAURANT]  WITH CHECK ADD  CONSTRAINT [RESTAURANT_IdLocalitate_fkey] FOREIGN KEY([IdLocalitate])
REFERENCES [dbo].[LOCALITATE] ([IdLocalitate])
GO
ALTER TABLE [dbo].[RESTAURANT] CHECK CONSTRAINT [RESTAURANT_IdLocalitate_fkey]
GO
ALTER TABLE [dbo].[RESTAURANT]  WITH CHECK ADD  CONSTRAINT [RESTAURANT_IdUtilizator_fkey] FOREIGN KEY([IdUtilizator])
REFERENCES [dbo].[UTILIZATOR] ([IdUtilizator])
GO
ALTER TABLE [dbo].[RESTAURANT] CHECK CONSTRAINT [RESTAURANT_IdUtilizator_fkey]
GO
ALTER TABLE [dbo].[STOC]  WITH CHECK ADD  CONSTRAINT [STOC_IdProdus_fkey] FOREIGN KEY([IdProdus])
REFERENCES [dbo].[PRODUS] ([IdProdus])
GO
ALTER TABLE [dbo].[STOC] CHECK CONSTRAINT [STOC_IdProdus_fkey]
GO
ALTER TABLE [dbo].[UTILIZATOR]  WITH CHECK ADD  CONSTRAINT [UTILIZATOR_IdLocalitate_fkey] FOREIGN KEY([IdLocalitate])
REFERENCES [dbo].[LOCALITATE] ([IdLocalitate])
GO
ALTER TABLE [dbo].[UTILIZATOR] CHECK CONSTRAINT [UTILIZATOR_IdLocalitate_fkey]
GO
USE [master]
GO
ALTER DATABASE [LastBite] SET  READ_WRITE 
GO
