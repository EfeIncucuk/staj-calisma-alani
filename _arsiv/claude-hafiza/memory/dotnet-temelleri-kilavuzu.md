---
name: dotnet-temelleri-kilavuzu
description: "Ana roadmap'in Faz 3 ve Faz 4'ünü açan ek kılavuz artifact'i — sıfırdan .NET projesi kurma, kurulum sözlüğü, 6 günlük plan"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7f2bae00-035a-415d-a0eb-3f650fb65cec
  modified: 2026-08-13T10:45:08.941Z
---

**13 Ağustos 2026**: Efe ana roadmap'teki "kur şunu kur bunu" belirsizliğinden
bunaldığı için, sadece .NET temelleri (Faz 3 + Faz 4) için ayrı bir kılavuz
yayımlandı:

https://claude.ai/code/artifact/4f3d5767-ebd6-4dfc-8624-4cf5592a03a2

İçeriği: makinedeki ölçülmüş .NET durumu, kurulum sözlüğü (SDK/runtime/MSBuild/
NuGet/Kestrel farkları), **kurmayacakların listesi**, editör kurulumu,
`dotnet new sln` → `webapi` → `add package` → `build`/`run` adım adım,
üretilen dosyaların anatomisi, Faz 3'ün 4 günü + Faz 4'ün 2 günü,
hata sözlüğü ve ana projedeki mevcut durum.

Devamı — aynı fazların **"nasıl" tarafı** (sınıf/liste/LINQ/controller/DI/async/
SQL/Dapper, satır satır açıklamalı ders notları):

https://claude.ai/code/artifact/cee8db3d-7c5f-43ee-a73a-ed2872a6bbd8

Ders notlarındaki örnekler **bilerek Country'den değil**, paralel bir kütüphane
alanından (Kitap / Yazar / Tur) — yapı birebir aynı (soft delete, iki lookup,
6'lı unique kontrolü, LEFT JOIN) ama Efe'nin teslim edeceği kod değil.
Her bölümün sonunda "Country'ye çevirirken" eşleştirme şeridi var.
Bu ayrım [[efe-kodu-kendisi-yazmak-istiyor]] gereği; sonraki dokümanlarda da koru.

Bütün C# örnekleri netcoreapp3.1'de derlenerek doğrulandı (0 uyarı, 0 hata);
DI hata mesajı da gerçekten çalıştırılarak alındı — kayıt unutulduğunda hata
**derlemede veya açılışta değil, ilk istek controller'a ulaştığında** çıkıyor.

Ana roadmap (10 faz, uçtan uca): [[sifirdan-kurulum-karari]] içinde.

**Efe'nin o tarihteki konumu:** Faz 5'in başı. `proje/backend/CountryApi`
iskeleti hazır (csproj + Startup CORS/Swagger + appsettings port 5434),
`Controllers/ Models/ Dtos/ Services/ Repositories/` klasörlerinin **hepsi boş**.
İki açık kontrol maddesi: Startup'taki CORS adresi `5173` (kendi frontend'i
5174 olacak), launchSettings portu `5000` (kendi backend'i 5001 olacak).

İlgili: [[efe-stajyer-agldn-989]], [[dotnet-31-vscode-devkit-uyumsuzlugu]],
[[efe-kodu-kendisi-yazmak-istiyor]]
