const mysql = require('mysql2/promise');

const products = [
    {
        brand: 'ASUS',
        name: 'Laptop Gaming ASUS ROG Strix G15 G513RC HN038W',
        stock: 12,
        price: 24990000,
        attributes: {
            category: 'laptop',
            brand: 'ASUS',
            cpu: 'AMD Ryzen 7 6800H',
            ram: '8GB DDR5 4800MHz',
            storage: '512GB PCIe NVMe SSD',
            gpu: 'NVIDIA GeForce RTX 3050 4GB',
            screen: '15.6" FHD 144Hz IPS',
            battery: '56WHrs, 4S1P, 4-cell Li-ion',
            weight: '2.10 Kg',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67554_laptop_asus_rog_strix_g15_g513rc_hn038w.jpg'
        }
    },
    {
        brand: 'DELL',
        name: 'Laptop Dell XPS 15 9530',
        stock: 5,
        price: 55990000,
        attributes: {
            category: 'laptop',
            brand: 'DELL',
            cpu: 'Intel Core i7-13700H',
            ram: '16GB DDR5 4800MHz',
            storage: '512GB PCIe NVMe SSD',
            gpu: 'NVIDIA GeForce RTX 4050 6GB',
            screen: '15.6" FHD+ (1920 x 1200) InfinityEdge Non-Touch Anti-Glare 500-Nit',
            battery: '6 Cell, 86 Wh, integrated',
            weight: '1.86 Kg',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72888_laptop_dell_xps_15_9530_xps9530_1.jpg'
        }
    },
    {
        brand: 'APPLE',
        name: 'MacBook Air M2 2022 13.6 inch',
        stock: 20,
        price: 27990000,
        attributes: {
            category: 'laptop',
            brand: 'APPLE',
            cpu: 'Apple M2 8-core CPU',
            ram: '8GB Unified Memory',
            storage: '256GB SSD',
            gpu: '8-core GPU',
            screen: '13.6" Liquid Retina (2560 x 1664)',
            battery: '52.6-watt-hour lithium-polymer',
            weight: '1.24 Kg',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/66861_macbook_air_m2_13_inch_midnight_1.jpg'
        }
    },
    {
        brand: 'LENOVO',
        name: 'Laptop Lenovo IdeaPad Slim 5 16IAH8',
        stock: 18,
        price: 18990000,
        attributes: {
            category: 'laptop',
            brand: 'LENOVO',
            cpu: 'Intel Core i5-12450H',
            ram: '16GB LPDDR5 4800MHz',
            storage: '512GB SSD M.2 2242 PCIe 4.0x4 NVMe',
            gpu: 'Intel UHD Graphics',
            screen: '16" WUXGA (1920x1200) IPS 300nits Anti-glare',
            battery: 'Integrated 56.6Wh',
            weight: '1.89 Kg',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/74140_laptop_lenovo_ideapad_slim_5_16iah8.jpg'
        }
    },
    {
        brand: 'MSI',
        name: 'Laptop Gaming MSI Cyborg 15 A12UCX 281VN',
        stock: 15,
        price: 16990000,
        attributes: {
            category: 'laptop',
            brand: 'MSI',
            cpu: 'Intel Core i5-12450H',
            ram: '8GB DDR5 4800MHz',
            storage: '512GB NVMe PCIe Gen4x4 SSD',
            gpu: 'NVIDIA GeForce RTX 2050 4GB',
            screen: '15.6" FHD (1920x1080) 144Hz IPS-Level',
            battery: '3-Cell, 53.5 Battery (Whr)',
            weight: '1.98 Kg',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73099_laptop_gaming_msi_cyborg_15_a12ucx.jpg'
        }
    }
];

async function run() {
    try {
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'pccomdb'
        });

        for (const p of products) {
            const query = `INSERT INTO Cpu (brand, cpu_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)`;
            await con.execute(query, [
                p.brand,
                p.name,
                p.stock,
                p.price,
                JSON.stringify(p.attributes)
            ]);
            console.log(`Inserted ${p.name}`);
        }

        await con.end();
        console.log("Done inserting Laptop data");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
