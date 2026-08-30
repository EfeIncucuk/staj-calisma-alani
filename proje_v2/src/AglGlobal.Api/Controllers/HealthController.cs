using Microsoft.AspNetCore.Mvc;

namespace AglGlobal.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>API ayakta mi? Faz 1'in "bitti sayilir" kontrolu.</summary>
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        durum = "ayakta",
        ortam = HttpContext.RequestServices
            .GetRequiredService<IWebHostEnvironment>().EnvironmentName,
        zamanUtc = DateTime.UtcNow
    });
}
