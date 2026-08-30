using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CountryApi.Services;
using CountryApi.Dtos;

namespace CountryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var currencies = await _currencyService.GetAllAsync();
            return Ok(currencies);
        }
    }
}