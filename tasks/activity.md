# BookStore – Panduan Halaman (User & Admin)

## Daftar Halaman – User

### 1. SignUp / Register User
- Nama halaman: `signup` atau `register`
- Fungsi:
  - Formulir registrasi user baru (nama, email, password, konfirmasi password, dll).
  - Validasi input: format email, panjang password, tidak boleh kosong.
  - Tombol “Register” yang mengirim data ke backend dan mengarahkan ke halaman login jika sukses.
- Komentar:
  - Harus ada feedback error/warning jika input tidak valid.
  - Jangan tampilkan password di DOM (gunakan `type="password"`).

### 2. Login User
- Nama halaman: `login`
- Fungsi:
  - Formulir login (email/username + password).
  - Opsi “Forgot password” jika support recovery password.
  - Tombol “Login” yang mengirim data ke backend, set token/session, lalu redirect ke `Home` jika valid.
- Komentar:
  - Jangan hardcode role; role didapat dari response backend.
  - Tambahkan loading state saat request sedang berjalan.

### 3. Landing Page (Guest)
- Nama halaman: `landing` atau `home-guest`
- Fungsi:
  - Hero banner dengan gambar/video (stock, tidak melanggar hak cipta).
  - Ringkasan fitur: “Browse books”, “Safe checkout”, “Contact us”, dll.
  - CTA: “Sign Up” dan “Login”.
- Komentar:
  - Bersifat promosi, tidak memuat data user pribadi.
  - Gunakan layout responsif dan SEO‑friendly.

### 4. Home / Dashboard User
- Nama halaman: `home` atau `user-dashboard`
- Fungsi:
  - Tampilkan salam: “Welcome, [username]!”.
  - Ringkasan: jumlah buku terbaru, promo, kategori unggulan.
  - Card list buku terbaru/terlaris (gambar, judul, harga, tombol “View Detail”).
  - Quick access: “Continue Shopping”, “My Cart”, “My Orders”.
- Komentar:
  - Gunakan API untuk fetch data buku (paginasi, limit).
  - Gunakan placeholder skeleton saat loading.

### 5. About Us
- Nama halaman: `about-us`
- Fungsi:
  - Profil singkat toko buku (sejarah, misi, visi, nilai).
  - Tim atau kontak umum (tanpa detail pribadi berlebihan).
  - Gambar berkaitan (ilustrasi toko, buku, dll).
- Komentar:
  - Tidak perlu fitur interaktif berat, cukup statis.
  - Tetap responsive dan bisa di‑scroll.

### 6. Contact to Admin
- Nama halaman: `contact`
- Fungsi:
  - Formulir: nama, email, subjek, pesan.
  - Tombol “Send” untuk mengirim pesan ke admin.
  - Feedback: “Message sent successfully” atau pesan error.
- Komentar:
  - Kirim ke backend dengan validasi email dan text tidak boleh kosong.
  - Simpan di database (tabel `messages`) agar admin bisa membaca nanti.

### 7. Book List / Browse Books
- Nama halaman: `books` atau `book-list`
- Fungsi:
  - Tampilan grid/list buku.
  - Filter: kategori, harga, rating, dll (opsional).
  - Search bar di atas atau di samping.
  - Button “Add to Cart” pada tiap item.
- Komentar:
  - Gunakan state pagination untuk limit jumlah buku per page.
  - Gambar buku harus dari URL public domain / royalty‑free.

### 8. Book Detail
- Nama halaman: `book/:id` atau `book-detail`
- Fungsi:
  - Menampilkan detail: judul, pengarang, kategori, stok, harga, deskripsi panjang.
  - Gambar sampul besar plus mini‑gallery jika ada multiple image.
  - Tombol:
    - “Add to Cart”
    - “Back to list”
    - “Rate / Review” (opsional jika ada fitur rating).
- Komentar:
  - Tambahkan loading state saat fetch data dari API.
  - Jika buku tidak ditemukan, tampilkan 404 user‑friendly.

### 9. Search Results
- Nama halaman: `search`
- Fungsi:
  - Menampilkan daftar buku berdasarkan input search.
  - Parameter di query string (misal: `/search?q=python`).
  - Layout sama seperti `books` (grid/list).
- Komentar:
  - Handle jika tidak ada hasil: “No books found”.
  - Validasi minimum karakter sebelum fetch (misal ≥ 2).

### 10. Shopping Cart
- Nama halaman: `cart`
- Fungsi:
  - Tabel / list item dalam keranjang (nama buku, gambar, harga satuan, jumlah, total).
  - Fitur:
    - Ubah jumlah buku.
    - Hapus item dari cart.
    - Hitung total harga di sisi client & backend.
  - Tombol:
    - “Continue Shopping”
    - “Checkout / Proceed to Payment”
- Komentar:
  - Gunakan async update ke backend saat quantity berubah.
  - Tambahkan notifikasi jika stock tidak mencukupi.

### 11. Checkout / Payment at Delivery
- Nama halaman: `checkout`
- Fungsi:
  - Form alamat pengiriman.
  - Ringkasan pesanan (list buku, jumlah, subtotal, Ongkir, total).
  - Tipe pembayaran: “Payment at Delivery” (COD).
  - Button: “Confirm Order”.
- Komentar:
  - Validasi alamat: nama, telepon, alamat lengkap.
  - Setelah sukses, redirect ke `Order Confirmation` dan kosongkan cart.

