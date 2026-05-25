using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PcComponentStore.Api.Helpers;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;

        public ChatbotController(PcComponentStoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("ask")]
        public async Task<ActionResult<dynamic>> Ask([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return Ok(new { reply = "Bạn cần mình giúp gì về PC hay linh kiện không ạ?" });
            }

            string msg = request.Message.ToLower().Trim();

            // Nhận diện ý định (Intent detection) cơ bản
            bool isGreeting = msg.Contains("chào") || msg.Contains("hello") || msg.Contains("hi");
            bool isPriceQuery = msg.Contains("giá") || msg.Contains("rẻ") || msg.Contains("đắt");
            bool isBuildPc = msg.Contains("build") || msg.Contains("xây dựng") || msg.Contains("cấu hình") 
                             || msg.Contains("bộ pc") || msg.Contains("dàn pc") || msg.Contains("máy tính") 
                             || (msg.Contains("pc") && (msg.Contains("triệu") || msg.Contains("tr") || msg.Contains("củ") || msg.Contains("giá")));
            bool optimizeVga = msg.Contains("vga") || msg.Contains("card màn hình") || msg.Contains("đồ họa");
            
            // Xây dựng danh sách từ khóa tìm kiếm
            string[] keywords = msg.Split(new[] { ' ', ',', '.', '?' }, System.StringSplitOptions.RemoveEmptyEntries);
            
            // Trích xuất danh mục sản phẩm có thể có
            string? targetCategory = null;
            if (msg.Contains("laptop")) targetCategory = "laptop";
            else if (optimizeVga) targetCategory = "vga";
            else if (msg.Contains("màn hình") || msg.Contains("monitor")) targetCategory = "monitor";
            else if (msg.Contains("cpu") || msg.Contains("vi xử lý") || msg.Contains("chip")) targetCategory = "cpu";
            else if (msg.Contains("mainboard") || msg.Contains("bo mạch")) targetCategory = "mainboard";
            else if (msg.Contains("ram")) targetCategory = "ram";
            else if (msg.Contains("ssd") || msg.Contains("hdd") || msg.Contains("ổ cứng")) targetCategory = "storage";
            else if (msg.Contains("nguồn") || msg.Contains("psu")) targetCategory = "psu";
            else if (msg.Contains("tản nhiệt")) targetCategory = "cooler";

            // Nhận diện giá tiền (VD: dưới 10 triệu, trên 5 tr)
            decimal? maxPrice = null;
            decimal? minPrice = null;
            decimal? exactBudget = null;
            
            var matchUnder = System.Text.RegularExpressions.Regex.Match(msg, @"dưới\s+(\d+)\s*(triệu|tr|củ)");
            if (matchUnder.Success && decimal.TryParse(matchUnder.Groups[1].Value, out decimal maxVal)) {
                maxPrice = maxVal * 1000000;
            }

            var matchOver = System.Text.RegularExpressions.Regex.Match(msg, @"(trên|hơn)\s+(\d+)\s*(triệu|tr|củ)");
            if (matchOver.Success && decimal.TryParse(matchOver.Groups[2].Value, out decimal minVal)) {
                minPrice = minVal * 1000000;
            }

            var matchExact = System.Text.RegularExpressions.Regex.Match(msg, @"(?<!dưới\s|trên\s|hơn\s)\b(\d+)\s*(triệu|tr|củ)\b");
            if (matchExact.Success && decimal.TryParse(matchExact.Groups[1].Value, out decimal exactVal)) {
                exactBudget = exactVal * 1000000;
            }

            // Truy vấn CSDL
            var allProducts = await _context.Products.ToListAsync();

            if (isBuildPc)
            {
                decimal targetBudget = exactBudget ?? maxPrice ?? minPrice ?? 0;
                
                if (targetBudget == 0)
                {
                    return Ok(new { reply = "Bạn muốn build PC với ngân sách khoảng bao nhiêu tiền ạ? (VD: 20 triệu, 15 triệu...)" });
                }

                var build = PcBuilderAlgorithm.BuildPc(allProducts, targetBudget, optimizeVga);
                
                if (build.Count == 0)
                {
                    return Ok(new { reply = "Xin lỗi bạn, với ngân sách này hiện tại cửa hàng chưa có đủ linh kiện để build trọn bộ. Bạn có thể tăng thêm ngân sách một chút được không ạ?" });
                }

                decimal totalPrice = build.Sum(p => p.Price ?? 0);
                string buildReplyText = $"Dạ vâng! Đây là cấu hình PC tối ưu nhất trong tầm giá **{totalPrice.ToString("N0")}đ** mà AI của cửa hàng vừa xây dựng cho bạn:\n\n";

                var buildItemsResult = build.Select(p => new {
                    Id = p.Id,
                    Name = p.Name,
                    Brand = p.Brand,
                    Price = p.Price ?? 0,
                    StockQuantity = p.Stock,
                    CategoryName = p.Category,
                    Attributes = p.Attributes
                }).ToList();

                buildReplyText += "Bạn có thể xem danh sách linh kiện bên dưới và bấm nút thêm vào giỏ hàng nhé!";
                
                return Ok(new { reply = buildReplyText, buildItems = buildItemsResult });
            }
            
            // Lọc sản phẩm
            var matchedProducts = allProducts.Select(c => {
                string catName = c.Category;
                try {
                    if (!string.IsNullOrEmpty(c.Attributes)) {
                        using (JsonDocument doc = JsonDocument.Parse(c.Attributes)) {
                            if (doc.RootElement.TryGetProperty("category", out JsonElement catElement)) {
                                catName = catElement.GetString()?.ToLower() ?? "cpu";
                            }
                        }
                    }
                } catch { }
                return new { Product = c, Category = catName };
            });

            // Lọc theo Category nếu nhận diện được
            if (!string.IsNullOrEmpty(targetCategory))
            {
                matchedProducts = matchedProducts.Where(p => p.Category == targetCategory);
            }

            // Lọc theo Khoảng giá
            if (maxPrice.HasValue) {
                matchedProducts = matchedProducts.Where(p => p.Product.Price != null && p.Product.Price <= maxPrice.Value);
            }
            if (minPrice.HasValue) {
                matchedProducts = matchedProducts.Where(p => p.Product.Price != null && p.Product.Price >= minPrice.Value);
            }

            // Tính điểm số trùng khớp dựa trên Keywords
            var rankedProducts = matchedProducts.Select(p => {
                int score = 0;
                string searchSpace = $"{p.Product.Name?.ToLower()} {p.Product.Brand?.ToLower()} {p.Product.Attributes?.ToLower()}";
                
                // Các keyword loại trừ không tính điểm
                string[] ignoreWords = { "cho", "mình", "tôi", "hỏi", "có", "không", "giá", "bao", "nhiêu", "tìm", "mua", "loại", "nào" };
                
                foreach (var kw in keywords) {
                    if (!ignoreWords.Contains(kw) && searchSpace.Contains(kw)) {
                        score++;
                    }
                }
                return new { p.Product, p.Category, Score = score };
            })
            // Chỉ lấy những sản phẩm có điểm > 0 HOẶC nếu đã biết category thì lấy bừa 3 cái cao điểm nhất
            .Where(p => p.Score > 0 || !string.IsNullOrEmpty(targetCategory))
            .OrderByDescending(p => p.Score)
            .ThenBy(p => p.Product.Price) // Nếu cùng điểm thì ưu tiên giá rẻ lên trước
            .Take(3)
            .ToList();

            // Nếu chỉ chào hỏi mà không có keyword cụ thể
            if (isGreeting && rankedProducts.Count() == 0 && string.IsNullOrEmpty(targetCategory))
            {
                return Ok(new { reply = "Chào bạn! Mình là trợ lý AI của PC Component Store. Bạn đang cần tìm mua linh kiện gì, laptop hay muốn build PC ạ?" });
            }

            if (rankedProducts.Count() == 0)
            {
                return Ok(new { reply = "Dạ hiện tại mình chưa tìm thấy sản phẩm nào khớp với yêu cầu của bạn. Bạn có thể nói rõ hơn tên thương hiệu hoặc loại sản phẩm được không ạ?" });
            }

            // Sinh câu trả lời
            string replyText = $"Dạ, cửa hàng em đang có một số mẫu cực kỳ phù hợp với yêu cầu của bạn ạ:\n\n";
            
            foreach (var item in rankedProducts)
            {
                string priceFmt = item.Product.Price?.ToString("N0") + "đ";
                replyText += $"- **{item.Product.Name}**\n  💵 Giá chỉ: {priceFmt}\n\n";
            }
            
            replyText += "Bạn thấy ưng mẫu nào chưa ạ? Bạn có thể bấm vào mục tìm kiếm trên Web để xem hình ảnh và chi tiết nhé!";

            // Lưu lịch sử nếu có UserId
            if (request.UserId.HasValue)
            {
                var userObj = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId.Value);
                if (userObj != null)
                {
                    // Update attributes JSON with search history
                    var currentHistory = new List<string>();
                    Dictionary<string, object> attrDict = new Dictionary<string, object>();
                    
                    if (!string.IsNullOrEmpty(userObj.Attributes))
                    {
                        try {
                            attrDict = JsonSerializer.Deserialize<Dictionary<string, object>>(userObj.Attributes) ?? new Dictionary<string, object>();
                            if (attrDict.TryGetValue("searchHistory", out object? historyObj) && historyObj is JsonElement jsonEl)
                            {
                                if (jsonEl.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var item in jsonEl.EnumerateArray())
                                    {
                                        currentHistory.Add(item.GetString() ?? "");
                                    }
                                }
                            }
                        } catch { }
                    }

                    // Add new keywords
                    var ignoreWordsList = new List<string> { "cho", "mình", "tôi", "hỏi", "có", "không", "giá", "bao", "nhiêu", "tìm", "mua", "loại", "nào", "dưới", "trên", "triệu", "tr", "củ" };
                    var newKeywords = keywords.Where(k => !ignoreWordsList.Contains(k)).ToList();
                    
                    if (!string.IsNullOrEmpty(targetCategory)) newKeywords.Add(targetCategory);
                    
                    currentHistory.AddRange(newKeywords);
                    // Keep only last 20 keywords to avoid bloat
                    currentHistory = currentHistory.Distinct().TakeLast(20).ToList();

                    attrDict["searchHistory"] = currentHistory;
                    userObj.Attributes = JsonSerializer.Serialize(attrDict);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { reply = replyText });
        }

        [HttpGet("suggestions/{userId}")]
        public async Task<ActionResult<dynamic>> GetSuggestions(int userId)
        {
            var userObj = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (userObj == null || string.IsNullOrEmpty(userObj.Attributes))
                return Ok(new List<object>());

            var currentHistory = new List<string>();
            try {
                var attrDict = JsonSerializer.Deserialize<Dictionary<string, object>>(userObj.Attributes);
                if (attrDict != null && attrDict.TryGetValue("searchHistory", out object? historyObj) && historyObj is JsonElement jsonEl)
                {
                    if (jsonEl.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var item in jsonEl.EnumerateArray())
                        {
                            currentHistory.Add(item.GetString() ?? "");
                        }
                    }
                }
            } catch { return Ok(new List<object>()); }

            if (currentHistory.Count == 0) return Ok(new List<object>());

            var allProducts = await _context.Products.ToListAsync();
            
            var matchedProducts = allProducts.Select(c => {
                string catName = c.Category;
                try {
                    if (!string.IsNullOrEmpty(c.Attributes)) {
                        using (JsonDocument doc = JsonDocument.Parse(c.Attributes)) {
                            if (doc.RootElement.TryGetProperty("category", out JsonElement catElement)) {
                                catName = catElement.GetString()?.ToLower() ?? "cpu";
                            }
                        }
                    }
                } catch { }
                return new { Product = c, Category = catName };
            });

            var rankedProducts = matchedProducts.Select(p => {
                int score = 0;
                string searchSpace = $"{p.Product.Name?.ToLower()} {p.Product.Brand?.ToLower()} {p.Category}".ToLower();
                
                foreach (var kw in currentHistory) {
                    if (searchSpace.Contains(kw.ToLower())) {
                        score++;
                    }
                }
                return new { p.Product, p.Category, Score = score };
            })
            .Where(p => p.Score > 0)
            .OrderByDescending(p => p.Score)
            .Take(8)
            .Select(p => new {
                Id = p.Product.Id,
                Name = p.Product.Name,
                Brand = p.Product.Brand,
                Price = p.Product.Price ?? 0,
                StockQuantity = p.Product.Stock,
                CategoryName = p.Category,
                Attributes = p.Product.Attributes
            })
            .ToList();

            return Ok(rankedProducts);
        }
    }
}
