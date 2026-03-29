# Vercel Deployment — 10-Minute Quickstart

**Goal:** Get your Scalar landing page live at a URL in 10 minutes.

---

## Prerequisites (2 minutes)

- [ ] GitHub account (free): https://github.com/signup
- [ ] Vercel account: https://vercel.com (sign up with GitHub)
- [ ] Git installed: `git --version` in terminal
- [ ] Node.js 16+: `node --version` in terminal

---

## Step 1: Set Up Locally (3 minutes)

Open terminal in the Scalar folder:

```bash
# Initialize Git
git init

# Set your Git identity (one time)
git config user.name "Your Name"
git config user.email "you@example.com"

# Install dependencies
npm install

# Test it works
npm run dev
```

Visit: **http://localhost:3000**

See the landing page? ✅ Great!

Press `Ctrl+C` to stop.

---

## Step 2: Push to GitHub (3 minutes)

Go to https://github.com/new

Create a new repo:
- **Name:** `scalar-landing`
- **Public**
- Click **Create**

GitHub shows you commands. Copy and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/scalar-landing.git
git branch -M main
git add .
git commit -m "Initial commit: Scalar landing page"
git push -u origin main
```

---

## Step 3: Deploy to Vercel (2 minutes)

Go to: https://vercel.com/dashboard

Click **Add New** → **Project**

Paste your repo URL:
```
https://github.com/YOUR_USERNAME/scalar-landing
```

Click the repo when it appears.

Click **Import**.

**Settings** (should auto-fill):
- Framework: Next.js ✓
- Root: ./ ✓

Click **Deploy**

Wait 1-2 minutes...

---

## Step 4: Done! 🎉

You'll see:
```
✓ Production
  https://scalar-landing-xxx.vercel.app
```

Click the URL → Your site is live!

---

## From Now On

Every time you make changes:

```bash
# Edit files locally
git add .
git commit -m "Describe your changes"
git push
```

Vercel auto-deploys. Done.

---

## Add Your Domain (Optional)

1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel: **Settings** → **Domains**
3. Add domain
4. Update DNS at your registrar (follow Vercel's instructions)

---

## Customize Your Site

Edit files and push:

- **Change colors:** Edit `tailwind.config.js`
- **Change copy:** Edit `components/ScalarLandingPage.js`
- **Change CTA destination:** Edit `pages/index.js`

See `CUSTOMIZATION_QUICK_START.md` for details.

---

## That's It!

You're live. Now:
1. Share the URL with people
2. Gather feedback
3. Iterate and improve
4. Plan your outreach

**Questions?** See full guide: `VERCEL_DEPLOYMENT.md`

---

**Status:** ✅ Ready to deploy
