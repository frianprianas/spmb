const https = require('https');

const url = 'https://annibuku.com/sekolah-menengah-pertama-se-bandung?page=1';
// Relaxed regex to just find links
const regex = /<a[^>]+href="(https:\/\/annibuku\.com\/sekolah\/(\d+)-[^"]+)"[^>]*>([^<]+)<\/a>/gi;

https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        let match;
        let count = 0;
        while ((match = regex.exec(data)) !== null) {
            console.log(`Matched: ${match[1]} | Name: ${match[3]}`);
            count++;
        }
        console.log(`Total found: ${count}`);
        if (count === 0) {
            console.log('--- HTML SNIPPET AROUND PROBABLE SCHOOL ---');
            const idx = data.indexOf('336668');
            console.log(data.substring(idx - 100, idx + 200));
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
