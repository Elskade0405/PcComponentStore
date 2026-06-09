using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcComponentStore.Api.Data;
using PcComponentStore.Api.DTOs;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using PcComponentStore.Api.Helpers;

namespace PcComponentStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly PcComponentStoreDbContext _context;
        private static readonly HttpClient _httpClient = new HttpClient();
        private static readonly string[] GEMINI_API_KEYS = new[] {
            "AIzaSyCs3VU9NhqJ-i7khcQjzDavn29GIh3I1Q0",
            "AIzaSyAp1B3h9BWfPN_mNKwQZR7bw_WHzX9wqTo",
            "AIzaSyBagJKInIlGQcfHdeZ1ugHjNqgHN6iLxic",
            "AIzaSyBfDJoyqr4dpH0aiAQPZbeH1edTo_o_WLE",
            "AIzaSyBOVTfqv3Duk3bVmsE8p14sLe9UmUkemYc"
        };
        private static int _currentKeyIndex = 0;

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
            
            var matchUnder = System.Text.RegularExpressions.Regex.Match(msg, @"(?:dưới\s+(\d+)\s*(?:triệu|tr|củ))|(?:(\d+)\s*(?:triệu|tr|củ)\s*(?:trở xuống|đổ lại|quay đầu))");
            if (matchUnder.Success) {
                string valStr = !string.IsNullOrEmpty(matchUnder.Groups[1].Value) ? matchUnder.Groups[1].Value : matchUnder.Groups[2].Value;
                if (decimal.TryParse(valStr, out decimal maxVal)) {
                    maxPrice = maxVal * 1000000;
                }
            }

            var matchOver = System.Text.RegularExpressions.Regex.Match(msg, @"(?:(?:trên|hơn)\s+(\d+)\s*(?:triệu|tr|củ))|(?:(\d+)\s*(?:triệu|tr|củ)\s*(?:trở lên))");
            if (matchOver.Success) {
                string valStr = !string.IsNullOrEmpty(matchOver.Groups[1].Value) ? matchOver.Groups[1].Value : matchOver.Groups[2].Value;
                if (decimal.TryParse(valStr, out decimal minVal)) {
                    minPrice = minVal * 1000000;
                }
            }

            var matchExact = System.Text.RegularExpressions.Regex.Match(msg, @"(?<!dưới\s|trên\s|hơn\s)\b(\d+)\s*(triệu|tr|củ)\b(?!\s*(trở xuống|đổ lại|quay đầu|trở lên))");
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
                
                string buildPrompt = $"Bạn là nhân viên tư vấn PC Component Store. Khách hàng nhắn: \"{request.Message}\". ";
                buildPrompt += $"Bạn đã build được cấu hình giá {totalPrice:N0}đ gồm: {string.Join(", ", build.Select(p => p.Name))}. ";
                buildPrompt += "Hãy tư vấn thân thiện, in đậm tên linh kiện. KHÔNG bịa ra linh kiện khác ngoài danh sách. TRẢ LỜI NGẮN GỌN DƯỚI 150 TỪ.";
                
                string buildReplyText = await CallGeminiWithRotation(buildPrompt);

                var buildItemsResult = build.Select(p => new {
                    Id = p.Id,
                    Name = p.Name,
                    Brand = p.Brand,
                    Price = p.Price ?? 0,
                    StockQuantity = p.Stock,
                    CategoryName = p.Category,
                    Attributes = p.Attributes
                }).ToList();

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

                // Strict model matching (Tránh hỏi i5 ra i3/i7)
                string[] strictModels = { "i3", "i5", "i7", "i9", "ryzen 3", "ryzen 5", "ryzen 7", "ryzen 9" };
                foreach (var model in strictModels)
                {
                    // Nếu user đích danh hỏi dòng model này
                    if (msg.Contains(model))
                    {
                        if (searchSpace.Contains(model)) {
                            score += 10; // Điểm cộng tuyệt đối
                        } else {
                            score -= 20; // Trừ điểm rất nặng nếu lạc quẻ (vd: hỏi i5 mà đây là i3)
                        }
                    }
                }

                // Heuristic chấm điểm cho nhu cầu đặc biệt (Render, 3D, Gaming)
                if (msg.Contains("render") || msg.Contains("3d") || msg.Contains("đồ họa") || msg.Contains("làm việc")) {
                    if (searchSpace.Contains("i9") || searchSpace.Contains("i7") || searchSpace.Contains("ryzen 9") || searchSpace.Contains("ryzen 7") || searchSpace.Contains("rtx 4090") || searchSpace.Contains("rtx 4080")) {
                        score += 5; // Ưu tiên CPU nhiều nhân, VGA mạnh
                    }
                }
                if (msg.Contains("game") || msg.Contains("gaming") || msg.Contains("chơi")) {
                    if (searchSpace.Contains("x3d") || searchSpace.Contains("i5") || searchSpace.Contains("ryzen 5") || searchSpace.Contains("rtx 4060") || searchSpace.Contains("rx 7600")) {
                        score += 5; // Ưu tiên CPU dòng X3D, i5, Ryzen 5 hoặc VGA tầm trung/cao
                    }
                }

                return new { p.Product, p.Category, Score = score };
            })
            // Chỉ lấy những sản phẩm có điểm >= 0 (Loại bỏ những sản phẩm bị phạt điểm âm)
            // Đồng thời Score > 0 HOẶC nếu đã biết category thì mới lấy
            .Where(p => p.Score >= 0 && (p.Score > 0 || !string.IsNullOrEmpty(targetCategory)))
            .OrderByDescending(p => p.Score)
            .ThenBy(p => p.Product.Price) // Nếu cùng điểm thì ưu tiên giá rẻ lên trước
            .Take(5)
            .ToList();

            string replyText = "";
            string prompt = "Bạn là nhân viên tư vấn bán hàng chuyên nghiệp của PC Component Store. ";
            prompt += $"Khách hàng nhắn: \"{request.Message}\".\n\n";

            // Nếu chỉ chào hỏi mà không có keyword cụ thể
            if (isGreeting && rankedProducts.Count() == 0 && string.IsNullOrEmpty(targetCategory))
            {
                prompt += "Hãy chào lại khách hàng một cách thân thiện và hỏi xem họ cần tư vấn mua linh kiện gì. TRẢ LỜI DƯỚI 50 TỪ.";
            }
            else if (rankedProducts.Count() == 0)
            {
                prompt += "Không tìm thấy linh kiện nào phù hợp. Hãy xin lỗi khách và gợi ý họ cung cấp thêm thông tin. TRẢ LỜI DƯỚI 50 TỪ.";
            }
            else
            {
                prompt += "Dưới đây là danh sách linh kiện có sẵn trong kho khớp với yêu cầu:\n";
                foreach (var item in rankedProducts)
                {
                    prompt += $"- {item.Product.Name} (Giá: {item.Product.Price?.ToString("N0")}đ)\n";
                }
                prompt += "\nHãy tư vấn khách hàng, giới thiệu sơ qua về các sản phẩm này. IN ĐẬM tên sản phẩm. CHỈ DÙNG THÔNG TIN ĐƯỢC CUNG CẤP, KHÔNG ĐƯỢC BỊA THÊM SẢN PHẨM KHÁC. TRẢ LỜI DƯỚI 150 TỪ.";
            }

            replyText = await CallGeminiWithRotation(prompt);

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

        private async Task<string> CallGeminiWithRotation(string prompt)
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[] { new { text = prompt } }
                    }
                }
            };
            string jsonBody = JsonSerializer.Serialize(requestBody);

            for (int i = 0; i < GEMINI_API_KEYS.Length; i++)
            {
                string currentKey = GEMINI_API_KEYS[_currentKeyIndex];
                string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={currentKey}";
                
                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseStr = await response.Content.ReadAsStringAsync();
                    using (JsonDocument doc = JsonDocument.Parse(responseStr))
                    {
                        var root = doc.RootElement;
                        if (root.TryGetProperty("candidates", out JsonElement candidates) && candidates.GetArrayLength() > 0)
                        {
                            var parts = candidates[0].GetProperty("content").GetProperty("parts");
                            if (parts.GetArrayLength() > 0)
                            {
                                return parts[0].GetProperty("text").GetString() ?? "Xin lỗi, hiện tại AI không thể trả lời.";
                            }
                        }
                    }
                    return "Xin lỗi, hiện tại AI không thể trả lời. Vui lòng thử lại sau.";
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests || (int)response.StatusCode == 429)
                {
                    // Quá giới hạn, chuyển sang key tiếp theo
                    _currentKeyIndex = (_currentKeyIndex + 1) % GEMINI_API_KEYS.Length;
                }
                else
                {
                    // Lỗi khác, trả về thông báo lỗi
                    return $"Hệ thống AI đang bảo trì (Lỗi: {response.StatusCode}). Xin vui lòng quay lại sau.";
                }
            }

            return "Hệ thống AI hiện đang quá tải. Vui lòng thử lại sau ít phút.";
        }
    }
}
