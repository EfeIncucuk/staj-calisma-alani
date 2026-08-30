using System.Collections.Generic;
using System.Threading.Tasks;
using DenemeApi.Models;
using DenemeApi.Dtos;

namespace DenemeApi.Services
{
    public interface ICountryService
    {
        Task<List<CountryListDto>> GetAllCountriesAsync();
        Task<CountryListDto> AddAsync(CountrySaveDto dto);
        Task<bool> IsCountryNameInUseAsync(string countryName, long? excludeCountryId);
        Task<CountryListDto> GetByIdAsync(long id);
        Task<CountryListDto> UpdateAsync(long id, CountrySaveDto dto);
        Task<bool> DeleteAsync(long id);
    }
}