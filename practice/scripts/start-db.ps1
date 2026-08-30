# Veritabanini baslatir.
# Bilgisayari her yeniden baslattiginda bunu tekrar calistirman gerekiyor.

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$bin  = Join-Path $root "pgsql\bin"
$data = Join-Path $root "pgdata"

$ready = & "$bin\pg_isready.exe" -h localhost -p 5433 -U postgres 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Veritabani zaten calisiyor (localhost:5433)." -ForegroundColor Green
    exit 0
}

Write-Host "PostgreSQL baslatiliyor..."
& "$bin\pg_ctl.exe" -D "$data" -l (Join-Path $root "pgsql.log") start

& "$bin\pg_isready.exe" -h localhost -p 5433 -U postgres
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Hazir. Baglanti bilgileri:" -ForegroundColor Green
    Write-Host "  Sunucu       : localhost"
    Write-Host "  Port         : 5433"
    Write-Host "  Veritabani   : AnahtarGlobalLondra"
    Write-Host "  Kullanici    : postgres"
    Write-Host "  Sifre        : (yok - bos birak)"
    Write-Host "  Sema         : SystemAdmin"
} else {
    Write-Host "Baslatilamadi. Log dosyasina bak: $root\pgsql.log" -ForegroundColor Red
}
