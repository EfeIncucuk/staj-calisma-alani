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
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly string _connectionString;

        public CurrencyRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CountryDb");
        }

        public async Task<List<CurrencyListDto>> GetAllAsync()
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                select
                    c.""Id"",
                    c.""CurrencyAlphaCode"",
                    c.""CurrencyName""
                from ""SystemAdmin"".""Currency"" c
                where c.""RecordStatus"" = 1
                order by c.""CurrencyName""";

            var conc = await connection.QueryAsync<CurrencyListDto>(sql);
            return conc.AsList();
        }
    }
}