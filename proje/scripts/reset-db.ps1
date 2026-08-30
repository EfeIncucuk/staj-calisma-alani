# =====================================================================
#  Veritabanini sifirdan kurar:  sema -> seed
#
#  Her adim oncekinin basarili olmasina bagli. Bir adim sifir olmayan
#  cikis kodu dondururse zincir durur - yoksa bozuk veriyle devam eder
#  ve hata cok sonra, alakasiz bir yerde ortaya cikar.
#
#  Kullanim:  .\scripts\reset-db.ps1
# =====================================================================

$psql = Join-Path $PSScriptRoot "psql.ps1"
$db = Split-Path $PSScriptRoot -Parent

$adimlar = @(
    "db\00-reset.sql",
    "db\01-schema.sql",
    "db\02-seed-currency.sql",
    "db\03-seed-language.sql",
    "db\04-seed-country.sql"
)

foreach ($adim in $adimlar) {
    $yol = Join-Path $db $adim
    if (-not (Test-Path $yol)) {
        Write-Host "EKSIK DOSYA: $adim" -ForegroundColor Red
        Write-Host "Seed dosyalari uretilmemis olabilir:  node db\generate-seed.mjs"
        exit 1
    }

    Write-Host ""
    Write-Host "--> $adim" -ForegroundColor Cyan
    & $psql -q -f $yol

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "DURDU: $adim basarisiz (cikis kodu $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "Sonraki adimlar CALISTIRILMADI." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host ""
Write-Host "Veritabani hazir." -ForegroundColor Green
Write-Host "Dogrulamak icin:  .\scripts\psql.ps1 -f db\99-verify.sql"
exit 0
