const https = require('https');
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client', 'public', 'schools_data.json');
// URL provided: https://data.sekolah-kita.net/kabupaten-kota/kota+bandung_74/smp
const baseUrl = 'https://data.sekolah-kita.net/kabupaten-kota/kota+bandung_74/smp?page=';

let allScrapedSchools = [];
let existingSchools = [];

// Load existing data
if (fs.existsSync(targetFile)) {
    try {
        existingSchools = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        console.log(`Loaded ${existingSchools.length} existing schools.`);
    } catch (e) {
        console.error("Error reading existing file:", e);
    }
}

function fetchPage(pageNum) {
    return new Promise((resolve, reject) => {
        const url = pageNum === 1 ? 'https://data.sekolah-kita.net/kabupaten-kota/kota+bandung_74/smp' : baseUrl + pageNum;
        console.log(`Fetching ${url}...`);

        const options = {};

        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                if (res.statusCode === 404) return resolve(""); // End of pages
                return reject(new Error(`Status Code: ${res.statusCode}`));
            }
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve(data); });
        }).on("error", (err) => { reject(err); });
    });
}

async function run() {
    let page = 1;
    let hasNext = true;
    let newCount = 0;

    // We can't know exact total pages easily without determining it from pagination HTML, 
    // but we can stop when no school items are found.
    while (hasNext) {
        try {
            const html = await fetchPage(page);
            fs.writeFileSync('last_response.html', html);
            console.log("Dumped HTML to last_response.html");

            // Regex to find School Names
            // Structure: <h5 class="mb-1">SMP ...</h5>
            const schoolRegex = /<h5 class="mb-1">([^<]+)<\/h5>/g;

            // Regex to find Status (it is usually near the school name in the text content)
            // But doing it globally separately might de-sync. 
            // Better to split by school item block.
            // <a href="..." class="list-group-item ..."> ... </a>

            // Regex for School Card
            const itemRegex = /<a href="([^"]+)" class="school-card">([\s\S]*?)<\/a>/g;
            let match;
            let itemsFoundOnPage = 0;

            while ((match = itemRegex.exec(html)) !== null) {
                itemsFoundOnPage++;
                const link = match[1];
                const block = match[2];

                // Extract Name
                const nameMatch = block.match(/<h3 class="school-name">([^<]+)<\/h3>/);
                if (!nameMatch) continue;
                const name = nameMatch[1].trim();

                // Extract Status
                const statusMatch = block.match(/<span class="info-label">Status<\/span>\s*<span class="info-value">([^<]+)<\/span>/);
                const status = statusMatch ? statusMatch[1].trim().toUpperCase() : "SWASTA";

                // Check Duplicates by Name in EXISTING data
                const exists = existingSchools.some(s => s.nama.replace(/\s+/g, ' ').toUpperCase() === name.replace(/\s+/g, ' ').toUpperCase());

                // Also check duplicates in currently scraped list
                const alreadyScraped = allScrapedSchools.some(s => s.nama === name);

                if (!exists && !alreadyScraped) {
                    allScrapedSchools.push({
                        nama: name,
                        npsn: "-",
                        kab_kota: "Kota Bandung",
                        status: status
                    });
                    newCount++;
                }
            }

            if (itemsFoundOnPage === 0) {
                console.log("No items found on page " + page + ". Stopping.");
                hasNext = false;
            } else {
                console.log(`Page ${page}: Found ${itemsFoundOnPage} items. Accumulated new: ${newCount}`);
                page++;
                // Artificial limit to prevent infinite loops if something goes wrong, e.g. 50 pages
                if (page > 50) hasNext = false;
            }

            // Delay
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(err);
            hasNext = false;
        }
    }

    if (newCount > 0) {
        const finalData = [...existingSchools, ...allScrapedSchools];
        fs.writeFileSync(targetFile, JSON.stringify(finalData, null, 4));
        console.log(`\nSuccess! Added ${newCount} new schools.`);
    } else {
        console.log("\nNo new schools found to add.");
    }
}

run();
