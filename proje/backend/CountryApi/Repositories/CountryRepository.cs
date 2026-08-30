using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;                                    
using Microsoft.Extensions.Configuration;        
using Npgsql;                                    
using CountryApi.Dtos;
using CountryApi.Models;

namespace CountryApi.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        private readonly string _connectionString;
        
        public CountryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CountryDb");
        }

        public async Task<List<CountryListDto>> GetAllAsync()
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                select 
                    c.""Id"",
                    c.""CountryName"",
                    c.""CountryNameOriginal"",
                    c.""CountryNameOfficial"",
                    c.""Country2AlpCode"",
                    c.""Country3AlpCode"",
                    c.""CountryNumCode"",
                    cur.""CurrencyAlphaCode"" as ""CurrencyName"",
                    l.""Name"" as ""LanguageName"",
                    c.""PhoneCode"",
                    c.""Riskscore"",
                    c.""AccountingRegionCode"",
                    c.""AccountingRegionDesc""
                from ""SystemAdmin"".""Country"" c
                left join ""SystemAdmin"".""Language"" l on l.""Id"" = c.""LanguageId"" and l.""RecordStatus"" = 1
                left join ""SystemAdmin"".""Currency"" cur on cur.""Id"" = c.""CurrencyId""
                where c.""RecordStatus"" = 1
                order by c.""CountryName""";
            
            var conc = await connection.QueryAsync<CountryListDto>(sql);
            return conc.AsList();
        }

        public async Task<CountrySaveDto> GetByIdAsync(long Id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                select
                    c.""CountryName"",
                    c.""CountryNameOriginal"",
                    c.""CountryNameOfficial"",
                    c.""Country2AlpCode"",
                    c.""Country3AlpCode"",
                    c.""CountryNumCode"",
                    c.""CurrencyId"",
                    c.""LanguageId"",
                    c.""PhoneCode"",
                    c.""Riskscore"",
                    c.""AccountingRegionCode"",
                    c.""AccountingRegionDesc""
                from ""SystemAdmin"".""Country"" c
                where c.""Id"" = @Id and c.""RecordStatus"" = 1";

            var conc = await connection.QueryFirstOrDefaultAsync<CountrySaveDto>(sql, new { Id });
            return conc;
        }

        public async Task<bool> IsDuplicateAsync(CountrySaveDto dto, long? excludeId)
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                select count(*)
                from ""SystemAdmin"".""Country""
                where ""RecordStatus"" = 1
                    and (
                           lower(trim(""CountryName""))         = lower(trim(@CountryName))
                        or lower(trim(""CountryNameOriginal"")) = lower(trim(@CountryNameOriginal))
                        or lower(trim(""CountryNameOfficial"")) = lower(trim(@CountryNameOfficial))
                        or lower(trim(""Country2AlpCode""))     = lower(trim(@Country2AlpCode))
                        or lower(trim(""Country3AlpCode""))     = lower(trim(@Country3AlpCode))
                        or ""CountryNumCode""    = @CountryNumCode
                        )
                    and (@excludeId is null or ""Id"" <> @excludeId)";
            
            var adet = await connection.ExecuteScalarAsync<long>(sql, new { dto.CountryName, dto.CountryNameOriginal, dto.CountryNameOfficial, dto.Country2AlpCode, dto.Country3AlpCode, dto.CountryNumCode, excludeId});
            return adet > 0;
        }

        public async Task<long> AddAsync(Country country)
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql= @"
                insert into ""SystemAdmin"".""Country""
                    (""CountryName"",""CountryNameOriginal"", ""CountryNameOfficial"", ""Country2AlpCode"", ""Country3AlpCode"", ""CountryNumCode"", ""CurrencyId"", ""LanguageId"", ""PhoneCode"", ""Riskscore"", ""AccountingRegionCode"", ""AccountingRegionDesc"", ""RecordCreateUser"", ""RecordCreateDate"", ""RecordStatus"")
                values
                    (@CountryName, @CountryNameOriginal, @CountryNameOfficial, @Country2AlpCode, @Country3AlpCode, @CountryNumCode, @CurrencyId, @LanguageId, @PhoneCode, @RiskScore, @AccountingRegionCode, @AccountingRegionDesc, @RecordCreateUser, @RecordCreateDate, @RecordStatus)
                returning ""Id""";
            
            return await connection.ExecuteScalarAsync<long>(sql, country);
        }

        public async Task<long> UpdateAsync(long id, Country country)
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                update ""SystemAdmin"".""Country""
                set ""CountryName"" = @CountryName,
                    ""CountryNameOriginal"" = @CountryNameOriginal,
                    ""CountryNameOfficial"" = @CountryNameOfficial,
                    ""Country2AlpCode"" = @Country2AlpCode,
                    ""Country3AlpCode"" = @Country3AlpCode,
                    ""CountryNumCode"" = @CountryNumCode,
                    ""PhoneCode"" = @PhoneCode,
                    ""Riskscore"" = @RiskScore,
                    ""AccountingRegionCode"" = @AccountingRegionCode,
                    ""AccountingRegionDesc"" = @AccountingRegionDesc,
                    ""CurrencyId"" = @CurrencyId,
                    ""LanguageId"" = @LanguageId,
                    ""RecordUpdateDate"" = @RecordUpdateDate
                where ""Id"" = @Id
            ";

            return await connection.ExecuteAsync(sql, country);
        }

        public async Task<long> DeleteAsync(long id)
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                update ""SystemAdmin"".""Country""
                set ""RecordStatus"" = -1,
                    ""RecordUpdateDate"" = @updateDate
                where ""Id"" = @id";

            return await connection.ExecuteAsync(sql, new { id, updateDate = DateTime.UtcNow });
        }
    }
}