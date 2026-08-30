using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Repositories;
using CountryApi.Models;

namespace CountryApi.Services
{
    public class CountryService : ICountryService
    {
        private readonly ICountryRepository _countryRepository;

        public CountryService(ICountryRepository countryRepository)
        {
            _countryRepository = countryRepository;
        }

        public async Task<List<CountryListDto>> GetAllAsync()
        {
            return await _countryRepository.GetAllAsync();
        }

        public async Task<CountrySaveDto> GetByIdAsync(long id)
        {
            return await _countryRepository.GetByIdAsync(id);
        }

        public async Task<bool> IsDuplicateAsync(CountrySaveDto dto, long? excludeId)
        {
            return await _countryRepository.IsDuplicateAsync(dto, excludeId);
        }

        
        public async Task<long> AddAsync(CountrySaveDto dto)
        {   
            var country = new Country
            {
                CountryName = dto.CountryName.Trim(),
                CountryNameOriginal = dto.CountryNameOriginal.Trim(),
                CountryNameOfficial = dto.CountryNameOfficial.Trim(),
                Country2AlpCode = dto.Country2AlpCode.Trim().ToUpper(),
                Country3AlpCode = dto.Country3AlpCode.Trim().ToUpper(),
                CountryNumCode = dto.CountryNumCode.Value,
                LanguageId = dto.LanguageId,
                CurrencyId = dto.CurrencyId,
                RiskScore = dto.RiskScore,
                PhoneCode = dto.PhoneCode,
                AccountingRegionCode = dto.AccountingRegionCode,
                AccountingRegionDesc = dto.AccountingRegionDesc?.Trim(),
            };

            country.RecordStatus = 1;
            country.RecordCreateDate = DateTime.UtcNow;
            country.RecordCreateUser = 0;

            return await _countryRepository.AddAsync(country);
        }

        public async Task<long> UpdateAsync(long id, CountrySaveDto dto)
        {
            var country = new Country
            {
                Id = id,
                CountryName = dto.CountryName.Trim(),
                CountryNameOriginal = dto.CountryNameOriginal.Trim(),
                CountryNameOfficial = dto.CountryNameOfficial.Trim(),
                Country2AlpCode = dto.Country2AlpCode.Trim().ToUpper(),
                Country3AlpCode = dto.Country3AlpCode.Trim().ToUpper(),
                CountryNumCode = dto.CountryNumCode.Value,
                LanguageId = dto.LanguageId,
                CurrencyId = dto.CurrencyId,
                RiskScore = dto.RiskScore,
                PhoneCode = dto.PhoneCode,
                AccountingRegionCode = dto.AccountingRegionCode,
                AccountingRegionDesc = dto.AccountingRegionDesc?.Trim(),
            };

            country.RecordUpdateDate = DateTime.UtcNow;

            return await _countryRepository.UpdateAsync(id, country);
        }

        public async Task<bool> IsIdExistAsync(long id)
        {
            var country = await _countryRepository.GetByIdAsync(id);
            return country != null;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            return await _countryRepository.DeleteAsync(id) > 0;
        }
    }
}