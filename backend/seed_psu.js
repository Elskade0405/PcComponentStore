const mysql = require('mysql2/promise');

const products = [
    {
        brand: 'Corsair',
        name: 'Nguồn máy tính Corsair RM850e 850W 80 Plus Gold',
        stock: 30,
        price: 3250000,
        attributes: {
            category: 'psu',
            wattage: '850W',
            efficiency: '80 Plus Gold',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/72579_nguon_may_tinh_corsair_rm850e_850w_80_plus_gold_1.jpg'
        }
    },
    {
        brand: 'Cooler Master',
        name: 'Nguồn máy tính Cooler Master MWE 750 Bronze V2',
        stock: 50,
        price: 1850000,
        attributes: {
            category: 'psu',
            wattage: '750W',
            efficiency: '80 Plus Bronze',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/58882_nguon_may_tinh_cooler_master_mwe_750_bronze_v2_230v_1.jpg'
        }
    },
    {
        brand: 'GIGABYTE',
        name: 'Nguồn máy tính GIGABYTE GP-P550B 550W 80 Plus Bronze',
        stock: 45,
        price: 1150000,
        attributes: {
            category: 'psu',
            wattage: '550W',
            efficiency: '80 Plus Bronze',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/54316_nguon_may_tinh_gigabyte_gp_p550b_550w_80_plus_bronze_1.jpg'
        }
    },
    {
        brand: 'ASUS',
        name: 'Nguồn máy tính Asus ROG THOR 1000W Platinum II',
        stock: 10,
        price: 8590000,
        attributes: {
            category: 'psu',
            wattage: '1000W',
            efficiency: '80 Plus Platinum',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/65133_nguon_may_tinh_asus_rog_thor_1000w_platinum_ii_1.jpg'
        }
    },
    {
        brand: 'MSI',
        name: 'Nguồn máy tính MSI MAG A650BN 650W 80 Plus Bronze',
        stock: 40,
        price: 1350000,
        attributes: {
            category: 'psu',
            wattage: '650W',
            efficiency: '80 Plus Bronze',
            formFactor: 'ATX',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/61053_nguon_may_tinh_msi_mag_a650bn_650w_80_plus_bronze_1.jpg'
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
        console.log("Done inserting PSU data");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
