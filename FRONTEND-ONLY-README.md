# RodaRaja Market - Frontend Only Version

Aplikasi ini sekarang **TIDAK MEMERLUKAN BACKEND**! Semua data disimpan di browser menggunakan localStorage.

## 🚀 Cara Menjalankan

1. **Masuk ke folder client-side:**
   ```bash
   cd client-side
   ```

2. **Install dependencies (jika belum):**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

4. **Buka browser:**
   - Aplikasi akan berjalan di: `http://localhost:5173`

## 👤 Akun Demo untuk Login

### Akun Penjual:
- **Email:** `penjual@test.com`
- **Password:** `123456`
- **Role:** Penjual (bisa buat listing)

### Akun Pembeli:
- **Email:** `pembeli@test.com`  
- **Password:** `123456`
- **Role:** Pembeli (hanya bisa lihat)

### Akun Dealer:
- **Email:** `dealer@test.com`
- **Password:** `123456`
- **Role:** Penjual

## ✨ Fitur yang Berfungsi

✅ **Login/Register** - Data disimpan di localStorage  
✅ **Lihat Listings** - Semua motor dan mobil  
✅ **Filter & Search** - Berdasarkan kategori, lokasi, harga, dll  
✅ **Buat Listing Baru** - Harus login sebagai penjual  
✅ **Edit Listing** - Update listing yang sudah ada  
✅ **Upload Foto** - Foto disimpan sebagai base64  
✅ **Detail Listing** - Lihat info lengkap kendaraan  

## 📸 Foto yang Tersedia

Foto-foto kendaraan ada di folder:
```
client-side/public/images/
```

Motor:
- pcx-160.svg
- nmax-155.svg
- sprint-150.svg
- gsx-r150.svg
- mt-15.svg
- vario-160.svg
- w175.svg

Mobil:
- avanza-2019.svg
- brio-2021.svg
- innova-2018.svg
- xenia-2020.svg

## 💾 Penyimpanan Data

- **Listings:** Disimpan di `localStorage` dengan key `rodaraja-listings`
- **Auth:** Disimpan di `localStorage` dengan key `rodaraja-auth`
- **Draft Form:** Disimpan di `localStorage` dengan key `sell-marketplace-draft-v1`

### Reset Data:
Jika ingin reset semua data ke awal:
```javascript
// Di browser console:
localStorage.clear()
// Lalu refresh halaman
```

## 🎨 Data Motor & Mobil yang Tersedia

### Motor (7 unit):
1. Honda PCX 160 CBS 2023 - Rp 31,800,000
2. Yamaha NMAX 155 Connected 2022 - Rp 29,500,000
3. Vespa Sprint 150 I-Get 2024 - Rp 43,900,000
4. Suzuki GSX-R150 2023 - Rp 35,500,000
5. Yamaha MT-15 2022 - Rp 33,200,000
6. Honda Vario 160 2023 - Rp 28,900,000
7. Kawasaki W175 2023 - Rp 32,500,000

### Mobil (4 unit):
1. Toyota Avanza G 2019 - Rp 165,000,000
2. Honda Brio RS 2021 - Rp 178,000,000
3. Toyota Innova Reborn 2018 - Rp 235,000,000
4. Daihatsu Xenia R 2020 - Rp 152,000,000

## 📝 Notes

- **Tidak perlu backend server** - Semua berjalan di frontend
- **Data persist di browser** - Selama tidak clear localStorage
- **Upload foto baru** - Akan disimpan sebagai base64 string
- **Cocok untuk demo/prototype** - Tidak production-ready

## 🔧 Troubleshooting

**Foto tidak muncul?**
- Pastikan file SVG ada di `client-side/public/images/`
- Check console browser untuk error
- Coba hard refresh (Ctrl+F5)

**Data hilang?**
- localStorage mungkin ter-clear
- Refresh halaman untuk load ulang mock data

**Login tidak berhasil?**
- Pastikan menggunakan email/password yang benar
- Cek console browser untuk error

## 🎯 Development

File penting yang diubah:
- `src/presentation/utils/api.ts` - Mock API (tidak pakai fetch)
- `src/infrastructure/data/listings.ts` - Data motor & mobil
- `src/infrastructure/data/users.ts` - Data user untuk login

Enjoy! 🎉
