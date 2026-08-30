# Backend API'yi baslatir.  http://localhost:5000
#
# Bu pencereyi acik birakman gerekiyor. Durdurmak icin Ctrl+C.
# Kod degistirdiginde durdurup yeniden baslat (3.1'de otomatik yenileme yok;
# istersen "dotnet watch run" ile kendisi yenilesin).
#
# Kontrol ucu:  http://localhost:5000/api/ping

$root = Split-Path $PSScriptRoot -Parent
$env:ASPNETCORE_ENVIRONMENT = "Development"
Set-Location (Join-Path $root "backend\CountryApi")
dotnet run --urls "http://localhost:5000"
