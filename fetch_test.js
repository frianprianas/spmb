const https = require('https');

const urls = [
    'https://api-sekolah-indonesia.vercel.app/sekolah?jenjang=smp&provinsi=jawa+barat&page=1&perPage=5',
    'https://api-sekolah-indonesia.vercel.app/sekolah/smp?provinsi=jawa+barat&page=1&perPage=5',
];

urls.forEach(url => {
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
            console.log(`URL: ${url}`);
            console.log(data.substring(0, 500)); // Print first 500 chars
            console.log('---');
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});
