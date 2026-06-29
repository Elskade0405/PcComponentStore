using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PcComponentStore.Api.Models
{
    public class Order
    {
        [Key]
        public string Id { get; set; } = string.Empty; 
        
        public int? UserId { get; set; }
        public User? User { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Pending"; 
        public string PaymentMethod { get; set; } = "COD";

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
