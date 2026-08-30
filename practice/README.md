# AGLDN-989 · Country Definition — Pratik Ortamı

Gerçek projeye dokunmadan, kendi kum havuzunda **Country Definition** ekranını
uçtan uca bir kez yazman için hazırlanmış çalışma ortamı.

Veritabanı, şema ve gerçek veri hazır. Backend ve frontend çalışır durumda ama
**boş** — ekranın tamamını sen yazacaksın.

---

## 1. Nasıl başlatılır

Üç ayrı PowerShell penceresi aç, her birinde sırayla:

```powershell
# 1. pencere — veritabanı (bir kez çalıştır, arka planda kalır)
.\scripts\start-db.ps1

# 2. pencere — backend API (açık kalmalı)
.\scripts\start-backend.ps1

# 3. pencere — frontend (açık kalmalı)
.\scripts\start-frontend.ps1
```

Sonra tarayıcıda **http://localhost:5173** — yeşil "Ortam hazır" panelini
görüyorsan üç katman da birbirine bağlı demektir.

> Bilgisayarı yeniden başlattığında veritabanı kapanır; `start-db.ps1`'i
> tekrar çalıştırman gerekir. Veri kaybolmaz.

### Adresler

| Katman | Adres |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| **Swagger** | http://localhost:5000/swagger |
| Kontrol ucu | http://localhost:5000/api/ping |
| PostgreSQL | localhost:**5433** |

> **Swagger'ı kullan.** Yazdığın her ucu tarayıcıdan deneyebilirsin — POST/PUT/DELETE
> dahil. Ekranı yazmaya başlamadan önce backend'i buradan test et; hata ayıklaması
> çok daha kolay olur, çünkü sorun frontend'de mi backend'de mi ayırt edebilirsin.

### Veritabanı bağlantı bilgileri

dBeaver kurarsan bu bilgilerle bağlanabilirsin:

| Alan | Değer |
|---|---|
| Host | `localhost` |
| Port | `5433` |
| Database | `AnahtarGlobalLondra` |
| Username | `postgres` |
| Password | *(yok — boş bırak)* |
| Schema | `SystemAdmin` |

dBeaver yoksa `.\scripts\psql.ps1` ile komut satırından bağlanabilirsin.

---

## 2. Klasörde ne var

```
practice/
├─ db/
│  ├─ 01-schema.sql          Şema — kılavuzun CREATE TABLE ifadeleri
│  ├─ 02-seed-currency.sql   178 ISO 4217 para birimi
│  ├─ 03-seed-language.sql   5 dil (2'si aktif — tuzak, aşağıda)
│  ├─ 04-seed-country.sql    250 ülke (247'si aktif)
│  ├─ 99-verify.sql          Verinin doğruluğunu denetleyen sorgular
│  └─ generate-seed.mjs      Seed'i internetten yeniden üreten script
│
├─ backend/CountryApi/       .NET Core 3.1 Web API
│  ├─ Startup.cs             Servis kayıtları + CORS  (yorumlu)
│  ├─ appsettings.json       Bağlantı dizesi
│  ├─ Controllers/
│  │  └─ PingController.cs   TEK örnek uç — Dapper kalıbını gösteriyor
│  └─ Models/ Dtos/ Services/ Repositories/     ← boş, senin için
│
├─ frontend/                 React 18 + TypeScript + Ant Design 5
│  ├─ vite.config.ts         /api → localhost:5000 proxy'si
│  └─ src/App.tsx            Ortam kontrol paneli + BOŞ ekran yer tutucusu
│
└─ scripts/                  başlat / durdur / sıfırla / denetle
```

### Kullandığın sürümler

| | Sürüm | Not |
|---|---|---|
| .NET Core | **3.1** | Gerçek projenin sürümü. `Startup.cs` dünyası — internetteki örneklerin çoğu daha yeni sürüm için yazılmış, `Program.cs` tek dosya gösteriyorlar. Sende bu bicim geçerli. |
| React | 18.3 | |
| Ant Design | **5.29** | Kılavuzdaki test senaryolarındaki `ant-input-status-success` sınıfı bu sürümün. |
| PostgreSQL | 16.4 | Taşınabilir sürüm, kurulum yapılmadı. |
| Veri erişimi | Dapper + Npgsql | Bkz. aşağıdaki "Gerçek projeden farklar". |

---

## 3. Görevin

**Kabul kriterleri:** Stajyer Kılavuzu, sayfa 4–7.
**Test senaryoları:** sayfa 10–15.
Ekranı yazmaya başlamadan ikisini de baştan sona oku.

Önerilen sıra — her adımdan sonra tarayıcıda çalıştığını gör, sonra devam et:

1. Tabloyu API'den doldur (sadece okuma, 12 kolon)
2. Üç dropdown'ı doldur (Para Birimi, Dil, Muhasebe Bölgesi)
3. Formu kur — 11 alan, zorunluluk, `maxLength`'ler, karakter filtreleri, `onBlur` trim
4. Temizle butonu
5. Kaydet: doğrulama → onay modalı → POST → yeşil toast → formu temizle → tabloyu yenile
6. Düzenle ikonu → satırı forma doldur → PUT
7. Sil ikonu → onay → soft delete

Yazacağın uçlar:

```
GET    /api/country          aktif kayıtlar, Currency + Language JOIN'li
POST   /api/country          6 zorunlu alan için unique kontrolü
PUT    /api/country/{id}     unique kontrolünde kendi kaydını hariç tut
DELETE /api/country/{id}     soft delete → RecordStatus = -1
GET    /api/currency         dropdown kaynağı
GET    /api/language         dropdown kaynağı, RecordStatus = 1 filtresiyle
```

