using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using DenemeApi.Models;
using DenemeApi.Services;
using DenemeApi.Dtos;


namespace DenemeApi.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;

        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllCountries()
        {
            var countries = await _countryService.GetAllCountriesAsync();
            return Ok(countries);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetCountryById(long id)
        {
            var country = await _countryService.GetByIdAsync(id);
            if (country == null)
            {
                return NotFound();
            }
            return Ok(country);
        }
        
        [HttpPost]

        public async Task<IActionResult> AddCountry([FromBody] CountrySaveDto country)
        {
            if (await _countryService.IsCountryNameInUseAsync(country.CountryName, null))
            {
                return Conflict("A country with the same name already exists.");
            }

            return Ok(await _countryService.AddAsync(country));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCountry(long id, [FromBody] CountrySaveDto country)
        {
            if (await _countryService.IsCountryNameInUseAsync(country.CountryName, id))
            {
                return Conflict("A country with the same name already exists.");
            }

            var updatedCountry = await _countryService.UpdateAsync(id, country);
            if (updatedCountry == null)
            {
                return NotFound("Country not found.");
            }

            return Ok(updatedCountry);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCountry(long id)
        {
            var isDeleted = await _countryService.DeleteAsync(id); 
            if (isDeleted)
            {
                return Ok("Country deleted successfully.");
            }
            else
            {
                return NotFound("Country could not be deleted.");
            }
        }

    }
}