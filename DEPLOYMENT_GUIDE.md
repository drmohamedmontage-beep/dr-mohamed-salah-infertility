# Deployment Guide - Infertility CDSS

Complete step-by-step instructions to deploy your application to production.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Git (optional)

### Deploy to Vercel (Easiest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel

# Follow prompts and your app will be live!
```

**✅ Done!** Your app is live at a Vercel URL

---

## 📋 Deployment Options

Choose based on your needs:

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| **Vercel** | ⭐ Easy | Free tier | Quick deployment |
| **Netlify** | ⭐ Easy | Free tier | Static hosting |
| **GitHub Pages** | ⭐⭐ Medium | Free | Public sites |
| **AWS S3** | ⭐⭐ Medium | ~$1/month | Scalable |
| **Docker** | ⭐⭐⭐ Hard | Variable | Professional |

---

## 🔵 Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Your Project
```bash
cd "c:\Users\Tbark\Desktop\اختبار"

# Make sure everything is built
npm run build

# Check build succeeded (should see dist/ folder)
ls dist
```

### Step 2: Deploy

**Option A: Using CLI (Simplest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# When prompted:
# - Link to existing project? → No
# - Set project name → "infertility-cdss"
# - Choose framework → Other
# - Root directory → ./
# - Output directory → dist/
```

**Option B: Using GitHub**
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy: Infertility CDSS v0.2.0"
git push origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Select your GitHub repo
# 5. Click Deploy

# Vercel automatically deploys on every push!
```

### Step 3: Configure Environment (if using Supabase)

After deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_key
   ```
5. Redeploy

### Step 4: Test Live Site
- Your site is now live at: `https://infertility-cdss.vercel.app`
- Changes pushed to GitHub automatically deploy

---

## 🟦 Option 2: Deploy to Netlify

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Deploy

**Option A: Using Netlify CLI**
```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# You'll get a live URL immediately!
```

**Option B: Using Web UI**
1. Go to netlify.com
2. Click "Add new project" → "Deploy manually"
3. Drag & drop the `dist/` folder
4. Done! 🎉

### Step 3: Set Environment Variables
1. Go to Site Settings → Build & Deploy
2. Add environment variables:
   ```
   VITE_SUPABASE_URL = ...
   VITE_SUPABASE_ANON_KEY = ...
   ```

---

## 🟨 Option 3: Deploy to AWS S3

### Step 1: Create S3 Bucket
```bash
# Using AWS CLI
aws s3 mb s3://infertility-cdss

# Enable static website hosting
aws s3 website s3://infertility-cdss/ \
  --index-document index.html \
  --error-document index.html
```

### Step 2: Build and Upload
```bash
# Build locally
npm run build

# Upload to S3
aws s3 sync dist/ s3://infertility-cdss/ --delete

# Make files public
aws s3api put-bucket-policy --bucket infertility-cdss \
  --policy file://policy.json
```

### Step 3: Get URL
```bash
# Your site is at:
http://infertility-cdss.s3-website.amazonaws.com
```

---

## 🐳 Option 4: Docker Deployment (Professional)

### Step 1: Create Dockerfile
```dockerfile
# Use Node.js for building
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use nginx to serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

### Step 3: Build & Deploy
```bash
# Build Docker image
docker build -t infertility-cdss .

# Run locally
docker run -p 80:80 infertility-cdss

# Deploy to Docker Hub or cloud platform
docker tag infertility-cdss yourname/infertility-cdss
docker push yourname/infertility-cdss
```

---

## 🔧 Pre-Deployment Checklist

Before deploying, verify:

- [ ] **Build succeeds:** `npm run build` completes without errors
- [ ] **No console errors:** Check browser console for errors
- [ ] **Responsive design:** Test on mobile/tablet/desktop
- [ ] **Arabic support:** Verify RTL layout works
- [ ] **Print works:** Test print functionality
- [ ] **Search functions:** Medicine search works
- [ ] **All links work:** Navigation works correctly
- [ ] **Database config:** If using Supabase, credentials are correct
- [ ] **Environment vars:** Set in deployment platform
- [ ] **Performance:** Run Lighthouse audit (DevTools)

---

## 🧪 Testing Before Deployment

### Local Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Visit http://localhost:4173
# Test everything thoroughly
```

### Lighthouse Audit
```bash
# In DevTools (F12):
# 1. Go to Lighthouse tab
# 2. Click "Analyze page load"
# 3. Aim for scores > 90
```

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 📊 Deployment Comparison

