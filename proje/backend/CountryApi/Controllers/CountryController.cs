using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CountryApi.Services;
using CountryApi.Dtos;

namespace CountryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;

        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var countries = await _countryService.GetAllAsync();
            return Ok(countries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var country = await _countryService.GetByIdAsync(id);
            if(country == null)
            {
                return NotFound();
            }
            return Ok(country);
        }

        [HttpPost]
        public async Task<IActionResult> AddCountry([FromBody] CountrySaveDto country)
        {
            if (await _countryService.IsDuplicateAsync(country , null))
            {
                return Conflict("A country with the same name already exists.");
            }
            return Ok(await _countryService.AddAsync(country));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCountry(long id, [FromBody] CountrySaveDto country)
        {
            if (!await _countryService.IsIdExistAsync(id))
            {
                return NotFound();
            }

            if (await _countryService.IsDuplicateAsync(country, id))
            {
                return Conflict("A country with the same name already exists.");
            }
            
            await _countryService.UpdateAsync(id, country);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCountry(long id)
        {
            if (!await _countryService.IsIdExistAsync(id))
            {
                return NotFound();
            }

            await _countryService.DeleteAsync(id);
            return NoContent();
        }
    }
}