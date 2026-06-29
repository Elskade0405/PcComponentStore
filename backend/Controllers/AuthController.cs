using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using PcComponentStore.Api.Models;
using Google.Apis.Auth;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly IMemoryCache _cache;

        public AuthController(PcComponentStoreDbContext context, IConfiguration configuration, IWebHostEnvironment env, IMemoryCache cache)
        {
            _context = context;
            _configuration = configuration;
            _env = env;
            _cache = cache;
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
                if (!string.IsNullOrEmpty(user.Attributes) && user.Attributes.Contains("\"isLocked\":true"))
                {
                    return Unauthorized(new { Status = "Error", Message = "Tài khoản của bạn đã bị khóa." });
                }
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.RoleType == "admin" ? "Admin" : (user.RoleType == "customer" ? "Customer" : user.RoleType))
                };

                var token = GetToken(authClaims);

                return Ok(new AuthResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Email = user.Email,
                    Role = user.RoleType == "admin" ? "Admin" : (user.RoleType == "customer" ? "Customer" : user.RoleType), UserId = user.Id
                });
            }
            return Unauthorized();
        }

        [HttpGet("import-db")]
        public async Task<IActionResult> ImportDb()
        {
            var sqlFilePath = Path.Combine(_env.ContentRootPath, "Db", "pccomdb.sql");
            if (!System.IO.File.Exists(sqlFilePath)) return NotFound("SQL file not found at " + sqlFilePath + ". Please place your pccomdb.sql here.");

            var sql = await System.IO.File.ReadAllTextAsync(sqlFilePath);
            
            try 
            {
                // First, connect without database to create it
                var defaultConn = _configuration.GetConnectionString("DefaultConnection");
                if (string.IsNullOrEmpty(defaultConn)) return BadRequest("DefaultConnection is not configured.");
                var masterConnectionString = defaultConn.Replace("Database=pccomdb;", "");
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

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.RoleType == "admin" ? "Admin" : (user.RoleType == "customer" ? "Customer" : user.RoleType))
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "ThisIsAVerySecretKeyThatNeedsToBeAtLeast32BytesLong"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class GoogleLoginRequest
        {
            public string Credential { get; set; } = null!;
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var clientId = _configuration["Google:ClientId"];
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                if (!string.IsNullOrEmpty(clientId))
                {
                    validationSettings.Audience = new[] { clientId };
                }

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential, validationSettings);

                var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == payload.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Username = payload.Name ?? payload.Email.Split('@')[0],
                        Email = payload.Email,
                        PasswordHash = "GOOGLE_LOGIN", // Placeholder for Google users
                        PhoneNumber = "0000000000",
                        RoleType = "customer",
                        Attributes = "{}",
                        CreatedAt = DateTime.UtcNow
                    };

                    if (!await _context.Users.AnyAsync())
                    {
                        user.RoleType = "admin";
                    }

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.RoleType == "admin" ? "Admin" : (user.RoleType == "customer" ? "Customer" : user.RoleType), UserId = user.Id
                    }
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized(new { Message = "Invalid Google Token" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error processing Google Login", Details = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return BadRequest(new { Message = "Email này chưa được đăng ký trong hệ thống." });
            }

            // Generate 6-digit OTP
            string otp = new Random().Next(100000, 999999).ToString();

            // Store in cache with 5 minutes expiration
            _cache.Set($"OTP_{model.Email}", otp, TimeSpan.FromMinutes(5));

            // Log OTP clearly to console/system log for developer debugging and demo mode fallback
            Console.WriteLine($"[FORGOT PASSWORD OTP] Email: {model.Email} | OTP: {otp}");

            try
            {
                // Read from environment variables first (Railway), fallback to appsettings.json
                var smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER") 
                    ?? _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") 
                    ?? _configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME") 
                    ?? _configuration["EmailSettings:SmtpUsername"] ?? "";
                var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD") 
                    ?? _configuration["EmailSettings:SmtpPassword"] ?? "";
                var senderName = Environment.GetEnvironmentVariable("SMTP_SENDER_NAME") 
                    ?? _configuration["EmailSettings:SenderName"] ?? "PC Component Store";
                var senderEmail = Environment.GetEnvironmentVariable("SMTP_SENDER_EMAIL") 
                    ?? _configuration["EmailSettings:SenderEmail"] ?? smtpUsername;

                var brevoApiKey = Environment.GetEnvironmentVariable("BREVO_API_KEY") 
                    ?? _configuration["EmailSettings:BrevoApiKey"];

                if (!string.IsNullOrEmpty(brevoApiKey))
                {
                    Console.WriteLine($"[Brevo] Sending email to {model.Email} via HTTP API...");
                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Add("api-key", brevoApiKey);
                        httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                        var payload = new
                        {
                            sender = new { name = senderName, email = senderEmail },
                            to = new[] { new { email = model.Email } },
                            subject = "Mã xác thực Khôi phục mật khẩu - PC Component Store",
                            htmlContent = $"<h3>Mã xác thực OTP của bạn là: <strong style='font-size:24px;color:#2563eb'>{otp}</strong></h3><p>Mã này có hiệu lực trong vòng 5 phút. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>"
                        };

                        var jsonPayload = System.Text.Json.JsonSerializer.Serialize(payload);
                        var content = new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");

                        var response = await httpClient.PostAsync("https://api.brevo.com/v3/smtp/email", content);
                        var responseBody = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"[Brevo Response] Status: {response.StatusCode}, Body: {responseBody}");

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception($"Brevo API returned error: {response.StatusCode} - {responseBody}");
                        }
                    }

                    return Ok(new { Message = "Một mã OTP đã được gửi đến email của bạn qua Brevo." });
                }

                Console.WriteLine($"[SMTP] Connecting to {smtpServer}:{smtpPort} as {smtpUsername}...");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress("", model.Email));
                message.Subject = "Mã xác thực Khôi phục mật khẩu - PC Component Store";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $"<h3>Mã xác thực OTP của bạn là: <strong style='font-size:24px;color:#2563eb'>{otp}</strong></h3><p>Mã này có hiệu lực trong vòng 5 phút. Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>"
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    client.Timeout = 15000; // 15 seconds

                    // Accept all SSL certificates
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    // Use StartTls for port 587, SslOnConnect for port 465
                    var sslOptions = smtpPort == 465 
                        ? MailKit.Security.SecureSocketOptions.SslOnConnect 
                        : MailKit.Security.SecureSocketOptions.StartTls;
                    
                    await client.ConnectAsync(smtpServer, smtpPort, sslOptions);
                    Console.WriteLine("[SMTP] Connected! Authenticating...");
                    
                    await client.AuthenticateAsync(smtpUsername, smtpPassword);
                    Console.WriteLine("[SMTP] Authenticated! Sending email...");
                    
                    await client.SendAsync(message);
                    Console.WriteLine("[SMTP] Email sent successfully!");
                    
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SMTP/Brevo ERROR] {ex.GetType().Name}: {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[SMTP/Brevo INNER] {ex.InnerException.GetType().Name}: {ex.InnerException.Message}");
                
                var errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                
                // Return an Ok with warning message. The page will transition to step 2 where they can type the OTP from Railway logs.
                return Ok(new { Message = $"Mã OTP đã được tạo thành công! (Lưu ý: Không thể gửi email do lỗi SMTP/Brevo: '{errorMsg}'. Vui lòng lấy mã OTP trực tiếp trong Log của Railway)." });
            }

            return Ok(new { Message = "Một mã OTP đã được gửi đến email của bạn." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (!_cache.TryGetValue($"OTP_{model.Email}", out string expectedOtp))
            {
                return BadRequest(new { Message = "Mã OTP đã hết hạn hoặc không tồn tại." });
            }

            if (expectedOtp != model.Otp)
            {
                return BadRequest(new { Message = "Mã OTP không chính xác." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return BadRequest(new { Message = "Người dùng không tồn tại." });

            // Cập nhật mật khẩu mới
            user.PasswordHash = model.NewPassword;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Xóa OTP khỏi cache
            _cache.Remove($"OTP_{model.Email}");

            return Ok(new { Message = "Khôi phục mật khẩu thành công!" });
        }
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }
}
