const mysql = require('mysql2/promise');

const products = [
    // --- MAINBOARDS ---
    {
        brand: 'Asus',
        name: 'Mainboard Asus ROG STRIX Z790-A GAMING WIFI II DDR5',
        stock: 12,
        price: 10490000,
        attributes: {
            category: 'mainboard',
            socket: 'LGA 1700',
            chipset: 'Z790',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/75217_mainboard_asus_rog_strix_z790_a_gaming_wifi_ii_ddr5_2.jpg'
        }
    },
    {
        brand: 'GIGABYTE',
        name: 'Mainboard GIGABYTE B760M AORUS ELITE AX DDR5',
        stock: 25,
        price: 4350000,
        attributes: {
            category: 'mainboard',
            socket: 'LGA 1700',
            chipset: 'B760',
            formFactor: 'Micro-ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72186_mainboard_gigabyte_b760m_aorus_elite_ax_1.jpg'
        }
    },
    {
        brand: 'MSI',
        name: 'Mainboard MSI MAG B650 TOMAHAWK WIFI',
        stock: 15,
        price: 5590000,
        attributes: {
            category: 'mainboard',
            socket: 'AM5',
            chipset: 'B650',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68413_mainboard_msi_mag_b650_tomahawk_wifi_1.jpg'
        }
    },
    {
        brand: 'Asrock',
        name: 'Mainboard Asrock X670E Taichi',
        stock: 5,
        price: 13990000,
        attributes: {
            category: 'mainboard',
            socket: 'AM5',
            chipset: 'X670E',
            formFactor: 'E-ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68541_mainboard_asrock_x670e_taichi_2.jpg'
        }
    },

    // --- STORAGE (SSD/HDD) ---
    {
        brand: 'Samsung',
        name: 'Ổ cứng SSD Samsung 980 PRO 1TB M.2 NVMe PCIe Gen 4.0',
        stock: 40,
        price: 2450000,
        attributes: {
            category: 'storage',
            type: 'SSD NVMe',
            capacity: '1TB',
            formFactor: 'M.2 2280',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/57134_o_cung_ssd_samsung_980_pro_1tb_m_2_nvme_pcie_gen_4_0_1.jpg'
        }
    },
    {
        brand: 'Kingston',
        name: 'Ổ cứng SSD Kingston NV2 500GB PCIe 4.0 x4 NVMe',
        stock: 60,
        price: 1050000,
        attributes: {
            category: 'storage',
            type: 'SSD NVMe',
            capacity: '500GB',
            formFactor: 'M.2 2280',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68032_o_cung_ssd_kingston_nv2_500gb_pcie_4_0_x4_nvme_1.jpg'
        }
    },
    {
        brand: 'Western Digital',
        name: 'Ổ cứng HDD WD Blue 2TB 3.5 inch SATA III',
        stock: 35,
        price: 1550000,
        attributes: {
            category: 'storage',
            type: 'HDD',
            capacity: '2TB',
            formFactor: '3.5 inch',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/18659_18659_18659_18659_18659_18659_18659_wd_blue_1tb_64mb_cache__wd10ezex__500_500_0_0_0_0_0_0_0_0.jpg'
        }
    },
    {
        brand: 'Crucial',
        name: 'Ổ cứng SSD Crucial BX500 480GB 3D NAND SATA 3',
        stock: 45,
        price: 890000,
        attributes: {
            category: 'storage',
            type: 'SSD SATA',
            capacity: '480GB',
            formFactor: '2.5 inch',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/68832_ssd_crucial_bx500_2_5_inch_sata_iii_500gb_1.jpg'
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
        console.log("Done inserting Mainboards and Storage");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
