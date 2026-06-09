const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCs3VU9NhqJ-i7khcQjzDavn29GIh3I1Q0';
const body = JSON.stringify({
    contents: [{
        parts: [{
            text: "hello"
        }]
    }]
});

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
})
.then(async r => {
    console.log(r.status);
    console.log(await r.text());
}).catch(console.error);
