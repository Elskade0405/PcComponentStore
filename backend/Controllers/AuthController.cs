using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using PcComponentStore.Api.Models;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(PcComponentStoreDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (userExists)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User already exists!" });

            var newUser = new User
            {
                Username = model.Email.Split('@')[0],
                Email = model.Email,
                PasswordHash = model.Password, // WARNING: In production, hash this properly (BCrypt, Argon2, etc.)
                PhoneNumber = "0000000000",
                RoleType = "customer",
                Attributes = "{}",
                CreatedAt = DateTime.UtcNow
            };

            // If it's the very first user, make them an admin automatically
            if (!await _context.Users.AnyAsync())
            {
                newUser.RoleType = "admin";
            }

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "User created successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // Note: Currently doing plaintext password check for compatibility with provided SQL dump's 'hashed_pwd_1'.
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email && u.PasswordHash == model.Password);
            
            if (user != null)
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.RoleType == "admin" ? "Admin" : "Customer")
                };

                var token = GetToken(authClaims);

                return Ok(new AuthResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Email = user.Email,
                    Role = user.RoleType == "admin" ? "Admin" : "Customer"
                });
            }
            return Unauthorized();
        }

        [HttpGet("import-db")]
        public async Task<IActionResult> ImportDb()
        {
            var sqlFilePath = @"C:\Users\admin\Documents\workspace\DoAn_PcStore\Db\pccomdb.sql";
            if (!System.IO.File.Exists(sqlFilePath)) return NotFound("SQL file not found at " + sqlFilePath);

            var sql = await System.IO.File.ReadAllTextAsync(sqlFilePath);
            
            try 
            {
                // First, connect without database to create it
                var masterConnectionString = "Server=localhost;User=root;Password=1234;";
                using var masterConnection = new MySqlConnector.MySqlConnection(masterConnectionString);
                await masterConnection.OpenAsync();
                
                using var createCmd = masterConnection.CreateCommand();
                createCmd.CommandText = "CREATE DATABASE IF NOT EXISTS pccomdb; USE pccomdb;";
                await createCmd.ExecuteNonQueryAsync();

                // Now execute the script
                using var scriptCmd = masterConnection.CreateCommand();
                scriptCmd.CommandText = sql;
                await scriptCmd.ExecuteNonQueryAsync();

                return Ok("Database created and imported successfully!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}
