const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'public', 'schools_data.json');

const newSchools = [
    // Page 1
    { "nama": "SMP GRAVITASI", "npsn": "336668", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMPN 2 SOREANG", "npsn": "22204", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMPN 2 KUTAWARINGIN", "npsn": "22203", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMP YPPKP SOREANG", "npsn": "22202", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP PLUS AL IRFAN", "npsn": "22201", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP BINA CASTRENA INSANI", "npsn": "22200", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP AL-TAMIMI", "npsn": "22199", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP AL BURDAH", "npsn": "22198", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMPN 1 CANGKUANG", "npsn": "22104", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMP PLUS AL MUHSININ", "npsn": "22103", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP PGRI CANGKUANG", "npsn": "22102", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP PASUNDAN 1 CANGKUANG", "npsn": "22101", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    // Page 2
    { "nama": "SMP BHAKTI MULYA BANJARAN", "npsn": "22100", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMPN 2 SOLOKANJERUK", "npsn": "22028", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMPN 1 SOLOKANJERUK", "npsn": "22027", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMP YPPSD SOLOKANJERUK", "npsn": "22026", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP PGRI 450 SOLOKANJERUK", "npsn": "22025", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP GPI SOLOKANJERUK", "npsn": "22024", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP DIENUL ISLAM", "npsn": "22023", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP DARUSSALAM", "npsn": "22022", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP BHAKTI PUTRA", "npsn": "22021", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMPN 1 NAGREG", "npsn": "21946", "kab_kota": "Kab. Bandung", "status": "NEGERI" },
    { "nama": "SMP YP 17 NAGREG", "npsn": "21945", "kab_kota": "Kab. Bandung", "status": "SWASTA" },
    { "nama": "SMP TRIBHAKTI", "npsn": "21944", "kab_kota": "Kab. Bandung", "status": "SWASTA" }
];

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let schools = [];
    try {
        schools = JSON.parse(data);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return;
    }

    // Filter out duplicates based on NPSN
    const existingNpsn = new Set(schools.map(s => s.npsn));
    const addedSchools = newSchools.filter(s => !existingNpsn.has(s.npsn));

    const updatedSchools = [...schools, ...addedSchools];

    fs.writeFile(filePath, JSON.stringify(updatedSchools, null, 4), (err) => {
        if (err) console.error('Error writing file:', err);
        else console.log(`Successfully added ${addedSchools.length} new schools.`);
    });
});
