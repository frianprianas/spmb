# Panduan Setup HTTPS untuk API (Backend) via Nginx

Karena Frontend Anda sudah HTTPS (`https://spmb.smkbn666.sch.id:10007`), maka Backend (API) juga **WAJIB HTTPS** agar tidak diblokir browser.

Kita akan menggunakan **Nginx** sebagai "jembatan" (Reverse Proxy). Nginx akan menerima request HTTPS dari luar, lalu meneruskannya ke aplikasi Node.js Anda yang berjalan di port `10008` secara internal.

---

## Langkah 1: Tentukan Domain untuk API
Anda punya dua pilihan strategi:
1.  **Subdomain Baru**: Misal `https://api.smkbn666.sch.id` (Direkomendasikan).
2.  **Path Tetap**: Menggunakan domain frontend tapi dibelokkan, misal `https://spmb.smkbn666.sch.id/api/`. (Agak rumit jika frontend dan backend beda port seperti sekarang, 10007 & 10008).

Kita asumsikan Anda ingin cara yang paling rapi, yaitu membuat backend bisa diakses via HTTPS pada port yang sama dengan frontend atau domain khusus.

Tetapi, karena Anda sudah memakai port khusus (`10007` untuk Frontend), cara paling cepat tanpa ubah domain adalah:
**Membuat Proxy di Nginx agar port 10008 juga dilindungi SSL yang sama.**

## Langkah 2: Edit Konfigurasi Nginx di VPS

Masuk ke VPS, lalu edit file konfigurasi Nginx Anda.
Biasanya lokasi file ada di `/etc/nginx/sites-available/default` atau nama file khusus di `/etc/nginx/sites-available/smkbn666`.

Jalankan:
```bash
sudo nano /etc/nginx/sites-available/default
# atau sesuaikan dengan nama config Anda
```

Cari bagian `server` yang menangani `spmb.smkbn666.sch.id`.
Tambahkan blok konfigurasi baru (server block) baru di **bawahnya** (atau buat file baru) khusus untuk API.

Atau, cara paling mudah: **Gunakan Domain Utama tapi arahkan `/api` ke Backend.**

Contoh Config yang harus Anda pasang (Sesuaikan path sertifikat SSL-nya):

```nginx
# Server Block untuk FRONTEND (Pasti sudah ada, contoh di port 10007 atau 443)
server {
    listen 10007 ssl;
    server_name spmb.smkbn666.sch.id;

    ssl_certificate /etc/letsencrypt/live/spmb.smkbn666.sch.id/fullchain.pem; # SESUAIKAN
    ssl_certificate_key /etc/letsencrypt/live/spmb.smkbn666.sch.id/privkey.pem; # SESUAIKAN

    # Ini lokasi Frontend React Anda
    location / {
        root /var/www/spmb-frontend/dist; # SESUAIKAN folder build
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # --- TAMBAHAN PENTING ---
    # Arahkan semua request yang berawalan /api ke Backend Node.js
    location /api/ {
        proxy_pass http://localhost:10008; # Backend jalan di 10008
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Langkah 3: Restart Nginx
Setelah edit config, cek error dulu:
```bash
sudo nginx -t
```
Jika `OK`, restart Nginx:
```bash
sudo systemctl restart nginx
```

## Langkah 4: Update ENV di VPS dan Build Ulang
Setelah Langkah 2 berhasil, artinya Backend Anda sekarang bisa diakses lewat:
`https://spmb.smkbn666.sch.id:10007/api/...` (Perhatikan: HTTPS, dan Port sama dengan Frontend).

Sekarang, update file `.env` Frontend di VPS:
1.  Buka folder client di VPS.
2.  Edit `.env` (atau set environment variable saat build).
3.  Ubah `VITE_API_BASE_URL` menjadi request relative atau full URL HTTPS:
    ```ini
    VITE_API_BASE_URL=https://spmb.smkbn666.sch.id:10007
    ```
    *(Atau kosongkan saja `VITE_API_BASE_URL=` jika Anda pakai config proxy Nginx `/api/`, dia akan otomatis ke domain sendiri)*.

4.  **Build Ulang Frontend**:
    ```bash
    npm run build
    ```
    *(Pastikan hasil build di-serve oleh Nginx).*

---
**Rangkuman Solusi:**
Intinya, kita "menitipkan" Backend Node.js ke Nginx yang sudah ada SSL-nya.
Jadi Frontend tidak lagi request ke `http://141...:10008` (yang tidak aman), tapi request ke `https://spmb...:10007/api` (yang aman), dan Nginx yang akan meneruskannya ke backend di dalam server.
