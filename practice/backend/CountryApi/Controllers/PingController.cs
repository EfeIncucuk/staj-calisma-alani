using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace CountryApi.Controllers
{
    /// <summary>
    /// Ortamin ayakta oldugunu kanitlayan tek uc.
    /// Amaci senin yerine is yapmak degil; "API calisiyor mu, veritabanina
    /// baglanabiliyor mu" sorusunu cevaplamak.
    ///
    /// Ayni zamanda kullanacagin uc temel kalibi gosteriyor:
    ///   1) IConfiguration ile baglanti dizesini okumak
    ///   2) NpgsqlConnection acmak
    ///   3) Dapper ile sorgu calistirmak
    ///
    /// Kendi Country uclarini yazarken bunu bir yere kopyalamak yerine
    /// duzgun katmanlara ayirmalisin: Controller -> Service -> Repository.
    /// Burada hepsi tek dosyada, cunku bu bir saglik kontrolu, ozellik degil.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        private readonly string _connectionString;

        // Constructor injection: IConfiguration'i sen olusturmuyorsun,
        // .NET sana veriyor. Startup.cs icindeki kayitlar bunu mumkun kiliyor.
        public PingController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("AnahtarGlobalLondra");
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                await using var connection = new NpgsqlConnection(_connectionString);

                var now = await connection.ExecuteScalarAsync<DateTime>("select now()");

                // Not: kolon ve sema adlari cift tirnak icinde.
                // PostgreSQL tirnaksiz tanimlayicilari kucuk harfe cevirir,
                // bu tablonun kolonlari ise buyuk harf iceriyor ("CountryName").
                // Tirnaklari unutursan "column does not exist" hatasi alirsin.
                var activeCountries = await connection.ExecuteScalarAsync<long>(
                    @"select count(*) from ""SystemAdmin"".""Country"" where ""RecordStatus"" = 1");

                var activeLanguages = await connection.ExecuteScalarAsync<long>(
                    @"select count(*) from ""SystemAdmin"".""Language"" where ""RecordStatus"" = 1");

                var currencies = await connection.ExecuteScalarAsync<long>(
                    @"select count(*) from ""SystemAdmin"".""Currency"" where ""RecordStatus"" = 1");

                return Ok(new
                {
                    api = "calisiyor",
                    veritabani = "baglanti kuruldu",
                    sunucuSaati = now,
                    aktifUlkeSayisi = activeCountries,
                    aktifDilSayisi = activeLanguages,
                    paraBirimiSayisi = currencies,
                    ipucu = "Buradan sonrasi sana ait. AGLDN-989 kabul kriterlerini ac ve basla."
                });
            }
            catch (Exception ex)
            {
                // 500 dondurup sebebi soylemek, sessizce patlamaktan iyidir.
                return StatusCode(500, new
                {
                    api = "calisiyor",
                    veritabani = "BAGLANTI KURULAMADI",
                    hata = ex.Message,
                    kontrolEt = "PostgreSQL ayakta mi? scripts\\start-db.ps1 calistirdin mi?"
                });
            }
        }
    }
}
