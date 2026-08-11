# Panduan Deployment Website UMKM Desa Gumelar Kidul

Website ini dibangun menggunakan Vite (React) dan siap untuk di-hosting secara gratis di Firebase Hosting, Vercel, atau Netlify. Berikut panduan lengkap untuk deployment.

## A. Persiapan Akun & Database (Firebase)

Karena website ini membutuhkan database dan penyimpanan foto (Firestore & Storage), Anda wajib membuat project Firebase terlebih dahulu meskipun hosting akhirnya menggunakan Vercel.

1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google.
2. Klik **Buat Project** (Create Project), beri nama misalnya `umkm-gumelar-kidul`.
3. Matikan Google Analytics (bisa dinyalakan nanti jika perlu), lalu klik **Buat Project**.

### Mengaktifkan Authentication (Untuk Login Admin)
1. Di menu kiri, pilih **Build > Authentication**.
2. Klik **Get Started**.
3. Pilih penyedia login **Email/Password** dan aktifkan, lalu klik **Save**.
4. Pindah ke tab **Users**, klik **Add User**.
5. Masukkan email dan password untuk akun Admin pertama Anda (misal: `admin@gumelarkidul.desa.id`).

### Mengaktifkan Firestore Database
1. Di menu kiri, pilih **Build > Firestore Database**.
2. Klik **Create Database**.
3. Biarkan opsi lokasi (pilih yang terdekat, misal `asia-southeast2` Jakarta), lalu mulai dalam mode produksi.
4. Setelah database terbuat, masuk ke tab **Rules**. Ubah aturannya menjadi:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /umkm/{umkmId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
5. Klik **Publish**.

### Mengaktifkan Firebase Storage (Untuk Foto)
1. Di menu kiri, pilih **Build > Storage**.
2. Klik **Get Started**.
3. Sama seperti database, masuk ke tab **Rules** lalu ubah menjadi:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
4. Klik **Publish**.

---

## B. Menghubungkan Website dengan Firebase

1. Masuk ke **Project Overview** (ikon gir) > **Project settings**.
2. Scroll ke bawah, pada bagian "Your apps", klik ikon web `</>`.
3. Beri nama aplikasi, lalu klik **Register app**.
4. Anda akan melihat blok kode berisi `firebaseConfig`.
5. Di folder kode website, cari file `.env.example`, gandakan dan ganti namanya menjadi `.env`.
6. Isi nilai pada `.env` berdasarkan `firebaseConfig` Anda. Contoh:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyA...
   VITE_FIREBASE_AUTH_DOMAIN=umkm-gumelar.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=umkm-gumelar
   VITE_FIREBASE_STORAGE_BUCKET=umkm-gumelar.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:1234:web:abcd
   ```

---

## C. Cara Deployment

### Opsi 1: Menggunakan Firebase Hosting (Rekomendasi Utama)

1. Pastikan Anda sudah menginstal Node.js di komputer.
2. Buka terminal di folder proyek ini dan ketik perintah berikut untuk menginstal Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Login ke Firebase:
   ```bash
   firebase login
   ```
4. Hubungkan proyek Anda:
   ```bash
   firebase init hosting
   ```
   - Pilih "Use an existing project" lalu pilih proyek Anda.
   - Public directory? Ketik `dist`
   - Configure as a single-page app? Ketik `y`
   - Set up automatic builds with GitHub? Ketik `N`
   - File dist/index.html already exists? Ketik `N`
5. Lakukan proses build:
   ```bash
   npm run build
   ```
6. Deploy website:
   ```bash
   firebase deploy --only hosting
   ```
7. Website Anda sudah online!

### Opsi 2: Menggunakan Vercel (Paling Mudah via GitHub)

1. Upload seluruh folder proyek ini (kecuali folder `node_modules`) ke repository GitHub Anda.
2. Buka [Vercel](https://vercel.com/) dan login menggunakan GitHub.
3. Klik **Add New > Project**.
4. Pilih repository GitHub yang baru saja Anda buat.
5. Pada bagian **Environment Variables**, masukkan semua variabel dari file `.env` yang berisi kredensial Firebase Anda.
6. Klik **Deploy**.
7. Tunggu beberapa menit, website Anda sudah online secara gratis.
