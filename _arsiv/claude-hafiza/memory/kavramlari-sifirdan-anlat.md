---
name: kavramlari-sifirdan-anlat
description: "Efe bir kavramı ilk kez duyuyorsa 'bunu biliyorsun' varsayma — ne olduğu, neden şimdi, nasıl eklenir sırasıyla anlat"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 542125b1-b62c-44ee-a7ed-7914900d866d
  modified: 2026-08-16T20:05:03.225Z
---

**14 Ağustos 2026**: Efe, `[Required]` etiketini "eklememişsin" diye geçerken
uyardı: *"Bazı şeyleri sanki biliyormuşum gibi yazıyorsun fakat bilmiyorum."*

Yeni bir kavramı ilk kez andığımda üç soruyu sırayla cevapla:
1. **Bu şey ne?** (attribute nedir, DataAnnotations nereden geliyor)
2. **Neden şimdi / önceden neden yoktu?** — tarihçe önemli, çünkü daha önce
   bilinçli olarak yapmadığımız şeyler var ve sebebini bilmek istiyor
3. **Nasıl eklerim?** — hangi dosya, hangi `using`, hangi satır

**Why:** Efe neredeyse sıfırdan başlayan bir stajyer ([[efe-stajyer-agldn-989]]);
"şunu ekle" demek onun için eksik bilgi, sadece yönerge. Kavramı anlamadan
eklediği kod, iki hafta sonra gerçek projede tanımadığı kod olur.

**How to apply:** Bir öneri cümlesi kurarken ("X ekle", "Y'ye geçir") o X daha
önce bu sohbette açıklanmadıysa, öneriyle birlikte kısa bir "bu nedir" bölümü
ver. Kod yazma kuralı hâlâ geçerli — [[efe-kodu-kendisi-yazmak-istiyor]]:
sözdizimini göster, uygulamayı ona bırak.
