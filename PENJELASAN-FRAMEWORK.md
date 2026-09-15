# Penjelasan Framework dan Teknologi Sistem

Dokumen ini berisi rangkuman konsep dasar dari teknologi utama yang digunakan dalam pengembangan sistem ini. Tujuannya adalah untuk memberikan pemahaman dasar agar Anda dapat menjawab dengan percaya diri saat ditanya mengenai arsitektur aplikasi.

---

## 1. React (Pembuat Tampilan Utama)
React adalah library JavaScript buatan Facebook (Meta) yang digunakan untuk membuat antarmuka pengguna (UI). Konsep utama React yang wajib diketahui:

* **Komponen (Components):** React membagi halaman web menjadi bagian-bagian kecil yang bisa digunakan berulang kali (seperti balok Lego). 
  * *Contoh di sistem:* Komponen `UmkmCard.jsx` adalah sebuah "Lego" berbentuk kartu yang menampilkan data UMKM. Di halaman utama, komponen ini bisa dipanggil berkali-kali untuk menampilkan banyak UMKM sekaligus tanpa harus menulis ulang kodenya.
* **JSX (JavaScript XML):** Format penulisan kode di React. Ini memungkinkan penulisan elemen HTML (`<div>`, `<h1>`, dll) langsung di dalam file JavaScript. File-file React umumnya berakhiran `.jsx`.
* **State & Props:**
  * **State:** Memori internal sebuah komponen. Jika *State* berubah, komponen akan otomatis menggambar ulang dirinya sendiri (update tampilan) tanpa me-refresh halaman web.
  * **Props:** Cara antar komponen berkomunikasi. Seperti mengoper data dari komponen induk ke komponen anak. Misalnya, halaman `DetailUmkm.jsx` mengirimkan data UMKM melalui *Props* ke komponen gambar.
* **Hooks:** Fungsi khusus React untuk menggunakan *State* dan fitur React lainnya (biasanya diawali dengan kata `use`).
  * *Contoh di sistem:* File `useGaleri.js` adalah *Custom Hook* yang digunakan untuk mengelola logika (seperti mengambil data foto) secara terpisah dari tampilan.

## 2. Vite (Mesin Penggerak & Pembuat Aplikasi)
Vite (dibaca: "vit") adalah *Build Tool* atau alat pembuat aplikasi.
* **Keunggulan:** Sangat cepat. Saat kode diubah dan disimpan (Save), Vite akan langsung memperbarui tampilan di browser secara instan tanpa perlu memuat ulang seluruh halaman (fitur *Hot Module Replacement* / HMR).
* **Perannya:** Saat aplikasi siap dirilis, Vite bertugas membungkus (bundling) semua file `.jsx` dan `.css` menjadi file `.html`, `.js`, dan `.css` biasa yang sangat kecil dan teroptimasi agar cepat dimuat oleh pengguna.

## 3. Firebase (Backend & Database)
Sistem ini menggunakan arsitektur *serverless* dengan Firebase sebagai "Backend as a Service" (BaaS) dari Google.
* **Database (Firestore):** Tempat menyimpan data teks (seperti nama UMKM, alamat, harga produk).
* **Storage:** Tempat menyimpan file besar seperti foto UMKM.
* **Authentication:** Layanan untuk fitur Login/Register (seperti pada halaman `AdminLogin.jsx`). Firebase menangani sistem keamanan, pengecekan email, dan password.

## 4. React Router DOM (Pengatur Jalan)
Sistem ini berkonsep *Single Page Application* (SPA), artinya aplikasi web ini sebenarnya hanya memuat 1 halaman HTML sungguhan.
* **Perannya:** React Router bertugas mengatur navigasi/perpindahan halaman. Saat pengguna mengklik dari halaman "Beranda" ke halaman "Detail UMKM", web tidak akan memuat ulang (loading) di browser. React Router hanya mencopot komponen "Beranda" dan memasang komponen "Detail UMKM" secepat kilat.

---

## Ringkasan (Elevator Pitch)
Jika Anda ditanya: *"Aplikasi ini pakai teknologi apa dan bagaimana cara kerjanya?"*

**Anda dapat menjawab:**

> "Aplikasi ini dibuat menggunakan framework **React** di bagian frontend, di-generate menggunakan **Vite** agar proses pengembangan dan performanya cepat. Konsep utamanya menggunakan arsitektur berbasis **Komponen**, sehingga bagian-bagian UI seperti kartu produk bisa didaur ulang. Untuk perpindahan halamannya menggunakan **React Router** sehingga website terasa sangat cepat karena tidak perlu memuat ulang halaman baru (konsep *Single Page Application*).
>
> Sedangkan untuk backend dan databasenya, sistem ini tidak menggunakan server tradisional, melainkan menggunakan layanan *serverless* dari **Firebase**. Firebase menangani sistem login admin, database data UMKM, sekaligus penyimpanan foto-fotonya."
