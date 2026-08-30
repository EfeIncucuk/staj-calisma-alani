-- =====================================================================
--  AGLDN-989  Country Definition  |  Pratik ortam semasi
--  Kaynak: Stajyer Kilavuzu, "Teknik Bilgiler" bolumu (s. 8-9)
--
--  Bu dosya dokumandaki CREATE TABLE ifadelerini birebir kurar.
--  Iki bilincli duzeltme var, en altta "NOTLAR" bolumunde aciklandi.
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS "SystemAdmin";

-- ---------------------------------------------------------------------
--  Sequence'ler
--  Dokumandaki DEFAULT nextval(...) ifadelerinin calismasi icin
--  tablolardan ONCE olusturulmalari gerekiyor.
-- ---------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS "SystemAdmin"."Country_Id_seq"  AS bigint START 1;
CREATE SEQUENCE IF NOT EXISTS "SystemAdmin"."Currency_Id_seq" AS bigint START 1;
CREATE SEQUENCE IF NOT EXISTS "SystemAdmin"."Language_Id_seq" AS bigint START 1;


-- ---------------------------------------------------------------------
--  Currency
--  Para Birimi dropdown'inin kaynagi.
--  Ekranda "TRY - Turkish lira" bicminde gosterilecek.
-- ---------------------------------------------------------------------

CREATE TABLE "SystemAdmin"."Currency" (
    "Id"                  int8         NOT NULL DEFAULT nextval('"SystemAdmin"."Currency_Id_seq"'::regclass),
    "CurrencyAlphaCode"   varchar(3)   NOT NULL,
    "CurrencyNumericCode" varchar(3)   NOT NULL,
    "CurrencyName"        varchar(100) NOT NULL,
    "RecordStatus"        int4         NOT NULL,
    CONSTRAINT "PK_CURRENCY_ID" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_CURRENCY_CURRENCY_ALPHA_CODE"
    ON "SystemAdmin"."Currency" ("CurrencyAlphaCode" DESC);
CREATE INDEX "IX_CURRENCY_CURRENCY_NUMERIC_CODE"
    ON "SystemAdmin"."Currency" ("CurrencyNumericCode" DESC);
CREATE UNIQUE INDEX "UK_CURRENCY_ID"
    ON "SystemAdmin"."Currency" ("Id" DESC);


-- ---------------------------------------------------------------------
--  Language
--  Dil dropdown'inin kaynagi.
--  DIKKAT: Ekranda SADECE RecordStatus = 1 olanlar listelenecek.
--  (Kilavuz s.12, "Dil alaninda listelenen verilerin ... kontrolu")
-- ---------------------------------------------------------------------

CREATE TABLE "SystemAdmin"."Language" (
    "Id"           int8         NOT NULL DEFAULT nextval('"SystemAdmin"."Language_Id_seq"'::regclass),
    "Name"         varchar(100) NOT NULL,
    "Code"         varchar(8)   NOT NULL,
    "EngName"      varchar(100) NULL,
    "OrgName"      varchar(100) NULL,
    "RecordStatus" int4         NOT NULL,
    CONSTRAINT "PK_LANGUAGE_ID" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "UK_LANGUAGE_ID"
    ON "SystemAdmin"."Language" ("Id" DESC);


-- ---------------------------------------------------------------------
--  Country
--  Gelistirecegin ekranin ana tablosu.
--
--  Zorunlu ve benzersiz olmasi gereken 6 alan:
--      CountryName, CountryNameOriginal, CountryNameOfficial,
--      Country2AlpCode, Country3AlpCode, CountryNumCode
--
--  DIKKAT: Bu 6 alan icin tabloda UNIQUE constraint YOK.
--  Benzersizlik kontrolunu servis katmaninda sen yazacaksin.
--  (Bilincli olarak boyle birakildi - dokumandaki DDL de boyle.)
--
--  RecordStatus:  1 = aktif,  -1 = silinmis (soft delete)
-- ---------------------------------------------------------------------

CREATE TABLE "SystemAdmin"."Country" (
    "Id"                    int8         NOT NULL DEFAULT nextval('"SystemAdmin"."Country_Id_seq"'::regclass),
    "CountryName"           varchar(100) NOT NULL,
    "CountryNameOriginal"   varchar(100) NOT NULL,
    "CountryNameOfficial"   varchar(100) NOT NULL,
    "Country2AlpCode"       varchar(2)   NOT NULL,
    "Country3AlpCode"       varchar(3)   NOT NULL,
    "CountryNumCode"        int4         NOT NULL DEFAULT 0,
    "CurrencyId"            int8         NULL,
    "LanguageId"            int8         NULL,
    "PhoneCode"             int4         NULL DEFAULT 0,
    "Riskscore"             int4         NULL DEFAULT 0,
    "AccountingRegionCode"  int4         NULL DEFAULT 0,
    "AccountingRegionDesc"  varchar(100) NULL,
    "RecordCreateUser"      int4         NOT NULL DEFAULT 0,
    "RecordCreateDate"      timestamptz  NOT NULL DEFAULT now(),
    "RecordUpdateDate"      timestamptz  NULL,
    "RecordStatus"          int4         NOT NULL,
    CONSTRAINT "PK_Country_ID" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_COUNTRY_Country_NAME"
    ON "SystemAdmin"."Country" ("CountryName" DESC);
CREATE UNIQUE INDEX "UK_Country_ID"
    ON "SystemAdmin"."Country" ("Id" DESC);


-- =====================================================================
--  NOTLAR - dokumandan iki sapma
--
--  1) Dokumandaki index ifadeleri kolon adlarini tirnaksiz yaziyor:
--         CREATE INDEX ... ON "SystemAdmin"."Country" (CountryName DESC);
--     PostgreSQL tirnaksiz tanimlayicilari kucuk harfe cevirir, yani
--     bu ifade "countryname" adli bir kolon arar ve HATA verir; cunku
--     kolonun gercek adi tirnakli "CountryName".
--     Burada kolon adlari tirnaklandi ki script gercekten calissin.
--     -> Gercek projede semaya dokunmayacaksin, bu sadece pratik
--        ortami ayaga kaldirmak icin gerekli bir duzeltme.
--
--  2) Dokumanda PhoneCode / Riskscore / AccountingRegionCode
--     "NULL DEFAULT 0" olarak yaziliyor - yani NULL kabul ediyorlar.
--     Aynen korundu. Bu senin icin bir tasarim karari demek:
--     kullanici alani bos biraktiginda DB'ye NULL mi 0 mi yazacaksin?
--     Hangisini secersen sec, LISTEDE VE FORMDA BOS GOSTERMEN gerekiyor.
--     Tabloda anlamsiz "0"lar goruyorsan bu satiri hatirla.
-- =====================================================================
