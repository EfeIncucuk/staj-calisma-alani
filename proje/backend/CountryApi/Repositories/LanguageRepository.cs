using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using CountryApi.Dtos;

namespace CountryApi.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly string _connectionString;

        public LanguageRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CountryDb");
        }

        public async Task<List<LanguageListDto>> GetAllAsync()
        {
            await using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
                select
                    l.""Id"",
                    l.""Name""
                from ""SystemAdmin"".""Language"" l
                where l.""RecordStatus"" = 1
                order by l.""Name""";

            var languages = await connection.QueryAsync<LanguageListDto>(sql);
            return languages.AsList();
        }
    }
}
