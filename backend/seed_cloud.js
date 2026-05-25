// ============================================================
// SEED ALL DATA - Script tổng hợp để seed data lên cloud DB
// ============================================================
// Cách dùng:
//   1. Sửa thông tin DB bên dưới (lấy từ Railway/Aiven)
//   2. Chạy: node seed_cloud.js
// ============================================================

const mysql = require('mysql2/promise');

// ============================================================
// 👇 SỬA THÔNG TIN DATABASE CLOUD CỦA BẠN Ở ĐÂY 👇
// ============================================================
const DB_CONFIG = {
    host: 'mysql.railway.internal',  // ← Host từ Railway
    port: 3306,                       // ← Port từ Railway
    user: 'root',                      // ← User từ Railway
    password: 'gVGxHDkBOODigkRoamwOdHuhayuoODlD',          // ← Password từ Railway
    database: 'railway'                // ← Database từ Railway
};

// ============================================================

async function run() {
    let con;
    try {
        console.log(`\n🔌 Đang kết nối tới ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
        con = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Kết nối thành công!\n');

        // ============================
        // Tạo bảng (nếu chưa có)
        // ============================
        console.log('📦 Đang tạo bảng...');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS cpu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                cpu_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng cpu');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS vga (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                vga_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng vga');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS ram (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                ram_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng ram');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS psu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                psu_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng psu');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS monitor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                monitor_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng monitor');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS mainboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                mainboard_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng mainboard');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS storage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                storage_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng storage');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS laptop (
                id INT AUTO_INCREMENT PRIMARY KEY,
                brand VARCHAR(100),
                laptop_name VARCHAR(500),
                stock INT DEFAULT 0,
                price DECIMAL(18,2) DEFAULT 0,
                attributes JSON NULL
            )
        `);
        console.log('  ✅ Bảng laptop');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                role_type VARCHAR(50) NOT NULL,
                attributes JSON NULL,
                created_at DATETIME NOT NULL
            )
        `);
        console.log('  ✅ Bảng users');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(50) PRIMARY KEY,
                user_id INT NULL,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                total_amount DECIMAL(18,2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                order_date DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('  ✅ Bảng orders');

        await con.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(18,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);
        console.log('  ✅ Bảng order_items');

        // ============================
        // Seed dữ liệu sản phẩm
        // ============================
        console.log('\n📥 Đang seed dữ liệu sản phẩm...\n');

        // --- CPU ---
        const cpus = [
            { brand: 'INTEL', name: 'CPU Intel Core i9-14900K (Up to 6.0GHz, 24 Nhân 32 Luồng, 36MB Cache, Socket LGA 1700)', stock: 20, price: 15490000, attributes: { category: 'cpu', brand: 'INTEL', socket: 'LGA 1700', cores: 24, threads: 32, baseClock: '3.2 GHz', boostClock: '6.0 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/74404_cpu_intel_core_i9_14900k_1.jpg' } },
            { brand: 'INTEL', name: 'CPU Intel Core i7-14700K (Up to 5.6GHz, 20 Nhân 28 Luồng, 33MB Cache, Socket LGA 1700)', stock: 35, price: 10990000, attributes: { category: 'cpu', brand: 'INTEL', socket: 'LGA 1700', cores: 20, threads: 28, baseClock: '3.4 GHz', boostClock: '5.6 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/74403_cpu_intel_core_i7_14700k_1.jpg' } },
            { brand: 'INTEL', name: 'CPU Intel Core i5-13400F (Up to 4.6GHz, 10 Nhân 16 Luồng, 20MB Cache, Socket LGA 1700)', stock: 50, price: 5290000, attributes: { category: 'cpu', brand: 'INTEL', socket: 'LGA 1700', cores: 10, threads: 16, baseClock: '2.5 GHz', boostClock: '4.6 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/69599_cpu_intel_core_i5_13400f_1.jpg' } },
            { brand: 'INTEL', name: 'CPU Intel Core i3-12100F (Up to 4.3GHz, 4 Nhân 8 Luồng, 12MB Cache, Socket LGA 1700)', stock: 45, price: 2190000, attributes: { category: 'cpu', brand: 'INTEL', socket: 'LGA 1700', cores: 4, threads: 8, baseClock: '3.3 GHz', boostClock: '4.3 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/63897_cpu_intel_core_i3_12100f_1.jpg' } },
            { brand: 'AMD', name: 'CPU AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16 Nhân 32 Luồng, 144MB Cache, Socket AM5)', stock: 15, price: 17590000, attributes: { category: 'cpu', brand: 'AMD', socket: 'AM5', cores: 16, threads: 32, baseClock: '4.2 GHz', boostClock: '5.7 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/70438_cpu_amd_ryzen_9_7950x3d_1.jpg' } },
            { brand: 'AMD', name: 'CPU AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8 Nhân 16 Luồng, 96MB Cache, Socket AM5)', stock: 30, price: 10490000, attributes: { category: 'cpu', brand: 'AMD', socket: 'AM5', cores: 8, threads: 16, baseClock: '4.2 GHz', boostClock: '5.0 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/71375_cpu_amd_ryzen_7_7800x3d_1.jpg' } },
            { brand: 'AMD', name: 'CPU AMD Ryzen 5 7600X (Up to 5.3GHz, 6 Nhân 12 Luồng, 32MB Cache, Socket AM5)', stock: 40, price: 6190000, attributes: { category: 'cpu', brand: 'AMD', socket: 'AM5', cores: 6, threads: 12, baseClock: '4.7 GHz', boostClock: '5.3 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67440_cpu_amd_ryzen_5_7600x_1.jpg' } },
            { brand: 'AMD', name: 'CPU AMD Ryzen 5 5600G (Up to 4.4GHz, 6 Nhân 12 Luồng, 16MB Cache, Socket AM4)', stock: 60, price: 3390000, attributes: { category: 'cpu', brand: 'AMD', socket: 'AM4', cores: 6, threads: 12, baseClock: '3.9 GHz', boostClock: '4.4 GHz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/59695_cpu_amd_ryzen_5_5600g_1.jpg' } },
        ];

        for (const p of cpus) {
            await con.execute('INSERT INTO cpu (brand, cpu_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ CPU: ${cpus.length} sản phẩm`);

        // --- VGA ---
        const vgas = [
            { brand: 'NVIDIA', name: 'VGA NVIDIA GeForce RTX 4090 Founders Edition 24GB GDDR6X', stock: 10, price: 49990000, attributes: { category: 'vga', brand: 'NVIDIA', vram: '24GB GDDR6X', cudaCores: 16384, boostClock: '2520 MHz', memoryInterface: '384-bit', tdp: '450W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68104_vga_nvidia_rtx_4090.jpg' } },
            { brand: 'NVIDIA', name: 'VGA Gigabyte GeForce RTX 4070 Ti SUPER AERO OC 16GB GDDR6X', stock: 25, price: 22990000, attributes: { category: 'vga', brand: 'NVIDIA', vram: '16GB GDDR6X', cudaCores: 8448, boostClock: '2640 MHz', memoryInterface: '256-bit', tdp: '285W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/75823_vga_rtx_4070ti_super.jpg' } },
            { brand: 'NVIDIA', name: 'VGA MSI GeForce RTX 4060 Ti VENTUS 2X BLACK 8GB OC', stock: 40, price: 11490000, attributes: { category: 'vga', brand: 'NVIDIA', vram: '8GB GDDR6', cudaCores: 4352, boostClock: '2580 MHz', memoryInterface: '128-bit', tdp: '160W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73618_vga_msi_rtx_4060ti.jpg' } },
            { brand: 'NVIDIA', name: 'VGA ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6', stock: 55, price: 8490000, attributes: { category: 'vga', brand: 'NVIDIA', vram: '8GB GDDR6', cudaCores: 3072, boostClock: '2505 MHz', memoryInterface: '128-bit', tdp: '115W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73299_vga_asus_rtx_4060.jpg' } },
            { brand: 'AMD', name: 'VGA Sapphire PULSE AMD Radeon RX 7900 XTX 24GB GDDR6', stock: 12, price: 28990000, attributes: { category: 'vga', brand: 'AMD', vram: '24GB GDDR6', boostClock: '2525 MHz', memoryInterface: '384-bit', tdp: '355W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/70103_vga_rx_7900xtx.jpg' } },
            { brand: 'AMD', name: 'VGA MSI Radeon RX 7600 MECH 2X 8GB OC', stock: 35, price: 7490000, attributes: { category: 'vga', brand: 'AMD', vram: '8GB GDDR6', boostClock: '2655 MHz', memoryInterface: '128-bit', tdp: '165W', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73100_vga_rx_7600.jpg' } },
        ];

        for (const p of vgas) {
            await con.execute('INSERT INTO vga (brand, vga_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ VGA: ${vgas.length} sản phẩm`);

        // --- RAM ---
        const rams = [
            { brand: 'CORSAIR', name: 'RAM Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz CL36', stock: 30, price: 3290000, attributes: { category: 'ram', brand: 'CORSAIR', ramType: 'DDR5', capacity: '32GB (2x16GB)', busSpeed: '6000MHz', casLatency: 'CL36', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68880_ram_corsair_vengeance_ddr5.jpg' } },
            { brand: 'G.SKILL', name: 'RAM G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz CL32', stock: 20, price: 4290000, attributes: { category: 'ram', brand: 'G.SKILL', ramType: 'DDR5', capacity: '32GB (2x16GB)', busSpeed: '6400MHz', casLatency: 'CL32', rgb: 'RGB', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/70203_ram_gskill_trident_z5.jpg' } },
            { brand: 'KINGSTON', name: 'RAM Kingston Fury Beast DDR4 16GB (2x8GB) 3200MHz CL16', stock: 50, price: 1090000, attributes: { category: 'ram', brand: 'KINGSTON', ramType: 'DDR4', capacity: '16GB (2x8GB)', busSpeed: '3200MHz', casLatency: 'CL16', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/63109_ram_kingston_fury_beast.jpg' } },
            { brand: 'KINGSTON', name: 'RAM Kingston Fury Beast DDR5 16GB (1x16GB) 5600MHz CL36', stock: 40, price: 1490000, attributes: { category: 'ram', brand: 'KINGSTON', ramType: 'DDR5', capacity: '16GB (1x16GB)', busSpeed: '5600MHz', casLatency: 'CL36', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73590_ram_kingston_fury_ddr5.jpg' } },
        ];

        for (const p of rams) {
            await con.execute('INSERT INTO ram (brand, ram_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ RAM: ${rams.length} sản phẩm`);

        // --- PSU ---
        const psus = [
            { brand: 'CORSAIR', name: 'Nguồn Corsair RM850x 850W 80 Plus Gold Full Modular', stock: 25, price: 3490000, attributes: { category: 'psu', brand: 'CORSAIR', powerCapacity: '850W', efficiency: '80 Plus Gold', modular: 'Full Modular', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/69500_psu_corsair_rm850x.jpg' } },
            { brand: 'CORSAIR', name: 'Nguồn Corsair RM1000e 1000W 80 Plus Gold Full Modular', stock: 15, price: 4290000, attributes: { category: 'psu', brand: 'CORSAIR', powerCapacity: '1000W', efficiency: '80 Plus Gold', modular: 'Full Modular', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72100_psu_corsair_rm1000e.jpg' } },
            { brand: 'MSI', name: 'Nguồn MSI MAG A650BN 650W 80 Plus Bronze', stock: 40, price: 1490000, attributes: { category: 'psu', brand: 'MSI', powerCapacity: '650W', efficiency: '80 Plus Bronze', modular: 'Non-Modular', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/71200_psu_msi_a650bn.jpg' } },
        ];

        for (const p of psus) {
            await con.execute('INSERT INTO psu (brand, psu_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ PSU: ${psus.length} sản phẩm`);

        // --- Monitor ---
        const monitors = [
            { brand: 'LG', name: 'Màn hình LG 27GP850-B 27" QHD IPS 165Hz 1ms', stock: 20, price: 9990000, attributes: { category: 'monitor', brand: 'LG', screenSize: '27 inch', resolution: '2560x1440 (QHD)', refreshRate: '165Hz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/62200_monitor_lg_27gp850.jpg' } },
            { brand: 'SAMSUNG', name: 'Màn hình Samsung Odyssey G5 27" QHD VA 165Hz', stock: 25, price: 6990000, attributes: { category: 'monitor', brand: 'SAMSUNG', screenSize: '27 inch', resolution: '2560x1440 (QHD)', refreshRate: '165Hz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/64300_monitor_samsung_g5.jpg' } },
            { brand: 'ASUS', name: 'Màn hình ASUS TUF Gaming VG249Q1A 24" FHD IPS 165Hz', stock: 35, price: 4490000, attributes: { category: 'monitor', brand: 'ASUS', screenSize: '24 inch', resolution: '1920x1080 (FHD)', refreshRate: '165Hz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67800_monitor_asus_vg249q.jpg' } },
        ];

        for (const p of monitors) {
            await con.execute('INSERT INTO monitor (brand, monitor_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ Monitor: ${monitors.length} sản phẩm`);

        // --- Mainboard ---
        const mainboards = [
            { brand: 'ASUS', name: 'Mainboard ASUS ROG STRIX B760-F GAMING WIFI DDR5 (LGA 1700)', stock: 20, price: 6990000, attributes: { category: 'mainboard', brand: 'ASUS', socket: 'LGA 1700', chipset: 'B760', ramSlots: 4, mainboardSize: 'ATX', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72500_main_asus_b760f.jpg' } },
            { brand: 'MSI', name: 'Mainboard MSI PRO B760M-A WIFI DDR4 (LGA 1700)', stock: 35, price: 3690000, attributes: { category: 'mainboard', brand: 'MSI', socket: 'LGA 1700', chipset: 'B760', ramSlots: 2, mainboardSize: 'Micro-ATX', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72300_main_msi_b760m.jpg' } },
            { brand: 'GIGABYTE', name: 'Mainboard Gigabyte B650 AORUS ELITE AX DDR5 (AM5)', stock: 25, price: 5490000, attributes: { category: 'mainboard', brand: 'GIGABYTE', socket: 'AM5', chipset: 'B650', ramSlots: 4, mainboardSize: 'ATX', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/71000_main_gigabyte_b650.jpg' } },
        ];

        for (const p of mainboards) {
            await con.execute('INSERT INTO mainboard (brand, mainboard_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ Mainboard: ${mainboards.length} sản phẩm`);

        // --- Storage ---
        const storages = [
            { brand: 'SAMSUNG', name: 'Ổ cứng SSD Samsung 990 PRO 1TB M.2 NVMe PCIe Gen4', stock: 30, price: 3490000, attributes: { category: 'storage', brand: 'SAMSUNG', driveType: 'SSD M.2 NVMe', storageCapacity: '1TB', readSpeed: '7450 MB/s', writeSpeed: '6900 MB/s', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/69800_ssd_samsung_990pro.jpg' } },
            { brand: 'WD', name: 'Ổ cứng SSD WD Black SN770 500GB M.2 NVMe PCIe Gen4', stock: 45, price: 1590000, attributes: { category: 'storage', brand: 'WD', driveType: 'SSD M.2 NVMe', storageCapacity: '500GB', readSpeed: '5000 MB/s', writeSpeed: '4000 MB/s', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67700_ssd_wd_sn770.jpg' } },
        ];

        for (const p of storages) {
            await con.execute('INSERT INTO storage (brand, storage_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ Storage: ${storages.length} sản phẩm`);

        // --- Laptop ---
        const laptops = [
            { brand: 'ASUS', name: 'Laptop ASUS TUF Gaming A15 FA507NV-LP131W (Ryzen 7 7735HS, RTX 4060 8GB, 16GB DDR5, 512GB SSD)', stock: 15, price: 24990000, attributes: { category: 'laptop', brand: 'ASUS', pcCpu: 'Ryzen 7 7735HS', pcVga: 'RTX 4060 8GB', pcRam: '16GB DDR5', pcStorage: '512GB SSD', screenSize: '15.6 inch', resolution: '1920x1080 (FHD)', refreshRate: '144Hz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73800_laptop_asus_tuf.jpg' } },
            { brand: 'LENOVO', name: 'Laptop Lenovo Legion 5 15IAH7H (i7-12700H, RTX 3060 6GB, 16GB DDR5, 512GB SSD)', stock: 20, price: 27990000, attributes: { category: 'laptop', brand: 'LENOVO', pcCpu: 'i7-12700H', pcVga: 'RTX 3060 6GB', pcRam: '16GB DDR5', pcStorage: '512GB SSD', screenSize: '15.6 inch', resolution: '2560x1440 (QHD)', refreshRate: '165Hz', thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68900_laptop_lenovo_legion5.jpg' } },
        ];

        for (const p of laptops) {
            await con.execute('INSERT INTO laptop (brand, laptop_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)',
                [p.brand, p.name, p.stock, p.price, JSON.stringify(p.attributes)]);
        }
        console.log(`  ✅ Laptop: ${laptops.length} sản phẩm`);

        // ============================
        // Tổng kết
        // ============================
        const total = cpus.length + vgas.length + rams.length + psus.length + monitors.length + mainboards.length + storages.length + laptops.length;
        console.log(`\n🎉 HOÀN TẤT! Đã seed ${total} sản phẩm vào database cloud.`);
        console.log('👉 Bạn có thể truy cập website để kiểm tra.\n');

    } catch (e) {
        console.error('\n❌ LỖI:', e.message);
        if (e.message.includes('ECONNREFUSED') || e.message.includes('ETIMEDOUT')) {
            console.error('💡 Kiểm tra lại host, port, và đảm bảo database cloud đang chạy.');
        }
        if (e.message.includes('Access denied')) {
            console.error('💡 Kiểm tra lại user và password.');
        }
    } finally {
        if (con) await con.end();
    }
}

run();
