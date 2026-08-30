
$root = Split-Path $PSScriptRoot -Parent
$bin = Join-Path $root "pgsql\bin"
$pgpsql = Join-Path $bin "psql.exe"
$pgIsReady = Join-Path $bin "pg_isready.exe"


& $pgIsReady -h localhost -p 5434 -U postgres | Out-Null
if ($LASTEXITCODE -eq 0) {
    $env:PGCLIENTENCODING = "UTF8"
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

    & $pgpsql -h localhost -p 5434 -U postgres -v ON_ERROR_STOP=1 -d AnahtarGlobalLondra @args
    exit $LASTEXITCODE
}
else{
     Write-Host "Veritabani kapali, once baslatin" -ForegroundColor red
     exit 1
}


