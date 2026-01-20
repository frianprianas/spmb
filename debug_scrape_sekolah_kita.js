const https = require('https');

const url = 'https://data.sekolah-kita.net/kabupaten-kota/kota+bandung_74/smp';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(data.slice(0, 5000)); // Print first 5000 chars
        // Also try to find a school block to see if NPSN is there
        const firstSchool = data.match(/<div[^>]*class="[^"]*sekolah-item[^"]*"[\s\S]*?<\/div>/i) ||
            data.match(/SMP NEGERI 12[\s\S]{0,500}/);

        if (firstSchool) {
            console.log("--- SAMPLE SCHOOL BLOCK ---");
            console.log(firstSchool[0]);
        }
    });
}).on('error', (e) => {
    console.error(e);
});
