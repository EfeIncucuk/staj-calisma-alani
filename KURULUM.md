# Format sonrasi kurulum

Bu depo `C:\Users\Efe\Desktop\Aaa` calisma alaninin tam yedegi.
Yeni makinede sifirdan ayaga kaldirmak icin asagidaki sirayi izle.

> `pgsql/` (PostgreSQL ikilileri) ve `pgdata/` (veritabani dosyalari) **depoda yok** —
> bilerek. Ikisi de bu dosyadaki adimlarla yeniden uretilir; veri kaybi olmaz
> cunku tum seed SQL'leri (`db/02/03/04-seed-*.sql`) depoda ve internet gerektirmez.

---

## 0. Depoyu al

```powershell
cd C:\Users\Efe\Desktop
git clone <repo-url> Aaa
cd Aaa
```

## 1. Gerekli yazilimlar

| Ne | Neden | Nereden |
|---|---|---|
| Git | depo | https://git-scm.com |
| .NET SDK **3.1** | `proje/` (netcoreapp3.1) | https://dotnet.microsoft.com/download/dotnet/3.1 |
| .NET SDK **8.0** | `proje_v2/` | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js 18+ | frontend (Vite) | https://nodejs.org |
| VS Code | editor | https://code.visualstudio.com |

> .NET 3.1 destek disi ama indirilebilir durumda. `global.json` yok, yani en yeni SDK
> varsayilan olur; `dotnet build` yine calisir, sadece `NETSDK1138` uyarisi verir.

## 2. PostgreSQL 16 (tasinabilir) kurulumu

Kurulum sihirbazi degil, **zip ikilileri** kullaniliyor — makineye hicbir sey yazmaz.

1. https://www.enterprisedb.com/download-postgresql-binaries adresinden
   **PostgreSQL 16.4, Windows x86-64** zip'ini indir.
2. Zip icindeki `pgsql` klasorunu `proje\pgsql` olacak sekilde cikar
   (yani `proje\pgsql\bin\postgres.exe` yolu olusmali).

### Veri klasorunu (`pgdata`) olustur

```powershell
cd C:\Users\Efe\Desktop\Aaa\proje
.\pgsql\bin\initdb.exe -D pgdata -U postgres -E UTF8
```

Sifre sorulmaz; `pg_hba.conf` varsayilani `trust` (yerel makine, sifresiz baglanti).

### Portu 5434 yap

`proje\pgdata\postgresql.conf` icinde `port` satirini bul, su hale getir:

```
port = 5434
```

(Satir basindaki `#` varsa kaldir. Bu adim atlanirsa varsayilan 5432 kalir ve
tum betikler/baglanti dizeleri kirilir.)

### Baslat ve veritabanini olustur

```powershell
.\scripts\start-db.ps1
.\pgsql\bin\createdb.exe -h localhost -p 5434 -U postgres AnahtarGlobalLondra
.\scripts\reset-db.ps1
.\scripts\psql.ps1 -f db\99-verify.sql     # "HATA" satiri cikmamali
```

> `proje_v2` ayni sunucuyu kullanir, veritabani adi farkli:
> `.\pgsql\bin\createdb.exe -h localhost -p 5434 -U postgres AglGlobal`

## 3. Bagimliliklar

```powershell
cd C:\Users\Efe\Desktop\Aaa\proje\frontend ; npm install
cd C:\Users\Efe\Desktop\Aaa\proje\backend  ; dotnet restore
cd C:\Users\Efe\Desktop\Aaa\proje_v2       ; dotnet restore
```

## 4. Calistir

Uc ayri PowerShell penceresi (ayrintilar icin `CLAUDE.md`):

```powershell
cd proje ; .\scripts\start-db.ps1               # 1) veritabani
cd proje\backend\CountryApi ; dotnet run        # 2) API  -> localhost:5001
cd proje\frontend ; npm run dev                 # 3) UI   -> localhost:5174
```

## 5. Claude Code hafizasini geri yukle

```powershell
$h = "$env:USERPROFILE\.claude\projects\C--Users-Efe-Desktop-Aaa\memory"
New-Item -ItemType Directory -Force $h
Copy-Item _arsiv\claude-hafiza\memory\*.md $h
Copy-Item _arsiv\claude-hafiza\settings*.json "$env:USERPROFILE\.claude\"
```

---

## `practice/` klasoru

Ayni adimlar gecerli, sadece portlar farkli — `practice\pgdata\postgresql.conf`
icinde **`port = 5433`** olmali, veritabani adi yine `AnahtarGlobalLondra`.
`practice/` bilerek farkli portlarda calisir ki `proje/` ile ayni anda acilabilsin.

---

## `_arsiv/git-bundles/` nedir

`proje/` ve `proje_v2/` bu depoya tasinmadan once **kendi ayri git depolariydi**.
Bu depoda dosyalari duz halde duruyor ama o eski commit gecmisleri kaybolmasin diye
her biri tek dosyalik bir *bundle* olarak saklandi. Geri acmak icin:

```powershell
git clone _arsiv\git-bundles\proje.bundle proje-gecmis
cd proje-gecmis ; git log --oneline --all
```

`proje.bundle` icinde `feature/AGLDN-989` (7 commit) ve `master` dallarinin tamami var.
