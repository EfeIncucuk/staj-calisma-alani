# CLAUDE.md

Bu dosya Claude Code'a bu çalışma alanı hakkında kalıcı bağlam verir.

## Asıl proje nerede

**`.\proje\`** — gerçek iş bu klasörde. Diğer klasörler referans/deneme:

| Klasör | Ne | Kural |
|---|---|---|
| `proje/` | **AGLDN-989 Country Definition** — asıl proje, kendi git deposu | Tüm iş burada |
| `practice/` | Hazır verilmiş pratik ortamı (aynı ekranın referansı) | **Sadece oku, değiştirme** |
| `deneme/` | `DenemeApi`, `Oyun`, `frontend-deneme` — öğrenme amaçlı denemeler | Dokunma |

`practice/` portları bilerek farklı (5433 / 5000 / 5173) ki `proje/` ile aynı anda çalışabilsin. Karıştırma.

---

## Ne yapıyor

Ülke tanımları (Country Definition) CRUD ekranı: liste + form, para birimi ve dil dropdown'ları,
mükerrer kayıt kontrolü, soft delete.

Katmanlar: **React (Vite + antd) → ASP.NET Core 3.1 Web API (Dapper) → PostgreSQL**

```
proje/
  backend/CountryApi/      # ASP.NET Core 3.1, Controller -> Service -> Repository -> Dapper
  frontend/                # React 18 + TypeScript + Vite + antd 5 + axios
  db/                      # şema + üretilmiş seed SQL'leri
  scripts/                 # PostgreSQL başlat/durdur/reset PowerShell betikleri
  pgsql/ pgdata/           # taşınabilir PostgreSQL kurulumu + veri (git'te değil)
```

## Portlar ve bağlantı

| Katman | Adres |
|---|---|
| Frontend (Vite) | http://localhost:5174 |
| Backend API | http://localhost:5001 |
| Swagger | http://localhost:5001/swagger |
| PostgreSQL | localhost:**5434**, db `AnahtarGlobalLondra`, kullanıcı `postgres`, şifre yok |
| Şema | `SystemAdmin` |

Bu üçü birbirine bağlı, birini değiştirirsen diğerlerini de değiştir:

- `frontend/vite.config.ts` → `server.port: 5174` ve `proxy: { '/api': 'http://localhost:5001' }`
- `backend/CountryApi/Startup.cs` → CORS politikası `"React"`, izinli origin `http://localhost:5174`
- `backend/CountryApi/Properties/launchSettings.json` → `applicationUrl: http://localhost:5001`

Frontend istekleri `/api/...` şeklinde göreli atar, Vite proxy'si backend'e yönlendirir.

## Çalıştırma

Üç ayrı PowerShell penceresi:

```powershell
# 1) veritabanı (bir kez; bilgisayar kapanınca tekrar gerekir, veri kaybolmaz)
cd proje ; .\scripts\start-db.ps1

# 2) backend (açık kalmalı)
cd proje\backend\CountryApi ; dotnet run

# 3) frontend (açık kalmalı)
cd proje\frontend ; npm run dev
```

Diğer betikler (hepsi `proje/` kökünden çalıştırılır):

```powershell
.\scripts\stop-db.ps1                    # PostgreSQL durdur
.\scripts\psql.ps1 -f db\99-verify.sql   # psql çalıştır (DB kapalıysa uyarır)
.\scripts\reset-db.ps1                   # DB'yi sıfırla: 00-reset -> 01-schema -> 02/03/04-seed
node db\generate-seed.mjs                # seed SQL'lerini yeniden üret (internet ister)
```

`backend/` ve `frontend/` için başlatma betiği **yok** — elle `dotnet run` / `npm run dev`.

## Veritabanı

- `db/01-schema.sql` — elle yazılmış şema. Tablolar: `Country`, `Currency`, `Language`.
- `db/02/03/04-seed-*.sql` — **üretilmiş dosyalar, elle düzenlenmez.** Kaynak `db/generate-seed.mjs`
  (mledoze/countries verisini indirip SQL üretir). Değişiklik gerekiyorsa üreteci düzenle.
- `db/99-verify.sql` — seed doğrulama; "HATA" satırı gerçek problemdir.
- `db/deneme.sql` — geçici sorgu karalaması, kimse kullanmıyor.

Şemanın bilerek yapılmış özellikleri:

- **FOREIGN KEY yok.** `CurrencyId` / `LanguageId` sahipsiz kalabilir; DB korumaz.
- Benzersiz olması gereken 6 alan (`CountryName`, `CountryNameOriginal`, `CountryNameOfficial`,
  `Country2AlpCode`, `Country3AlpCode`, `CountryNumCode`) için **UNIQUE kısıt yok** —
  mükerrer kontrolü `CountryRepository.IsDuplicateAsync` içinde SQL ile yapılıyor.
- `RecordStatus`: `1` = aktif, `-1` = silinmiş. **Silme = soft delete**, her sorgu
  `RecordStatus = 1` filtrelemeli.
- Dil dropdown'ı ve join'ler sadece aktif dilleri gösterir (`l."RecordStatus" = 1`).

### Tuzaklar

- Kolon adı **`"Riskscore"`** (küçük `s`) ama C# property'si `RiskScore`. Dapper büyük/küçük
  harf duyarsız eşlediği için çalışıyor; SQL yazarken kolonu `"Riskscore"` diye yaz.
- Tüm tanımlayıcılar çift tırnaklı ve PascalCase. Tırnaksız yazarsan PostgreSQL küçük harfe
  çevirir ve "kolon yok" hatası alırsın.
