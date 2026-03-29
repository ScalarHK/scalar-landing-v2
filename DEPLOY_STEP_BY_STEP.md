# Deploy to Vercel - Copy & Paste Steps

I've set everything up. Here are the exact steps to deploy:

---

## On Your Local Machine (10 minutes)

### 1️⃣ Copy the project files to your computer

You have two options:

**Option A: Download as ZIP**
1. Go to the Scalar folder in the outputs
2. Download all files as ZIP
3. Unzip on your computer
4. Open terminal in that folder

**Option B: Clone from where you have them**
Just navigate to your existing Scalar folder

### 2️⃣ Install dependencies (2 min)

Open terminal in the Scalar folder and run:

```bash
npm install
```

### 3️⃣ Test it works (1 min)

```bash
npm run dev
```

Visit: **http://localhost:3000**

See your landing page? Press `Ctrl+C` to stop.

### 4️⃣ Create GitHub repository

Go to: **https://github.com/new**

Fill in:
- **Repository name:** `scalar-landing`
- **Description:** `AI Receptionist landing page`
- **Public** (click the radio button)
- **Create repository**

### 5️⃣ Push to GitHub (3 min)

GitHub will show you a code block that says "push an existing repository"

Copy those commands and run them in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/scalar-landing.git
git branch -M main
git add .
git commit -m "Initial commit: Scalar landing page"
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### 6️⃣ Deploy to Vercel (2 min)

1. Go to: **https://vercel.com/dashboard**
2. Click **Add New** → **Project**
3. Search for and click `scalar-landing` repo
4. Click **Import**
5. Vercel auto-detects Next.js ✓
6. Click **Deploy**
7. Wait 1-2 minutes

### 7️⃣ Done! 🎉

You'll see:
```
✓ Production
  https://scalar-landing-xxx.vercel.app
```

Click the URL. Your site is live!

---

## If Something Goes Wrong

### "npm install fails"
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### "git command not found"
Install Git: https://git-scm.com/downloads

### "Can't push to GitHub"
Make sure:
- You created the GitHub repo first
- You used YOUR_USERNAME (not literally "YOUR_USERNAME")
- You have push permission to the repo

### "Vercel deployment fails"
Check the build log:
1. Vercel dashboard → Deployments
2. Click the failed deployment
3. Look for error messages
4. Usually it's a missing dependency

---

## Copy-Paste Checklist

Have these open:

- [ ] Terminal in Scalar folder
- [ ] GitHub (https://github.com)
- [ ] Vercel (https://vercel.com/dashboard)

Run in order:

```bash
# 1. Install
npm install

# 2. Test
npm run dev
# Press Ctrl+C when done

# 3. Initialize git (if not done)
git init

# 4. Create GitHub repo at github.com/new
# Then run the commands GitHub gives you:

git remote add origin https://github.com/YOUR_USERNAME/scalar-landing.git
git branch -M main
git add .
git commit -m "Initial commit: Scalar landing page"
git push -u origin main

# 5. Go to Vercel dashboard
# Click Add New → Project
# Select scalar-landing
# Click Import → Deploy
# Wait 1-2 min
```

---

## That's It

After step 7, you're live. Share the Vercel URL with anyone.

**To make changes later:**
```bash
# Edit files locally
# Then:
git add .
git commit -m "Your change"
git push

# Vercel auto-deploys in 1-2 minutes
```

---

## Need Help?

- **Deployment issues:** See `VERCEL_DEPLOYMENT.md`
- **Customize colors/copy:** See `CUSTOMIZATION_QUICK_START.md`
- **Project structure:** See `PROJECT_STRUCTURE.md`
- **Design decisions:** See `ARCHITECTURE_NOTES.md`

---

**Status:** Ready to deploy
**Time needed:** 10 minutes
**Difficulty:** Copy & paste
