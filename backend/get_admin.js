const mysql = require('mysql2/promise');

async function run() {
    try {
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'pccomdb'
        });
        
        const [rows] = await con.query("SELECT email, password_hash, role_type FROM users WHERE role_type='admin'");
        console.log("=== ADMIN ACCOUNTS ===");
        if (rows.length === 0) {
            console.log("No admin accounts found.");
        } else {
            rows.forEach(r => {
                console.log(`Email: ${r.email} | Password: ${r.password_hash} | Role: ${r.role_type}`);
            });
        }
        await con.end();
    } catch (e) {
        console.error(e);
    }
}
run();
