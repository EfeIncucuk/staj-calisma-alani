using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Models;

namespace CountryApi.Repositories
{
    public interface ICountryRepository
    {
        Task<List<CountryListDto>> GetAllAsync();
        Task<CountrySaveDto> GetByIdAsync(long Id);
        Task<bool> IsDuplicateAsync(CountrySaveDto dto, long? excludeId);
        Task<long> AddAsync(Country country);
        Task<long> UpdateAsync(long id, Country country);
        Task<long> DeleteAsync(long id);
    }
}