---
name: sifirdan-kurulum-karari
description: "Efe her katmanı (PostgreSQL sunucusu, şema, seed üreteci, iki proje) sıfırdan kendisi kuruyor; practice/ klasörü sadece referans"
metadata: 
  node_type: memory
  type: project
  originSessionId: c468f252-b6ad-4acc-90a1-af93eca45467
  modified: 2026-08-11T11:18:28.762Z
---

**2026 Ağustos**: Efe gerçek projeye erişemediği için Country Definition ekranını
yerel olarak yazacak — ve **her katmanı sıfırdan kendisi kuracak**: PostgreSQL
sunucusu, şema DDL'i, seed üreteci, backend ve frontend projeleri.

Klasör düzeni:
- `Desktop\Aaa\practice\` — benim kurduğum, çalışan **referans** ortam. Dokunulmuyor.
- `Desktop\Aaa\proje\` (ismi ona kalmış) — kendi kuracağı ortam.

Port ayrımı (ikisi aynı anda çalışamaz):
| | practice | kendi ortamı |
|---|---|---|
| PostgreSQL | 5433 | **5434** |
| Backend | 5000 | **5001** |
| Frontend | 5173 | **5174** |

**Referans disiplini** — roadmap'in en önemli kuralı: önce 30 dk kendi dener,
sonra bakar; baktığında kopyalamaz, okur/kapatır/kendi yazar. Ortam sorunlarında
(port, bağlantı dizesi, paket sürümü) serbestçe bakabilir, çünkü öğrenme değeri yok.

Roadmap 10 faza çıktı (~32 iş günü) ve artifact olarak yayımlandı:
https://claude.ai/code/artifact/afd6bffa-a722-4b10-8633-66bcfd15b7e2

İlgili: [[efe-stajyer-agldn-989]], [[efe-kodu-kendisi-yazmak-istiyor]],
[[dotnet-31-vscode-devkit-uyumsuzlugu]]
