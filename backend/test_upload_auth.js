const fs = require('fs');

async function run() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:5285/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@pccomponent.com', password: 'password123' }) // assuming default admin
        });
        
        if (!loginRes.ok) {
            console.log("Login failed", await loginRes.text());
            return;
        }
        
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Got token");

        // 2. Upload
        fs.writeFileSync('dummy.jpg', 'fake image content');
        const formData = new FormData();
        const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
        formData.append('image', blob, 'dummy.jpg');
        
        const uploadRes = await fetch('http://localhost:5285/api/products/upload-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        console.log("Upload Status:", uploadRes.status);
        console.log("Upload Body:", await uploadRes.text());
    } catch(e) {
        console.error(e);
    }
}
run();