### 12. Order Confirmation / Success
- Nama halaman: `order-success` atau `order-confirmation`
- Fungsi:
  - Menampilkan resi / order ID.
  - Detail: daftar buku yang dipesan, total harga, metode pembayaran, status awal.
  - Informasi: estimasi pengiriman, cara kontak jika ada masalah.
- Komentar:
  - Jangan memuat form berulang di halaman ini.
  - Sertakan link “Back to Home” atau “View Orders”.

### 13. My Orders (History)
- Nama halaman: `my-orders`
- Fungsi:
  - List semua pesanan user (order ID, tanggal, status, total).
  - Klik salah satu order untuk melihat detail pesanan.
- Komentar:
  - Gunakan status: `Pending`, `Processing`, `Delivered`, `Cancelled`.
  - Tidak perlu fitur update status di sisi user (hanya admin).

### 14. Profile / Account Settings
- Nama halaman: `profile` atau `account-settings`
- Fungsi:
  - Lihat dan edit data pribadi: nama, email, no HP, alamat default.
  - Ganti password (lama, baru, konfirmasi).
  - Tombol “Save Changes”.
- Komentar:
  - Validasi password baru tidak boleh sama dengan password lama.
  - Tambahkan konfirmasi: “Perubahan berhasil disimpan”.

---

## Daftar Halaman – Admin

### 1. Admin Login
- Nama halaman: `admin/login`
- Fungsi:
  - Form login khusus admin (email/username + password).
  - Setelah login, redirect ke `Admin Dashboard`.
- Komentar:
  - Endpoint berbeda dari user login, atau role diperiksa di backend.
  - Tambahkan rate limit / captcha jika perlu.

### 2. Admin Dashboard
- Nama halaman: `admin/dashboard`
- Fungsi:
  - Ringkasan: total buku, total kategori, jumlah user, jumlah order baru.
  - Quick stats dengan grafik sederhana (jika diperlukan).
  - Navigasi menu: kategori, buku, user, order, pesan.
- Komentar:
  - Tidak perlu semua fitur kompleks; cukup menampilkan angka‑angka penting.
  - Gunakan card layout untuk setiap stat.

### 3. Category Management
- Nama halaman: `admin/categories`
- Fungsi:
  - Tabel daftar kategori buku.
  - Aksi per baris:
    - Edit (ubah nama kategori).
    - Delete (hapus kategori, validasi jika masih ada buku terkait).
  - Tombol “Add New Category” (munculkan modal atau form).
- Komentar:
  - Backend harus validasi: kategori tidak boleh kosong, tidak boleh duplikat.
  - Soft delete lebih baik daripada hard delete (opsional).

### 4. Book Management
- Nama halaman: `admin/books`
- Fungsi:
  - Tabel daftar buku (judul, kategori, harga, stok, status).
  - Aksi per baris:
    - View Detail.
    - Edit (form update buku).
    - Delete (hapus atau set status non‑aktif).
  - Tombol “Add New Book” (form lengkap: judul, pengarang, kategori, stok, harga, deskripsi, gambar).
- Komentar:
  - Gunakan upload file gambar dengan validasi type (JPG/PNG) dan size.
  - Backend cek unique title jika perlu (opsional).

### 5. User Management
- Nama halaman: `admin/users`
- Fungsi:
  - Tabel daftar user (nama, email, role, status, tanggal daftar).
  - Aksi:
    - View Detail (biodata, order history).
    - Update role (jika ada multi‑role).
    - Block / unblock user (soft ban).
- Komentar:
  - Jangan tampilkan password di admin; hanya SHA‑512 atau bcrypt hash.
  - Tambahkan tombol “Send Warning / Email” jika ada fitur email.

### 6. Order Management
- Nama halaman: `admin/orders`
- Fungsi:
  - Tabel semua pesanan dari semua user.
  - Kolom: order ID, user, tanggal, metode pembayaran, status, total.
  - Aksi per baris:
    - View Detail Pesanan.
    - Update status (misal: `Pending` → `Delivered`, `Cancelled`).
- Komentar:
  - Log perubahan status jika perlu (misal: `Status updated from Pending to Delivered by Admin X`).
  - Tambahkan filter berdasarkan status, tanggal, atau user.

### 7. Inbox / Messages (Contact)
- Nama halaman: `admin/messages`
- Fungsi:
  - Daftar pesan dari user (nama, email, subjek, tanggal).
  - Aksi:
    - Read message (baca detail).
    - Reply (opsional form balasan).
    - Delete / Mark as read.
- Komentar:
  - Jika ada email, bisa trigger auto‑reply; jika tidak ada, cukup mark sebagai dibaca.
  - Highlight pesan baru.

---

## Catatan Umum Best Practices

- Gunakan `PascalCase` untuk nama komponen (React/Vue), `kebab-case` untuk nama file view (`about-us.vue`, `book-list.tsx`).
- Setiap halaman:
  - Mempunyai `PageTitle` yang jelas.
  - Menggunakan `loader` saat fetch data.
  - Menampilkan error state (network error, 404, unauthorized).
- Gunakan `role` / `redirect` otomatis:
  - Jika user login sebagai admin, langsung redirect ke `/admin/dashboard`.
  - Jika user login sebagai user, redirect ke `/home`.
- Desain semua halaman responsif (mobile‑first atau responsive grid).
- Gunakan asset gambar/video dari sumber royalty‑free seperti Unsplash, Pexels, atau Pixabay.