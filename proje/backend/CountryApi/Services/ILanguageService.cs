using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;

namespace CountryApi.Services
{
    public interface ILanguageService
    {
        Task<List<LanguageListDto>> GetAllAsync();
    }
}
