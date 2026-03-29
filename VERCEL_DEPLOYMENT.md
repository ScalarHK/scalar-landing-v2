# Deploy Scalar Landing Page to Vercel

## Overview
This guide will take you through deploying the Scalar landing page to Vercel in **5-10 minutes**.

**TL;DR:** Push to GitHub → Connect to Vercel → Done. Auto-deploys on every push.

---

## Prerequisites

You'll need:
- ✅ GitHub account (free at github.com)
- ✅ Vercel account (free at vercel.com, sign up with GitHub)
- ✅ Git installed on your computer (`git --version`)
- ✅ Node.js installed (`node --version` should be 16+)

---

## Step 1: Clone This Project (or Initialize Git)

### Option A: If you already have this code locally

Navigate to the Scalar folder:
```bash
cd /path/to/Scalar
```

Initialize git (one time only):
```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Option B: If you need to download/set up from scratch

Clone the repo (if you have it on GitHub already):
```bash
git clone https://github.com/yourusername/scalar-landing.git
cd scalar-landing
```

---

## Step 2: Install Dependencies

Run this once to install all required packages:

```bash
npm install
```

This installs:
- Next.js
- React
- Tailwind CSS
- lucide-react (icons)

**Expected time:** 1-2 minutes

---

## Step 3: Test Locally (Optional but Recommended)

Before deploying, test that everything works:

```bash
npm run dev
```

This starts a local server at `http://localhost:3000`

Open in your browser and verify:
- ✅ Hero page loads
- ✅ Can enter a domain
- ✅ Loading animation works
- ✅ Demo chatbot appears
- ✅ Mobile responsive

Stop the server: Press `Ctrl+C`

---

## Step 4: Create GitHub Repository

### 4a. Create a new repo on GitHub

1. Go to **https://github.com/new**
2. Repository name: `scalar-landing` (or your choice)
3. Description: "AI Receptionist landing page for Scalar"
4. Choose: **Public** (easier to share)
5. Click **Create repository**

### 4b. Add files to Git and push

Copy the commands from GitHub's "...or push an existing repository from the command line" section. They'll look like this:

```bash
git remote add origin https://github.com/yourusername/scalar-landing.git
git branch -M main
git add .
git commit -m "Initial commit: Scalar landing page"
git push -u origin main
```

Run these commands in your terminal from the Scalar folder.

**What this does:**
- Connects your local folder to GitHub
- Stages all files
- Creates initial commit
- Pushes to GitHub

**Expected time:** 30 seconds (first time) → GitHub push takes a few seconds

---

## Step 5: Connect to Vercel (The Deploy Part)

### 5a. Sign in to Vercel

Go to **https://vercel.com** and click **Sign Up**
- Choose "Continue with GitHub"
- Authorize Vercel to access your GitHub account
- You'll be logged in

### 5b. Create a new project

1. Click **Add New...** → **Project**
2. Under "Import Git Repository", paste: `https://github.com/yourusername/scalar-landing`
   - (Or click the repo if it appears in the list)
3. Click **Import**

### 5c. Configure Project

Vercel should auto-detect it's a Next.js project. You'll see:

**Project Name:** `scalar-landing` (or change it)
**Framework Preset:** Next.js ✓
**Root Directory:** `./` ✓

**Environment Variables:** (Leave blank for now)

Click **Deploy**

**Expected time:** 1-2 minutes (Vercel builds and deploys)

---

## Step 6: Your Site is Live! 🎉

Once deployment completes, you'll see:

```
✓ Production
  https://scalar-landing-yourusername.vercel.app
```

Click the URL to view your live site.

---

## Next Deployments (Super Easy)

From now on, every time you push to GitHub, Vercel auto-deploys:

```bash
# Make changes locally
nano ScalarLandingPage.jsx  # or edit in your editor

# Stage, commit, push
git add .
git commit -m "Update headline copy"
git push
```

Vercel automatically detects the push and redeploys. Check status at **vercel.com/dashboard**

---

## Custom Domain (Optional)

Want `yourdomain.com` instead of the Vercel subdomain?

### In Vercel Dashboard

1. Go to your project
2. Click **Settings**
3. Click **Domains**
4. Click **Add Domain**
5. Enter your domain name
6. Follow DNS setup instructions (domain provider specific)

**Cost:** Domain varies ($10-15/year), Vercel hosting is free

---

## Troubleshooting

### Build Failed?

Check the build logs:
1. Go to Vercel dashboard
2. Click your project
3. Click **Deployments**
4. Find the failed deploy
5. Click it to see the error

