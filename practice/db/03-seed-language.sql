-- =====================================================================
--  Language  -  Dil dropdown'inin kaynagi
--  Otomatik uretildi: db/generate-seed.mjs
--
--  DIKKAT / TUZAK:
--  Bes dil var ama sadece IKISI aktif (RecordStatus = 1).
--  Kabul kriteri dropdown'da sadece Turkce ve Ingilizce gorunmesini istiyor.
--  Listeleme sorgunda  RecordStatus = 1  filtresi yoksa besi de gorursun
--  ve Test Senaryosu 1 (Dil) basarisiz olur.
-- =====================================================================

TRUNCATE TABLE "SystemAdmin"."Language" RESTART IDENTITY CASCADE;

INSERT INTO "SystemAdmin"."Language"
    ("Name", "Code", "EngName", "OrgName", "RecordStatus")
VALUES
    ('Türkçe', 'tr-TR', 'Turkish', 'Türkçe', 1),
    ('İngilizce', 'en-GB', 'English', 'English', 1),
    ('Almanca', 'de-DE', 'German', 'Deutsch', -1),
    ('Fransızca', 'fr-FR', 'French', 'Français', -1),
    ('Arapça', 'ar-SA', 'Arabic', 'العربية', -1);
