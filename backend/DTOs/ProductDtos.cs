namespace PcComponentStore.Api.DTOs
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public string Brand { get; set; } = string.Empty;
        
        // Dynamic attributes for CPU
        public string? Socket { get; set; }
        public string? Cores { get; set; }
        public string? BaseClock { get; set; }
        public string? BoostClock { get; set; }
        public string? Cache { get; set; }
        public string? Tdp { get; set; }
    }
}
