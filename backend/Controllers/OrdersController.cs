using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.Models;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;

        public OrdersController(PcComponentStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Manager,SalesStaff")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    User = o.User != null ? new { o.User.Username, o.User.Email } : null,
                    o.CustomerName,
                    o.Email,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetOrder(string id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<dynamic>> CreateOrder([FromBody] OrderCreateDto dto)
        {
            try
            {
                if (dto.Items == null || dto.Items.Count == 0)
                {
                    return BadRequest("Order must contain at least one item.");
                }

                string newOrderId = "ORD" + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + new Random().Next(100, 999).ToString();

                var order = new Order
                {
                    Id = newOrderId,
                    UserId = dto.UserId,
                    CustomerName = dto.CustomerName,
                    Phone = dto.Phone,
                    Email = dto.Email,
                    Address = dto.Address,
                    TotalAmount = dto.TotalAmount,
                    Status = "Pending",
                    PaymentMethod = dto.PaymentMethod,
                    OrderDate = DateTime.UtcNow
                };

                foreach (var itemDto in dto.Items)
                {
                    order.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = itemDto.ProductId,
                        Quantity = itemDto.Quantity,
                        UnitPrice = itemDto.UnitPrice
                    });
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Order created successfully", OrderId = order.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message, Inner = ex.InnerException?.Message, StackTrace = ex.StackTrace });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Manager,SalesStaff")]
        public async Task<ActionResult<dynamic>> UpdateStatus(string id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Order status updated" });
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.CustomerName,
                    o.Email,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    Items = o.OrderItems.Select(oi => new {
                        Name = oi.Product != null ? oi.Product.Name : "Unknown Product",
                        oi.Quantity,
                        oi.UnitPrice,
                        Image = oi.Product != null ? oi.Product.Attributes : null 
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
