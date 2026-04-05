using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using PcComponentStore.Api.Models;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;

        public ProductsController(PcComponentStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetProducts([FromQuery] string? category)
        {
            // For now, only the CPU table exists in the new schema. 
            // If they query CPU, return it. Otherwise, return empty.
            if (string.IsNullOrEmpty(category) || category.ToLower() == "cpu")
            {
                var cpus = await _context.Cpu.ToListAsync();
                var result = cpus.Select(c => new 
                {
                    Id = c.Id,
                    Name = c.CpuName,
                    Brand = c.Brand,
                    Price = 5000000, // mock price since the new schema has no price
                    StockQuantity = c.Stock,
                    CategoryName = "CPU",
                    Attributes = c.Attributes
                });
                return Ok(result);
            }

            return Ok(new List<dynamic>());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetProduct(int id)
        {
            var cpu = await _context.Cpu.FindAsync(id);
            if (cpu == null) return NotFound();

            return Ok(new {
                Id = cpu.Id,
                Name = cpu.CpuName,
                Brand = cpu.Brand,
                Price = 5000000,
                StockQuantity = cpu.Stock,
                CategoryName = "CPU",
                Attributes = cpu.Attributes
            });
        }

        [HttpPost]
        public async Task<ActionResult<dynamic>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            var attributesObj = new {
                socket = productDto.Socket ?? "",
                cores = productDto.Cores ?? "",
                baseClock = productDto.BaseClock ?? "",
                boostClock = productDto.BoostClock ?? "",
                cache = productDto.Cache ?? "",
                tdp = productDto.Tdp ?? ""
            };

            var cpu = new Cpu
            {
                Brand = string.IsNullOrEmpty(productDto.Brand) ? "Intel" : productDto.Brand,
                CpuName = productDto.Name,
                Stock = productDto.StockQuantity,
                Attributes = System.Text.Json.JsonSerializer.Serialize(attributesObj)
            };
            _context.Cpu.Add(cpu);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = cpu.Id }, cpu);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto productDto)
        {
            var cpu = await _context.Cpu.FindAsync(id);
            if (cpu == null) return NotFound();
            
            cpu.CpuName = productDto.Name;
            cpu.Stock = productDto.StockQuantity;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var cpu = await _context.Cpu.FindAsync(id);
            if (cpu == null) return NotFound();
            _context.Cpu.Remove(cpu);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
