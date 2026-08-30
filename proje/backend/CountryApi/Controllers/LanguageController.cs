using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CountryApi.Services;

namespace CountryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanguageController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public LanguageController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var languages = await _languageService.GetAllAsync();
            return Ok(languages);
        }
    }
}
