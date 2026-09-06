SI-NILAI SD V8 FINAL — 2026/2027
Versi ini meneruskan project dengan perangkat pembelajaran yang sudah berisi per kelas (1–6).

Dokumen yang sudah tersedia:
- CP — Capaian Pembelajaran, per kelas dan mata pelajaran
- TP — Tujuan Pembelajaran, per kelas dan mata pelajaran
- ATP — Alur Tujuan Pembelajaran, per kelas dan mata pelajaran
- Prota — Program Tahunan, per kelas dan mata pelajaran
- Prosem — Program Semester, per kelas dan mata pelajaran
- RPM Deep Learning, per kelas, mata pelajaran, dan BAB/Unit
- Penilaian per BAB, Rapor, Database Guru, Backup/Restore

Catatan penting:
- Kelas I–II menggunakan Fase A, III–IV Fase B, V–VI Fase C.
- Isi awal merupakan rumusan kerja/template siap edit agar dapat disesuaikan dengan CP resmi, buku yang dipakai sekolah, kalender pendidikan, dan kondisi peserta didik.
- Untuk judul BAB yang belum diverifikasi dari buku SIBI, aplikasi menggunakan label Unit Pembelajaran agar tidak mengarang judul buku.
- STS tidak digunakan.
- Data aplikasi disimpan lokal di browser. Untuk data terpusat/multi-perangkat diperlukan backend/API + PostgreSQL.

Referensi resmi:
https://buku.kemendikdasmen.go.id/katalog
https://kurikulum.kemendikdasmen.go.id/panduan-mapel

Cara pakai GitHub Pages:
1. Upload index.html ke root repository.
2. Settings > Pages > Deploy from branch > main > /(root).
3. Tunggu deployment selesai lalu buka URL GitHub Pages.

Login awal:
Username: guru
Password: 123456


FITUR LOGIN PER KELAS (V8)
- Akun Guru Kelas memiliki field Kelas 1–6.
- Setelah login, Guru Kelas otomatis masuk ke halaman Data Siswa kelasnya.
- Guru Kelas hanya melihat, menambah, mengimport, dan menilai siswa pada kelas yang ditetapkan.
- Selector kelas pada CP, TP, ATP, Prota, Prosem, RPM, dan Penilaian dikunci ke kelas guru.
- Administrator dapat mengelola seluruh kelas melalui akun admin.
- Logo sekolah disimpan sebagai logo-sekolah.png dan tampil di halaman login serta header aplikasi.
- Akun awal: guru / 123456 (Administrator).
- Contoh akun Guru Kelas dapat dibuat melalui Database Guru, misalnya username wali1, password 123456, peran Guru Kelas, Kelas 1.
