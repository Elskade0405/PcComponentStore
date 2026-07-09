const mysql = require('mysql2/promise');

const products = [
    {
        brand: 'INTEL',
        name: 'CPU Intel Core i9-14900K (Up to 6.0GHz, 24 Nhân 32 Luồng, 36MB Cache, Socket LGA 1700)',
        stock: 20,
        price: 15490000,
        attributes: {
            category: 'cpu',
            brand: 'INTEL',
            socket: 'LGA 1700',
            cores: 24,
            threads: 32,
            baseClock: '3.2 GHz',
            boostClock: '6.0 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/74404_cpu_intel_core_i9_14900k_1.jpg'
        }
    },
    {
        brand: 'INTEL',
        name: 'CPU Intel Core i7-14700K (Up to 5.6GHz, 20 Nhân 28 Luồng, 33MB Cache, Socket LGA 1700)',
        stock: 35,
        price: 10990000,
        attributes: {
            category: 'cpu',
            brand: 'INTEL',
            socket: 'LGA 1700',
            cores: 20,
            threads: 28,
            baseClock: '3.4 GHz',
            boostClock: '5.6 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/74403_cpu_intel_core_i7_14700k_1.jpg'
        }
    },
    {
        brand: 'INTEL',
        name: 'CPU Intel Core i5-13400F (Up to 4.6GHz, 10 Nhân 16 Luồng, 20MB Cache, Socket LGA 1700)',
        stock: 50,
        price: 5290000,
        attributes: {
            category: 'cpu',
            brand: 'INTEL',
            socket: 'LGA 1700',
            cores: 10,
            threads: 16,
            baseClock: '2.5 GHz',
            boostClock: '4.6 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/69599_cpu_intel_core_i5_13400f_1.jpg'
        }
    },
    {
        brand: 'INTEL',
        name: 'CPU Intel Core i3-12100F (Up to 4.3GHz, 4 Nhân 8 Luồng, 12MB Cache, Socket LGA 1700)',
        stock: 45,
        price: 2190000,
        attributes: {
            category: 'cpu',
            brand: 'INTEL',
            socket: 'LGA 1700',
            cores: 4,
            threads: 8,
            baseClock: '3.3 GHz',
            boostClock: '4.3 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/63897_cpu_intel_core_i3_12100f_1.jpg'
        }
    },
    {
        brand: 'AMD',
        name: 'CPU AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16 Nhân 32 Luồng, 144MB Cache, Socket AM5)',
        stock: 15,
        price: 17590000,
        attributes: {
            category: 'cpu',
            brand: 'AMD',
            socket: 'AM5',
            cores: 16,
            threads: 32,
            baseClock: '4.2 GHz',
            boostClock: '5.7 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/70438_cpu_amd_ryzen_9_7950x3d_1.jpg'
        }
    },
    {
        brand: 'AMD',
        name: 'CPU AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8 Nhân 16 Luồng, 96MB Cache, Socket AM5)',
        stock: 30,
        price: 10490000,
        attributes: {
            category: 'cpu',
            brand: 'AMD',
            socket: 'AM5',
            cores: 8,
            threads: 16,
            baseClock: '4.2 GHz',
            boostClock: '5.0 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/71375_cpu_amd_ryzen_7_7800x3d_1.jpg'
        }
    },
    {
        brand: 'AMD',
        name: 'CPU AMD Ryzen 5 7600X (Up to 5.3GHz, 6 Nhân 12 Luồng, 32MB Cache, Socket AM5)',
        stock: 40,
        price: 6190000,
        attributes: {
            category: 'cpu',
            brand: 'AMD',
            socket: 'AM5',
            cores: 6,
            threads: 12,
            baseClock: '4.7 GHz',
            boostClock: '5.3 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67440_cpu_amd_ryzen_5_7600x_1.jpg'
        }
    },
    {
        brand: 'AMD',
        name: 'CPU AMD Ryzen 5 5600G (Up to 4.4GHz, 6 Nhân 12 Luồng, 16MB Cache, Socket AM4)',
        stock: 60,
        price: 3390000,
        attributes: {
            category: 'cpu',
            brand: 'AMD',
            socket: 'AM4',
            cores: 6,
            threads: 12,
            baseClock: '3.9 GHz',
            boostClock: '4.4 GHz',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/59695_cpu_amd_ryzen_5_5600g_1.jpg'
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
        console.log("Done inserting CPU data");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
