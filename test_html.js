const https = require('https');

const url = 'https://annibuku.com/sekolah-menengah-pertama-se-bandung?page=1';

https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        console.log(data.substring(0, 3000)); // Print first 3000 chars to see structure
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