**Common issues:**
- Missing dependencies → Run `npm install` locally, commit, push again
- Node version → Vercel uses Node 18 by default (should work)
- Port already in use → Just affects local testing, not deployment

### Site shows blank page?

1. Check browser console for errors (F12 → Console tab)
2. Check Vercel build logs
3. Verify `pages/index.js` imports the component correctly

### Want to rollback to previous version?

1. Go to Vercel dashboard
2. Click **Deployments**
3. Find the version you want
4. Click the **...** menu
5. Click **Promote to Production**

---

## Environment Variables (When You Add Backend)

When you later connect to n8n or your own API, you'll need environment variables.

### Add to Vercel

1. Go to project **Settings**
2. Click **Environment Variables**
3. Add key/value pairs:
   - `NEXT_PUBLIC_API_URL=https://api.example.com`
   - `SECRET_KEY=your_secret_value`
4. Redeploy (push a commit to GitHub)

### In your code

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

**Note:** Variables starting with `NEXT_PUBLIC_` are visible in browser (use for public URLs)

---

## Analytics & Monitoring

### View traffic in Vercel

1. Go to your project dashboard
2. Click **Analytics**
3. See: page views, unique visitors, response times

### Add Google Analytics

In `pages/index.js`, add:

```jsx
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `,
        }}
      />
      {/* rest of page */}
    </>
  )
}
```

Replace `GA_MEASUREMENT_ID` with your Google Analytics ID.

---

## SSL Certificate (HTTPS)

✅ **Already handled!** Vercel automatically provides free SSL for all projects.

Your site is secure (https://) out of the box.

---

## Git Workflow (Going Forward)

After initial setup, the workflow is:

```bash
# 1. Make changes
# (Edit ScalarLandingPage.js, package.json, etc.)

# 2. Test locally
npm run dev
# Test at http://localhost:3000

# 3. Commit and push
git add .
git commit -m "Brief description of changes"
git push

# 4. Vercel auto-deploys
# Check status at vercel.com/dashboard
```

---

## Project File Structure (For Reference)

```
scalar-landing/
├── pages/
│   ├── _app.js                  ← Global config
│   ├── _document.js             ← HTML wrapper
│   └── index.js                 ← Main page (home route)
├── components/
│   └── ScalarLandingPage.js     ← Landing page component
├── styles/
│   └── globals.css              ← Global styles
├── public/                       ← Static files (images, etc.)
├── package.json                 ← Dependencies list
├── tailwind.config.js           ← Tailwind config
├── postcss.config.js            ← PostCSS config
├── next.config.js               ← Next.js config
├── .gitignore                   ← Files to ignore in Git
└── README.md                    ← Project documentation
```

---

## Performance Checklist

After deploying, check:

- [ ] **Load time:** Should be < 2 seconds
  - Check: Vercel dashboard → Analytics
- [ ] **Mobile:** Works on phone
  - Test: Resize browser or use phone
- [ ] **SEO:** Meta tags correct
  - Check: View page source, look for `<title>` and `<meta>`
- [ ] **Lighthouse score:** 85+
  - Check: F12 → Lighthouse tab
- [ ] **No errors:** Console clean
  - Check: F12 → Console, should show no red errors

---

## Common Next Steps

### 1. Add your domain
See "Custom Domain" section above

### 2. Set up email capture
When user clicks CTA, capture email and send to your database/CRM

### 3. Connect to backend
When you're ready, add API calls to scrape websites and generate real data

### 4. Add analytics
Set up Google Analytics or Mixpanel to track user behavior

### 5. A/B testing
Try different headlines, colors, CTA text. Measure which converts better.

---

## Support & Resources

- **Vercel docs:** https://vercel.com/docs
- **Next.js docs:** https://nextjs.org/docs
- **Tailwind docs:** https://tailwindcss.com/docs
- **GitHub help:** https://docs.github.com

---

## Quick Commands Reference

```bash
# Local development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server

# Git workflow
git status               # See what's changed
git add .                # Stage all changes
git commit -m "message"  # Create commit
git push                 # Push to GitHub (triggers Vercel deploy)
git log                  # See commit history
git diff                 # See what changed
```

---

## You're Done! 🚀

Your Scalar landing page is now live on the internet.

**Next:** Share the Vercel URL with people, test with real users, gather feedback, and plan your go-to-market campaign.

**Questions?** Check Vercel's support at vercel.com/support or Next.js docs at nextjs.org/docs

---

**Last Updated:** 2026-03-29
**Status:** Ready for deployment
