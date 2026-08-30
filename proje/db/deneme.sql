select
    c."Id",
    c."CountryName",
    l."Name" as "LanguageName",
    cur."CurrencyName" as "CurrencyName"
from "SystemAdmin"."Country" c
left join "SystemAdmin"."Language" l on l."Id" = c."LanguageId" and l."RecordStatus" = 1
left join "SystemAdmin"."Currency" cur on cur."Id" = c."CurrencyId"
where c."RecordStatus" = 1
order by c."CountryName";