# 🚀 Quick Deploy Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Git Repository

```bash
# If not initialized yet
git init

# Add all files
git add .

# Commit
git commit -m "Ready to deploy"

# Push to GitHub (create repo first at github.com)
git remote add origin https://github.com/YOUR_USERNAME/rodaraja-market.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client-side` (or leave empty if this folder is root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**

✅ Done! Your app will be live in ~2 minutes.

---

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to client-side folder
cd client-side

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 🔍 Post-Deploy Checklist

After deployment, test these:

- [ ] Homepage loads with all listings
- [ ] Images appear correctly
- [ ] Login works (penjual@test.com / 123456)
- [ ] Create new listing (must login first)
- [ ] Edit existing listing
- [ ] Filter and search functionality
- [ ] Mobile responsive

---

## 🌍 Your Live URL

Vercel will give you a URL like:
- `https://rodaraja-market.vercel.app`
- `https://your-project-name.vercel.app`

You can add a custom domain in Vercel settings.

---

## 🔄 Update Deployed App

Every time you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically redeploy! 🎉

---

## Demo Accounts

Share these with users:

**Seller Account:**
- Email: penjual@test.com
- Password: 123456

**Buyer Account:**
- Email: pembeli@test.com
- Password: 123456

---

## 📁 What Gets Deployed

```
✅ All source code (src/)
✅ Public assets (public/images/)
✅ Build output (dist/)
✅ Configuration files
❌ node_modules (rebuilt on Vercel)
❌ .env files (set in Vercel dashboard)
```

---

## 💡 Tips

1. **Test build locally first:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check build size:**
   - Keep under 100MB for fast deploys
   - Optimize images if needed

3. **Environment:**
   - Currently no env vars needed
   - All data in localStorage

---

## ⚡ Performance

Expected performance on Vercel:
- **First Load:** < 2s
- **Lighthouse Score:** 90+
- **Global CDN:** Yes
- **HTTPS:** Automatic

---

## 🆘 Need Help?

Check `DEPLOY-VERCEL.md` for detailed troubleshooting.

**Common Issues:**
- Build fails → Check `npm run build` locally
- 404 errors → Check `vercel.json` rewrites
- Images missing → Verify `public/images/` in repo

---

**Ready to deploy? Let's go!** 🚀
