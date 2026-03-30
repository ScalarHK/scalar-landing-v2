# Scalar AI: Complete Deployment Guide

---

## PHASE 1: WEBSITE DEPLOYMENT (Day 1)

### Option A: Deploy on Vercel (Recommended - Free)
1. Go to vercel.com, sign up with GitHub
2. Clone your repo: `git clone [your-repo-url]`
3. Run: `npm install && npm run build`
4. Deploy: `vercel --prod`
5. Get domain: `https://scalar-[yourname].vercel.app`
6. (Optional) Buy custom domain at vercel.com (10 HKD/month)

### Option B: Deploy on Netlify
1. Go to netlify.com, sign up
2. Connect your GitHub repo
3. Build command: `npm run build`
4. Deploy directory: `dist/` or `build/`
5. Automatic deployment on every push

### Option C: Self-hosted on Your Server
1. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
2. Clone repo and install: `npm install`
3. Build: `npm run build`
4. Start server: `npm start` or `pm2 start app.js`
5. Point domain to your server IP

---

## PHASE 2: CONNECT SUPABASE (Already Done)

Your Supabase instance is already set up (you provided credentials).

Verify it's working:
```bash
npm install @supabase/supabase-js

# Test connection
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY');
const { data } = await supabase.from('leads').select('*').limit(1);
console.log(data); // Should return data if connected
```

---

## PHASE 3: CHATBOT INTEGRATION (Day 2)

### Step 1: Get Retell AI Credentials
1. Go to retell.ai
2. Sign up for account
3. Create new "Agent"
4. Name it: "Scalar AI Receptionist"
5. Set language model: GPT-4
6. Copy: Agent ID, API Key

### Step 2: Configure Chatbot
In `scalar-website.jsx`, update:
```javascript
const RETELL_AGENT_ID = "YOUR_AGENT_ID";
const RETELL_API_KEY = "YOUR_API_KEY";
```

### Step 3: Test Chatbot
1. Go to your website
2. Click "Try Your Chatbot"
3. Start conversation: "I want to book an appointment"
4. Verify it responds correctly

### Step 4: Deploy Chatbot to WATI (for clients)
WATI is your WhatsApp integration for salon clients.

1. Go to wati.io
2. Create account
3. Connect WhatsApp Business Account
4. Get Tenant ID + API Key
5. In n8n, create WATI credential:
   - URL: https://api.wati.io/api/v1
   - Tenant ID: [your-tenant-id]
   - Auth Token: [your-auth-token]

---

## PHASE 4: PAYMENT PROCESSING (Day 2)

### Stripe Setup for Subscriptions

1. Go to stripe.com, create account
2. Get: Publishable Key, Secret Key
3. Create product: "Scalar AI Monthly"
4. Create price: 20,000 HKD, recurring, monthly
5. Store in your environment variables

In your website code:
```javascript
const STRIPE_KEY = "pk_live_YOUR_KEY";

// On "Upgrade" button click:
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  body: JSON.stringify({
    priceId: 'price_YOUR_MONTHLY_PRICE',
    email: user.email,
    customerId: user.id
  })
});
```

---

## PHASE 5: EMAIL AUTOMATION (Day 3)

### Option A: Resend (Recommended)
1. Go to resend.io
2. Create account
3. Verify domain (add DNS records)
4. Get API key
5. In n8n, create Resend credential:
   - API Key: [your-api-key]
   - From Email: noreply@scalar.com

### Option B: SendGrid
1. Go to sendgrid.com
2. Create account
3. Get API key
4. In n8n, add SendGrid credential

### Email Template Setup
Create email templates in Resend/SendGrid:

**Email 1: Demo Completion**
- Subject: "Your salon's chatbot just booked 3 appointments for you 🎯"
- Body: [Use template from email-sequences-sales-scripts.md]
- CTA: [Link to schedule call]

**Email 2: Trial Start**
- Subject: "Your Scalar setup is live 🚀"
- Body: [Setup instructions]

**Email 3: Trial Day 5**
- Subject: "How's Scalar performing?"

**Email 4: Trial Day 10**
- Subject: "[Business Name] – Your bookings through Scalar"
- Include: Real data from Supabase query

**Email 5: Trial Day 13**
- Subject: "Trial expires in 24 hours"

---

## PHASE 6: SMS AUTOMATION (Day 3)

### Twilio SMS Setup
1. Go to twilio.com
2. Create account
3. Get: Account SID, Auth Token, Phone Number
4. In n8n, create Twilio credential:
   - Account SID: [your-sid]
   - Auth Token: [your-token]
   - Phone Number: +852XXXXXXXXX

### SMS Templates
Save these as variables in n8n:

