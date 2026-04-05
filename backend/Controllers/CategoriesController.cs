using Microsoft.AspNetCore.Mvc;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<dynamic>> GetCategories()
        {
            return Ok(new List<dynamic>
            {
                new { Id = 1, Name = "CPU", Description = "Central Processing Units" }
            });
        }
    }
}
