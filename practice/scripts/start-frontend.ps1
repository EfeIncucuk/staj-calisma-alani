# Frontend'i baslatir.  http://localhost:5173
#
# Bu pencereyi de acik birakman gerekiyor. Durdurmak icin Ctrl+C.
# Kodu kaydettiginde tarayici kendi kendine yenilenir (hot reload).
#
# /api ile baslayan istekler otomatik olarak backend'e (5000) yonlendirilir,
# ayari vite.config.ts icinde.

$root = Split-Path $PSScriptRoot -Parent
Set-Location (Join-Path $root "frontend")
npm run dev
