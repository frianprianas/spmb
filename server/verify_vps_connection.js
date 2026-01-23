require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('--- DIAGNOSIS KONEKSI DATABASE VPS ---');
console.log('1. Memeriksa Environment Variables...');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPass = process.env.DB_PASS || process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT || 5432;

console.log(`   DB_HOST: ${dbHost}`);
console.log(`   DB_NAME: ${dbName}`);
console.log(`   DB_USER: ${dbUser}`);
console.log(`   DB_PORT: ${dbPort}`);
console.log(`   DB_PASS: ${dbPass ? '****** (Terisi)' : 'KOSONG (Bahaya!)'}`);

if (!dbHost || dbHost === 'localhost' || dbHost === '127.0.0.1') {
    console.warn('\n[PERINGATAN] DB_HOST masih localhost! Jika ini VPS, harusnya IP Publik Database (202.10.x.x).');
}

console.log('\n2. Mencoba Menghubungi Database...');

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        connectTimeout: 10000 // 10 detik timeout
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('\n✅ SUKSES! Koneksi ke database berhasil.');
        console.log('   Server aplikasi bisa berkomunikasi dengan database.');
    } catch (error) {
        console.error('\n❌ GAGAL! Tidak bisa connect ke database.');
        console.error('------------------------------------------');
        console.error('Pesan Error:', error.message);

        if (error.original) {
            console.error('Detail Error:', error.original.code);
            if (error.original.code === 'ECONNREFUSED') {
                console.error('\n[ANALISIS] Connection Refused.');
                console.error('Kemungkinan: IP Salah, Database Down, atau Firewall di Server Database (202...) memblokir IP VPS ini.');
            } else if (error.original.code === '28P01') {
                console.error('\n[ANALISIS] Password Authentication Failed.');
                console.error('Kemungkinan: Password salah atau User salah.');
            } else if (error.original.code === '3D000') {
                console.error('\n[ANALISIS] Database does not exist.');
                console.error(`Kemungkinan: Database dengan nama '${dbName}' tidak ada di server.`);
            }
        }
    } finally {
        await sequelize.close();
    }
}

testConnection();
