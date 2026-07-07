# GIẢI THÍCH CHI TIẾT MÃ NGUỒN VÀ KIẾN TRÚC DỰ ÁN (BẢN ĐẦY ĐỦ)

## MỤC LỤC
1. [Tổng quan Kiến trúc và Cấu trúc thư mục](#1-tổng-quan-kiến-trúc-và-cấu-trúc-thư-mục)
2. [Backend – ASP.NET Core Web API](#2-backend--aspnet-core-web-api)
   - [2.1. Cấu hình và Khởi động (Program.cs, appsettings.json)](#21-cấu-hình-và-khởi-động)
   - [2.2. Lớp Dữ liệu (Models, Data, DbContext)](#22-lớp-dữ-liệu-models-data-dbcontext)
   - [2.3. Lớp Xử lý Giao tiếp (Controllers, DTOs)](#23-lớp-xử-lý-giao-tiếp-controllers-dtos)
   - [2.4. Thuật toán Cốt lõi (Helpers)](#24-thuật-toán-cốt-lõi-helpers)
   - [2.5. Các tập lệnh Seed Data](#25-các-tập-lệnh-seed-data)
3. [Frontend – ReactJS (Vite)](#3-frontend--reactjs-vite)
   - [3.1. Cấu hình Frontend (package.json, vite, config.js)](#31-cấu-hình-frontend)
   - [3.2. Định tuyến và Bảo vệ (App.jsx, main.jsx)](#32-định-tuyến-và-bảo-vệ)
   - [3.3. Quản lý Trạng thái (Context API)](#33-quản-lý-trạng-thái-context-api)
   - [3.4. Giao tiếp API (Services)](#34-giao-tiếp-api-services)
   - [3.5. Thành phần Giao diện (Components)](#35-thành-phần-giao-diện-components)
   - [3.6. Các Trang chức năng (Pages)](#36-các-trang-chức-năng-pages)
   - [3.7. Styling (CSS)](#37-styling-css)

---

## 1. Tổng quan Kiến trúc và Cấu trúc thư mục

Dự án được xây dựng theo mô hình **Client-Server** truyền thống, tách biệt hoàn toàn giữa Frontend (giao diện) và Backend (xử lý logic, cơ sở dữ liệu).

### Cây thư mục dự án:
```text
PcComponentStore/
├── backend/                  ← ASP.NET Core Web API (.NET 8)
│   ├── Controllers/          ← Chứa các lớp xử lý HTTP Request (API endpoints)
│   ├── Models/               ← Chứa các lớp C# đại diện cho các bảng trong CSDL
│   ├── DTOs/                 ← Data Transfer Objects: Định dạng dữ liệu gửi/nhận API
│   ├── Data/                 ← Chứa DbContext (Entity Framework) quản lý kết nối CSDL
│   ├── Helpers/              ← Chứa các thuật toán phụ trợ (VD: Thuật toán Build PC)
│   ├── wwwroot/              ← Thư mục chứa file tĩnh (ảnh upload, logo...)
│   ├── appsettings.json      ← Cấu hình kết nối DB, JWT Secret Key
│   ├── dockerfile            ← Cấu hình để đóng gói Backend thành Docker Container
│   ├── .env                  ← Chứa biến môi trường (Database URL, Brevo API Key)
│   ├── PcComponentStore.Api.csproj ← File cấu hình project .NET (chứa danh sách thư viện)
│   └── Program.cs            ← Điểm khởi chạy (Entry point) của ứng dụng Backend
│
├── frontend/                 ← ReactJS SPA (Xây dựng bằng Vite)
│   ├── public/               ← Chứa file tĩnh (favicon, icon)
│   ├── src/                  
│   │   ├── assets/           ← Ảnh tĩnh, font chữ dùng trong giao diện
│   │   ├── components/       ← Thành phần UI tái sử dụng (Navbar, Footer, Button...)
│   │   ├── context/          ← Quản lý State toàn cục bằng React Context (Auth, Cart)
│   │   ├── pages/            ← Chứa các trang (Home, Login, Products, Admin...)
│   │   ├── services/         ← Cấu hình gọi API bằng Axios
│   │   ├── App.jsx           ← Cấu hình Routing (React Router v6)
│   │   ├── config.js         ← Biến môi trường Frontend (API_URL)
│   │   ├── index.css         ← CSS toàn cục (Biến màu sắc, reset CSS)
│   │   └── main.jsx          ← Điểm khởi chạy của React, render App vào DOM
│   ├── package.json          ← Danh sách thư viện npm (react, axios, lucide-react...)
│   └── vite.config.js        ← Cấu hình build tool Vite
│
└── PhanBien_DoAn/            ← Thư mục chứa tài liệu giải thích, báo cáo đồ án
```

---

## 2. Backend – ASP.NET Core Web API

Backend sử dụng **C#** trên nền tảng **.NET 8**, áp dụng kiến trúc **MVC** (chỉ dùng Model và Controller do View nằm ở Frontend) kết hợp với **Entity Framework Core (EF Core)** để tương tác CSDL MySQL.

### 2.1. Cấu hình và Khởi động

#### `Program.cs`
Đây là trái tim của Backend, nơi mọi thứ được kết nối với nhau trước khi server chạy.
1. **Load Biến Môi Trường:** Sử dụng `DotNetEnv` để đọc file `.env` (lấy `MYSQL_URL` khi deploy Railway).
2. **Cấu hình Dependency Injection (DI):** Đăng ký `PcComponentStoreDbContext`, `IMemoryCache` (dùng để lưu OTP).
3. **Cấu hình EF Core:** Phân tích `MYSQL_URL` thành chuỗi kết nối chuẩn và kết nối MySQL (hỗ trợ version 8.0.30).
4. **Cấu hình JWT (JSON Web Token):** Đọc Secret Key từ `appsettings.json`, thiết lập tham số xác thực (Issuer, Audience, Expiration).
5. **Cấu hình CORS:** Cho phép Frontend (ở cổng khác) gọi API mà không bị chặn bởi trình duyệt.
6. **Auto-Migration:** Sử dụng `dbContext.Database.ExecuteSqlRaw` để tự động tạo các bảng `users`, `orders`, `order_items` nếu chưa tồn tại (chạy 1 lần lúc startup).

#### `appsettings.json` & `.env`
- **appsettings.json:** Chứa cấu hình mặc định (ConnectionStrings tĩnh, JWT settings).
- **.env:** Chứa các giá trị nhạy cảm không push lên GitHub (như `BREVO_API_KEY`, mật khẩu DB).

### 2.2. Lớp Dữ liệu (Models, Data, DbContext)

#### `Models/` (Thực thể CSDL)
- **`User.cs`:** Người dùng. Có trường `Attributes` (kiểu string, lưu JSON) để chứa các thuộc tính động (như `isLocked`).
- **`Product.cs`:** Sản phẩm. Sử dụng mô hình **Single Table** cho toàn bộ 9 loại linh kiện. Các thuộc tính kỹ thuật khác biệt (VD: Socket của CPU, VRAM của VGA) được gom thành 1 object JSON và lưu vào trường `Attributes`.
- **`Order.cs` & `OrderItem.cs`:** Đơn hàng và Chi tiết đơn hàng. Quan hệ 1-N (1 Order có nhiều OrderItem). Khóa ngoại `UserId` có thể NULL (hỗ trợ khách mua không cần đăng nhập).
- **`Setting.cs`:** Lưu các cài đặt động của hệ thống (banner, trạng thái bảo trì) dạng Key-Value.

#### `Data/PcComponentStoreDbContext.cs`
- Thừa kế từ `DbContext`. Quản lý các `DbSet<T>`.
- **Fluent API (`OnModelCreating`):** Cấu hình chi tiết tên bảng (`ToTable("users")`), kiểu dữ liệu (`HasColumnType("json")`), và quy tắc xóa khóa ngoại (`OnDelete(DeleteBehavior.SetNull)` cho User-Order và `Cascade` cho Order-OrderItem).

### 2.3. Lớp Xử lý Giao tiếp (Controllers, DTOs)

Các Controller xử lý HTTP Request, nhận dữ liệu qua DTO, tương tác với CSDL, và trả về HTTP Response (thường là JSON).

#### `Controllers/AuthController.cs` (Phức tạp nhất)
- **`Register`:** Kiểm tra email trùng, mã hóa mật khẩu (hash), tự động set quyền `admin` cho user đầu tiên.
- **`Login`:** Xác thực, tạo danh sách `Claim` (ID, Email, Role), sinh token JWT trả về Frontend.
- **`ForgotPassword` & `ResetPassword`:**
  - Sinh OTP ngẫu nhiên 6 số, lưu vào `IMemoryCache` với thời gian sống 5 phút (Key là Email).
  - Tích hợp **Brevo HTTP API** để gửi email (vượt qua việc Railway chặn cổng SMTP).
  - Logic **Fallback:** Nếu HTTP thất bại → thử SMTP thường → Nếu thất bại → In OTP ra console (đảm bảo không bị nghẽn luồng test).

#### `Controllers/ProductsController.cs`
- **`GetProducts`:** Lấy danh sách sản phẩm. Sử dụng LINQ `.Select()` để parse trường JSON `Attributes` trả về Frontend một cách trực quan.
- **`CreateProduct` / `UpdateProduct`:** Tùy thuộc vào trường `Type` (cpu, vga, ram...), backend tự động gom các thuộc tính tương ứng (VD: `Socket`, `Cores`, `Tdp` cho CPU) thành một `Dictionary`, sau đó Serialize thành chuỗi JSON để lưu vào cột `Attributes`.
- Yêu cầu quyền `[Authorize(Roles = "Admin,Manager,Editor")]` cho các thao tác thay đổi dữ liệu.

#### `Controllers/OrdersController.cs`
- Cung cấp API cho khách hàng (xem lịch sử, tạo đơn) và cho Admin (xem toàn bộ, cập nhật trạng thái).
- **`CreateOrder`:** Sinh mã đơn hàng tự động dạng `ORD + [NămThángNgàyGiờPhútGiây] + [Random]`.

#### `Controllers/ChatbotController.cs`
- Nhận text từ user, dùng phương pháp **Rule-based & Regex** để hiểu ý định (Intent).
- **Bóc tách ngân sách:** Dùng Regex như `(?:dưới\s+(\d+)\s*(?:triệu|tr))` để hiểu "dưới 10 triệu".
- Trả về JSON chứa câu trả lời text và mảng sản phẩm gợi ý tương ứng.

#### `DTOs/` (Data Transfer Objects)
- Dùng để kiểm soát dữ liệu đầu vào/ra, tránh lộ cấu trúc DB.
- VD: `ProductCreateDto` chứa đến 30 trường (cho mọi loại linh kiện), nhưng khi insert, Controller chỉ nhặt những trường cần thiết tương ứng với loại sản phẩm đó.

### 2.4. Thuật toán Cốt lõi (Helpers)

#### `Helpers/PcBuilderAlgorithm.cs`
- **Mục đích:** Gợi ý trọn bộ PC (6 linh kiện chính) phù hợp với ngân sách cho trước.
- **Logic:**
  1. Tính ngân sách từng linh kiện: Dựa vào tỷ lệ (VGA 30%, CPU 30%...). Nếu user nhắc đến "VGA/Card", tỷ lệ VGA tăng lên 45%, CPU giảm xuống 20%.
  2. Chọn linh kiện tốt nhất (đắt nhất) nhưng không vượt quá ngân sách đã chia.
  3. **Kiểm tra tính tương thích (Cực kỳ quan trọng):**
     - Đọc trường JSON `Attributes` của CPU để lấy `socket` (VD: LGA1700, AM5).
     - Chỉ tìm Mainboard có `socket` khớp với CPU.
     - Kiểm tra tên Mainboard chứa "ddr4" hay "ddr5" để lọc tiếp thanh RAM tương thích.

### 2.5. Các tập lệnh Seed Data
Nằm ở thư mục gốc backend (`seed_*.js`). Chạy bằng NodeJS.
- Chứa hàng trăm mẫu dữ liệu có sẵn (CPU Intel/AMD, VGA Nvidia, Màn hình LG/Asus...).
- Dùng thư viện `axios` để POST thẳng vào API `/api/products` nhằm tự động tạo dữ liệu mẫu cho hệ thống mà không cần nhập tay.

---

## 3. Frontend – ReactJS (Vite)

Frontend là một **Single Page Application (SPA)**, sử dụng React Router để điều hướng không cần tải lại trang.

### 3.1. Cấu hình Frontend
- **`vite.config.js`:** Cấu hình build tool Vite, giúp dev server chạy cực nhanh và tối ưu hóa file tĩnh khi build production.
- **`package.json`:** Định nghĩa các dependencies chính: `react-router-dom` (định hướng), `axios` (gọi API), `lucide-react` (icon), `jwt-decode` (giải mã token).
- **`config.js`:** Chứa hằng số `API_URL` trỏ tới Backend (localhost khi code, URL Railway khi deploy).

### 3.2. Định tuyến và Bảo vệ (App.jsx, main.jsx)
- **`main.jsx`:** Kết nối React với file `index.html`, load CSS toàn cục.
- **`App.jsx`:** Khai báo 27+ tuyến đường (Routes).
- **`ProtectedRoute` component:** Một wrapper component. Kiểm tra nếu user chưa login → đẩy về `/login`. Nếu Route yêu cầu Admin mà user là customer → đẩy về trang chủ.

### 3.3. Quản lý Trạng thái (Context API)
Sử dụng React Context để chia sẻ dữ liệu toàn cục (không cần truyền props qua nhiều tầng).

#### `context/AuthContext.jsx`
- Quản lý trạng thái Đăng nhập.
- Khi khởi động (`useEffect`), đọc JWT Token từ `localStorage`. Nếu có, set `user` state.
- Cung cấp các hàm `login`, `register`, `logout` cho mọi component khác gọi.

#### `context/CartContext.jsx`
- Quản lý Giỏ hàng.
- **Tính năng độc đáo:** Giỏ hàng được cá nhân hóa bằng cách lưu `localStorage` với key dạng `cart_user@email.com`. Khách vãng lai dùng `cart_guest`. Khi đăng nhập/đăng xuất, giỏ hàng tự động thay đổi theo user.
- Cung cấp hàm: `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`.

### 3.4. Giao tiếp API (Services)
#### `services/api.js`
- Khởi tạo 1 instance của `axios`.
- **Interceptor:** Bắt mọi request gửi đi, tự động lấy Token từ `localStorage` và nhét vào Header (`Authorization: Bearer <token>`). Giúp các API cần xác thực hoạt động trơn tru mà không cần code Header lặp lại ở từng nơi.

### 3.5. Thành phần Giao diện (Components)

#### Navbar & MegaMenu
- **`Navbar.jsx`:** Chứa thanh tìm kiếm (có gợi ý dropdown khi gõ), giỏ hàng, thông tin tài khoản.
- **`MegaMenu.jsx`:** Hiển thị danh mục tĩnh. Hover để hiển thị cột danh mục con. Khi click, truyền `alias` (tên đã format) sang `GenericCategory`.

#### Tiện ích (Utilities)
- **`Chatbot.jsx`:** Widget góc phải dưới. Lưu lịch sử chat bằng State. Khi gửi tin, gọi API `/api/chatbot/ask` và hiển thị phản hồi dạng text kèm Component `ProductCard` thu nhỏ nếu có gợi ý.
- **`CheckoutModal.jsx` & `ComponentPickerModal.jsx`:** Các cửa sổ popup (Modal) hiển thị nổi lên trên giao diện để thanh toán hoặc chọn linh kiện build PC.

### 3.6. Các Trang chức năng (Pages)

#### Xử lý Danh mục động (`GenericCategory.jsx`)
- Đây là một trang "Vạn năng". Thay vì tạo 20 file cho 20 danh mục, ta dùng 1 file nhận `alias` từ URL (ví dụ: `/collection/vga-card-man-hinh`).
- **Logic Mapping:** Sử dụng bộ lọc từ khóa. Nếu URL chứa "vga" hoặc "card-man-hinh", nó sẽ hiểu đây là danh mục VGA. Nếu URL chứa "rtx 5000", nó vừa tìm category VGA, vừa lọc tên chứa "rtx 50".
- Kết hợp lọc thêm theo Khoảng giá (min-max Price) trên giao diện.

#### Trang Xây dựng Cấu hình (`BuildPC.jsx`)
- Giao diện dạng danh sách các bộ phận cần thiết (CPU, VGA, Main, RAM...).
- Khi click "Chọn", mở `ComponentPickerModal` truyền loại linh kiện tương ứng.
- Có nút **"Gợi ý cấu hình AI"**: Bật popup nhập ngân sách, sau đó gửi API hoặc tự động gọi thuật toán phân bổ. 
- Khi người dùng nhấn "Thêm tất cả vào giỏ", code duyệt mảng linh kiện đã chọn và gọi `addToCart` liên tục.

#### Quản trị viên (`AdminDashboard.jsx`)
- Quản lý toàn bộ hệ thống bằng các Tab (Sản phẩm, Đơn hàng, Người dùng).
- **Tab Sản phẩm:** Có form động siêu lớn. Nếu chọn loại là CPU, form hiện các ô nhập Socket, Lõi, Luồng... Nếu chọn VGA, form tự đổi thành ô nhập VRAM, Cuda Cores. (Nhờ data binding thông minh của React).
- Gọi API upload ảnh riêng lẻ, lấy URL trả về rồi mới gắn vào product object để submit.

### 3.7. Styling (CSS)
- Dự án ưu tiên dùng **Vanilla CSS** với Flexbox/Grid thay vì Tailwind/Bootstrap để sinh viên dễ dàng tùy biến sâu.
- **`index.css`:** Định nghĩa biến màu sắc CSS (`--bg-primary`, `--text-red`) để tạo tính nhất quán.
- Hỗ trợ Responsive thông qua Media Queries (`@media (max-width: 768px)`), giúp menu tự gập lại trên điện thoại.
