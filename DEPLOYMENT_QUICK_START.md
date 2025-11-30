# Deployment Quick Start

**Choose your deployment method:**

---

## ⚡ Super Quick (2 Minutes) - Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
npm run build
vercel --prod

# Done! Your site is live
```

**Result:** `https://your-project.vercel.app`

---

## 📦 Using Helper Scripts

### Windows (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File deployment-helper.ps1

# Select option 4 for Vercel or 5 for Netlify
```

### Mac/Linux (Bash)
```bash
chmod +x deployment-helper.sh
./deployment-helper.sh

# Select option 4 for Vercel or 5 for Netlify
```

---

## 🔷 Vercel (Recommended)

### 1. Connect GitHub
```bash
git push origin main
# Go to vercel.com → New Project → Import from GitHub
```

### 2. Auto-Deploy
- Vercel automatically deploys on every push
- Production URL: `https://your-project.vercel.app`
- Custom domain: Update DNS settings

### 3. Environment Variables
```
Settings → Environment Variables
VITE_SUPABASE_URL = your_url
VITE_SUPABASE_ANON_KEY = your_key
```

---

## 🟧 Netlify (Alternative)

### 1. Build & Deploy
```bash
npm run build
netlify deploy --prod --dir=dist
```

### 2. Or Connect GitHub
- Go to netlify.com
- New site → GitHub
- Select repo
- Auto-deploy on push

### 3. Add Environment Variables
```
Site Settings → Build & Deploy → Environment
VITE_SUPABASE_URL = your_url
VITE_SUPABASE_ANON_KEY = your_key
```

---

## 🐳 Docker (Professional)

### Build & Run
```bash
# Build image
docker build -t infertility-cdss .

# Run locally
docker run -p 80:80 infertility-cdss

# Visit http://localhost
```

---

## ✅ Pre-Deploy Checklist

```bash
# 1. Build locally
npm run build

# 2. Test build
npm run preview

# 3. Check for errors
# Visit http://localhost:4173 and test everything

# 4. Commit changes
git add .
git commit -m "Ready for deployment"
git push

# 5. Deploy!
```

---

## 📊 Platform Comparison

| | Vercel | Netlify | AWS | Docker |
|---|---|---|---|---|
| **Ease** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | Free | Free | ~$5/mo | Variable |
| **Speed** | Fast | Fast | Very Fast | Custom |
| **Best for** | Quick deploy | Quick deploy | Production | Enterprise |

---

## 🔗 Next Steps

1. **Choose Platform:** Vercel (recommended)
2. **Build:** `npm run build`
3. **Deploy:** Follow platform instructions
4. **Test:** Verify everything works
5. **Monitor:** Check analytics/errors
6. **Share:** Give stakeholders the URL

---

## 📞 Common Questions

**Q: Will my data be lost?**  
A: No. It's stored in your database (Supabase or own server)

**Q: Can I use a custom domain?**  
A: Yes. All platforms support custom domains

**Q: How do I rollback?**  
A: Git revert and redeploy, or use platform's deployment history

**Q: Is HTTPS included?**  
A: Yes. Free SSL with Vercel/Netlify

---

**Ready to deploy? Choose Vercel and you'll be live in minutes!** 🚀