### Build Output
```
dist/
├── assets/
│   ├── index-[hash].js (~50KB gzipped)
│   ├── style-[hash].css (~20KB gzipped)
│   └── icons/
├── index.html (~2KB)
└── favicon.ico

Total: ~70-100KB
```

### Performance Targets
- **LCP (Largest Contentful Paint):** < 2.5s ✅
- **FID (First Input Delay):** < 100ms ✅
- **CLS (Cumulative Layout Shift):** < 0.1 ✅

---

## 🌍 Domain Setup (After Deployment)

### Connect Custom Domain to Vercel

1. **Buy domain** (Godaddy, Namecheap, etc.)
2. **Add to Vercel:**
   - Project Settings → Domains
   - Enter your domain: `obgyn-clinic.com`
3. **Update DNS:**
   - Vercel shows DNS records to add
   - Update records at your registrar
4. **Wait for DNS propagation** (can take 24-48 hours)

### SSL Certificate
- Vercel automatically provides free SSL
- Your site is secure at `https://obgyn-clinic.com`

---

## 🔐 Security Checklist

Before going live:

- [ ] **HTTPS enabled** ✅ (automatic with Vercel/Netlify)
- [ ] **CORS configured** (if calling external APIs)
- [ ] **API keys hidden** in environment variables
- [ ] **No hardcoded secrets** in code
- [ ] **Content Security Policy** set
- [ ] **Rate limiting** configured (if needed)
- [ ] **Data validation** on inputs
- [ ] **Password hashing** (if authentication added)

---

## 📈 Monitoring & Analytics

### After Deployment

**Add Google Analytics:**
```html
<!-- In index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

**Vercel Analytics:**
- Automatically tracks performance metrics
- View in Vercel Dashboard → Analytics

**Error Tracking:**
- Set up Sentry for error monitoring
- Get alerts for production issues

---

## 🚨 Troubleshooting Deployment

### Problem: Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Problem: 404 on Refresh
**Solution:** Add redirect rule

**Vercel:** Create `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:** Create `_redirects`
```
/*  /index.html  200
```

### Problem: Slow Performance
- Enable gzip compression
- Minify assets (Vite does this)
- Optimize images
- Use CDN (included with Vercel/Netlify)

### Problem: Environment Variables Not Working
```bash
# Vercel: Redeploy after setting env vars
vercel env pull  # Download env vars locally
vercel redeploy

# Netlify: Same - redeploy after setting
netlify deploy --prod
```

---

## 📱 Mobile App Alternative

If you want a mobile app:

### Option 1: React Native (Code sharing)
```bash
npx create-react-native-app infertility-app
# Share components/logic with web version
```

### Option 2: Capacitor (Web wrapper)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npx cap open ios  # Build in Xcode
```

### Option 3: PWA (Progressive Web App)
```bash
# Add to web manifest
npm install workbox-vite

# Users can "Install" from browser
```

---

## 💾 Database Deployment (Supabase)

### Option 1: Cloud Supabase (Recommended)
```bash
# 1. Create account at supabase.com
# 2. New Project → PostgreSQL
# 3. Import schema:
   - SQL Editor → New Query
   - Paste supabase_schema.sql
   - Run

# 4. Seed data:
   - Paste supabase_seed.sql
   - Run

# 5. Get credentials:
   - Settings → API
   - Copy URL and ANON_KEY

# 6. Add to environment variables:
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=...
```

### Option 2: Self-Hosted PostgreSQL
```bash
# Digital Ocean, AWS RDS, or self-hosted
# Export connection string
DATABASE_URL=postgresql://user:pass@host:5432/db

# Use with Supabase or direct connection
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Deployment Support

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build timeout | Increase timeout in settings |
| Out of memory | Use production build settings |
| Slow uploads | Use CDN / Content Delivery |
| CORS errors | Configure CORS headers |
| 404 errors | Add redirect rules |

---

## ✅ Deployment Checklist

- [ ] Code is committed and pushed
- [ ] `npm run build` succeeds locally
- [ ] Environment variables configured
- [ ] Database is set up (if using)
- [ ] Testing completed
- [ ] Security review done
- [ ] Performance optimized
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Team notified

---

## 🎉 You're Ready!

Your application is production-ready. Choose your deployment platform and go live! 

### Next Steps:
1. **Choose platform** (Vercel recommended)
2. **Follow deployment steps** above
3. **Test live site** thoroughly
4. **Share with stakeholders**
5. **Monitor performance**

---

**Version:** 0.2.0  
**Status:** Ready for Production ✅  
**Last Updated:** December 2025

For questions, refer to specific platform docs or contact support.
