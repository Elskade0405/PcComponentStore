namespace PcComponentStore.Api.DTOs
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public List<string>? DetailImageUrls { get; set; }
        
        // CPU
        public string? Socket { get; set; }
        public string? Cores { get; set; }
        public string? BaseClock { get; set; }
        public string? BoostClock { get; set; }
        public string? Cache { get; set; }
        public string? Tdp { get; set; }
        public string? Generation { get; set; }
        public string? GenerationName { get; set; }
        public string? Threads { get; set; }
        public string? MemorySupport { get; set; }
        public string? MemoryChannels { get; set; }
        public string? PcieVersion { get; set; }
        public string? PcieLanes { get; set; }
        public string? Cooling { get; set; }

        public string Type { get; set; } = "cpu"; // "cpu", "vga", "ram", "monitor", "pc"

        // VGA
        public string? GraphicEngine { get; set; }
        public string? BusStandard { get; set; }
        public string? Vram { get; set; }
        public string? EngineClock { get; set; }
        public string? CudaCores { get; set; }
        public string? MemoryClock { get; set; }
        public string? MemoryInterface { get; set; }
        public string? Ports { get; set; }
        public string? Dimensions { get; set; }
        public string? RecommendedPsu { get; set; }
        public string? PowerConnectors { get; set; }
        public string? DirectX { get; set; }

        // RAM
        public string? RamModel { get; set; }
        public string? Capacity { get; set; }
        public string? BusSpeed { get; set; }
        public string? RamType { get; set; }
        public string? Overclock { get; set; }
        public string? Rgb { get; set; }
        public string? Voltage { get; set; }
        public string? CasLatency { get; set; }
        public string? Warranty { get; set; }

        // Monitor
        public string? ScreenSize { get; set; }
        public string? Resolution { get; set; }
        public string? RefreshRate { get; set; }

        // Mainboard
        public string? MainboardSize { get; set; }
        public string? RamSlots { get; set; }
        public string? Chipset { get; set; }

        // Storage (SSD/HDD)
        public string? DriveType { get; set; }
        public string? Connection { get; set; }
        public string? StorageCapacity { get; set; }
        public string? ReadSpeed { get; set; }
        public string? WriteSpeed { get; set; }
        public string? OsSupport { get; set; }
        public string? OperatingTemp { get; set; }
        public string? OtherFeatures { get; set; }

        // PC Lắp Ráp Sẵn
        public string? PcCpu { get; set; }
        public string? PcMainboard { get; set; }
        public string? PcRam { get; set; }
        public string? PcVga { get; set; }
        public string? PcStorage { get; set; }
        public string? PcPsu { get; set; }
        public string? PcCase { get; set; }

        // PSU (Nguồn)
        public string? PowerCapacity { get; set; }
        public string? Efficiency { get; set; }
        public string? FormFactor { get; set; }
        public string? Modular { get; set; }
        public string? InputVoltage { get; set; }
        public string? PsuFanSize { get; set; }

        // Cooling (Tản nhiệt)
        public string? CoolerType { get; set; }
        public string? SupportedSockets { get; set; }
        public string? FanSpeed { get; set; }
        public string? Airflow { get; set; }
        public string? NoiseLevel { get; set; }
        public string? RadiatorSize { get; set; }
    }
}
