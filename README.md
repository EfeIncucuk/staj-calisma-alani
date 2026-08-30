# Aaa — staj calisma alani yedegi

`C:\Users\Efe\Desktop\Aaa` calisma alaninin tam yedegi.

| Klasor | Ne |
|---|---|
| `proje/` | **AGLDN-989 Country Definition** — asil proje. React + ASP.NET Core 3.1 + PostgreSQL |
| `proje_v2/` | **AglGlobal** — ikinci tur: .NET 8 + EF Core code-first |
| `practice/` | Sirketin verdigi pratik ortami (referans, degistirilmiyor) |
| `deneme/` | Ogrenme amacli denemeler |
| `_arsiv/` | `proje/` ve `proje_v2/`'nin eski git gecmisleri (bundle) + Claude Code hafizasi |

- **Yeni makinede kurulum:** [`KURULUM.md`](KURULUM.md)
- **Projenin ayrintilari, portlar, mimari, tuzaklar:** [`CLAUDE.md`](CLAUDE.md)

`pgsql/` (PostgreSQL ikilileri) ve `pgdata/` (veritabani dosyalari) bilerek depoda
degil — `KURULUM.md` ikisini de sifirdan olusturmayi anlatiyor. Seed SQL'leri depoda,
yani veritabani internetsiz yeniden kurulabilir.
