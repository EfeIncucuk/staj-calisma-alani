using System.Collections.Generic;
using System.Threading.Tasks;
using CountryApi.Dtos;

namespace CountryApi.Repositories
{
    public interface ILanguageRepository
    {
        Task<List<LanguageListDto>> GetAllAsync();
    }
}
