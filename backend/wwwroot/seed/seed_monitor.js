const mysql = require('mysql2/promise');

const products = [
    {
        brand: 'ASUS',
        name: 'Màn hình ASUS TUF Gaming VG27AQ3A 27" Fast IPS 2K 180Hz 1ms',
        stock: 30,
        price: 6490000,
        attributes: {
            category: 'monitor',
            brand: 'ASUS',
            resolution: '2K (1440p)',
            refreshRate: '144Hz - 165Hz', 
            panel: 'IPS',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73873_man_hinh_asus_tuf_gaming_vg27aq3a_2.jpg'
        }
    },
    {
        brand: 'DELL',
        name: 'Màn hình Dell UltraSharp U2723QE 27" IPS 4K',
        stock: 15,
        price: 13990000,
        attributes: {
            category: 'monitor',
            brand: 'DELL',
            resolution: '4K (2160p)',
            refreshRate: '60Hz - 75Hz',
            panel: 'IPS',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/64297_man_hinh_dell_ultrasharp_u2723qe_27_inch_4k_ips_1.jpg'
        }
    },
    {
        brand: 'LG',
        name: 'Màn hình LG 27GR95QE-B 27" OLED 2K 240Hz',
        stock: 5,
        price: 21990000,
        attributes: {
            category: 'monitor',
            brand: 'LG',
            resolution: '2K (1440p)',
            refreshRate: '240Hz+',
            panel: 'OLED',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/70417_man_hinh_lg_27gr95qe_b_27_oled_2k_240hz_1.jpg'
        }
    },
    {
        brand: 'GIGABYTE',
        name: 'Màn hình GIGABYTE G24F 2 24" IPS 165Hz',
        stock: 45,
        price: 3390000,
        attributes: {
            category: 'monitor',
            brand: 'GIGABYTE',
            resolution: 'Full HD (1080p)',
            refreshRate: '144Hz - 165Hz',
            panel: 'IPS',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67406_man_hinh_gigabyte_g24f_2_23_8_inch_ips_165hz_1.jpg'
        }
    },
    {
        brand: 'SAMSUNG',
        name: 'Màn hình cong Samsung Odyssey G5 G55C 27" VA 2K 165Hz',
        stock: 20,
        price: 5990000,
        attributes: {
            category: 'monitor',
            brand: 'SAMSUNG',
            resolution: '2K (1440p)',
            refreshRate: '144Hz - 165Hz',
            panel: 'VA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/78396_man_hinh_cong_samsung_odyssey_g5_g55c_27_inch_va_2k_165hz_1.jpg'
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
        console.log("Done inserting Monitor data");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
