import { readFileSync, writeFileSync } from "node:fs";
const paraKodlari = JSON.parse(readFileSync("db/currency-codes.json", "utf8"));

const URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

const res = await fetch(URL);
if (!res.ok) throw new Error(`HTTP ${res.status}`);

const veri = await res.json();
if (!Array.isArray(veri)) throw new Error("beklenen bir dizi degildi");

// console.log("kayit sayisi:", veri.length);
// console.log(JSON.stringify(veri[0], null, 2));
const CurrencyCode = c => Object.keys(c.currencies ?? {})[0];
const LangCode = c => Object.keys(c.languages ?? {})[0];
const LangName = c => Object.values(c.languages ?? {})[0];


function countries(c, i) {
    
    const regionCodes = {
        Europe: 1,
        Asia: 2,
        Africa: 3,
        Oceania: 4,
        Americas: 5,
        Antarctic: 6,
    }
    return {
        CountryName: c.name.common,
        CountryNameOriginal: Object.values(c.name.native)[0].common,
        CountryNameOfficial: c.name.official,
        Country2AlpCode: c.cca2,
        Country3AlpCode: c.cca3,
        CountryNumCode: Number(c.ccn3),
        CurrencyKod: CurrencyCode(c) ?? null,
        // Her 25. ulkenin dili bos birakiliyor: "dil secilmemis kayit" senaryosunu
        // test edebilmek icin. Filtre dili olmayan ulkeleri elediginden, bu NULL'lari
        // kasten burada uretiyoruz. (TR i=224, GB i=78 -> ikisi de etkilenmiyor.)
        LanguageKod: i % 25 === 0 ? null : LangCode(c) ?? null,
        PhoneCode: Number.isNaN(Number(c.idd.root + Object.values(c.idd.suffixes)[0])) ? null : Number(c.idd.root + Object.values(c.idd.suffixes)[0]),
        Riskscore: i % 10 === 0 ? null : i % 100,
        AccountingRegionCode: regionCodes[c.region] ?? 7,
        AccountingRegionDesc: c.region,
        RecordStatus: i % 60 === 0 ? -1 : 1,
    };
}

// Artik ULKE degil, KOD aliyor. Cagirilirken GecerliParalar dizisinden gelecek,
// yani paraKodlari[kod] kesin dolu - "?? null" gerekmiyor.
function currencies(kod) {
    const detay = paraKodlari[kod];
    return {
        CurrencyAlphaCode: kod,
        CurrencyName: detay.name,
        CurrencyNumericCode: detay.numeric,
        RecordStatus: 1,
    };
}

// kod ve ad ayri parametre: ikisi de DilAdlari Map'inden gelecek.
// i = dil listesindeki sira. Pasif dil oranini buradan ayarla.
function language(kod, ad, i) {
    return {
        Name: ad,
        Code: kod,
        EngName: ad,
        OrgName: null,
        RecordStatus: i % 12 === 0 ? -1 : 1,
    };
}

const temiz = veri.filter((c) => {
    const nativeNames = Object.keys(c.name.native ?? {});
    const languages = Object.keys(c.languages ?? {});
    return c.ccn3 && languages.length > 0 && nativeNames.includes(languages[0]);
});

// ---------------------------------------------------------------
//  Sozlukler: ulkelerde gecen FARKLI kodlar
// ---------------------------------------------------------------

// Set ayni kodu iki kez tutmaz -> 247 ulkeden 153 farkli para birimi kalir.
const UsedCurrencies = new Set(temiz.map(CurrencyCode).filter(Boolean));

// ISO listesinde karsiligi olmayanlari ayikla (ANG, CKD, CUC) -> 150.
// [...Set] spread: Set'in .filter'i yok, once diziye aciyoruz.
const GecerliParalar = [...UsedCurrencies].filter(kod => paraKodlari[kod]);

// Dilde kod YETMIYOR, adi da lazim ("tur" -> "Turkish").
// Map, [anahtar, deger] ciftleri alir ve ayni anahtar tekrarlarsa tek tutar.
const DilAdlari = new Map(temiz.map(c => [LangCode(c), LangName(c)]));

// ---------------------------------------------------------------
//  Uc tablonun satirlari
// ---------------------------------------------------------------

const currencyRows = GecerliParalar.map(currencies);

