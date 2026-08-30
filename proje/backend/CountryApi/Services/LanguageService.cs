using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;
using CountryApi.Repositories;

namespace CountryApi.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly ILanguageRepository _languageRepository;

        public LanguageService(ILanguageRepository languageRepository)
        {
            _languageRepository = languageRepository;
        }

        public async Task<List<LanguageListDto>> GetAllAsync()
        {
            return await _languageRepository.GetAllAsync();
        }
    }
}