---

## 4. Verideki tuzaklar

Seed verisi rastgele değil — kabul kriterlerini **atlarsan yakalanacak** şekilde
kurgulandı. Dördü de kılavuzdaki gerçek test senaryolarına karşılık geliyor.

### Tuzak 1 — Silinmiş ülkeler

Tabloda 250 ülke var, **247'si aktif**. Üçü `RecordStatus = -1`
(Antarctica, Bouvet Island, Heard Island and McDonald Islands).

Ekranın listesinde **247 satır** görmelisin. 250 görüyorsan listeleme
sorgunda `RecordStatus = 1` filtresi eksik.

### Tuzak 2 — Pasif diller

`Language` tablosunda 5 dil var, sadece **2'si aktif** (Türkçe, İngilizce).
Almanca, Fransızca ve Arapça `RecordStatus = -1`.

Kabul kriteri dropdown'da sadece Türkçe ve İngilizce görünmesini istiyor.
Filtreyi koymazsan beşi de düşer ve **Dil / Test Senaryosu 1** başarısız olur.

### Tuzak 3 — Boş sayısal alanlar

Aktif kayıtların bir kısmında bu alanlar `NULL`:

| Alan | Boş kayıt sayısı |
|---|---|
| Riskscore | ~62 |
| LanguageId | ~155 |
| AccountingRegionCode | ~89 |
| CurrencyId | 3 |

Bunları tabloda ve güncelleme formunda **boş** göstermelisin. `0` ya da
`null` yazısı görünüyorsa gösterim mantığın eksik.

### Tuzak 4 — Kılavuzdaki "Turkey" kaydı

Regresyon senaryoları (Test Senaryosu 3–11) sistemde şu kaydın bulunduğunu
varsayıyor. Birebir üretildi:

| Alan | Değer |
|---|---|
| CountryName | `Turkey` |
| CountryNameOriginal | `Türkiye` |
| CountryNameOfficial | `The Republic of Turkey` |
| Country2AlpCode | `TR` |
| Country3AlpCode | `TUR` |
| CountryNumCode | `792` |
| Para birimi | TRY |
| Dil | Türkçe |
| PhoneCode | `90` |
| Riskscore | `5` |

`United Kingdom` kaydı da Test Senaryosu 9 için aktif tutuldu.

Yani kılavuzdaki **unique kontrolü senaryolarını harfiyen koşabilirsin**:
"Turkey" yazıp kaydetmeye çalış, hata almalısın.

---

## 5. Kendini denetleme

```powershell
.\scripts\verify-db.ps1     # 7 başlıkta veri raporu
.\scripts\reset-db.ps1      # veriyi fabrika ayarına döndür (kendi kayıtların silinir)
.\scripts\psql.ps1          # veritabanına komut satırından bağlan
```

`verify-db.ps1` çıktısında **"tekrar" ve "ihlal" kolonlarındaki her sayı 0
olmalı.** Değilse veri bozulmuş — `reset-db.ps1` çalıştır.

Test yaparken şu sırayı öneririm: `reset-db.ps1` → senaryoyu koş → sonucu yaz →
bir sonraki senaryo. Böylece her senaryo temiz veriyle başlar.

---

## 6. Gerçek projeden farklar

Bu ortam öğrenmek için kuruldu, birebir kopya değil. Bilmen gereken farklar:

| Konu | Burada | Gerçek projede |
|---|---|---|
| **Veri erişimi** | Dapper + Npgsql — SQL'i kendin yazıyorsun, ne olduğunu görüyorsun | EF Core veya Dapper. **Faz 0'da bunu tespit et.** EF Core ise: `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 3.1.*` |
| **Frontend derleyici** | Vite | Muhtemelen Create React App. React/TypeScript/AntD kodu **aynı**, sadece başlatma komutu ve proxy ayarı farklı. |
| **Katmanlar** | `PingController` her şeyi tek dosyada yapıyor | Controller → Service → Repository ayrımı zorunlu. Sen de öyle yaz — `Services/` ve `Repositories/` klasörleri boş bırakıldı. |
| **Kimlik doğrulama** | Yok. `RecordCreateUser` alanına elle bir sayı yaz. | Oturumdaki kullanıcıdan gelir. |
| **Ortak altyapı** | Yok | Standart hata sarmalayıcısı, ortak bileşenler, temel sınıflar vardır. **Onları kullan, yenisini yazma.** |
| **Excel'e aktar** | Kütüphane kurulmadı | Projede zaten bir aktarma altyapısı olabilir; önce onu ara. |

Bu ortamda yazdığın kod gerçek projeye **kopyalanmaz** — desenler farklı olacak.
Buradan taşıyacağın şey kod değil, **ekranın nasıl çalıştığını bilmek.**

---

## 7. Sırada ne var

Bittiğinde şunları yapabiliyor olacaksın: React formu kurmak, Ant Design
tablosunu API'den doldurmak, .NET Core'da katmanlı bir CRUD servisi yazmak,
PostgreSQL'de JOIN'li sorgu kurmak ve soft delete uygulamak.

Bunlar gerçek task'ın tamamı. Orada tek yeni şey şirketin kendi desenine
uyum sağlamak olacak — ve onun yolu SourceGraph'ta mevcut bir ekranı bulup
taklit etmek.
