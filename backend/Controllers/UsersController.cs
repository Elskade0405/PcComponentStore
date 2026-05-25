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
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            // In a real application, DO NOT return PasswordHash. 
            // However, the user explicitly requested to view the username and password for the admin dashboard.
            return Ok(users);
        }
    }
}
