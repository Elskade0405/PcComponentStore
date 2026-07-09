const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedRolesCloud() {
    const connection = await mysql.createConnection({
        host: 'zephyr.proxy.rlwy.net',
        port: 42275,
        user: 'root',
        password: 'gVGxHDkBOODigkRoamwOdHuhayuoODlD',
        database: 'railway'
    });

    console.log('Connected to Railway MySQL.');

    const saltRounds = 10;
    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

    const usersToSeed = [
        {
            username: 'manager_user',
            password_hash: passwordHash,
            email: 'manager@gmail.com',
            phone_number: '0123456781',
            role_type: 'Manager',
            attributes: JSON.stringify({})
        },
        {
            username: 'sales_user',
            password_hash: passwordHash,
            email: 'sales@gmail.com',
            phone_number: '0123456782',
            role_type: 'SalesStaff',
            attributes: JSON.stringify({})
        },
        {
            username: 'editor_user',
            password_hash: passwordHash,
            email: 'editor@gmail.com',
            phone_number: '0123456783',
            role_type: 'Editor',
            attributes: JSON.stringify({})
        }
    ];

    for (const user of usersToSeed) {

        const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [user.email]);
        
        if (existing.length === 0) {
            await connection.execute(
                `INSERT INTO users (username, password_hash, email, phone_number, role_type, attributes, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [user.username, user.password_hash, user.email, user.phone_number, user.role_type, user.attributes]
            );
            console.log(`User ${user.email} with role ${user.role_type} created on Railway.`);
        } else {
            console.log(`User ${user.email} already exists on Railway.`);
        }
    }

    await connection.end();
}

seedRolesCloud().catch(console.error);
