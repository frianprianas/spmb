const https = require('https');
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client', 'public', 'schools_data.json');
const baseUrl = 'https://annibuku.com/sekolah-menengah-pertama-se-bandung?page=';
const totalPages = 26; // 309 schools / ~12 per page

let allSchools = [];

// Helper to fetch one page
function fetchPage(pageNum) {
    return new Promise((resolve, reject) => {
        https.get(baseUrl + pageNum, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => {
                resolve(data);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}

// Regex to extract school data
// Looks for the link pattern and then the Status label
// Note: This regex assumes the status appears after the link within a reasonable distance
const schoolRegex = /<a\s+href="https:\/\/annibuku\.com\/sekolah\/(\d+)-[^"]+">([^<]+)<\/a>[\s\S]*?<span\s+class="label">(NEGERI|SWASTA)<\/span>/gi;

async function scrape() {
    console.log(`Starting scrape of ${totalPages} pages...`);

    for (let i = 1; i <= totalPages; i++) {
        try {
            console.log(`Fetching page ${i}...`);
            const html = await fetchPage(i);

            // Reset regex lastIndex
            schoolRegex.lastIndex = 0;

            let match;
            let count = 0;
            while ((match = schoolRegex.exec(html)) !== null) {
                const id = match[1];
                const name = match[2];
                const status = match[3];

                // Avoid duplicates in current batch (though unusual on same page)
                if (!allSchools.find(s => s.npsn === id)) {
                    allSchools.push({
                        nama: name.trim(),
                        npsn: id, // Using internal ID as NPSN placeholder
                        kab_kota: "Kab. Bandung", // Source is "Se-Kabupaten Bandung"
                        status: status
                    });
                    count++;
                }
            }
            console.log(`  Found ${count} schools on page ${i}.`);

            // Courtesy delay
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`Error fetching page ${i}:`, err);
        }
    }

    // Merge with existing data
    let existingData = [];
    if (fs.existsSync(targetFile)) {
        try {
            existingData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        } catch (e) {
            console.error('Error reading existing file:', e);
        }
    }

    // Merge strategy: 
    // 1. Keep existing data that might have accurate 8-digit NPSN
    // 2. Add scraped data if not present (by Name or ID)

    // Let's rely on Name for de-duplication primarily, since scraping gives internal ID
    const existingNames = new Set(existingData.map(s => s.nama.toUpperCase()));

    let addedCount = 0;
    allSchools.forEach(scraped => {
        if (!existingNames.has(scraped.nama.toUpperCase())) {
            existingData.push(scraped);
            addedCount++;
        }
    });

    console.log(`Total schools scraped: ${allSchools.length}`);
    console.log(`New schools added to file: ${addedCount}`);

    fs.writeFileSync(targetFile, JSON.stringify(existingData, null, 4));
    console.log('Done!');
}

scrape();
