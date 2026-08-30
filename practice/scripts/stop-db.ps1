# Veritabanini durdurur.

$root = Split-Path $PSScriptRoot -Parent
& (Join-Path $root "pgsql\bin\pg_ctl.exe") -D (Join-Path $root "pgdata") stop
