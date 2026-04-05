using System;

namespace PcComponentStore.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string RoleType { get; set; } = null!;
        public string Attributes { get; set; } = null!; // JSON string mapped to string in EF Core
        public DateTime CreatedAt { get; set; }
    }
}
