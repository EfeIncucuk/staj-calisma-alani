# Veritabanina komut satirindan baglanir (dBeaver yerine hizli yol).
#
# Faydali komutlar:
#   \dt "SystemAdmin".*                     tablolari listele
#   \d "SystemAdmin"."Country"              tablo yapisini goster
#   \x                                      genis satirlari dikey goster
#   \q                                      cik
#
# Ornek sorgular:
#   select * from "SystemAdmin"."Country" where "CountryName" = 'Turkey';
#   select count(*) from "SystemAdmin"."Country" where "RecordStatus" = 1;
#   select * from "SystemAdmin"."Country" where "RecordStatus" = -1;
#
# DIKKAT: kolon ve sema adlari CIFT TIRNAK icinde yazilmali.
# Tirnaksiz yazarsan PostgreSQL kucuk harfe cevirir ve kolonu bulamaz.
#
# Tek bir sorgu calistirmak icin parametre verebilirsin:
#   .\scripts\psql.ps1 'select count(*) from "SystemAdmin"."Country";'

param([string]$Sorgu)

$root = Split-Path $PSScriptRoot -Parent
$psql = Join-Path $root "pgsql\bin\psql.exe"
$env:PGCLIENTENCODING = "UTF8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

if ([string]::IsNullOrWhiteSpace($Sorgu)) {
    & $psql -h localhost -p 5433 -U postgres -d "AnahtarGlobalLondra"
} else {
    & $psql -h localhost -p 5433 -U postgres -d "AnahtarGlobalLondra" -c $Sorgu
}
