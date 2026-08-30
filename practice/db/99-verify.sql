\pset border 2
\echo === 1) Kayit sayilari ===
select 'Country (aktif)'   as tablo, count(*) from "SystemAdmin"."Country"  where "RecordStatus" = 1
union all select 'Country (silinmis)', count(*) from "SystemAdmin"."Country"  where "RecordStatus" = -1
union all select 'Currency (aktif)',   count(*) from "SystemAdmin"."Currency" where "RecordStatus" = 1
union all select 'Language (aktif)',   count(*) from "SystemAdmin"."Language" where "RecordStatus" = 1
union all select 'Language (pasif)',   count(*) from "SystemAdmin"."Language" where "RecordStatus" = -1;

\echo
\echo === 2) Kilavuzdaki Turkiye satiri birebir uretildi mi? ===
select c."CountryName", c."CountryNameOriginal", c."CountryNameOfficial",
       c."Country2AlpCode" as a2, c."Country3AlpCode" as a3, c."CountryNumCode" as num,
       cur."CurrencyAlphaCode" as para, l."Name" as dil,
       c."PhoneCode" as tel, c."Riskscore" as risk, c."RecordStatus" as durum
from "SystemAdmin"."Country" c
left join "SystemAdmin"."Currency" cur on cur."Id" = c."CurrencyId"
left join "SystemAdmin"."Language" l   on l."Id"  = c."LanguageId"
where c."CountryName" = 'Turkey';

\echo
\echo === 3) Unicode dogru saklanmis mi? (Arapca / Bengalce / Yunanca) ===
select "CountryName", "CountryNameOriginal", "CountryNameOfficial"
from "SystemAdmin"."Country"
where "Country2AlpCode" in ('SA','BD','GR','JP','AZ','BH')
order by "CountryName";

\echo
\echo === 4) 6 zorunlu alanin HEPSI benzersiz mi? (hepsi 0 olmali) ===
select 'CountryName'         as alan, count(*) - count(distinct "CountryName")         as tekrar from "SystemAdmin"."Country"
union all select 'CountryNameOriginal', count(*) - count(distinct "CountryNameOriginal") from "SystemAdmin"."Country"
union all select 'CountryNameOfficial', count(*) - count(distinct "CountryNameOfficial") from "SystemAdmin"."Country"
union all select 'Country2AlpCode',     count(*) - count(distinct "Country2AlpCode")     from "SystemAdmin"."Country"
union all select 'Country3AlpCode',     count(*) - count(distinct "Country3AlpCode")     from "SystemAdmin"."Country"
union all select 'CountryNumCode',      count(*) - count(distinct "CountryNumCode")      from "SystemAdmin"."Country";

\echo
\echo === 5) Alan kurallari veriye uyuyor mu? (hepsi 0 olmali) ===
select 'Risk skoru 1-5 disinda'        as ihlal, count(*) from "SystemAdmin"."Country" where "Riskscore" is not null and "Riskscore" not between 1 and 5
union all select '2 harf kodu harf disi', count(*) from "SystemAdmin"."Country" where "Country2AlpCode" !~ '^[A-Za-z]{2}$'
union all select '3 harf kodu harf disi', count(*) from "SystemAdmin"."Country" where "Country3AlpCode" !~ '^[A-Za-z]{3}$'
union all select 'Isim 100 karakter ustu', count(*) from "SystemAdmin"."Country" where length("CountryName") > 100
union all select 'Telefon kodu 6 hane ustu', count(*) from "SystemAdmin"."Country" where "PhoneCode" is not null and "PhoneCode" > 999999
union all select 'Basinda/sonunda bosluk', count(*) from "SystemAdmin"."Country" where "CountryName" <> btrim("CountryName") or "CountryNameOriginal" <> btrim("CountryNameOriginal");

\echo
\echo === 6) Dropdown kaynaklari ===
select 'Dil dropdown''inda gorunmeli' as liste, string_agg("Name", ', ' order by "Name") as degerler
from "SystemAdmin"."Language" where "RecordStatus" = 1;
select 'Bos birakilan alanlar (NULL) var mi?' as kontrol,
       count(*) filter (where "Riskscore" is null)            as risk_bos,
       count(*) filter (where "CurrencyId" is null)           as para_bos,
       count(*) filter (where "LanguageId" is null)           as dil_bos,
       count(*) filter (where "AccountingRegionCode" is null)  as bolge_bos
from "SystemAdmin"."Country" where "RecordStatus" = 1;

\echo
\echo === 7) Silinmis (RecordStatus = -1) ulkeler - listede GORUNMEMELI ===
select "CountryName", "Country2AlpCode", "RecordStatus"
from "SystemAdmin"."Country" where "RecordStatus" = -1 order by "CountryName";
