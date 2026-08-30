// =====================================================================
//  Seed ureteci  -  AGLDN-989 pratik ortami
//
//  Ne yapar: internetten gercek ISO verisini ceker ve uc SQL dosyasi uretir.
//    02-seed-currency.sql   ISO 4217 para birimleri
//    03-seed-language.sql   Diller (bazilari RecordStatus = -1)
//    04-seed-country.sql    Gercek ulkeler, kendi alfabelerindeki isimleriyle
//
//  Calistirmak icin:  node db/generate-seed.mjs
//  (Bir kez calistirildi, uretilen SQL dosyalari klasorde duruyor.
//   Veriyi sifirlamak istersen tekrar calistirmana gerek yok,
//   sadece reset-db.ps1 kullan.)
// =====================================================================

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---------- yardimcilar ----------

/** SQL string literal'i guvenli hale getirir: tek tirnaklari ikiye katlar. */
const q = (v) => (v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

/** Sayisal deger ya da NULL. */
const n = (v) => (v === null || v === undefined || v === "" ? "NULL" : String(v));

/** Virgul ve tirnak iceren alanlari dogru ayiran kucuk bir CSV parser. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const header = (title, extra = "") => `-- =====================================================================
--  ${title}
--  Otomatik uretildi: db/generate-seed.mjs
${extra ? "--\n" + extra + "\n" : ""}-- =====================================================================

`;

// ---------- 1) PARA BIRIMLERI ----------

console.log("ISO 4217 para birimleri cekiliyor...");
const csvRes = await fetch("https://raw.githubusercontent.com/datasets/currency-codes/main/data/codes-all.csv");
if (!csvRes.ok) throw new Error(`Para birimi CSV'si alinamadi: ${csvRes.status}`);
const csvRows = parseCsv(await csvRes.text());

const csvHead = csvRows[0].map((h) => h.trim());
const iCurrency = csvHead.indexOf("Currency");
const iAlpha = csvHead.indexOf("AlphabeticCode");
const iNumeric = csvHead.indexOf("NumericCode");
const iWithdraw = csvHead.indexOf("WithdrawalDate");

const currencies = new Map(); // alphaCode -> { alpha, numeric, name }
for (const r of csvRows.slice(1)) {
  const alpha = (r[iAlpha] || "").trim();
  const numeric = (r[iNumeric] || "").trim();
  const name = (r[iCurrency] || "").trim();
  const withdrawn = (r[iWithdraw] || "").trim();
  // Yururlukten kalkmislari ve kod/isim eksiklerini atla
  if (withdrawn || alpha.length !== 3 || !numeric || !name) continue;
  if (!currencies.has(alpha)) {
    currencies.set(alpha, { alpha, numeric: numeric.padStart(3, "0"), name });
  }
}
const currencyList = [...currencies.values()].sort((a, b) => a.alpha.localeCompare(b.alpha));
console.log(`  ${currencyList.length} para birimi.`);

const currencySql =
  header(
    "Currency  -  Para Birimi dropdown'inin kaynagi",
    `--  Ekranda "TRY - Turkish Lira" bicminde gosterilecek:
--     CurrencyAlphaCode + ' - ' + CurrencyName
--  Hepsi RecordStatus = 1 (aktif).`
  ) +
  `TRUNCATE TABLE "SystemAdmin"."Currency" RESTART IDENTITY CASCADE;\n\n` +
  `INSERT INTO "SystemAdmin"."Currency"\n` +
  `    ("CurrencyAlphaCode", "CurrencyNumericCode", "CurrencyName", "RecordStatus")\nVALUES\n` +
  currencyList
    .map((c) => `    (${q(c.alpha)}, ${q(c.numeric)}, ${q(c.name)}, 1)`)
    .join(",\n") +
  ";\n";

writeFileSync(join(DIR, "02-seed-currency.sql"), currencySql, "utf8");

// ---------- 2) DILLER ----------

// Kabul kriteri: Dil dropdown'inda SADECE Turkce ve Ingilizce gorunecek.
// Bu yuzden pasif (RecordStatus = -1) kayitlar da ekliyoruz: eger listeleme
// sorgunda RecordStatus = 1 filtresini koymazsan bu diller de dropdown'a
// duser ve Test Senaryosu 1 (Dil) BASARISIZ olur. Bilincli bir tuzak.
const languages = [
  { name: "Türkçe",    code: "tr-TR", eng: "Turkish", org: "Türkçe",    status: 1 },
  { name: "İngilizce", code: "en-GB", eng: "English", org: "English",   status: 1 },
  { name: "Almanca",   code: "de-DE", eng: "German",  org: "Deutsch",   status: -1 },
  { name: "Fransızca", code: "fr-FR", eng: "French",  org: "Français",  status: -1 },
  { name: "Arapça",    code: "ar-SA", eng: "Arabic",  org: "العربية",   status: -1 },
];

const languageSql =
  header(
    "Language  -  Dil dropdown'inin kaynagi",
    `--  DIKKAT / TUZAK:
--  Bes dil var ama sadece IKISI aktif (RecordStatus = 1).
--  Kabul kriteri dropdown'da sadece Turkce ve Ingilizce gorunmesini istiyor.
--  Listeleme sorgunda  RecordStatus = 1  filtresi yoksa besi de gorursun
--  ve Test Senaryosu 1 (Dil) basarisiz olur.`
  ) +
  `TRUNCATE TABLE "SystemAdmin"."Language" RESTART IDENTITY CASCADE;\n\n` +
  `INSERT INTO "SystemAdmin"."Language"\n` +
  `    ("Name", "Code", "EngName", "OrgName", "RecordStatus")\nVALUES\n` +
  languages
    .map((l) => `    (${q(l.name)}, ${q(l.code)}, ${q(l.eng)}, ${q(l.org)}, ${l.status})`)
    .join(",\n") +
  ";\n";

writeFileSync(join(DIR, "03-seed-language.sql"), languageSql, "utf8");

// ---------- 3) ULKELER ----------

console.log("Ulke verisi cekiliyor...");
// NOT: restcountries.com API'si (v3.1 ve v5) kullanimdan kaldirildi ve artik
// her istege HTTP 200 ile hata govdesi donuyor. Bu yuzden o API'nin de
// beslendigi statik kaynak veri setini kullaniyoruz.
const cRes = await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json");
if (!cRes.ok) throw new Error(`Ulke verisi alinamadi: ${cRes.status}`);
const raw = await cRes.json();
// Govde 200 donse bile dizi olmayabilir - kontrol et, yoksa hata mesaji anlamsiz olur.
if (!Array.isArray(raw)) {
  throw new Error(`Beklenen dizi gelmedi. Gelen govde: ${JSON.stringify(raw).slice(0, 300)}`);
}
console.log(`  ${raw.length} kayit geldi.`);

// Kilavuzdaki Turkiye satirini BIREBIR uretmek icin istisna.
// Neden: dokumanin regresyon senaryolari (Test Senaryosu 3-11) sistemde
// tam olarak su kaydin bulundugunu varsayiyor -
//   Turkey / Türkiye / The Republic of Turkey / TR / TUR / 792 / TRY / Türkçe / 90 / 5
// Guncel veri setinde ise ulkenin adi "Türkiye" olarak geciyor. Ustune yaziyoruz
// ki dokumandaki senaryolari harfiyen kosabilsin.
const DOC_OVERRIDES = {
  TR: {
    name: "Turkey",
    original: "Türkiye",
    official: "The Republic of Turkey",
    risk: 5,
    regionCode: null,
    regionDesc: null,
  },
};

// Silinmis sayilacak ulkeler (RecordStatus = -1).
// Sabit kodlarla seciliyor ki Turkey ve United Kingdom - test senaryolarinin
// ihtiyac duydugu iki kayit - her zaman aktif kalsin.
const SOFT_DELETE_CODES = new Set(["AQ", "BV", "HM"]);

// Benzersizlik takibi: bu 6 alan senin unique kontrolunu test edecegin alanlar,
// dolayisiyla SEED VERISININ KENDISI de bu alanlarda temiz olmak zorunda.
const seen = { name: new Set(), orig: new Set(), off: new Set(), a2: new Set(), a3: new Set(), num: new Set() };
const skipped = [];
const rows = [];
let syntheticNum = 900001; // ccn3'u olmayan ulkeler icin benzersiz yedek kod

for (const c of raw) {
  const name = c?.name?.common?.trim();
  const official = c?.name?.official?.trim();
  const a2 = (c?.cca2 || "").trim().toUpperCase();
  const a3 = (c?.cca3 || "").trim().toUpperCase();

  if (!name || !official || a2.length !== 2 || a3.length !== 3) {
    skipped.push(`${name || "?"} (eksik isim/kod)`);
    continue;
  }
  // Sadece harf kurali: kabul kriteri 2/3 harf kodlarina sadece alfabetik
  // karakter girilebilecegini soyluyor. Veri de buna uymak zorunda.
  if (!/^[A-Z]{2}$/.test(a2) || !/^[A-Z]{3}$/.test(a3)) {
    skipped.push(`${name} (kodda harf disi karakter)`);
    continue;
  }

  // Orjinal isim: ulkenin kendi alfabesindeki adi. Arapca, Bengalce vb.
  // karakterlerin dogru saklandigini burada test edeceksin.
  let original = name;
  const native = c?.name?.native;
  if (native && typeof native === "object") {
    const first = Object.values(native)[0];
    if (first?.common?.trim()) original = first.common.trim();
  }

  const numCode = /^\d{1,6}$/.test(String(c?.ccn3 || "")) ? String(Number(c.ccn3)) : String(syntheticNum++);

  // Telefon kodu: idd.root + ilk suffix. "+9" + "0" -> 90
  let phone = null;
  const root = (c?.idd?.root || "").replace(/\D/g, "");
  const suffix = Array.isArray(c?.idd?.suffixes) ? (c.idd.suffixes[0] || "").replace(/\D/g, "") : "";
  const combined = `${root}${suffix}`;
  if (combined && combined.length <= 6) phone = Number(combined);

  // Para birimi: ilk para biriminin alfabetik kodu (Currency tablosunda var mi diye bakiliyor)
  const curCodes = c?.currencies ? Object.keys(c.currencies) : [];
  const currencyAlpha = curCodes.find((k) => currencies.has(k)) || null;

  // Dil: sadece iki aktif dilden birine eslesiyorsa doldur, yoksa NULL.
  // Cogu ulkede NULL kalacak - bu bilincli: bos dropdown'i da gormen gerekiyor.
  const langs = c?.languages ? Object.keys(c.languages) : [];
  const languageCode = langs.includes("tur") ? "tr-TR" : langs.includes("eng") ? "en-GB" : null;

  const numeric = Number(numCode);

  // Risk skoru: kabul kriteri sadece 1-5 kabul ediyor.
  // Ulkelerin yaklasik 1/4'unde NULL biraktim - listede ve formda bos
  // gosterimi test edebilmen icin.
  //
  // NOT: Bu dagitim ILK basta numCode % 4 ile yapiliyordu ve kayitlarin
  // yarisi bos cikiyordu. Sebebi: ISO 3166-1 numerik kodlari duzgun
  // dagilmiyor, tarihsel olarak 4'un katlari halinde atanmislar
  // (4, 8, 12, 16, 20, 24, 28 ...). Bu yuzden isme dayali basit bir
  // karma kullaniyoruz - dagilim duzgun ve her calistirmada ayni.
  const hash = [...name].reduce((h, ch) => (h * 31 + ch.codePointAt(0)) % 100000, 7);
  const risk = hash % 4 === 0 ? null : (hash % 5) + 1;

  // Muhasebe bolgesi: kabul kriterindeki iki secenek. 1 = Londra, 2 = Yurtdisi Ulke.
  // (Bu kodlarin gercek degeri dokumanda YOK - analiste sorulacaklar listesinde.)
  let regionCode = null, regionDesc = null;
  if (a2 === "GB") { regionCode = 1; regionDesc = "Londra"; }
  else if (numeric % 3 !== 0) { regionCode = 2; regionDesc = "Yurtdışı Ülke"; }

  const row = { name, original, official, a2, a3, numCode, currencyAlpha, languageCode, phone, risk, regionCode, regionDesc };

  // Kilavuzdaki satirla birebir eslesmesi gereken ulkeler icin ustune yaz.
  if (DOC_OVERRIDES[a2]) Object.assign(row, DOC_OVERRIDES[a2]);

  // Silinmis kayit tuzagi.
  row.recordStatus = SOFT_DELETE_CODES.has(a2) ? -1 : 1;

  // Benzersizlik: cakisan kaydi tamamen atla, veriyi bozmaktan iyidir.
  // (Ustune yazmadan SONRA kontrol ediyoruz, cunku istisna da cakisabilir.)
  const key = { name: row.name, orig: row.original, off: row.official, a2: row.a2, a3: row.a3, num: row.numCode };
  const clash = Object.keys(seen).find((k) => seen[k].has(key[k]));
  if (clash) { skipped.push(`${row.name} (${clash} alani cakisti)`); continue; }
  for (const k of Object.keys(seen)) seen[k].add(key[k]);

  rows.push(row);
}

// Ekranda alfabetik gorunmesi icin isme gore sirala.
rows.sort((a, b) => a.name.localeCompare(b.name, "en"));

const softDeletedNames = rows.filter((r) => r.recordStatus === -1).map((r) => r.name);
const SOFT_DELETED = softDeletedNames.length;
const activeCount = rows.filter((r) => r.recordStatus === 1).length;

// Test senaryolarinin ihtiyac duydugu kayitlar gercekten aktif mi?
for (const must of ["Turkey", "United Kingdom"]) {
  const hit = rows.find((r) => r.name === must && r.recordStatus === 1);
  if (!hit) throw new Error(`Test senaryolari icin gerekli aktif kayit uretilemedi: ${must}`);
}

const countrySql =
  header(
    "Country  -  gelistirecegin ekranin ana tablosu",
    `--  Toplam ${rows.length} kayit, bunlarin ${activeCount} tanesi aktif.
--
--  DIKKAT / TUZAK:
--  ${SOFT_DELETED} ulke RecordStatus = -1 ile eklendi (silinmis sayiliyor):
--      ${softDeletedNames.join(", ")}
--  Ekranin listesinde ${activeCount} satir gormelisin. ${rows.length} goruyorsan
--  listeleme sorgunda  RecordStatus = 1  filtresi eksik demektir.
--
--  CurrencyId ve LanguageId dogrudan sayi olarak yazilmiyor; alt sorgu ile
--  koda gore bulunuyor. Boylece Currency/Language tablolari yeniden
--  yuklendiginde de dogru kayda baglanir.`
  ) +
  `TRUNCATE TABLE "SystemAdmin"."Country" RESTART IDENTITY CASCADE;\n\n` +
  `INSERT INTO "SystemAdmin"."Country" (\n` +
  `    "CountryName", "CountryNameOriginal", "CountryNameOfficial",\n` +
  `    "Country2AlpCode", "Country3AlpCode", "CountryNumCode",\n` +
  `    "CurrencyId", "LanguageId", "PhoneCode", "Riskscore",\n` +
  `    "AccountingRegionCode", "AccountingRegionDesc",\n` +
  `    "RecordCreateUser", "RecordCreateDate", "RecordStatus"\n) VALUES\n` +
  rows
    .map(
      (r) =>
        `    (${q(r.name)}, ${q(r.original)}, ${q(r.official)}, ` +
        `${q(r.a2)}, ${q(r.a3)}, ${r.numCode}, ` +
        (r.currencyAlpha
          ? `(SELECT "Id" FROM "SystemAdmin"."Currency" WHERE "CurrencyAlphaCode" = ${q(r.currencyAlpha)})`
          : "NULL") +
        ", " +
        (r.languageCode
          ? `(SELECT "Id" FROM "SystemAdmin"."Language" WHERE "Code" = ${q(r.languageCode)})`
          : "NULL") +
        `, ${n(r.phone)}, ${n(r.risk)}, ${n(r.regionCode)}, ${q(r.regionDesc)}, 1, now(), ${r.recordStatus})`
    )
    .join(",\n") +
  ";\n";

writeFileSync(join(DIR, "04-seed-country.sql"), countrySql, "utf8");

// ---------- ozet ----------

console.log("");
console.log("Uretilen dosyalar:");
console.log(`  02-seed-currency.sql   ${currencyList.length} para birimi`);
console.log(`  03-seed-language.sql   ${languages.length} dil (${languages.filter((l) => l.status === 1).length} aktif)`);
console.log(`  04-seed-country.sql    ${rows.length} ulke (${activeCount} aktif, ${SOFT_DELETED} silinmis)`);
if (skipped.length) {
  console.log("");
  console.log(`Atlanan ${skipped.length} kayit (benzersizlik/eksik veri):`);
  for (const s of skipped) console.log(`  - ${s}`);
}
