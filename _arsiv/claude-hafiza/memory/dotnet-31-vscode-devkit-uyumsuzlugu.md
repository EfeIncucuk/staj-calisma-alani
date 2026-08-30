---
name: dotnet-31-vscode-devkit-uyumsuzlugu
description: "Efe'nin makinesinde tek .NET SDK 3.1 kurulu; C# Dev Kit netcoreapp3.1 projesini yükleyemiyor, çözüm dotnet.preferCSharpExtension veya modern SDK kurulumu"
metadata: 
  node_type: memory
  type: project
  originSessionId: c468f252-b6ad-4acc-90a1-af93eca45467
  modified: 2026-08-13T13:29:15.490Z
---

Efe'nin makinesinde (2026 Ağustos itibarıyla) **tek kurulu .NET SDK 3.1.426**
→ MSBuild **16.7**. Runtime olarak 3.1.32 ve 6.0.11 var, 8/9/10 yok.
Yönetici yetkisi **yok**, bu yüzden standart SDK kurulumu yapılamıyor.

Bunun sonucu: **C# Dev Kit** (`ms-dotnettools.csdevkit`) `netcoreapp3.1`
projesini yükleyemiyor ve iki mesaj veriyor —
`Failed to monitor project loading status.` ve
`Failed to restore NuGet packages for the solution.`
**İkisi de derleyici hatası değil**: `dotnet build` 0 hata veriyor, NuGet
komut satırından sorunsuz restore ediliyor. Sorun yalnızca editörün proje
yükleme katmanında.

Denenen çözüm: `dotnet.preferCSharpExtension: true` ayarı
(`Aaa\.vscode\settings.json` ve `practice\backend\.vscode\settings.json`).
Eklentinin kendi açıklaması bu ayarı "Dev Kit'in desteklemediği eski proje
türleri" için öneriyor. `dotnet.server.useOmnisharp` işe yaramaz — Dev Kit
kuruluyken dikkate alınmıyor.

Kalan risk: C# eklentisi Microsoft.Build.Framework **17.11** + MSBuildLocator
taşıyor, yani MSBuild'i kurulu SDK'dan buluyor → 16.7 ile sürüm uyuşmazlığı
sürebilir. Dil sunucusunun kendisi çalışıyor (eklenti kendi özel .NET 10.0.10
runtime'ını indirmiş). Ayar yetmezse kesin çözüm: **.NET 8 SDK'yı
`dotnet-install.ps1` ile kullanıcı klasörüne kurmak** (yönetici gerekmez).

Ayrıca: makinede Visual Studio **Build Tools 2026** (MSBuild 18.5) var ama
yalnızca C++ iş yükü kurulu, .NET SDK'sı yok — bu yüzden işe yaramıyor.

**Güncelleme — 13 Ağustos 2026:** Dev Kit kaldırılırken **C# eklentisinin kendisi
de (`ms-dotnettools.csharp`) gitmiş**. `code --list-extensions` çıktısında yalnızca
`ms-dotnettools.vscode-dotnet-runtime` kaldı. Yani VS Code'da hiç C# dil desteği
yok: IntelliSense, `Ctrl+.`, F12 çalışmıyor — ama `dotnet build` 0 hata veriyor.
`.vscode/settings.json` içindeki `useOmnisharp` / `preferCSharpExtension`
ayarlarını okuyan eklenti olmadığı için ikisi de şu an **etkisiz**.
Çözüm: sadece `ms-dotnettools.csharp` kur, Dev Kit'i geri kurma.

**Güncelleme 2 — 13 Ağustos 2026, öğleden sonra:** `ms-dotnettools.csharp`
**2.140.9 geri kuruldu** (13:19) ve OmniSharp 1.39.14-net6.0 indirilmiş durumda
(`.omnisharp\1.39.14-net6.0`, 486 dosya, tam). Bu sürümde
`dotnet.server.useOmnisharp` ve `dotnet.defaultSolution` ayarları **hâlâ var**,
yani `.vscode\settings.json` yeniden etkili.
Otomatik tamamlamanın gelmemesinin sebebi: VS Code 11:36'da açılmış, eklenti
13:19'da kurulmuş → **pencere yenilenmedi**, hiçbir `dotnet.exe`/OmniSharp
süreci çalışmıyordu. Çözüm: `Developer: Reload Window`.
Ayrıca workspace kökü `Aaa`'da **üç ayrı .sln** var (deneme/Deneme.sln,
practice/CountryApi.sln, proje/CountryApi.sln) → OmniSharp hangisini
yükleyeceğini seçemeyebilir; gerekirse `dotnet.defaultSolution` ayarlanmalı
ya da doğrudan proje klasörü açılmalı.

Doğrulanan paket sürümleri (netcoreapp3.1 ile uyumlu, bu makinede derlendi):
Npgsql **5.0.18**, Dapper **2.1.35**, Swashbuckle.AspNetCore **5.6.3**.
Sürüm vermeden `dotnet add package Npgsql` denenirse en yeni sürüm (10.0.3)
gelir ve `netcoreapp3.1 ile uyumlu değil` hatası verir — `--version` şart.

İlgili: [[efe-stajyer-agldn-989]], [[dotnet-temelleri-kilavuzu]]
