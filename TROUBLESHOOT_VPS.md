# Panduan Troubleshooting Error 500 di VPS

Masalah Error 500 (Internal Server Error) saat login di VPS kemungkinan besar disebabkan oleh **koneksi database yang gagal** atau **variabel environment (.env) yang belum sesuai**.

Silakan cek langkah-langkah berikut secara berurutan:

## 1. Cek Pesan Error Detail (Penting)
Error 500 di console browser hanya memberi tahu ada yang salah, tapi tidak mengatakan *apa* yang salah.
1.  Buka aplikasi di browser (Chrome/Edge).
2.  Tekan `F12` untuk membuka **Developer Tools**.
3.  Pilih tab **Network**.
4.  Lakukan Login kembali sampai error terjadi.
5.  Klik pada request `login` yang berwarna merah di daftar Network.
6.  Lihat tab **Response** atau **Preview** di sebelah kanan/bawah.
7.  **Sampaikan pesan error yang muncul di sana kepada saya.** (Biasanya berisi: "User not found", "password authentication failed", "connect ECONNREFUSED", dll).

## 2. Pastikan Environment Variables (ENV) di VPS Benar
Pastikan Anda telah mengatur Environment Variable di VPS (baik via file `.env` di folder server, atau via setting panel VPS/Docker/PM2).

Konfigurasi yang wajib disesuaikan untuk VPS:
*   **DB_HOST**: Harus diisi `202.10.34.141` (Sesuai alamat database Anda). *Jangan biarkan 127.0.0.1 atau localhost*.
*   **DB_USER**: Username database (misal: `postgres`).
*   **DB_PASS**: Password databse (misal: `buhun666` atau password baru jika ada).
*   **DB_NAME**: Nama database (misal: `spmb_bn666`).
*   **JWT_SECRET**: Kunci rahasia (bisa sembarang text panjang).

**Catatan**: Jika Anda menggunakan PM2, jangan lupa restart service setelah ubah env: `pm2 restart all`.

## 3. Cek Koneksi Database (Izin Akses Remote)
Karena database berada di server berbeda (`202.10.34.141`) dari aplikasi (`141.11.190.106`), pastikan database server mengizinkan koneksi dari IP aplikasi.
1.  Di server Database (`202...`), file `pg_hba.conf` PostgreSQL harus mengizinkan IP `141.11.190.106`.
2.  Di server Database (`202...`), file `postgresql.conf` harus memiliki `listen_addresses = '*'` (atau setidaknya menyertakan IP VPS).
3.  Pastikan firewall di server Database (`202...`) membuka port `5432` untuk IP VPS (`141...`).

Jika pesan error di "Langkah 1" adalah `connect ECONNREFUSED` atau `timeout`, berarti masalahnya ada di **Langkah 3** ini.
