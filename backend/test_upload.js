const fs = require('fs');

async function testUpload() {
    // create a dummy 1KB text file masquerading as an image
    fs.writeFileSync('dummy.jpg', 'fake image content');
    
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    formData.append('image', blob, 'dummy.jpg');
    
    try {
        const res = await fetch('http://localhost:5285/api/products/upload-image', {
            method: 'POST',
            body: formData,
            // we don't need auth header if the endpoint doesn't require it? 
            // WAIT, [Authorize(Roles = "Admin,Manager,Editor")] is on the endpoint!
        });
        
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testUpload();
