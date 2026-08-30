using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Repositories;

namespace CountryApi.Services
{
    public interface ICountryService
    {
        Task<List<CountryListDto>> GetAllAsync();
        Task<CountrySaveDto> GetByIdAsync(long id);
        Task<bool> IsDuplicateAsync(CountrySaveDto dto, long? excludeId);
        Task<long> AddAsync(CountrySaveDto country);
        Task<long> UpdateAsync(long id, CountrySaveDto country);
        Task<bool> IsIdExistAsync(long id);
        Task<bool> DeleteAsync(long id);
    }
}