// [...Map] -> [["tur","Turkish"], ...].  ([kod, ad], i) parametrede cifti aciyor.
const languageRows = [...DilAdlari].map(([kod, ad], i) => language(kod, ad, i));

const countryRows = temiz.map(countries);

// ---------------------------------------------------------------

console.log("temiz ulke          :", temiz.length);
console.log("farkli para birimi  :", UsedCurrencies.size);
console.log("gecerli para satiri :", currencyRows.length);
console.log("dil satiri          :", languageRows.length);
console.log("bunlardan pasif     :", languageRows.filter(l => l.RecordStatus === -1).length);
console.log("ulke satiri         :", countryRows.length);
console.log("dili bos ulke       :", countryRows.filter(r => r.LanguageKod === null).length);
console.log("para birimi bos     :", countryRows.filter(r => r.CurrencyKod === null).length);


// ===============================================================
//  BENZERSIZLIK GARANTISI
//
//  Semada bu 6 alan icin UNIQUE kisiti YOK - veritabani cakismayi
//  sessizce kabul eder. Kontrol burada yapilmali ve cakisma varsa
//  GURULTULU sekilde durmali. Sessiz gecmek, hatayi Faz 5'e tasir.
// ===============================================================

const benzersizOlmali = [
    "CountryName", "CountryNameOriginal", "CountryNameOfficial",
    "Country2AlpCode", "Country3AlpCode", "CountryNumCode",
];

for (const alan of benzersizOlmali) {
    const degerler = countryRows.map(r => r[alan]);
    const farkli = new Set(degerler);
    if (farkli.size !== degerler.length) {
        const tekrar = [...new Set(degerler.filter((v, i) => degerler.indexOf(v) !== i))];
        throw new Error(
            `${alan} benzersiz degil: ${degerler.length} satir, ${farkli.size} farkli deger. ` +
            `Tekrar edenler: ${tekrar.join(", ")}`
        );
    }
}
console.log("\nbenzersizlik         : 6 alanin hepsi tekrarsiz");


// ===============================================================
//  SQL URETIMI
// ===============================================================

// Bir JavaScript degerini SQL'e yazilacak metne cevirir.
//   null / undefined / NaN -> NULL   (tirnaksiz, ciplak kelime)
//   sayi                   -> 297    (tirnaksiz)
//   metin                  -> 'x'    (tek tirnak icinde, icteki ' ikilenmis)
function sqlDeger(v) {
    if (v === null || v === undefined) return "NULL";
    if (typeof v === "number") return Number.isNaN(v) ? "NULL" : String(v);
    return "'" + String(v).replaceAll("'", "''") + "'";
}

// Kolon adlari cift tirnakli olmali, yoksa PostgreSQL kucuk harfe cevirir.
const sqlKolon = adlar => adlar.map(a => `"${a}"`).join(", ");

// Kod -> Id cevrimi alt sorguyla yapiliyor. Boylece Id'leri JavaScript'te
// takip etmiyoruz; sequence dagitiyor. Kod Currency tablosunda yoksa alt sorgu
// hic satir dondurmez ve sonuc NULL olur - ANG / CKD / CUC icin istedigimiz sey bu.
const paraAltSorgu = kod => kod === null ? "NULL"
    : `(select "Id" from "SystemAdmin"."Currency" where "CurrencyAlphaCode" = ${sqlDeger(kod)})`;
const dilAltSorgu = kod => kod === null ? "NULL"
    : `(select "Id" from "SystemAdmin"."Language" where "Code" = ${sqlDeger(kod)})`;

// Tek bir INSERT cumlesi: butun satirlar tek islem. Biri patlarsa HICBIRI yazilmaz.
function insertCumlesi(tablo, kolonlar, demetler) {
    return `insert into "SystemAdmin"."${tablo}"\n` +
           `    (${sqlKolon(kolonlar)})\n` +
           `values\n` +
           demetler.map(d => "    (" + d + ")").join(",\n") + ";\n";
}

const baslik = (ad, adet, not) =>
    `-- =====================================================================\n` +
    `--  ${ad}  -  ${adet} satir\n` +
    `--\n` +
    `--  URETILMIS DOSYA. Elle duzenlemeyin.\n` +
    `--  Kaynak: db/generate-seed.mjs   ->   node db/generate-seed.mjs\n` +
    (not ? `--\n${not}\n` : ``) +
    `-- =====================================================================\n\n`;