- `.vscode/settings.json` içinde `mssql.intelliSense.enableErrorChecking: false` var:
  mssql eklentisi T-SQL grameriyle geçerli PostgreSQL kodunu yanlış kırmızıya boyuyordu.

## Backend

`netcoreapp3.1` + Dapper 2.1.35 + Npgsql 5.0.18 + Swashbuckle 5.6.3. **EF Core yok, ham SQL var.**

Katman düzeni — yeni bir alan eklerken hepsine dokunulur:

```
Controllers/XController.cs   -> HTTP, status kodları
Services/XService.cs         -> iş kuralları, DTO->Model dönüşümü, Trim/ToUpper, audit alanları
Repositories/XRepository.cs  -> Dapper + ham SQL, tek iş
Models/X.cs                  -> DB satırını temsil eder
Dtos/XListDto, XSaveDto      -> dışarı/içeri taşınan şekil
```

Her katmanın bir arayüzü var (`ICountryService` vb.) ve `Startup.ConfigureServices` içinde
`AddScoped` ile kaydediliyor. **Yeni servis/repository eklersen oraya kaydetmeyi unutma.**

Yerleşmiş kurallar:

- `Country` tam CRUD; `Currency` ve `Language` sadece `GET` (dropdown kaynağı).
- Doğrulama `CountrySaveDto` üzerinde DataAnnotations ile (`[Required]`, `[StringLength]`, `[Range]`).
- Mükerrer → `409 Conflict`, bulunamadı → `404`, güncelle/sil başarılı → `204 NoContent`.
- `Trim()` / `ToUpper()` **Service katmanında** yapılır, controller'da değil.
- Audit alanları Service'te set edilir: `RecordCreateDate/User/Status` eklerken,
  `RecordUpdateDate` güncellerken. Kullanıcı kimliği yok, `RecordCreateUser = 0` sabit.
- Bağlantı dizesi `appsettings.json` → `ConnectionStrings:CountryDb`.

### .NET SDK durumu

Makinede 3.1.426, 8.0.424 ve 10.0.400 kurulu; `global.json` yok, yani varsayılan SDK 10.0.400.
`dotnet build backend/CountryApi.sln` **çalışıyor** — sadece `NETSDK1138` (netcoreapp3.1 destek
dışı) uyarısı veriyor; bu normal, hata değil.

VS Code tarafında C# Dev Kit bu eski hedefle çalışmıyordu; kök `.vscode/settings.json` içinde
`dotnet.server.useOmnisharp: true` ve `dotnet.preferCSharpExtension: true` bu yüzden var.
Gerekçesinin tamamı o dosyanın yorumlarında yazılı.

## Frontend

React 18 + TS + Vite + **antd 5** + axios. Tek gerçek ekran: `src/CountryPage.tsx` (~400 satır),
`App.tsx` sadece onu render ediyor.

- Tüm UI antd bileşenleriyle: `Form`, `Table`, `Modal.confirm`, `Select`, `message`.
- **Türkçe arayüz.** Değişken/fonksiyon adları da Türkçe (`getir`, `kaydet`, `sil`, `duzenle`,
  `trimle`, `duzenlenenId`). Yeni kod yazarken bu alışkanlığı sürdür.
- Ekle/güncelle aynı formda: `duzenlenenId === null` ise POST, değilse PUT.
- Kaydet ve sil öncesi `Modal.confirm` onayı; sonuç `message.success/error` ile bildirilir.
- Hata eşlemesi: `409` → "Bu ülke zaten kayıtlı", `400` → "Girilen bilgilerde hata var".
- Girdi temizliği `normalize` ile (sadece harf / sadece rakam) + `onBlur` trim.
- Zorunlu alan yıldızı elle çizilen `<Yildiz />` bileşeni, antd'nin kendi `required` işareti değil.

Bilinen boşluklar (yapılmadı, bozuk değil):

- "Excel'e Aktar" butonunun `onClick` handler'ı yok.
- `accountingRegionDesc` dropdown'dan seçiliyor ama `accountingRegionCode` hiç doldurulmuyor.
- `@ant-design/icons` import ediliyor ama `package.json`'da yok — antd üzerinden geçişli olarak
  `node_modules`'da bulunduğu için çalışıyor. Temiz kurulumda kırılabilir; doğrudan bağımlılık
  olarak eklemek doğru olur.
- `src/Deneme.tsx` ve `src/CountryPage.tsx.bak` artık kullanılmıyor.

## Git

`proje/` kendi git deposu (uzak sunucu yok, sadece yerel). Aktif dal: **`feature/AGLDN-989`**.
Commit mesajları Türkçe ve kısa.

`.gitignore` dışarıda tutuyor: `pgsql/`, `pgdata/`, `pgsql.log`, `bin/`, `obj/`,
`node_modules/`, `dist/`, `.vs/`.

## Test

Test altyapısı **yok**. Doğrulama elle: `db/99-verify.sql`, Swagger UI ve tarayıcı.

## Bu projede çalışırken

- **Efe özellik kodunu kendisi yazıyor.** İstenmedikçe `backend/` veya `frontend/` altına kod
  yazma; plan, kavram anlatımı, hata ayıklama, ortam kurulumu serbest.
- Bir şey önermeden önce sırayla anlat: **bu nedir → neden şimdi gerekli → nasıl eklenir**.
- Yeni bir alan/özellik eklerken zincir hep aynı:
  `db/01-schema.sql` → `Models` → `Dtos` → `Repository` (SQL) → `Service` → `Controller` →
  `CountryPage.tsx` (interface + form alanı + tablo kolonu).
