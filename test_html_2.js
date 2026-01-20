const https = require('https');

const url = 'https://annibuku.com/sekolah-menengah-pertama-se-bandung?page=1';

https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        const idx = data.indexOf('SMP GRAVITASI');
        if (idx !== -1) {
            console.log('Found at ' + idx);
            console.log(data.substring(idx - 200, idx + 400));
        } else {
            console.log('Not found');
            console.log(data.substring(0, 500));
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
