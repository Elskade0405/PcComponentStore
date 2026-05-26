using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PcComponentStore.Api.Models
{
    [Table("settings")]
    public class Setting
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("setting_key")]
        public required string Key { get; set; }

        [Column("setting_value")]
        public string? Value { get; set; }
    }
}
