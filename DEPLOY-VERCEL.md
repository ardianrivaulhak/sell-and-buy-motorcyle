# 🚀 Deploy ke Vercel

Panduan lengkap untuk deploy RodaRaja Market ke Vercel.

## 📋 Prasyarat

1. **Akun Vercel** - Daftar gratis di [vercel.com](https://vercel.com)
2. **Git Repository** - Push code ke GitHub, GitLab, atau Bitbucket
3. **Vercel CLI** (opsional) - Untuk deploy via terminal

## 🌐 Metode 1: Deploy via Vercel Dashboard (Paling Mudah)

### Langkah 1: Push ke Git Repository

```bash
# Dari folder sell-and-buy-motorcyle
cd client-side
git init
git add .
git commit -m "Initial commit - RodaRaja Market"

# Buat repository baru di GitHub, lalu:
git remote add origin https://github.com/username/rodaraja-market.git
git branch -M main
git push -u origin main
```

### Langkah 2: Import ke Vercel

1. Login ke [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository:**
   - Pilih GitHub/GitLab/Bitbucket
   - Cari repository Anda
   - Click **"Import"**

### Langkah 3: Configure Project

**Framework Preset:** Vite

**Root Directory:** 
- Jika repo hanya `client-side`: biarkan kosong
- Jika repo full project: set ke `client-side`

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:** (tidak perlu, karena tidak ada backend)

### Langkah 4: Deploy!

Click **"Deploy"** dan tunggu 1-2 menit.

Selesai! 🎉 Aplikasi Anda akan live di: `https://rodaraja-market-xxx.vercel.app`

---

## 💻 Metode 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
cd client-side
vercel
```

Ikuti prompt:
- **Set up and deploy?** → Yes
- **Which scope?** → Pilih akun Anda
- **Link to existing project?** → No
- **Project name?** → `rodaraja-market`
- **Directory?** → `./` (current directory)
- **Override settings?** → No

### Deploy Production

```bash
vercel --prod
```

---

## 🔧 Konfigurasi Lanjutan

### Custom Domain

1. Buka project di Vercel Dashboard
2. Go to **Settings** → **Domains**
3. Add domain Anda
4. Update DNS records sesuai instruksi

### Environment Variables

Jika nanti butuh env variables:
1. Go to **Settings** → **Environment Variables**
2. Add key-value pairs
3. Redeploy

---

## 📁 Struktur Project untuk Vercel

```
client-side/
├── public/
│   └── images/           # Foto kendaraan
│       ├── pcx-160.svg
│       ├── nmax-155.svg
│       └── ...
├── src/
│   ├── presentation/
│   ├── infrastructure/
│   └── ...
├── index.html
├── package.json
├── vite.config.js
└── vercel.json           # ✅ Sudah dibuat
```

---

## ✅ Verifikasi Deploy

Setelah deploy, test:

1. **Homepage** - Harus load listings
2. **Login** - Coba dengan `penjual@test.com` / `123456`
3. **Foto** - Semua gambar harus muncul
4. **Create Listing** - Login dulu, lalu buat listing
5. **Filter & Search** - Test semua filter

---

## 🐛 Troubleshooting

### Foto tidak muncul?
- Check apakah folder `public/images` ada di repository
- Pastikan path foto di code: `/images/xxx.svg` (bukan `./images`)

### Routing tidak berfungsi (404)?
- Check `vercel.json` ada rewrite rules
- Pastikan ada: `"destination": "/index.html"`

### Build gagal?
- Check `package.json` dependencies
- Pastikan `npm run build` berhasil lokal dulu
- Check build logs di Vercel dashboard

### localStorage tidak persist?
- Ini normal - localStorage per-browser/per-device
- User harus login di setiap device

---

## 🔄 Update Aplikasi

Setiap kali push ke GitHub:
```bash
git add .
git commit -m "Update: fitur baru"
git push
```

Vercel akan **auto-deploy** 🎉

---

## 📊 Analytics & Monitoring

Vercel menyediakan:
- **Analytics** - Page views, visitors
- **Speed Insights** - Performance metrics
- **Logs** - Runtime logs

Akses di: Dashboard → Project → Analytics/Logs

---

## 💰 Pricing

**Hobby (Free):**
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth/month
- Custom domains

**Pro ($20/month):**
- More bandwidth
- Team features
- Priority support

Untuk project ini, **Free tier sudah cukup!** ✅

---

## 🎯 Quick Deploy Commands

```bash
# One-time setup
cd client-side
npm install -g vercel
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployment
vercel ls
```

---

## 📝 Catatan Penting

1. ✅ **Tidak perlu backend** - Aplikasi full frontend
2. ✅ **Data di localStorage** - Persist per-browser
3. ✅ **Foto sudah include** - Di folder public/images
4. ✅ **Free hosting** - Vercel Hobby tier
5. ✅ **Auto SSL** - HTTPS gratis dari Vercel

---

## 🔗 Links Berguna

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

---

**Happy Deploying!** 🚀
