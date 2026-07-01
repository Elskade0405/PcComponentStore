# GIẢI THÍCH CHI TIẾT CÁC FILE CODE TRONG DỰ ÁN

## MỤC LỤC
1. [Tổng quan Kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Backend – ASP.NET Core Web API](#2-backend)
3. [Frontend – ReactJS (Vite)](#3-frontend)

---

## 1. Tổng quan Kiến trúc

```
PcComponentStore/
├── backend/                  ← ASP.NET Core Web API (.NET 8)
│   ├── Controllers/          ← Xử lý HTTP Request (API endpoints)
│   ├── Models/               ← Định nghĩa cấu trúc bảng dữ liệu
│   ├── DTOs/                 ← Data Transfer Objects (dữ liệu gửi/nhận)
│   ├── Data/                 ← DbContext kết nối MySQL
│   ├── Helpers/              ← Thuật toán phụ trợ (PC Builder)
│   └── Program.cs            ← Điểm khởi chạy ứng dụng
├── frontend/src/             ← ReactJS SPA
│   ├── pages/                ← Các trang giao diện
│   ├── components/           ← Thành phần UI tái sử dụng
│   ├── context/              ← Quản lý State toàn cục
│   ├── services/             ← Cấu hình gọi API
│   └── App.jsx               ← Định tuyến (Routing)
└── PhanBien_DoAn/            ← Tài liệu phản biện
```

**Luồng hoạt động tổng quát:**
1. Người dùng truy cập Frontend (ReactJS) → Giao diện gửi HTTP Request tới Backend
2. Backend (ASP.NET Core) nhận Request → Xử lý logic → Truy vấn MySQL
3. Backend trả dữ liệu JSON → Frontend hiển thị lên giao diện

---

## 2. Backend

### 2.1. Program.cs – Điểm khởi chạy ứng dụng

| Chức năng | Mô tả |
|-----------|-------|
| Kết nối Database | Đọc biến `MYSQL_URL` từ Railway hoặc `ConnectionStrings` từ appsettings.json để kết nối MySQL |
| Cấu hình JWT | Thiết lập xác thực Token (Issuer, Audience, SecretKey) |
| CORS Policy | Cho phép Frontend gọi API từ domain khác |
| Auto-Migrate | Tự động tạo bảng `users`, `orders`, `order_items` nếu chưa tồn tại |
| Swagger | Bật giao diện test API khi chạy ở chế độ Development |

**Luồng khởi động:** Load .env → Cấu hình Services → Build App → Tạo bảng DB → Chạy Server

---

### 2.2. Controllers/ – Các API Endpoint

#### AuthController.cs – Xác thực & Bảo mật
Quản lý toàn bộ luồng đăng ký, đăng nhập, quên mật khẩu.

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/auth/register` | POST | Đăng ký tài khoản mới. Nếu là user đầu tiên trong DB → tự động gán role Admin |
| `/api/auth/login` | POST | Đăng nhập bằng Email + Password. Trả về JWT Token, Role, UserId |
| `/api/auth/google-login` | POST | Đăng nhập bằng Google OAuth. Xác minh Token Google, tự tạo tài khoản nếu chưa có |
| `/api/auth/forgot-password` | POST | Tạo mã OTP 6 số, lưu vào MemoryCache (5 phút). Gửi OTP qua Brevo API hoặc SMTP |
| `/api/auth/reset-password` | POST | Xác minh OTP, cập nhật mật khẩu mới |
| `/api/auth/import-db` | GET | Import file SQL vào database |

**Luồng Quên mật khẩu:**
```
Nhập Email → Kiểm tra tồn tại trong DB → Sinh OTP 6 số → Lưu Cache 5 phút
  → Ưu tiên gửi qua Brevo HTTP API (cổng 443)
  → Fallback: Gửi qua Gmail SMTP
  → Fallback cuối: In OTP ra Console Log
→ Người dùng nhập OTP + Mật khẩu mới → Xác minh OTP → Cập nhật DB
```

#### ProductsController.cs – Quản lý Sản phẩm
Xử lý CRUD sản phẩm với phân quyền Admin.

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/products` | GET | Lấy danh sách sản phẩm (có thể lọc theo `?category=cpu`) |
| `/api/products/{id}` | GET | Lấy chi tiết 1 sản phẩm theo ID |
| `/api/products` | POST | Thêm sản phẩm mới (yêu cầu Admin/Manager/Editor) |
| `/api/products/{id}` | PUT | Cập nhật sản phẩm (yêu cầu Admin/Manager/Editor) |
| `/api/products/{id}` | DELETE | Xóa sản phẩm (yêu cầu Admin/Manager/Editor) |
| `/api/products/upload-image` | POST | Upload ảnh sản phẩm lên server |

**Đặc biệt:** Hỗ trợ 9 loại sản phẩm khác nhau (CPU, VGA, RAM, Mainboard, Storage, PSU, Monitor, PC, Cooling) với các thuộc tính kỹ thuật riêng biệt được lưu dưới dạng JSON.

#### OrdersController.cs – Quản lý Đơn hàng

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/orders/all` | GET | Admin xem tất cả đơn hàng |
| `/api/orders/{id}` | GET | Xem chi tiết đơn hàng |
| `/api/orders` | POST | Tạo đơn hàng mới (sinh mã ORD + timestamp) |
| `/api/orders/{id}/status` | PUT | Admin cập nhật trạng thái đơn hàng |
| `/api/orders/user/{userId}` | GET | Xem lịch sử đơn hàng của user |

**Luồng đặt hàng:**
```
Thêm sản phẩm vào giỏ → Nhập thông tin giao hàng → Chọn phương thức thanh toán
→ POST /api/orders → Sinh mã đơn (ORD + timestamp + random)
→ Lưu Order + OrderItems vào DB → Trả về mã đơn hàng
```

#### ChatbotController.cs – Chatbot tư vấn thông minh

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/chatbot/ask` | POST | Nhận câu hỏi, phân tích và trả lời |

**Luồng xử lý Chatbot:**
```
Nhận tin nhắn → Chuyển thành chữ thường → Phân tích Intent:
  1. Lời chào (chào, hello, hi) → Trả lời chào hỏi
  2. Hỏi giá (giá, rẻ, đắt) → Tìm sản phẩm theo khoảng giá
  3. Build PC (build, cấu hình, bộ pc) → Gọi PcBuilderAlgorithm
  4. Tìm theo danh mục (laptop, vga, cpu...) → Query DB theo category
  5. Tìm theo từ khóa → Tìm sản phẩm có tên trùng khớp
→ Trả về text trả lời + danh sách sản phẩm dạng Card
```

**Kỹ thuật phân tích giá:** Dùng Regex để bóc tách số tiền từ câu tiếng Việt:
- "dưới 10 triệu" → maxPrice = 10.000.000
- "trên 5 củ" → minPrice = 5.000.000
- "tầm 15 triệu" → budget ±20%

#### UsersController.cs – Quản lý Người dùng

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/users/all` | GET | Admin lấy danh sách tất cả user |
| `/api/users/{id}/lock` | PUT | Admin khóa/mở khóa tài khoản |

#### SettingsController.cs – Cài đặt hệ thống

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/settings` | GET | Lấy tất cả cài đặt (banner, thông báo...) |
| `/api/settings/{key}` | GET | Lấy cài đặt theo key |
| `/api/settings` | POST | Admin cập nhật cài đặt |

#### UploadController.cs – Upload file

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/upload` | POST | Upload ảnh lên thư mục wwwroot/uploads |

#### CategoriesController.cs – Danh mục (tĩnh)

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/categories` | GET | Trả về danh sách danh mục sản phẩm |

---

### 2.3. Models/ – Mô hình dữ liệu

| File | Bảng DB | Các trường chính |
|------|---------|-----------------|
| `User.cs` | users | Id, Username, PasswordHash, Email, PhoneNumber, RoleType, Attributes (JSON), CreatedAt |
| `Product.cs` | products | Id, Category, Brand, Name, Stock, Price, Attributes (JSON) |
| `Order.cs` | orders | Id (ORDxxx), UserId, CustomerName, Phone, Email, Address, TotalAmount, Status, PaymentMethod, OrderDate |
| `OrderItem.cs` | order_items | Id, OrderId, ProductId, Quantity, UnitPrice |
| `Setting.cs` | settings | Id, Key, Value |

**Quan hệ:** User ←(1:N)→ Order ←(1:N)→ OrderItem →(N:1)→ Product

---

### 2.4. Helpers/PcBuilderAlgorithm.cs – Thuật toán Build PC

**Đầu vào:** Danh sách tất cả sản phẩm, Ngân sách mục tiêu, Ưu tiên VGA hay không

**Thuật toán:**
1. Phân bổ ngân sách theo tỷ lệ: VGA 30-45%, CPU 20-30%, Mainboard 15%, RAM 8%, Storage 7%, PSU 5%
2. Chọn VGA đắt nhất trong ngân sách VGA
3. Chọn CPU đắt nhất trong ngân sách CPU
4. Lọc Mainboard tương thích Socket với CPU đã chọn
5. Lọc RAM tương thích DDR4/DDR5 với Mainboard đã chọn
6. Chọn Storage và PSU phù hợp ngân sách còn lại

---

### 2.5. Data/PcComponentStoreDbContext.cs – Kết nối Database

Cấu hình Entity Framework Core ánh xạ các Model C# sang bảng MySQL:
- Đặt tên bảng (snake_case), ánh xạ cột, kiểu dữ liệu
- Cấu hình quan hệ khóa ngoại: Order → User (SET NULL), OrderItem → Order (CASCADE)

---

### 2.6. DTOs/ – Data Transfer Objects

| File | Mô tả |
|------|-------|
| `AuthDtos.cs` | RegisterDto, LoginDto, AuthResponseDto (Token, Email, Role) |
| `ProductDtos.cs` | ProductCreateDto (chứa tất cả thuộc tính cho 9 loại sản phẩm) |
| `OrderDtos.cs` | OrderUpdateStatusDto |
| `ChatRequestDto.cs` | Message (câu hỏi gửi tới Chatbot) |

---

### 2.7. Seed Scripts (seed_*.js) – Nạp dữ liệu mẫu

| File | Chức năng |
|------|-----------|
| `seed_cpu.js` | Nạp dữ liệu CPU (Intel, AMD) |
| `seed_vga.js` | Nạp dữ liệu Card đồ họa |
| `seed_ram.js` | Nạp dữ liệu RAM |
| `seed_mainboard_storage.js` | Nạp Mainboard + Ổ cứng |
| `seed_monitor.js` | Nạp Màn hình |
| `seed_psu.js` | Nạp Nguồn máy tính |
| `seed_laptop.js` | Nạp Laptop |
| `seed_roles.js` | Tạo tài khoản Admin/Staff mặc định |
| `seed_cloud.js` | Nạp dữ liệu lên môi trường Cloud (Railway) |

---

## 3. Frontend

### 3.1. Cấu trúc cốt lõi

#### App.jsx – Định tuyến (Router)
Quản lý toàn bộ 27 Route của ứng dụng. Bọc tất cả bên trong `AuthProvider` và `CartProvider`.

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | Home | Trang chủ |
| `/login` | Login | Đăng nhập |
| `/register` | Register | Đăng ký |
| `/forgot-password` | ForgotPassword | Quên mật khẩu |
| `/products` | Products | Danh sách sản phẩm |
| `/product/:id` | ProductDetail | Chi tiết sản phẩm |
| `/cart` | Cart | Giỏ hàng |
| `/build-pc` | BuildPC | Xây dựng cấu hình PC |
| `/order-history` | OrderHistory | Lịch sử đơn hàng |
| `/order-history/:id` | OrderDetail | Chi tiết đơn hàng |
| `/category/vga` | VgaCategory | Danh mục VGA |
| `/category/cpu` | CpuCategory | Danh mục CPU |
| `/collection/:alias` | GenericCategory | Danh mục động (vạn năng) |
| `/admin` | AdminDashboard | Trang quản trị (ProtectedRoute) |
| Các route khác | AboutUs, FAQ, Policy... | Trang thông tin tĩnh |

**ProtectedRoute:** Component bảo vệ route Admin. Nếu chưa đăng nhập → chuyển về `/login`. Nếu không phải Admin → chuyển về `/`.

#### config.js – Cấu hình API URL
Xác định địa chỉ Backend API (localhost khi dev, URL Railway khi production).

#### main.jsx – Điểm vào ứng dụng
Render `<App />` vào DOM root.

---

### 3.2. Context/ – Quản lý State toàn cục

#### AuthContext.jsx – Quản lý Xác thực

| Hàm | Chức năng |
|-----|-----------|
| `login(email, password)` | Gọi API đăng nhập, lưu Token/Email/Role vào localStorage |
| `register(fullName, email, password)` | Gọi API đăng ký |
| `logout()` | Xóa toàn bộ thông tin khỏi localStorage |
| `isAdmin` | Kiểm tra user có role Admin không |

**Luồng:** Khi App khởi động → Đọc Token từ localStorage → Nếu hợp lệ → Set user state → Các component con dùng `useAuth()` để truy cập.

#### CartContext.jsx – Quản lý Giỏ hàng

| Hàm | Chức năng |
|-----|-----------|
| `addToCart(product, qty)` | Thêm sản phẩm. Nếu đã có → tăng số lượng |
| `updateQuantity(id, qty)` | Cập nhật số lượng |
| `removeFromCart(id)` | Xóa sản phẩm khỏi giỏ |
| `clearCart()` | Xóa toàn bộ giỏ hàng |
| `cartCount` | Tổng số lượng sản phẩm |
| `cartTotal` | Tổng tiền giỏ hàng |

**Đặc biệt:** Giỏ hàng được lưu riêng theo email user (`cart_user@email.com`) trong localStorage. Khách vãng lai dùng key `cart_guest`.

---

### 3.3. Services/api.js – Axios HTTP Client

Tạo instance Axios với baseURL trỏ tới Backend. Tự động gắn JWT Token vào header `Authorization: Bearer <token>` cho mọi request.

---

### 3.4. Components/ – Thành phần UI tái sử dụng

#### Navbar.jsx – Thanh điều hướng
- Hiển thị Logo, Menu danh mục, Tìm kiếm, Giỏ hàng, Đăng nhập
- Tích hợp Mega Menu đa cấp (hover để mở submenu)
- Hàm `slugify()`: Chuyển đổi tiếng Việt có dấu thành URL slug (VD: "Màn hình" → "man-hinh")
- Responsive: Thu gọn thành hamburger menu trên mobile

#### MegaMenu.jsx + MegaMenu.css – Menu đa cấp
- Hiển thị danh mục sản phẩm dạng cột khi hover vào "Danh mục sản phẩm"
- Cấu trúc đệ quy: Danh mục cha → Danh mục con → Link sản phẩm

#### Chatbot.jsx – Cửa sổ Chat
- Nút chat nổi góc phải dưới màn hình
- Gửi tin nhắn tới `/api/chatbot/ask`
- Hiển thị câu trả lời text + Card sản phẩm (hình ảnh, tên, giá)
- Gợi ý câu hỏi nhanh (Quick replies)

#### ProductCard.jsx – Thẻ sản phẩm
- Hiển thị ảnh, tên, giá gốc/giá sale, badge giảm giá
- Nút "Thêm vào giỏ" và "Xem chi tiết"
- Hiệu ứng hover zoom ảnh

#### CheckoutModal.jsx – Modal thanh toán
- Form nhập thông tin giao hàng (Tên, SĐT, Email, Địa chỉ)
- Chọn phương thức thanh toán (COD, Chuyển khoản)
- Tóm tắt đơn hàng + Tổng tiền
- Gọi API tạo đơn hàng

#### ComponentPickerModal.jsx – Modal chọn linh kiện
- Dùng trong trang Build PC
- Hiển thị danh sách linh kiện theo từng loại (CPU, VGA, RAM...)
- Lọc, tìm kiếm và chọn linh kiện

#### CategoryBlock.jsx – Khối danh mục trang chủ
- Hiển thị grid các danh mục sản phẩm trên trang chủ
- Mỗi khối có icon, tên danh mục và link đến trang danh mục

#### Footer.jsx – Chân trang
- Thông tin công ty, liên hệ, chính sách
- Link đến các trang phụ (Về chúng tôi, Bảo hành, Vận chuyển...)

#### RealtimeAiAssistant.jsx – Trợ lý AI
- Widget hỗ trợ AI hiển thị gợi ý sản phẩm theo ngữ cảnh

---

### 3.5. Pages/ – Các trang giao diện

#### Home.jsx – Trang chủ
- Banner slider quảng cáo
- Grid danh mục sản phẩm nổi bật
- Sản phẩm bán chạy, sản phẩm mới

#### Products.jsx – Danh sách sản phẩm
- Hiển thị tất cả sản phẩm dạng grid
- Tìm kiếm theo tên
- Lọc theo danh mục

#### ProductDetail.jsx – Chi tiết sản phẩm
- Ảnh sản phẩm (gallery nhiều ảnh)
- Thông số kỹ thuật chi tiết (đọc từ JSON Attributes)
- Nút thêm vào giỏ hàng
- Sản phẩm liên quan

#### VgaCategory.jsx – Danh mục VGA chuyên biệt
- Breadcrumb điều hướng
- Sidebar bộ lọc (Hãng, Khoảng giá, VRAM, Sẵn hàng)
- Grid sản phẩm + Phân trang
- Bài viết SEO bên dưới

#### CpuCategory.jsx – Danh mục CPU chuyên biệt
- Tương tự VgaCategory nhưng có bộ lọc riêng cho CPU (Socket, Số nhân, TDP)

#### MonitorCategory.jsx – Danh mục Màn hình
- Bộ lọc theo kích thước, độ phân giải, tần số quét

#### GenericCategory.jsx – Danh mục động (Vạn năng)
- Nhận tham số `:alias` từ URL
- Tự động chuyển alias thành tiêu đề (VD: "ram-ddr5" → "Ram Ddr5")
- Dùng alias làm từ khóa tìm kiếm sản phẩm trong DB
- Một component phục vụ cho hàng chục danh mục menu khác nhau

#### BuildPC.jsx – Xây dựng cấu hình PC
- Giao diện chọn từng linh kiện (CPU, VGA, Mainboard, RAM, Storage, PSU)
- Mở ComponentPickerModal để chọn
- Tự động tính tổng tiền
- Gọi PcBuilderAlgorithm để gợi ý cấu hình theo ngân sách
- Nút thêm toàn bộ vào giỏ hàng

#### Cart.jsx – Giỏ hàng
- Danh sách sản phẩm đã thêm
- Tăng/giảm số lượng, xóa sản phẩm
- Hiển thị tổng tiền
- Nút mở CheckoutModal để đặt hàng

#### Login.jsx – Đăng nhập
- Form Email + Password
- Nút đăng nhập Google OAuth
- Link đến Đăng ký và Quên mật khẩu

#### Register.jsx – Đăng ký
- Form Họ tên + Email + Mật khẩu + Xác nhận mật khẩu
- Validate đầu vào

#### ForgotPassword.jsx – Quên mật khẩu (2 bước)
- Bước 1: Nhập email → Gửi yêu cầu OTP
- Bước 2: Nhập OTP + Mật khẩu mới → Xác nhận đổi
- Tự động chuyển bước khi API trả về thành công

#### OrderHistory.jsx – Lịch sử đơn hàng
- Danh sách đơn hàng của user đăng nhập
- Hiển thị mã đơn, ngày đặt, tổng tiền, trạng thái

#### OrderDetail.jsx – Chi tiết đơn hàng
- Thông tin giao hàng
- Danh sách sản phẩm trong đơn
- Trạng thái đơn hàng (Timeline)

#### AdminDashboard.jsx – Bảng điều khiển Admin
- **Tab Sản phẩm:** CRUD sản phẩm (thêm/sửa/xóa), upload ảnh
- **Tab Đơn hàng:** Xem tất cả đơn, cập nhật trạng thái
- **Tab Người dùng:** Xem danh sách user, khóa/mở khóa tài khoản
- **Tab Cài đặt:** Quản lý banner, thông báo hệ thống

#### Các trang thông tin (tĩnh)

| File | Nội dung |
|------|----------|
| `AboutUs.jsx` | Giới thiệu công ty |
| `BankAccount.jsx` | Thông tin tài khoản ngân hàng |
| `WarrantyPolicy.jsx` | Chính sách bảo hành |
| `ShippingPolicy.jsx` | Chính sách vận chuyển |
| `ReturnPolicy.jsx` | Chính sách đổi trả |
| `PrivacyPolicy.jsx` | Chính sách bảo mật |
| `TermsOfUse.jsx` | Điều khoản sử dụng |
| `PaymentMethods.jsx` | Phương thức thanh toán |
| `Faq.jsx` | Câu hỏi thường gặp |
| `PromotionInfo.jsx` | Thông tin khuyến mãi |
| `Careers.jsx` | Tuyển dụng |
| `PhoneLogin.jsx` | Đăng nhập bằng SĐT |

---

### 3.6. CSS

| File | Chức năng |
|------|-----------|
| `index.css` | CSS toàn cục: biến màu, font, layout chung, responsive |
| `App.css` | CSS riêng cho App component |
| `MegaMenu.css` | CSS cho Mega Menu đa cấp |
