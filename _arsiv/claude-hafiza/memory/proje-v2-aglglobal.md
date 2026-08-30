---
name: proje-v2-aglglobal
description: İkinci tur proje (proje-v2 / AglGlobal) kararları ve 14 fazlık yol haritası artifact'i.
metadata:
  type: project
---

24 Ağustos 2026'da Efe ilk projeyi (`proje/`, AGLDN-989) sıfırdan ve daha büyük ölçekte
yeniden yazmaya karar verdi. Yeni klasör: `Aaa/proje-v2/`, kendi git deposu.

Kararlar (Efe'nin seçimleri):
- **.NET 8 LTS**, EF Core 8 **code-first** — Dapper ve elle yazılan şema yok.
- **4 ayrı proje**: Domain / Application / Infrastructure / Api (assembly bazlı katman ayrımı).
- **İki modül**: SystemAdmin (Country, Currency, Language, CountryLanguage N-N) +
  Sales (Customer, Product, Order, OrderLine — durum makinesi ve 7 iş kuralı).
- **JWT + rol bazlı auth** (Admin / Operator / RiskApprover).
- **Frontend**: React + antd 5 devam, React Router + kendi paylaşılan bileşen kütüphanesi.
- Portlar: frontend 5175, API 5002, PostgreSQL 5434'teki ortak sunucuda `AglGlobal` veritabanı.

Yol haritası artifact'i (14 faz, 5 bölüm, tuzaklar listesi):
https://claude.ai/code/artifact/b5c1e944-096e-44b3-84ff-e9579f64dc31

Kodu Efe yazıyor — bkz. [[efe-kodu-kendisi-yazmak-istiyor]] ve [[kavramlari-sifirdan-anlat]].
Makinede Visual Studio 2026 Insiders kurulu; .NET 8'e geçişin bir sebebi de
[[dotnet-31-vscode-devkit-uyumsuzlugu]] sorununu ortadan kaldırmak.