**SMS 1: Post-Demo**
"Hi [Name], thanks for trying Scalar's chatbot demo! See how many bookings you could capture? Let's chat Friday. Reply YES to confirm. – James, Scalar"

**SMS 2: Trial Reminder**
"[Name], quick question: Did the chatbot demo resonate with your business? Reply with any questions. – James"

---

## PHASE 7: CRMS + LEAD DATABASE (Day 3)

### Your Supabase Schema (Already Created)

Verify these tables exist:

```sql
-- Table 1: leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  business_type TEXT,
  demo_completed_date TIMESTAMP,
  source TEXT,
  status TEXT, -- 'demo_completed', 'trial_active', 'trial_paused', 'paid_customer'
  created_at TIMESTAMP
);

-- Table 2: customers (paid users)
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  customer_id TEXT, -- Stripe customer ID
  business_name TEXT,
  business_type TEXT,
  phone TEXT,
  email TEXT,
  subscription_status TEXT,
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  monthly_cost NUMERIC,
  created_at TIMESTAMP
);

-- Table 3: bookings (captured by chatbot)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  salon_id TEXT,
  customer_id UUID REFERENCES customers(id),
  client_phone TEXT,
  client_name TEXT,
  service TEXT,
  date_time TIMESTAMP,
  status TEXT, -- 'confirmed', 'completed', 'no_show', 'cancelled'
  source TEXT,
  created_at TIMESTAMP
);

-- Table 4: trial_metrics (daily tracking during trial)
CREATE TABLE trial_metrics (
  id UUID PRIMARY KEY,
  trial_id TEXT,
  bookings_captured INTEGER,
  revenue_recovered NUMERIC,
  avg_response_time NUMERIC,
  no_show_rate NUMERIC,
  user_engagement NUMERIC,
  created_at TIMESTAMP
);

-- Table 5: customer_health (churn risk assessment)
CREATE TABLE customer_health (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  health_score INTEGER,
  total_bookings_captured INTEGER,
  total_revenue_recovered NUMERIC,
  churn_risk TEXT, -- 'low', 'medium', 'high'
  last_reviewed_at TIMESTAMP,
  next_review_at TIMESTAMP
);

-- Table 6: events (analytics tracking)
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id TEXT,
  event TEXT, -- 'demo_opened', 'demo_completed', 'trial_started', etc.
  event_data JSONB,
  created_at TIMESTAMP
);
```

All tables should already exist. Verify:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

---

## PHASE 8: N8N WORKFLOW SETUP (Day 4-5)

### Install n8n Locally (for testing)
```bash
npm install -g n8n
n8n start
# Opens at http://localhost:5678
```

### Or Use n8n Cloud
1. Go to n8n.io
2. Create account
3. Go to "Workflows"
4. Create new workflow

### Set Up Credentials in n8n

**Credential 1: Supabase**
- Name: Supabase (Scalar)
- Host: qnzaiplsqgiywfaebyrj.supabase.co
- Database: postgres
- User: postgres
- Password: [your-password]
- Port: 5432
- Test connection

**Credential 2: Resend Email**
- Name: Resend
- API Key: [your-resend-api-key]

**Credential 3: Twilio SMS**
- Name: Twilio
- Account SID: [your-account-sid]
- Auth Token: [your-auth-token]

**Credential 4: Stripe**
- Name: Stripe
- API Key: [your-stripe-secret-key]

**Credential 5: WATI**
- Name: WATI
- Base URL: https://api.wati.io
- Tenant ID: [your-tenant-id]
- Auth Token: [your-auth-token]

### Deploy Workflows

1. Copy workflow code from `n8n-workflows-analytics.md`
2. In n8n, create new node for each step
3. Connect credentials
4. Test each workflow
5. Set to "Active"

---

## PHASE 9: ANALYTICS SETUP (Day 5)

### Google Analytics 4

1. Go to analytics.google.com
2. Create new account
3. Create new property: "Scalar AI"
4. Get: Measurement ID (G-XXXXXX)
5. Add to your website header:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```

### Track Custom Events

In your React code:
```javascript
// When demo completes
gtag('event', 'demo_completed', {
  user_name: name,
  business_type: businessType
});

// When trial starts
gtag('event', 'trial_started', {
  customer_id: id,
  business_name: businessName
});

