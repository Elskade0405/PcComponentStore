const mysql = require('mysql2/promise');

const rams = [
    {
        brand: 'Corsair',
        name: 'RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz',
        stock: 50,
        price: 1150000,
        attributes: {
            category: 'ram',
            type: 'DDR4',
            capacity: '16GB',
            bus: '3200MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/49258_ram_corsair_vengeance_lpx_16gb_1x16gb_ddr4_3200mhz_1.jpg'
        }
    },
    {
        brand: 'Kingston',
        name: 'RAM Kingston Fury Beast RGB 16GB (2x8GB) DDR4 3200MHz',
        stock: 30,
        price: 1350000,
        attributes: {
            category: 'ram',
            type: 'DDR4',
            capacity: '16GB',
            bus: '3200MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/61050_ram_kingston_fury_beast_16gb_2x8gb_ddr4_3200mhz_1.jpg'
        }
    },
    {
        brand: 'G.Skill',
        name: 'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz',
        stock: 15,
        price: 3590000,
        attributes: {
            category: 'ram',
            type: 'DDR5',
            capacity: '32GB',
            bus: '6000MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/65792_ram_g_skill_trident_z5_rgb_32gb_2x16gb_ddr5_6000mhz_1.jpg'
        }
    },
    {
        brand: 'Corsair',
        name: 'RAM Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6200MHz',
        stock: 10,
        price: 4890000,
        attributes: {
            category: 'ram',
            type: 'DDR5',
            capacity: '32GB',
            bus: '6200MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/66807_ram_corsair_dominator_platinum_rgb_32gb_2x16gb_ddr5_5600mhz_black_1.jpg'
        }
    },
    {
        brand: 'Adata',
        name: 'RAM Adata XPG Spectrix D50 RGB 16GB (2x8GB) DDR4 3200MHz',
        stock: 25,
        price: 1250000,
        attributes: {
            category: 'ram',
            type: 'DDR4',
            capacity: '16GB',
            bus: '3200MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/55745_ram_adata_xpg_spectrix_d50_rgb_16gb_2x8gb_ddr4_3200mhz_white_1.jpg'
        }
    },
    {
        brand: 'Kingston',
        name: 'RAM Kingston Fury Renegade RGB 32GB (2x16GB) DDR5 6400MHz',
        stock: 8,
        price: 4190000,
        attributes: {
            category: 'ram',
            type: 'DDR5',
            capacity: '32GB',
            bus: '6400MHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72134_ram_kingston_fury_renegade_rgb_32gb_2x16gb_ddr5_6400mhz_silver_1.jpg'
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

        for (const ram of rams) {
            const query = `INSERT INTO Cpu (brand, cpu_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)`;
            await con.execute(query, [
                ram.brand,
                ram.name,
                ram.stock,
                ram.price,
                JSON.stringify(ram.attributes)
            ]);
            console.log(`Inserted ${ram.name}`);
        }

        await con.end();
        console.log("Done inserting RAMs");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
