# Deploy with OpenAI Integration

Your landing page now has **real AI chatbot** powered by OpenAI! Here's how to deploy it.

---

## What's New

✅ **Real AI Responses:** Chat uses GPT-3.5-turbo (OpenAI)
✅ **Context-Aware:** AI knows the business name, services, and industry
✅ **Works for Quick Actions:** Buttons also trigger real AI responses
✅ **Graceful Fallback:** If API fails, shows friendly fallback message

---

## Quick Setup (5 minutes)

### Step 1: Get OpenAI API Key

1. Go to: **https://platform.openai.com/api/keys**
2. Sign in (or create account)
3. Click **Create new secret key**
4. Copy the key (you won't see it again!)
5. Keep it safe - never commit it to GitHub

**Cost:** OpenAI charges per token (~$0.50 per 1M tokens for GPT-3.5-turbo)
- Typical chat response: ~100 tokens = ~$0.0005
- Testing won't cost much

### Step 2: Update Dependencies Locally

```bash
npm install
```

### Step 3: Test Locally (Optional)

Create `.env.local` in your Scalar folder:

```
OPENAI_API_KEY=sk-your-key-here
```

Then test:
```bash
npm run dev
```

Enter a domain, chat with the AI in the demo. Should respond with real AI!

**Don't commit `.env.local`** — it's in `.gitignore`

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add OpenAI integration for real AI chatbot"
git push
```

### Step 5: Add API Key to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Click your project
3. **Settings** → **Environment Variables**
4. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** (paste your OpenAI key)
5. Click **Save**

Vercel redeploys automatically. Done! ✅

---

## How It Works

### User Flow

```
1. User enters domain → Website scraped
2. Services extracted from real website
3. User types message in chat
   ↓
4. Frontend calls /api/chat endpoint
   ↓
5. Backend creates system prompt:
   "You are a receptionist for [Business Name]
   Services: [extracted services]
   Always try to book consultations"
   ↓
6. Calls OpenAI GPT-3.5-turbo
   ↓
7. AI generates contextual response
   ↓
8. Response displayed in chat
```

### Example

**Website scraped:** "Skin Beauty Clinic" with services: "Facials, Botox, Laser"

**User:** "What services do you offer?"

**AI Response:** "We specialize in facials, Botox, and laser treatments. Our treatments are designed to give you radiant, youthful skin. Would you like to book a consultation?"

The AI generates this contextually — not hardcoded!

---

## Costs

**OpenAI Pricing:**
- GPT-3.5-turbo: $0.50 per 1M input tokens + $1.50 per 1M output tokens
- Typical demo chat: 5-10 requests × 100-200 tokens each = ~$0.05-0.10

**For testing:** Completely free tier up to $5/month (usually covers hundreds of requests)

---

## What Changed

**Added files:**
- `pages/api/chat.js` — OpenAI chat endpoint

**Updated files:**
- `package.json` — Added `openai` dependency
- `components/ScalarLandingPage.js` — Chat now calls OpenAI API

**No breaking changes** — Still works without the key (shows fallback messages)

---

## Troubleshooting

### "API key not configured" error
- Check you added `OPENAI_API_KEY` to Vercel → Settings → Environment Variables
- Verify you copied the key correctly (should start with `sk-`)
- Redeploy after adding the key

### Chat shows "Sorry, I'm having trouble responding"
- Check OpenAI API key is valid
- Check your OpenAI account has credit/usage left
- Check Vercel build logs for errors
- Try again in a few moments

### Want to test before deploying?
Create `.env.local`:
```
OPENAI_API_KEY=sk-your-key
```

Then `npm run dev` locally. Delete `.env.local` before pushing to GitHub.

---

## Customizing the AI

The AI personality is defined in `pages/api/chat.js` function `createSystemPrompt()`.

To change behavior, edit this function. Examples:

**More sales-focused:**
```javascript
"Always encourage customers to book consultations.
Create urgency by mentioning limited availability."
```

**More friendly:**
```javascript
"Use casual language and lots of emojis.
Make conversations feel warm and personal."
```

**More professional:**
```javascript
"Keep responses professional and concise.
Use formal language and minimal emojis."
```

---

## Cost Monitoring

Monitor your OpenAI usage:

1. Go to: https://platform.openai.com/account/usage/overview
2. See total spend and daily breakdown
3. Set usage limits (Settings → Billing Limits)

Recommended: Set monthly limit to $10-20 to prevent surprises.

---

## Next Steps

1. ✅ Get OpenAI key
2. ✅ Push to GitHub
3. ✅ Add key to Vercel
4. ✅ Test live
5. (Optional) Customize AI behavior
6. (Optional) Monitor costs

---

## You're Now Running

✅ Real website scraper (Cheerio)
✅ Real AI chatbot (OpenAI GPT-3.5)
✅ Professional landing page (Next.js)
✅ Deployed on Vercel (auto-scaling)

This is a production-ready AI receptionist demo. Show this to prospects! 🚀

---

## Questions?

- OpenAI docs: https://platform.openai.com/docs
- Vercel env vars: https://vercel.com/docs/projects/environment-variables
- Project code: See `pages/api/chat.js` and `components/ScalarLandingPage.js`

Good luck! 🎉
