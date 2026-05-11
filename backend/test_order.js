const http = require('http');

const data = JSON.stringify({
    customerName: "Test",
    phone: "123456789",
    email: "test@example.com",
    address: "123 Street",
    totalAmount: 1000,
    paymentMethod: "COD",
    items: [
        {
            productId: 1,
            quantity: 1,
            unitPrice: 1000
        }
    ]
});

const options = {
    hostname: 'localhost',
    port: 5285,
    path: '/api/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', chunk => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
