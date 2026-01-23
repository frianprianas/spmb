# Panduan Pengecekan Database Server (202.10.34.141)

Untuk mengatasi Error 500, Anda perlu memastikan Server Database mengizinkan Server Aplikasi (141.11.190.106) untuk masuk.

Silakan masuk ke server **202.10.34.141** (via SSH atau Remote Desktop), lalu cek 3 hal ini:

## 1. Pastikan PostgreSQL "Listen" ke Semua IP
Buka file konfigurasi utama `postgresql.conf`.
Lokasi biasanya di: `/etc/postgresql/12/main/postgresql.conf` (versi bisa beda, misal 14 atau 16).

Cari baris ini:
```properties
listen_addresses = '*'
```
*   Jika tulisannya `listen_addresses = 'localhost'`, ubah menjadi `'*'`.
*   Ini penting agar database mau menerima tamu dari luar.

## 2. Izinkan IP App Server di `pg_hba.conf`
Ini adalah satpam-nya database. Buka file `pg_hba.conf`.
Lokasi biasanya sama dengan folder di atas.

Tambahkan baris ini di bagian paling bawah:
```text
# Izinkan App Server (141...) connect ke DB ini
host    all             all             141.11.190.106/32       md5
```
*   Ini artinya: "Izinkan IP `141.11.190.106` masuk ke semua database dengan password".

## 3. Restart PostgreSQL & Cek Firewall
Setelah edit file di atas, wajib restart:
```bash
sudo service postgresql restart
```

Terakhir, pastikan firewall tidak memblokir port 5432.
```bash
sudo ufw allow 5432/tcp
```

---

## 4. Cara Test Koneksi Manual
Di server Database, Anda bisa cek apakah user dan db sudah ada:
```bash
# Masuk ke postgres console
sudo -u postgres psql

# Cek daftar user
\du

# Cek daftar database
\l

# Keluar
\q
```
Pastikan user `postgres` (atau user yang Anda set di .env app) punya password yang sama dengan yang ada di file `.env` aplikasi.
