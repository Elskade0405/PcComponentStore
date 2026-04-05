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
        public DbSet<Cpu> Cpu { get; set; }

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

            // Configure Cpu table mapping
            builder.Entity<Cpu>(entity =>
            {
                entity.ToTable("cpu");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Brand).HasColumnName("brand");
                entity.Property(e => e.CpuName).HasColumnName("cpu_name");
                entity.Property(e => e.Stock).HasColumnName("stock");
                entity.Property(e => e.Attributes).HasColumnName("attributes").HasColumnType("json");
            });
        }
    }
}
