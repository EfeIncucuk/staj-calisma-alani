using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Models;

namespace CountryApi.Repositories
{
    public interface ICurrencyRepository
    {
        Task<List<CurrencyListDto>> GetAllAsync();
    }
}