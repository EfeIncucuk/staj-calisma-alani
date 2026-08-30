-- =====================================================================
--  AGLDN-989  Country Definition  -  Sema
--  Kaynak: Stajyer Kilavuzu, "Teknik Bilgiler" bolumu (s. 8-9)
--
--  Sira zorunlulugu:
--    1) SCHEMA    - her sey icinde yasayacak
--    2) SEQUENCE  - tablo tanimlarindaki nextval() bunlari cagiriyor
--    3) TABLE     - aralarindaki sira serbest (bu semada FOREIGN KEY yok)
--    4) INDEX     - tablolar var olduktan sonra
--
--  Dokumandan iki sapma var, en altta "NOTLAR" bolumunde aciklandi.
-- =====================================================================

CREATE SCHEMA "SystemAdmin";


-- ---------------------------------------------------------------------
--  Sequence'ler
-- ---------------------------------------------------------------------

CREATE SEQUENCE "SystemAdmin"."Country_Id_seq";
CREATE SEQUENCE "SystemAdmin"."Currency_Id_seq";
CREATE SEQUENCE "SystemAdmin"."Language_Id_seq";


-- ---------------------------------------------------------------------
--  Currency  -  Para Birimi dropdown'inin kaynagi
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
--  Language  -  Dil dropdown'inin kaynagi
--  DIKKAT: ekranda sadece RecordStatus = 1 olanlar listelenecek
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
--  Country  -  ekranin ana tablosu  (17 kolon)
--
--  Zorunlu VE benzersiz olmasi gereken 6 alan:
--      CountryName, CountryNameOriginal, CountryNameOfficial,
--      Country2AlpCode, Country3AlpCode, CountryNumCode
--
--  DIKKAT: bu 6 alan icin UNIQUE kisiti YOK. Benzersizlik kontrolunu
--  servis katmaninda sen yazacaksin. Veritabani seni korumayacak.
--
--  RecordStatus:  1 = aktif,  -1 = silinmis (soft delete)
-- ---------------------------------------------------------------------

CREATE TABLE "SystemAdmin"."Country" (
    "Id"                   int8         NOT NULL DEFAULT nextval('"SystemAdmin"."Country_Id_seq"'::regclass),
    "CountryName"          varchar(100) NOT NULL,
    "CountryNameOriginal"  varchar(100) NOT NULL,
    "CountryNameOfficial"  varchar(100) NOT NULL,
    "Country2AlpCode"      varchar(2)   NOT NULL,
    "Country3AlpCode"      varchar(3)   NOT NULL,
    "CountryNumCode"       int4         NOT NULL DEFAULT 0,
    "CurrencyId"           int8         NULL,
    "LanguageId"           int8         NULL,
    "PhoneCode"            int4         NULL DEFAULT 0,
    "Riskscore"            int4         NULL DEFAULT 0,
    "AccountingRegionCode" int4         NULL DEFAULT 0,
    "AccountingRegionDesc" varchar(100) NULL,
    "RecordCreateUser"     int4         NOT NULL DEFAULT 0,
    "RecordCreateDate"     timestamptz  NOT NULL DEFAULT now(),
    "RecordUpdateDate"     timestamptz  NULL,
    "RecordStatus"         int4         NOT NULL,
    CONSTRAINT "PK_Country_ID" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_COUNTRY_Country_NAME"
    ON "SystemAdmin"."Country" ("CountryName" DESC);

-- Bu index GEREKSIZ: "Id" zaten PRIMARY KEY oldugu icin PostgreSQL
-- otomatik bir unique index olusturuyor. Bu satir ayni kolona ikinci bir
-- index ekliyor - yer kapliyor, her yazma isleminde guncelleniyor, hicbir
-- faydasi yok. Dokumanda oldugu icin birebir aktardim; silmek de dogru
-- bir karar olurdu.
CREATE UNIQUE INDEX "UK_Country_ID"
    ON "SystemAdmin"."Country" ("Id" DESC);


-- =====================================================================
--  NOTLAR - dokumandan iki sapma
--
--  1) Dokumandaki index ifadeleri kolon adlarini TIRNAKSIZ yaziyor:
--         CREATE INDEX ... ON ... (CountryName DESC);
--     PostgreSQL tirnaksiz tanimlayicilari kucuk harfe cevirir, yani
--     "countryname" adli bir kolon arar ve HATA verir; kolonun gercek
--     adi "CountryName". Calissin diye kolon adlari tirnaklandi.
--
--  2) Dokumanda Language tablosunun son kolonu "NOT null" diye kucuk
--     harfle yaziliyor. SQL anahtar kelimeleri buyuk/kucuk harf duyarli
--     olmadigi icin fark etmez; tutarlilik icin "NOT NULL" yazildi.
-- =====================================================================
