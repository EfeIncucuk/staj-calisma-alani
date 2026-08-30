
$root = Split-Path $PSScriptRoot -Parent
$bin = Join-Path $root "pgsql\bin"
$data = Join-Path $root "pgdata"
$pgIsReady = Join-Path $bin "pg_isready.exe"

& $pgIsReady -h localhost -p 5434 -U postgres | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Veritabani halihazirda calisiyor. (localhost:5434)" -ForegroundColor Green
    exit 0
}

Write-Host "PostgreSQL baslatiliyor..."
& "$bin\pg_ctl.exe" -D "$data" -l (Join-Path $root "pgsql.log") start

& $pgIsReady -h localhost -p 5434 -U postgres
if($LASTEXITCODE -eq 0){
    Write-Host ""
    Write-Host "Hazir. Baglanti bilgileri:" -ForegroundColor Green
    Write-Host "  Sunucu       : localhost"
    Write-Host "  Port         : 5434"
    Write-Host "  Veritabani   : AnahtarGlobalLondra"
    Write-Host "  Kullanici    : postgres"
    Write-Host "  Sifre        : (yok - bos birak)"
    Write-Host "  Sema         : SystemAdmin"
} else {
    Write-Host "Baslatilamadi. Log dosyasina bak: $root\pgsql.log" -ForegroundColor Red
}
