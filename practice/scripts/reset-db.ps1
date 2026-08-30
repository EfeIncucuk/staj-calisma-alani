# Veritabanini fabrika ayarlarina dondurur:
# semayi tamamen silip yeniden kurar ve seed verisini bastan yukler.
#
# Ne zaman kullanacaksin:
#   - Test yaparken veriyi karistirdiginda
#   - Silme/guncelleme senaryolarini bastan kosmak istediginde
#   - "Turkey" kaydini yanlislikla bozdugunda
#
# Kendi ekledigin kayitlar SILINIR. Bu beklenen davranis.

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$psql = Join-Path $root "pgsql\bin\psql.exe"
$env:PGCLIENTENCODING = "UTF8"

& (Join-Path $root "pgsql\bin\pg_isready.exe") -h localhost -p 5433 -U postgres | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Veritabani calismiyor. Once scripts\start-db.ps1 calistir." -ForegroundColor Red
    exit 1
}

$files = @("00-reset.sql", "01-schema.sql", "02-seed-currency.sql", "03-seed-language.sql", "04-seed-country.sql")
foreach ($f in $files) {
    Write-Host "-> $f"
    & $psql -h localhost -p 5433 -U postgres -d "AnahtarGlobalLondra" -q -v ON_ERROR_STOP=1 -f (Join-Path $root "db\$f")
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   HATA: $f yuklenemedi." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Veritabani sifirlandi." -ForegroundColor Green
Write-Host "Kontrol etmek icin: scripts\verify-db.ps1"
