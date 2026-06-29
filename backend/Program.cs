using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.Models;
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var railwayMySqlUrl = Environment.GetEnvironmentVariable("MYSQL_URL");
if (!string.IsNullOrEmpty(railwayMySqlUrl))
{
    var uri = new Uri(railwayMySqlUrl);
    var userInfo = uri.UserInfo.Split(':');
    var dbName = uri.AbsolutePath.Trim('/');
    connectionString = $"Server={uri.Host};Port={(uri.Port > 0 ? uri.Port : 3306)};Database={dbName};User={userInfo[0]};Password={(userInfo.Length > 1 ? userInfo[1] : "")};";
}
builder.Services.AddDbContext<PcComponentStoreDbContext>(options =>
{
    var serverVersion = new MySqlServerVersion(new Version(8, 0, 30));
    options.UseMySql(connectionString, serverVersion);
});
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT Secret Key is not configured.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true) 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); 
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PcComponentStoreDbContext>();
    try
    {
        var createUsersTable = @"
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                role_type VARCHAR(50) NOT NULL,
                attributes JSON NULL,
                created_at DATETIME NOT NULL
            );
        ";

        var createOrdersTable = @"
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(50) PRIMARY KEY,
                user_id INT NULL,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                total_amount DECIMAL(18,2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                order_date DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            );
        ";
        
        var createOrderItemsTable = @"
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(18,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES cpu(id) ON DELETE RESTRICT
            );
        ";

        dbContext.Database.ExecuteSqlRaw(createUsersTable);
        dbContext.Database.ExecuteSqlRaw(createOrdersTable);
        dbContext.Database.ExecuteSqlRaw(createOrderItemsTable);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Could not create tables: {ex.Message}");
    }
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
