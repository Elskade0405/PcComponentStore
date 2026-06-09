const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCs3VU9NhqJ-i7khcQjzDavn29GIh3I1Q0';

fetch(url)
.then(async r => {
    let json = await r.json();
    let names = json.models.map(m => m.name).filter(n => n.includes('gemini'));
    console.log(names.join('\n'));
}).catch(console.error);
