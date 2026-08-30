using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DenemeApi.Models;
using DenemeApi.Dtos;

namespace DenemeApi.Services
{
    public class CountryService : ICountryService
    {
        private static List<Country> _Countries = new List<Country>();

        private CountryListDto ToListDto(Country country)
        {
            return new CountryListDto 
            {
                Id = country.Id,
                CountryName = country.CountryName,
                LanguageName = "",
                CurrencyName = "",
                PhoneCode = country.PhoneCode,
                RiskScore = country.RiskScore,
            };
        }

        public Task<List<CountryListDto>> GetAllCountriesAsync()
        {
            return Task.FromResult(
                _Countries
                .Where(c => c.RecordStatus == 1)
                .OrderBy(c => c.CountryName)
                .Select(c => ToListDto(c))
                .ToList());
        }

        public Task<bool> IsCountryNameInUseAsync(string countryName, long? excludeCountryId)
        {
            return Task.FromResult(
                _Countries.Any(c =>
                c.CountryName == countryName &&
                c.RecordStatus == 1 &&
                (excludeCountryId == null || c.Id != excludeCountryId.Value)));
        }

        public Task<CountryListDto> AddAsync(CountrySaveDto dto)
        {
            var country = new Country
            {
                CountryName = dto.CountryName,
                CountryNameOfficial = dto.CountryNameOfficial,
                CountryNameOriginal = dto.CountryNameOriginal,
                LanguageId = dto.LanguageId,
                CurrencyId = dto.CurrencyId,
                RiskScore = dto.RiskScore,
                PhoneCode = dto.PhoneCode,
                AccountingRegionCode = dto.AccountingRegionCode,
            };

            country.Id = _Countries.Count + 1;
            country.RecordStatus = 1;
            country.RecordCreateDate = DateTime.UtcNow;
            _Countries.Add(country);

            return Task.FromResult(ToListDto(country));
        }

        public Task<CountryListDto> GetByIdAsync(long id)
        {
            var country = _Countries.FirstOrDefault(c => c.Id == id && c.RecordStatus == 1);
            return Task.FromResult(country == null ? null : ToListDto(country));
        }

        public Task<CountryListDto> UpdateAsync(long id, CountrySaveDto dto)
        {
            var existingCountry = _Countries.FirstOrDefault(c => c.Id == id && c.RecordStatus == 1);
            if (existingCountry == null)
            {
                return Task.FromResult<CountryListDto>(null);
            }

            existingCountry.CountryName = dto.CountryName;
            existingCountry.CountryNameOfficial = dto.CountryNameOfficial;
            existingCountry.CountryNameOriginal = dto.CountryNameOriginal;
            existingCountry.LanguageId = dto.LanguageId;
            existingCountry.CurrencyId = dto.CurrencyId;
            existingCountry.RiskScore = dto.RiskScore;
            existingCountry.PhoneCode = dto.PhoneCode;
            existingCountry.AccountingRegionCode = dto.AccountingRegionCode;
            existingCountry.RecordUpdateDate = DateTime.UtcNow;

            return Task.FromResult(ToListDto(existingCountry));
        }

        public Task<bool> DeleteAsync(long id)
        {
            var country = _Countries.FirstOrDefault(c => c.Id == id);
            if (country == null)
            {
                return Task.FromResult(false);
            }
            if(country.RecordStatus == 1)
            {
                country.RecordStatus = 0;
                country.RecordUpdateDate = DateTime.UtcNow;
                return Task.FromResult(true);
            }
            else
            {
                return Task.FromResult(false);
            }
        }
    }
}