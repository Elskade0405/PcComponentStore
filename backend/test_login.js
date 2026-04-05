async function testLogin() {
    try {
        const res = await fetch('http://localhost:5285/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@pcstore.com', password: 'hashed_pwd_3' })
        });
        const data = await res.json();
        console.log("Login Success!");
        console.log("Status:", res.status);
        console.log("Body JSON:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.log("Login Failed:", err.message);
    }
}
testLogin();