// ---- 02  Currency -------------------------------------------------
const currencyKolonlari = ["CurrencyAlphaCode", "CurrencyNumericCode", "CurrencyName", "RecordStatus"];
const currencySql = baslik("Currency", currencyRows.length,
    `--  CurrencyNumericCode ISO 4217'den geliyor (db/currency-codes.json).\n` +
    `--  Kolon varchar(3) oldugu icin bastaki sifirlar korunuyor: '008'.`) +
    insertCumlesi("Currency", currencyKolonlari,
        currencyRows.map(r => currencyKolonlari.map(k => sqlDeger(r[k])).join(", ")));

// ---- 03  Language -------------------------------------------------
const languageKolonlari = ["Code", "Name", "EngName", "OrgName", "RecordStatus"];
const languageSql = baslik("Language", languageRows.length,
    `--  RecordStatus = -1 olanlar dil dropdown'inda GORUNMEYECEK.\n` +
    `--  Bazi ulkeler pasif bir dile isaret ediyor - duzenleme formunda\n` +
    `--  mevcut degerin listede olmamasi durumu bilincli olarak birakildi.\n` +
    `--  OrgName her zaman NULL: kaynak veride dilin kendi dilindeki adi yok.`) +
    insertCumlesi("Language", languageKolonlari,
        languageRows.map(r => languageKolonlari.map(k => sqlDeger(r[k])).join(", ")));

// ---- 04  Country -------------------------------------------------
const countryKolonlari = [
    "CountryName", "CountryNameOriginal", "CountryNameOfficial",
    "Country2AlpCode", "Country3AlpCode", "CountryNumCode",
    "CurrencyId", "LanguageId", "PhoneCode", "Riskscore",
    "AccountingRegionCode", "AccountingRegionDesc", "RecordStatus",
];

const countryDemeti = r => [
    sqlDeger(r.CountryName),
    sqlDeger(r.CountryNameOriginal),
    sqlDeger(r.CountryNameOfficial),
    sqlDeger(r.Country2AlpCode),
    sqlDeger(r.Country3AlpCode),
    sqlDeger(r.CountryNumCode),
    paraAltSorgu(r.CurrencyKod),
    dilAltSorgu(r.LanguageKod),
    sqlDeger(r.PhoneCode),
    sqlDeger(r.Riskscore),
    sqlDeger(r.AccountingRegionCode),
    sqlDeger(r.AccountingRegionDesc),
    sqlDeger(r.RecordStatus),
].join(", ");

const countrySql = baslik("Country", countryRows.length,
    `--  CurrencyId / LanguageId alt sorguyla cozuluyor: Id'leri sequence dagitir,\n` +
    `--  biz koda gore soruyoruz. Kod Currency/Language tablosunda yoksa alt sorgu\n` +
    `--  NULL doner - ANG / CKD / CUC kullanan ulkelerde beklenen davranis bu.\n` +
    `--\n` +
    `--  Id, RecordCreateUser, RecordCreateDate yazilmiyor: semadaki DEFAULT'lar dolduruyor.\n` +
    `--  RecordStatus MUTLAKA yazilir - varsayilani olmayan tek kolon.\n` +
    `--\n` +
    `--  DIKKAT: bu 6 alan (CountryName, CountryNameOriginal, CountryNameOfficial,\n` +
    `--  Country2AlpCode, Country3AlpCode, CountryNumCode) zorunlu VE benzersiz olmali,\n` +
    `--  ama semada UNIQUE kisiti YOK. Benzersizlik uretecte kontrol ediliyor.`) +
    insertCumlesi("Country", countryKolonlari, countryRows.map(countryDemeti));

// ---- yaz ----------------------------------------------------------
const dosyalar = [
    ["db/02-seed-currency.sql", currencySql],
    ["db/03-seed-language.sql", languageSql],
    ["db/04-seed-country.sql", countrySql],
];

console.log();
for (const [yol, icerik] of dosyalar) {
    writeFileSync(yol, icerik, "utf8");
    console.log("yazildi: " + yol.padEnd(26) + (icerik.length / 1024).toFixed(1) + " KB");
}