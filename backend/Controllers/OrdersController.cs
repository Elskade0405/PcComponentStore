using Microsoft.AspNetCore.Mvc;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> GetAllOrders()
        {
            return Ok(new List<dynamic>());
        }

        [HttpGet("{id}")]
        public ActionResult<dynamic> GetOrder(int id)
        {
            return NotFound();
        }

        [HttpPost]
        public ActionResult<dynamic> CreateOrder()
        {
            return Ok(new { Message = "Order created" });
        }

        [HttpPut("{id}/status")]
        public ActionResult<dynamic> UpdateStatus(int id, [FromBody] string status)
        {
            return Ok();
        }
    }
}
