using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Repositories;
using CountryApi.Models;

namespace CountryApi.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        public async Task<List<CurrencyListDto>> GetAllAsync()
        {
            return await _currencyRepository.GetAllAsync();
        }
    }
}