using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using PcComponentStore.Api.Models;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

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
            var products = await _context.Products.ToListAsync();
            var result = products.Select(p => new {
                Id = p.Id,
                Name = p.Name,
                Brand = p.Brand,
                Price = p.Price ?? 0,
                StockQuantity = p.Stock,
                CategoryName = p.Category,
                Attributes = p.Attributes
            }).Where(p => string.IsNullOrEmpty(category) || p.CategoryName.ToLower() == category.ToLower());
            
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            return Ok(new {
                Id = product.Id,
                Name = product.Name,
                Brand = product.Brand,
                Price = product.Price ?? 0,
                StockQuantity = product.Stock,
                CategoryName = product.Category,
                Attributes = product.Attributes
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager,Editor")]
        public async Task<ActionResult<dynamic>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            var attributesObj = new Dictionary<string, object> {
                { "category", productDto.Type ?? "cpu" },
                { "originalPrice", productDto.OriginalPrice ?? 0 },
                { "thumbnailUrl", productDto.ThumbnailUrl ?? "" },
                { "detailImageUrls", productDto.DetailImageUrls ?? new List<string>() }
            };

            if (productDto.Type == "cpu") {
                attributesObj["socket"] = productDto.Socket ?? "";
                attributesObj["cores"] = productDto.Cores ?? "";
                attributesObj["baseClock"] = productDto.BaseClock ?? "";
                attributesObj["boostClock"] = productDto.BoostClock ?? "";
                attributesObj["cache"] = productDto.Cache ?? "";
                attributesObj["tdp"] = productDto.Tdp ?? "";
                attributesObj["generation"] = productDto.Generation ?? "";
                attributesObj["generationName"] = productDto.GenerationName ?? "";
                attributesObj["threads"] = productDto.Threads ?? "";
                attributesObj["memorySupport"] = productDto.MemorySupport ?? "";
                attributesObj["memoryChannels"] = productDto.MemoryChannels ?? "";
                attributesObj["pcieVersion"] = productDto.PcieVersion ?? "";
                attributesObj["pcieLanes"] = productDto.PcieLanes ?? "";
                attributesObj["cooling"] = productDto.Cooling ?? "";
            } else if (productDto.Type == "vga") {
                attributesObj["graphicEngine"] = productDto.GraphicEngine ?? "";
                attributesObj["busStandard"] = productDto.BusStandard ?? "";
                attributesObj["vram"] = productDto.Vram ?? "";
                attributesObj["engineClock"] = productDto.EngineClock ?? "";
                attributesObj["cudaCores"] = productDto.CudaCores ?? "";
                attributesObj["memoryClock"] = productDto.MemoryClock ?? "";
                attributesObj["memoryInterface"] = productDto.MemoryInterface ?? "";
                attributesObj["ports"] = productDto.Ports ?? "";
                attributesObj["dimensions"] = productDto.Dimensions ?? "";
                attributesObj["recommendedPsu"] = productDto.RecommendedPsu ?? "";
                attributesObj["powerConnectors"] = productDto.PowerConnectors ?? "";
                attributesObj["directX"] = productDto.DirectX ?? "";
            } else if (productDto.Type == "ram") {
                attributesObj["ramModel"] = productDto.RamModel ?? "";
                attributesObj["capacity"] = productDto.Capacity ?? "";
                attributesObj["busSpeed"] = productDto.BusSpeed ?? "";
                attributesObj["ramType"] = productDto.RamType ?? "";
                attributesObj["overclock"] = productDto.Overclock ?? "";
                attributesObj["rgb"] = productDto.Rgb ?? "";
                attributesObj["voltage"] = productDto.Voltage ?? "";
                attributesObj["casLatency"] = productDto.CasLatency ?? "";
                attributesObj["warranty"] = productDto.Warranty ?? "";
            } else if (productDto.Type == "monitor") {
                attributesObj["screenSize"] = productDto.ScreenSize ?? "";
                attributesObj["resolution"] = productDto.Resolution ?? "";
                attributesObj["refreshRate"] = productDto.RefreshRate ?? "";
            } else if (productDto.Type == "mainboard") {
                attributesObj["socket"] = productDto.Socket ?? "";
                attributesObj["mainboardSize"] = productDto.MainboardSize ?? "";
                attributesObj["ramSlots"] = productDto.RamSlots ?? "";
                attributesObj["chipset"] = productDto.Chipset ?? "";
            } else if (productDto.Type == "storage") {
                attributesObj["driveType"] = productDto.DriveType ?? "";
                attributesObj["connection"] = productDto.Connection ?? "";
                attributesObj["storageCapacity"] = productDto.StorageCapacity ?? "";
                attributesObj["readSpeed"] = productDto.ReadSpeed ?? "";
                attributesObj["writeSpeed"] = productDto.WriteSpeed ?? "";
                attributesObj["osSupport"] = productDto.OsSupport ?? "";
                attributesObj["operatingTemp"] = productDto.OperatingTemp ?? "";
                attributesObj["otherFeatures"] = productDto.OtherFeatures ?? "";
            } else if (productDto.Type == "pc") {
                attributesObj["pcCpu"] = productDto.PcCpu ?? "";
                attributesObj["pcMainboard"] = productDto.PcMainboard ?? "";
                attributesObj["pcRam"] = productDto.PcRam ?? "";
                attributesObj["pcVga"] = productDto.PcVga ?? "";
                attributesObj["pcStorage"] = productDto.PcStorage ?? "";
                attributesObj["pcPsu"] = productDto.PcPsu ?? "";
                attributesObj["pcCase"] = productDto.PcCase ?? "";
            } else if (productDto.Type == "psu") {
                attributesObj["powerCapacity"] = productDto.PowerCapacity ?? "";
                attributesObj["efficiency"] = productDto.Efficiency ?? "";
                attributesObj["formFactor"] = productDto.FormFactor ?? "";
                attributesObj["modular"] = productDto.Modular ?? "";
                attributesObj["inputVoltage"] = productDto.InputVoltage ?? "";
                attributesObj["psuFanSize"] = productDto.PsuFanSize ?? "";
            } else if (productDto.Type == "cooling") {
                attributesObj["coolerType"] = productDto.CoolerType ?? "";
                attributesObj["supportedSockets"] = productDto.SupportedSockets ?? "";
                attributesObj["fanSpeed"] = productDto.FanSpeed ?? "";
                attributesObj["airflow"] = productDto.Airflow ?? "";
                attributesObj["noiseLevel"] = productDto.NoiseLevel ?? "";
                attributesObj["radiatorSize"] = productDto.RadiatorSize ?? "";
            }

            var product = new Product
            {
                Category = productDto.Type ?? "cpu",
                Brand = string.IsNullOrEmpty(productDto.Brand) ? "Unknown" : productDto.Brand,
                Name = productDto.Name,
                Price = productDto.Price,
                Stock = productDto.StockQuantity,
                Attributes = System.Text.Json.JsonSerializer.Serialize(attributesObj)
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager,Editor")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            
            product.Name = productDto.Name;
            product.Price = productDto.Price;
            product.Stock = productDto.StockQuantity;
            product.Category = productDto.Type ?? "cpu";
            product.Brand = string.IsNullOrEmpty(productDto.Brand) ? "Unknown" : productDto.Brand;
            
            var attributesObj = new Dictionary<string, object> {
                { "category", productDto.Type ?? "cpu" },
                { "originalPrice", productDto.OriginalPrice ?? 0 },
                { "thumbnailUrl", productDto.ThumbnailUrl ?? "" },
                { "detailImageUrls", productDto.DetailImageUrls ?? new List<string>() }
            };

            if (productDto.Type == "cpu") {
                attributesObj["socket"] = productDto.Socket ?? "";
                attributesObj["cores"] = productDto.Cores ?? "";
                attributesObj["baseClock"] = productDto.BaseClock ?? "";
                attributesObj["boostClock"] = productDto.BoostClock ?? "";
                attributesObj["cache"] = productDto.Cache ?? "";
                attributesObj["tdp"] = productDto.Tdp ?? "";
                attributesObj["generation"] = productDto.Generation ?? "";
                attributesObj["generationName"] = productDto.GenerationName ?? "";
                attributesObj["threads"] = productDto.Threads ?? "";
                attributesObj["memorySupport"] = productDto.MemorySupport ?? "";
                attributesObj["memoryChannels"] = productDto.MemoryChannels ?? "";
                attributesObj["pcieVersion"] = productDto.PcieVersion ?? "";
                attributesObj["pcieLanes"] = productDto.PcieLanes ?? "";
                attributesObj["cooling"] = productDto.Cooling ?? "";
            } else if (productDto.Type == "vga") {
                attributesObj["graphicEngine"] = productDto.GraphicEngine ?? "";
                attributesObj["busStandard"] = productDto.BusStandard ?? "";
                attributesObj["vram"] = productDto.Vram ?? "";
                attributesObj["engineClock"] = productDto.EngineClock ?? "";
                attributesObj["cudaCores"] = productDto.CudaCores ?? "";
                attributesObj["memoryClock"] = productDto.MemoryClock ?? "";
                attributesObj["memoryInterface"] = productDto.MemoryInterface ?? "";
                attributesObj["ports"] = productDto.Ports ?? "";
                attributesObj["dimensions"] = productDto.Dimensions ?? "";
                attributesObj["recommendedPsu"] = productDto.RecommendedPsu ?? "";
                attributesObj["powerConnectors"] = productDto.PowerConnectors ?? "";
                attributesObj["directX"] = productDto.DirectX ?? "";
            } else if (productDto.Type == "ram") {
                attributesObj["ramModel"] = productDto.RamModel ?? "";
                attributesObj["capacity"] = productDto.Capacity ?? "";
                attributesObj["busSpeed"] = productDto.BusSpeed ?? "";
                attributesObj["ramType"] = productDto.RamType ?? "";
                attributesObj["overclock"] = productDto.Overclock ?? "";
                attributesObj["rgb"] = productDto.Rgb ?? "";
                attributesObj["voltage"] = productDto.Voltage ?? "";
                attributesObj["casLatency"] = productDto.CasLatency ?? "";
                attributesObj["warranty"] = productDto.Warranty ?? "";
            } else if (productDto.Type == "monitor") {
                attributesObj["screenSize"] = productDto.ScreenSize ?? "";
                attributesObj["resolution"] = productDto.Resolution ?? "";
                attributesObj["refreshRate"] = productDto.RefreshRate ?? "";
            } else if (productDto.Type == "mainboard") {
                attributesObj["socket"] = productDto.Socket ?? "";
                attributesObj["mainboardSize"] = productDto.MainboardSize ?? "";
                attributesObj["ramSlots"] = productDto.RamSlots ?? "";
                attributesObj["chipset"] = productDto.Chipset ?? "";
            } else if (productDto.Type == "storage") {
                attributesObj["driveType"] = productDto.DriveType ?? "";
                attributesObj["connection"] = productDto.Connection ?? "";
                attributesObj["storageCapacity"] = productDto.StorageCapacity ?? "";
                attributesObj["readSpeed"] = productDto.ReadSpeed ?? "";
                attributesObj["writeSpeed"] = productDto.WriteSpeed ?? "";
                attributesObj["osSupport"] = productDto.OsSupport ?? "";
                attributesObj["operatingTemp"] = productDto.OperatingTemp ?? "";
                attributesObj["otherFeatures"] = productDto.OtherFeatures ?? "";
            } else if (productDto.Type == "pc") {
                attributesObj["pcCpu"] = productDto.PcCpu ?? "";
                attributesObj["pcMainboard"] = productDto.PcMainboard ?? "";
                attributesObj["pcRam"] = productDto.PcRam ?? "";
                attributesObj["pcVga"] = productDto.PcVga ?? "";
                attributesObj["pcStorage"] = productDto.PcStorage ?? "";
                attributesObj["pcPsu"] = productDto.PcPsu ?? "";
                attributesObj["pcCase"] = productDto.PcCase ?? "";
            } else if (productDto.Type == "psu") {
                attributesObj["powerCapacity"] = productDto.PowerCapacity ?? "";
                attributesObj["efficiency"] = productDto.Efficiency ?? "";
                attributesObj["formFactor"] = productDto.FormFactor ?? "";
                attributesObj["modular"] = productDto.Modular ?? "";
                attributesObj["inputVoltage"] = productDto.InputVoltage ?? "";
                attributesObj["psuFanSize"] = productDto.PsuFanSize ?? "";
            } else if (productDto.Type == "cooling") {
                attributesObj["coolerType"] = productDto.CoolerType ?? "";
                attributesObj["supportedSockets"] = productDto.SupportedSockets ?? "";
                attributesObj["fanSpeed"] = productDto.FanSpeed ?? "";
                attributesObj["airflow"] = productDto.Airflow ?? "";
                attributesObj["noiseLevel"] = productDto.NoiseLevel ?? "";
                attributesObj["radiatorSize"] = productDto.RadiatorSize ?? "";
            }
            
            product.Attributes = System.Text.Json.JsonSerializer.Serialize(attributesObj);
            
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin,Manager,Editor")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0) return BadRequest("Nội dung file rỗng.");
            
            // Giới hạn dung lượng 2MB để tránh Base64 quá dài
            if (image.Length > 2 * 1024 * 1024) return BadRequest("File quá lớn (Tối đa 2MB). Vui lòng nén ảnh lại.");

            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64String = Convert.ToBase64String(fileBytes);
            
            var fileUrl = $"data:{image.ContentType};base64,{base64String}";
            return Ok(new { url = fileUrl });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager,Editor")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
