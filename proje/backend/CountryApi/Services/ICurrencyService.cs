using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Repositories;

namespace CountryApi.Services
{
    public interface ICurrencyService
    {
        Task<List<CurrencyListDto>> GetAllAsync();
    }
}