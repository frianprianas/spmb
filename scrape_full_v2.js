const https = require('https');
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client', 'public', 'schools_data.json');
const baseUrl = 'https://annibuku.com/sekolah-menengah-pertama-se-bandung?page=';
const totalPages = 26;

let allSchools = [];

function fetchPage(pageNum) {
    return new Promise((resolve, reject) => {
        https.get(baseUrl + pageNum, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => { resolve(data); });
        }).on("error", (err) => { reject(err); });
    });
}

const linkRegex = /<a[^>]+href="(https:\/\/annibuku\.com\/sekolah\/(\d+)-[^"]+)"[^>]*>([^<]+)<\/a>/gi;

async function scrape() {
    console.log(`Starting scrape of ${totalPages} pages...`);

    for (let i = 1; i <= totalPages; i++) {
        try {
            process.stdout.write(`Fetching page ${i}... `);
            const html = await fetchPage(i);

            linkRegex.lastIndex = 0;
            let match;
            let pageCount = 0;

            while ((match = linkRegex.exec(html)) !== null) {
                const id = match[2];
                const name = match[3];
                // Avoid capturing navigation links if they match pattern (unlikely given the specific ID regex)

                // Search for status in the next 1000 characters
                const searchScope = html.substring(match.index, match.index + 1000);
                const statusMatch = searchScope.match(/(NEGERI|SWASTA)/);
                const status = statusMatch ? statusMatch[0] : "SWASTA"; // Default or Unknown

                if (!allSchools.find(s => s.npsn === id)) {
                    allSchools.push({
                        nama: name.trim(),
                        npsn: id,
                        kab_kota: "Kab. Bandung",
                        status: status
                    });
                    pageCount++;
                }
            }
            console.log(`Found ${pageCount} schools.`);
            // Courtesy delay
            await new Promise(r => setTimeout(r, 200));
        } catch (err) {
            console.error(`Error page ${i}:`, err.message);
        }
    }

    // Merge
    let existingData = [];
    if (fs.existsSync(targetFile)) {
        try {
            existingData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        } catch (e) { console.error(e); }
    }

    const existingNpsns = new Set(existingData.map(s => s.npsn));
    let addedCount = 0;

    allSchools.forEach(scraped => {
        if (!existingNpsns.has(scraped.npsn)) {
            // Also check Name to avoid duplicates if ID is different but school is same?
            // Actually, internal ID is safer than name which might vary slightly.
            // But let's check name too just in case.
            const nameExists = existingData.some(e => e.nama.toUpperCase() === scraped.nama.toUpperCase());
            if (!nameExists) {
                existingData.push(scraped);
                addedCount++;
            }
        }
    });

    console.log(`Total scraped: ${allSchools.length}`);
    console.log(`Added: ${addedCount}`);

    fs.writeFileSync(targetFile, JSON.stringify(existingData, null, 4));
    console.log('Schools data updated successfully!');
}

scrape();
