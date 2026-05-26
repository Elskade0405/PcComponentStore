using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Models;

namespace PcComponentStore.Api.Data
{
    public class PcComponentStoreDbContext : DbContext
    {
        public PcComponentStoreDbContext(DbContextOptions<PcComponentStoreDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Setting> Settings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Users table mapping
            builder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone_number");
                entity.Property(e => e.RoleType).HasColumnName("role_type");
                entity.Property(e => e.Attributes).HasColumnName("attributes").HasColumnType("json");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // Configure Products table mapping
            builder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Brand).HasColumnName("brand");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Stock).HasColumnName("stock");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.Attributes).HasColumnName("attributes").HasColumnType("json");
            });

            // Configure Order table mapping
            builder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasMaxLength(50);
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CustomerName).HasColumnName("customer_name").HasMaxLength(255);
                entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(20);
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255);
                entity.Property(e => e.Address).HasColumnName("address").HasColumnType("text");
                entity.Property(e => e.TotalAmount).HasColumnName("total_amount").HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(50);
                entity.Property(e => e.PaymentMethod).HasColumnName("payment_method").HasMaxLength(50);
                entity.Property(e => e.OrderDate).HasColumnName("order_date");

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure OrderItem table mapping
            builder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("order_items");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.OrderId).HasColumnName("order_id").HasMaxLength(50);
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.Quantity).HasColumnName("quantity");
                entity.Property(e => e.UnitPrice).HasColumnName("unit_price").HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
