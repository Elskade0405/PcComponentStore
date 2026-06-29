using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using System.Threading.Tasks;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;

        public UsersController(PcComponentStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();


            return Ok(users);
        }

        [HttpPut("{id}/lock")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> ToggleLockUser(int id, [FromBody] bool isLocked)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            if (user.RoleType == "admin") return BadRequest(new { Message = "Cannot lock an admin account." });

            var attributesObj = string.IsNullOrEmpty(user.Attributes) 
                ? new System.Collections.Generic.Dictionary<string, object>() 
                : System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.Dictionary<string, object>>(user.Attributes);
            
            if (attributesObj == null) attributesObj = new System.Collections.Generic.Dictionary<string, object>();
            
            attributesObj["isLocked"] = isLocked;
            user.Attributes = System.Text.Json.JsonSerializer.Serialize(attributesObj);
            
            await _context.SaveChangesAsync();
            return Ok(new { Message = isLocked ? "Account locked successfully." : "Account unlocked successfully." });
        }
    }
}
