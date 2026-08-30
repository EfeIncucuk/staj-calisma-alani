# Veritabanindaki verinin dogrulugunu kontrol eder.
#
# Yedi baslikta rapor verir: kayit sayilari, kilavuzdaki Turkiye satiri,
# unicode saklama, 6 zorunlu alanin benzersizligi, alan kurallari,
# dropdown kaynaklari ve silinmis kayitlar.
#
# "tekrar" ve "ihlal" kolonlarindaki her sayi 0 olmali.

$root = Split-Path $PSScriptRoot -Parent
$env:PGCLIENTENCODING = "UTF8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

& (Join-Path $root "pgsql\bin\psql.exe") `
    -h localhost -p 5433 -U postgres -d "AnahtarGlobalLondra" `
    -f (Join-Path $root "db\99-verify.sql")
