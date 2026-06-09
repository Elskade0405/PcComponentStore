const mysql = require('mysql2/promise');

async function fixPasswordsCloud() {
    const connection = await mysql.createConnection({
        host: 'zephyr.proxy.rlwy.net',
        port: 42275,
        user: 'root',
        password: 'gVGxHDkBOODigkRoamwOdHuhayuoODlD',
        database: 'railway'
    });

    console.log('Connected to Railway MySQL.');

    // The backend uses plaintext passwords currently: u.PasswordHash == model.Password
    const defaultPassword = 'password123';

    const emailsToFix = [
        'manager@gmail.com',
        'sales@gmail.com',
        'editor@gmail.com'
    ];

    for (const email of emailsToFix) {
        await connection.execute(
            'UPDATE users SET password_hash = ? WHERE email = ?',
            [defaultPassword, email]
        );
        console.log(`Password for ${email} has been reset to plaintext '${defaultPassword}'.`);
    }

    await connection.end();
}

fixPasswordsCloud().catch(console.error);
