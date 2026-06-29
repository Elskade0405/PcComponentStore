using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using PcComponentStore.Api.Models;

namespace PcComponentStore.Api.Helpers
{
    public static class PcBuilderAlgorithm
    {
        public static List<Product> BuildPc(List<Product> allProducts, decimal targetBudget, bool optimizeVga)
        {
            var build = new List<Product>();

            decimal vgaBudgetRatio = optimizeVga ? 0.45m : 0.30m;
            decimal cpuBudgetRatio = optimizeVga ? 0.20m : 0.30m;
            decimal mainboardBudgetRatio = 0.15m;
            decimal ramBudgetRatio = 0.08m;
            decimal storageBudgetRatio = 0.07m;
            decimal psuBudgetRatio = 0.05m;
            
            decimal vgaBudget = targetBudget * vgaBudgetRatio;
            decimal cpuBudget = targetBudget * cpuBudgetRatio;
            decimal mainboardBudget = targetBudget * mainboardBudgetRatio;
            decimal ramBudget = targetBudget * ramBudgetRatio;
            decimal storageBudget = targetBudget * storageBudgetRatio;
            decimal psuBudget = targetBudget * psuBudgetRatio;

            var vgas = GetProductsByCategory(allProducts, "vga").OrderByDescending(p => p.Price).ToList();
            var cpus = GetProductsByCategory(allProducts, "cpu").OrderByDescending(p => p.Price).ToList();
            var mainboards = GetProductsByCategory(allProducts, "mainboard").OrderByDescending(p => p.Price).ToList();
            var rams = GetProductsByCategory(allProducts, "ram").OrderByDescending(p => p.Price).ToList();
            var storages = GetProductsByCategory(allProducts, "storage").OrderByDescending(p => p.Price).ToList();
            var psus = GetProductsByCategory(allProducts, "psu").OrderByDescending(p => p.Price).ToList();

            var selectedVga = vgas.FirstOrDefault(p => p.Price <= vgaBudget) ?? vgas.LastOrDefault();
            if (selectedVga != null) build.Add(selectedVga);

            var selectedCpu = cpus.FirstOrDefault(p => p.Price <= cpuBudget) ?? cpus.LastOrDefault();
            if (selectedCpu != null) build.Add(selectedCpu);

            string cpuSocket = GetAttribute(selectedCpu, "socket");

            var compatibleMainboards = mainboards.Where(m => GetAttribute(m, "socket") == cpuSocket).ToList();
            var selectedMain = compatibleMainboards.FirstOrDefault(p => p.Price <= mainboardBudget) ?? compatibleMainboards.LastOrDefault();
            if (selectedMain != null) build.Add(selectedMain);


            string mainName = selectedMain?.Name?.ToLower() ?? "";
            string requiredRamType = mainName.Contains("ddr4") ? "ddr4" : "ddr5";
            
            var compatibleRams = rams.Where(r => r.Name?.ToLower().Contains(requiredRamType) == true).ToList();
            var selectedRam = compatibleRams.FirstOrDefault(p => p.Price <= ramBudget) ?? compatibleRams.LastOrDefault();
            if (selectedRam != null) build.Add(selectedRam);

            var selectedStorage = storages.FirstOrDefault(p => p.Price <= storageBudget) ?? storages.LastOrDefault();
            if (selectedStorage != null) build.Add(selectedStorage);

            var selectedPsu = psus.FirstOrDefault(p => p.Price <= psuBudget) ?? psus.LastOrDefault();
            if (selectedPsu != null) build.Add(selectedPsu);

            return build;
        }

        private static IEnumerable<Product> GetProductsByCategory(List<Product> products, string category)
        {
            return products.Where(p => string.Equals(p.Category, category, StringComparison.OrdinalIgnoreCase));
        }

        private static string GetAttribute(Product? product, string key)
        {
            if (product == null || string.IsNullOrEmpty(product.Attributes)) return "";
            try {
                using (var doc = JsonDocument.Parse(product.Attributes)) {
                    if (doc.RootElement.TryGetProperty(key, out var element)) {
                        return element.GetString() ?? "";
                    }
                }
            } catch { }
            return "";
        }
    }
}
