-- =====================================================================
--  AGLDN-989  -  Seed dogrulama
--
--  Iki bolum:
--    1) SAYIMLAR   - bilgi amacli. Uretecin kurallari degisirse bu sayilar da degisir.
--    2) KONTROLLER - hepsi OK olmali. HATA cikan satir gercek bir problemdir.
--
--  Calistirma:  .\scripts\psql.ps1 -f db\99-verify.sql
-- =====================================================================

\pset border 2

\echo
\echo ==================== 1. SAYIMLAR ====================
\echo

select 'Currency satir'                as "kontrol", count(*)::text as "deger" from "SystemAdmin"."Currency"
union all select 'Language satir',      count(*)::text from "SystemAdmin"."Language"
union all select 'Language  aktif',     count(*)::text from "SystemAdmin"."Language" where "RecordStatus" = 1
union all select 'Language  pasif',     count(*)::text from "SystemAdmin"."Language" where "RecordStatus" = -1
union all select 'Country  satir',      count(*)::text from "SystemAdmin"."Country"
union all select 'Country  aktif',      count(*)::text from "SystemAdmin"."Country" where "RecordStatus" = 1
union all select 'Country  silinmis',   count(*)::text from "SystemAdmin"."Country" where "RecordStatus" = -1
union all select 'CurrencyId bos',      count(*)::text from "SystemAdmin"."Country" where "CurrencyId" is null
union all select 'LanguageId bos',      count(*)::text from "SystemAdmin"."Country" where "LanguageId" is null
union all select 'Riskscore bos',       count(*)::text from "SystemAdmin"."Country" where "Riskscore" is null
union all select 'Riskscore en kucuk',  coalesce(min("Riskscore")::text, '-') from "SystemAdmin"."Country"
union all select 'Riskscore en buyuk',  coalesce(max("Riskscore")::text, '-') from "SystemAdmin"."Country"
union all select 'pasif dile bagli ulke',
       count(*)::text
       from "SystemAdmin"."Country" c
       join "SystemAdmin"."Language" l on l."Id" = c."LanguageId"
       where l."RecordStatus" = -1;

\echo
\echo ==================== 2. KONTROLLER ====================
\echo

-- Benzersiz olmasi gereken 6 alan. Semada UNIQUE kisiti YOK, bu yuzden
-- kontrol edilmesi gereken en onemli sey bu.
select 'CountryName tekrarsiz' as "kontrol",
       count(*)::text as "tekrar",
       case when count(*) = 0 then 'OK' else 'HATA' end as "durum"
  from (select "CountryName" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'CountryNameOriginal tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "CountryNameOriginal" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'CountryNameOfficial tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "CountryNameOfficial" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'Country2AlpCode tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "Country2AlpCode" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'Country3AlpCode tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "Country3AlpCode" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'CountryNumCode tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "CountryNumCode" from "SystemAdmin"."Country" group by 1 having count(*) > 1) t
union all
select 'CurrencyAlphaCode tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "CurrencyAlphaCode" from "SystemAdmin"."Currency" group by 1 having count(*) > 1) t
union all
select 'Language Code tekrarsiz', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from (select "Code" from "SystemAdmin"."Language" group by 1 having count(*) > 1) t

-- Sahipsiz referans: FOREIGN KEY olmadigi icin veritabani bunu engellemiyor.
union all
select 'sahipsiz CurrencyId yok', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" c
  where c."CurrencyId" is not null
    and not exists (select 1 from "SystemAdmin"."Currency" x where x."Id" = c."CurrencyId")
union all
select 'sahipsiz LanguageId yok', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" c
  where c."LanguageId" is not null
    and not exists (select 1 from "SystemAdmin"."Language" x where x."Id" = c."LanguageId")

-- Alan kurallari: kabul kriterinden geliyor, semada CHECK kisiti yok.
union all
select 'Country2AlpCode 2 karakter', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" where length("Country2AlpCode") <> 2
union all
select 'Country3AlpCode 3 karakter', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" where length("Country3AlpCode") <> 3
union all
select 'kodlar sadece harf', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country"
  where "Country2AlpCode" !~ '^[A-Za-z]+$' or "Country3AlpCode" !~ '^[A-Za-z]+$'
union all
select 'Riskscore 0-100 arasi', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country"
  where "Riskscore" is not null and ("Riskscore" < 0 or "Riskscore" > 100)
union all
select 'RecordStatus 1 veya -1', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" where "RecordStatus" not in (1, -1)
union all
select 'CurrencyNumericCode 3 hane', count(*)::text,
       case when count(*) = 0 then 'OK' else 'HATA' end
  from "SystemAdmin"."Currency" where length("CurrencyNumericCode") <> 3

-- Test senaryolarinin dayandigi kayitlar.
union all
select 'Turkiye aktif', (1 - count(*))::text,
       case when count(*) = 1 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" where "Country2AlpCode" = 'TR' and "RecordStatus" = 1
union all
select 'United Kingdom aktif', (1 - count(*))::text,
       case when count(*) = 1 then 'OK' else 'HATA' end
  from "SystemAdmin"."Country" where "Country2AlpCode" = 'GB' and "RecordStatus" = 1
union all
select 'Turkce dili aktif', (1 - count(*))::text,
       case when count(*) = 1 then 'OK' else 'HATA' end
  from "SystemAdmin"."Language" where "Code" = 'tur' and "RecordStatus" = 1;

\echo
\echo ==================== 3. TEST KAYITLARI ====================
\echo

select c."Country2AlpCode" as "kod",
       c."CountryName"     as "ad",
       c."CountryNumCode"  as "num",
       cur."CurrencyAlphaCode" as "para",
       l."Code"            as "dil",
       c."PhoneCode"       as "tel",
       c."Riskscore"       as "risk",
       c."RecordStatus"    as "durum"
  from "SystemAdmin"."Country" c
  left join "SystemAdmin"."Currency" cur on cur."Id" = c."CurrencyId"
  left join "SystemAdmin"."Language" l   on l."Id"   = c."LanguageId"
 where c."Country2AlpCode" in ('TR', 'GB', 'AW', 'CW', 'CI')
 order by c."Country2AlpCode";
