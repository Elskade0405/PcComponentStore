using System;

namespace PcComponentStore.Api.Models
{
    public class Cpu
    {
        public int Id { get; set; }
        public string Brand { get; set; } = null!;
        public string CpuName { get; set; } = null!;
        public int Stock { get; set; }
        public string Attributes { get; set; } = null!; // JSON string 
    }
}