// When user upgrades
gtag('event', 'paid_signup', {
  revenue: 20000,
  currency: 'HKD'
});
```

### Looker Studio Dashboard

1. Go to datastudio.google.com
2. Create new report
3. Connect to Google Analytics 4 data source
4. Build dashboards:
   - Funnel analysis (visitor → demo → trial → paid)
   - Traffic sources
   - Industry performance
   - Revenue tracking

---

## PHASE 10: DOMAIN + LAUNCH (Day 6)

### Buy Domain
1. Go to godaddy.com or namecheap.com
2. Search: scalar.com.hk or scalai.hk
3. Buy for 1 year
4. Point DNS to your hosting (Vercel, Netlify, or your server)

### Update Email
1. Create email: james@scalar.com.hk (via Resend)
2. Update all email templates
3. Update phone signature in SMS

### Launch Checklist

- [ ] Website live and SSL certificate active (https://)
- [ ] Chatbot demo working on homepage
- [ ] All 5 landing pages (clinic, salon, med spa, gym, real estate) visible
- [ ] Blog posts published and indexed
- [ ] Email automation running (test with personal email first)
- [ ] SMS automation running
- [ ] Payment processing live (test with Stripe test mode first)
- [ ] Analytics tracking (verify events firing)
- [ ] n8n workflows active
- [ ] Supabase queries returning data
- [ ] Support email monitored
- [ ] Sales calendar updated with availability

---

## PHASE 11: SOFT LAUNCH (Week 1)

### Send to Initial 20 People (Friends, Past Clients, Network)

Email template:
```
Subject: You're invited to try Scalar (AI receptionist for salons/clinics)

Hi [Name],

I've been building something for the past 3 months. It's called Scalar – an AI receptionist that captures booking requests on WhatsApp, Instagram, and websites 24/7.

I'd love your feedback. Try the demo: [website-link]

Takes 60 seconds. Let me know what you think.

James
```

### Measure Initial Response
- Click-through rate on email
- Demo completion rate
- Trial signup rate
- Any bugs or issues reported

### Fix Bugs & Optimize
- If demo completion < 30%, tweak copy
- If trial signup < 20% of demo completion, improve CTA
- If chatbot responds incorrectly, adjust Retell AI prompts

---

## PHASE 12: COLD OUTREACH (Week 2)

### Target List
1. Salons in Hong Kong (find on Google Maps)
2. Med clinics and aesthetics
3. Gyms and fitness studios
4. Real estate agencies

### Cold Call Script
[See email-sequences-sales-scripts.md]

### Track Responses
- Lead list in Airtable or Supabase
- Call outcomes
- Conversion rate
- Cost per qualified lead

---

## MONITORING + OPTIMIZATION (Ongoing)

### Weekly Checks
- New leads: [#] (goal: 10+)
- Trial conversions: [#] (goal: 3+)
- Active customers: [#]
- MRR: [HKD]

### Monthly Optimization
- Analyze top converting landing page → optimize others
- Analyze top converting blog post → write similar content
- Check churn: Any paid customers leaving?
- Customer health scores: Any "high risk" customers?

### Quarterly Reviews
- Revenue goal met?
- CAC (Customer Acquisition Cost) trending down?
- LTV (Customer Lifetime Value) trending up?
- Retention rate improving?

---

## EMERGENCY PROCEDURES

### If Chatbot Stops Responding
1. Check Retell AI status page
2. Check WATI webhook logs
3. Check n8n workflow logs
4. Manually notify affected customers

### If Supabase Goes Down
1. Access backup (Supabase has automatic backups)
2. Switch to standby database
3. Notify customers of temporary service interruption

### If Payment Processing Fails
1. Check Stripe dashboard for errors
2. Retry charge manually
3. Send apology email + free month credit

---

## COST BREAKDOWN (Monthly)

- Vercel hosting: Free (or $20/month for Pro)
- Supabase database: Free tier (or $25/month for paid)
- Retell AI: ~5,000 HKD (pay-as-you-go for API calls)
- Resend emails: Free tier 100/day (or $20/month for unlimited)
- Twilio SMS: ~1,000 HKD (depending on volume)
- n8n Cloud: Free tier (or $20/month for more workflows)
- Domain: 200 HKD/year
- Stripe payment processing: 3.8% + 0.30 HKD per transaction
- Google Analytics: Free

**Total startup cost: ~2,000 HKD + transaction fees**

---

## NEXT STEPS

1. **Week 1:** Deploy website, set up payment processing
2. **Week 2:** Configure n8n workflows, test email/SMS
3. **Week 3:** Soft launch to 20 people, gather feedback
4. **Week 4:** Cold outreach campaign begins
5. **Month 2:** 10-20 trials running
6. **Month 3:** First paying customers

---

## CONTACTS FOR SUPPORT

- **Retell AI support:** support@retell.ai
- **Supabase support:** support@supabase.io
- **Stripe support:** support@stripe.com
- **WATI support:** support@wati.io
- **n8n support:** support@n8n.io

---

## YOU'RE READY

Everything is built. Everything is documented. Everything is automated.

The only thing left is to launch, sell, and scale.

Good luck.

— Built for James, Scalar AI
