# Wajib Push ke GitHub

Setiap kali Anda (AI) melakukan perubahan file dalam workspace ini (baik itu membuat file baru, mengedit, atau menghapus file), Anda **DIWAJIBKAN** untuk langsung melakukan commit dan push perubahan tersebut ke GitHub.

**Alasan Utama**: 
Project ini terhubung dengan auto-deploy Vercel. Tanpa melakukan push ke GitHub, pengguna tidak akan bisa melihat hasil perubahan di website live-nya.

**Alur Kerja Wajib**:
1. Lakukan perubahan kode yang diminta pengguna.
2. Pada giliran (turn) yang sama atau tepat setelahnya, gunakan tool `run_command` untuk menjalankan:
   `git add .`
   `git commit -m "chore/feat/fix: deskripsi singkat"`
   `git push`
3. JANGAN pernah mengakhiri tugas pengeditan tanpa memastikan kode telah di-push, kecuali pengguna secara spesifik melarangnya.
