using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PcComponentStore.Api.Models
{
    public class Product
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("category")]
        public string Category { get; set; }

        [Column("brand")]
        public string? Brand { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("stock")]
        public int Stock { get; set; }

        [Column("price", TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        [Column("attributes")]
        public string? Attributes { get; set; }
    }
}
