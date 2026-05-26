using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;

        public SettingsController(PcComponentStoreDbContext context)
        {
            _context = context;
        }

        // GET: api/settings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Setting>>> GetSettings()
        {
            return await _context.Settings.ToListAsync();
        }

        // GET: api/settings/HOME_BANNER_URL
        [HttpGet("{key}")]
        public async Task<ActionResult<Setting>> GetSetting(string key)
        {
            var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == key);
            if (setting == null)
            {
                return NotFound();
            }
            return setting;
        }

        // POST: api/settings
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSetting([FromBody] SettingRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Key))
            {
                return BadRequest("Key is required");
            }

            var setting = await _context.Settings.FirstOrDefaultAsync(s => s.Key == request.Key);
            if (setting == null)
            {
                setting = new Setting { Key = request.Key, Value = request.Value };
                _context.Settings.Add(setting);
            }
            else
            {
                setting.Value = request.Value;
            }

            await _context.SaveChangesAsync();
            return Ok(setting);
        }
    }

    public class SettingRequestDto
    {
        public required string Key { get; set; }
        public string? Value { get; set; }
    }
}
