const mysql = require('mysql2/promise');

const vgas = [
    {
        brand: 'Asus',
        name: 'VGA Asus Dual GeForce RTX 3060 O12G V2',
        stock: 15,
        price: 7500000,
        attributes: {
            category: 'vga',
            vram: '12GB GDDR6',
            model: 'RTX 3060',
            gpu: 'NVIDIA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/59654_vga_asus_dual_rtx_3060_o12g_v2_1.jpg'
        }
    },
    {
        brand: 'MSI',
        name: 'VGA MSI GeForce RTX 4060 VENTUS 2X BLACK 8G OC',
        stock: 10,
        price: 8590000,
        attributes: {
            category: 'vga',
            vram: '8GB GDDR6',
            model: 'RTX 4060',
            gpu: 'NVIDIA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/73111_vga_msi_geforce_rtx_4060_ventus_2x_black_8g_oc_3.jpg'
        }
    },
    {
        brand: 'GIGABYTE',
        name: 'VGA GIGABYTE GeForce RTX 4070 Ti SUPER WINDFORCE MAX OC 16G',
        stock: 5,
        price: 24990000,
        attributes: {
            category: 'vga',
            vram: '16GB GDDR6X',
            model: 'RTX 4070ti Super',
            gpu: 'NVIDIA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/82103_vga_gigabyte_geforce_rtx_4070_ti_super_windforce_max_oc_16g_2.jpg'
        }
    },
    {
        brand: 'Zotac',
        name: 'VGA Zotac Gaming GeForce RTX 3050 Eco 8GB GDDR6',
        stock: 20,
        price: 4690000,
        attributes: {
            category: 'vga',
            vram: '8GB GDDR6',
            model: 'RTX 3050',
            gpu: 'NVIDIA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/78396_vga_zotac_gaming_geforce_rtx_3050_eco_8gb_gddr6_2.jpg'
        }
    },
    {
        brand: 'GIGABYTE',
        name: 'VGA GIGABYTE Radeon RX 6600 EAGLE 8G',
        stock: 8,
        price: 5290000,
        attributes: {
            category: 'vga',
            vram: '8GB GDDR6',
            model: 'RX 6600',
            gpu: 'AMD',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/61491_vga_gigabyte_radeon_rx_6600_eagle_8g__2_.jpg'
        }
    },
    {
        brand: 'Asus',
        name: 'VGA Asus ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
        stock: 2,
        price: 65990000,
        attributes: {
            category: 'vga',
            vram: '24GB GDDR6X',
            model: 'RTX 4090',
            gpu: 'NVIDIA',
            thumbnailUrl: 'https://hanoicomputercdn.com/media/product/67897_vga_asus_rog_strix_rtx_4090_o24g_gaming_1.jpg'
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

        for (const vga of vgas) {
            const query = `INSERT INTO Cpu (brand, cpu_name, stock, price, attributes) VALUES (?, ?, ?, ?, ?)`;
            await con.execute(query, [
                vga.brand,
                vga.name,
                vga.stock,
                vga.price,
                JSON.stringify(vga.attributes)
            ]);
            console.log(`Inserted ${vga.name}`);
        }

        await con.end();
        console.log("Done inserting VGAs");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
