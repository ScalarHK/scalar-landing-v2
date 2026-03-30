# Scalar AI: n8n Workflows + Analytics Setup

---

## N8N WORKFLOW 1: "CHATBOT DEMO → LEAD CAPTURE"

**Trigger:** User completes chatbot demo on website

**Steps:**

```
1. WEBHOOK (Listen for chatbot completion)
   Input: {
     user_name: string,
     user_email: string,
     user_phone: string,
     business_type: string,
     demo_duration: number
   }

2. SUPABASE INSERT (Save to database)
   Table: leads
   Fields:
   - name
   - email
   - phone
   - business_type
   - demo_completed_date
   - source: "website_demo"
   - status: "demo_completed"

3. CONDITIONAL: Check if phone number is valid
   If valid → continue
   If invalid → flag for review

4. SEND EMAIL (Thank you + value prop)
   To: user_email
   Subject: "[Business Name] – Your lead recovery potential"
   Body:
   - Estimated bookings recovery (based on business type)
   - Revenue at stake
   - CTA: Schedule 15-minute call

5. SEND SMS (Drive action)
   To: user_phone
   Message: "Hi [Name]! Thanks for trying Scalar's demo. Ready to see your real numbers? Let's talk Friday. [Link]"

6. AIRTABLE (Create record for sales team)
   Sync: name, email, phone, business_type
   Owner: [Assigned to James or sales team]

7. SLACK NOTIFICATION (Internal alert)
   Channel: #new_leads
   Message: "🎯 New demo: [Business Name] - [Business Type] - [Phone]"
   Action: /call-[phone] (quick dial link)

END
```

---

## N8N WORKFLOW 2: "TRIAL SIGNUP → ONBOARDING SEQUENCE"

**Trigger:** Client starts 14-day free trial

**Steps:**

```
1. STRIPE/PAYMENT (Trial activated)
   Input: trial_user_id

2. SUPABASE UPDATE (Mark as trial user)
   Table: leads
   Update: status = "trial_active"
   Add: trial_start_date, trial_end_date

3. SEND EMAIL SEQUENCE (Start of trial)
   Email 1 (Day 0): Setup confirmation
   Email 2 (Day 5): Check-in (How many bookings?)
   Email 3 (Day 10): Data review + upgrade recommendation
   Email 4 (Day 13): Trial ending, last chance to upgrade

4. WATI INTEGRATION (Connect WhatsApp)
   - Client WhatsApp number input
   - Add to Scalar bot as contact
   - Send welcome message: "Your Scalar receptionist is live! Here's how to use it..."

5. INSTAGRAM INTEGRATION (Connect DMs)
   - Client Instagram business account ID
   - Enable auto-responses
   - Send instructions

6. WEBSITE WIDGET (Deploy on client's site)
   - Add script tag to client's website
   - Widget appears in bottom-right
   - Link to their Scalar instance

7. SUPABASE (Create trial analytics table)
   Table: trial_metrics
   Fields:
   - trial_id
   - bookings_captured (daily count)
   - revenue_recovered (daily estimate)
   - avg_response_time
   - no_show_rate
   - user_engagement (% of chats to booking)

8. DAILY SUMMARY EMAIL (Days 1-14)
   To: client_email
   Subject: "Your Scalar bookings today"
   Body:
   - Bookings captured: [count]
   - Revenue recovered: [HKD]
   - Most requested service: [name]
   - Performance vs typical (benchmarks)

9. DAY 10 UPGRADE CALL (Sales call scheduled)
   Calendar: Reserve Friday 3 PM slot for this client
   Slack: Alert sales team
   CRM: Create opportunity record

10. DAY 13 FINAL EMAIL
    Subject: Trial expires tomorrow – 1 decision
    Body: Keep Scalar running (20k/month) or pause
    Link: Upgrade button

11. DAY 14 AUTOMATION
    - If trial user upgrades → Go to Workflow 3
    - If trial user pauses → Go to Workflow 4

END
```

---

## N8N WORKFLOW 3: "TRIAL → PAID CONVERSION + RECURRING SETUP"

**Trigger:** Client clicks "Upgrade to Paid" button

**Steps:**

```
1. STRIPE/PAYMENT (Charge monthly subscription)
   Amount: 20,000 HKD/month
   Interval: Monthly, auto-renew
   Customer: [client_id]

2. SUPABASE UPDATE (Mark as paying customer)
   Table: customers
   Fields:
   - customer_id
   - business_name
   - business_type
   - phone
   - email
   - subscription_status: "active"
   - subscription_start_date
   - subscription_end_date
   - monthly_cost: 20000

3. SEND EMAIL (Welcome to paid)
   Subject: "Congratulations! Your Scalar AI receptionist is now unlimited"
   Body:
   - Setup is complete
   - Bookings will continue flowing
   - You'll get a monthly report every 30 days
   - Support line: [contact info]

4. SLACK (Sales team celebrates)
   Channel: #new_customers
   Message: "🎉 New customer: [Business Name] – [Phone] – [Type]"

5. CREATE CALENDAR REMINDER (30-day check-in)
   Date: 30 days after subscription
   Assignee: James
   Task: Call [client name] - check satisfaction, upsell if needed

6. SUPABASE (Initialize customer success tracking)
   Table: customer_health
   Fields:
   - customer_id
   - health_score: 85 (starting point)
   - total_bookings_captured: [sum from trial]
   - total_revenue_recovered: [sum from trial × 30 / trial_days]
   - churn_risk: "low"
   - next_review: 30 days

7. MONTHLY REPORT EMAIL SETUP
   Schedule: 1st of each month
   Content:
   - Total bookings captured (monthly)
   - Revenue recovered (monthly)
   - No-show rate (vs baseline)
   - Top services
   - Trend analysis
   - Recommendations for growth

END
```

---

## N8N WORKFLOW 4: "TRIAL PAUSED → RECOVERY SEQUENCE"

**Trigger:** Client doesn't upgrade, trial expires

**Steps:**

```
1. SUPABASE UPDATE
   Table: leads
   Update: status = "trial_paused"
   Add: trial_end_reason = "no_upgrade"

2. SEND EMAIL (Why did you pause?)
   Subject: "We'd like to help [Business Name] succeed with Scalar"
   Body:
   - Your trial results
   - Why you paused (dropdowns: cost, complexity, not needed, other)
   - Recovery offer (if cost issue: 6-month discount)

3. SEND SMS (Soft reminder)
   Message: "[Name], we noticed you paused Scalar. Those bookings are going to competitors now. If you want to talk about making it work, I'm here. – James"

4. WAIT 7 DAYS (If no response)

5. FINAL EMAIL (Last attempt)
   Subject: "[Business Name] – The leads you're leaving on the table"
   Body:
   - Your trial captured [X] bookings
   - That's 4 bookings per week you're now missing
   - We reserved a discount code for you: RESTART20 (20% off first month)
   - Let's get you back running

6. MARK AS INACTIVE
   Table: leads
   Update: status = "paused_inactive"
   Tag: "recovery_eligible"

7. QUARTERLY CHECK-IN (Every 3 months)
   Email: "Thought of you – let's talk about restarting Scalar"
   Body: Current testimonials, new features, results from other salons

END
```

---

## N8N WORKFLOW 5: "BOOKING CAPTURED → LEAD QUALIFICATION + CLIENT NOTIFICATION"

**Trigger:** Chatbot completes a booking

**Steps:**

```
1. WEBHOOK (Booking data from chatbot)
   Input: {
     client_phone: string,
     client_name: string,
     service: string,
     date_time: datetime,
     salon_id: string
   }

2. SUPABASE INSERT (Log booking)
   Table: bookings
   Fields:
   - booking_id (auto-generate)
   - salon_id
   - client_phone
   - client_name
   - service
   - date_time
   - status: "confirmed"
   - source: "chatbot"
   - created_date

3. QUALIFICATION CHECK
   Check: Phone number valid?
   Check: Service exists in salon's menu?
   Check: Time slot available?
   If any fail: Manually review by staff

4. SEND CLIENT CONFIRMATION (SMS)
   To: client_phone
   Message: "✓ Your appointment confirmed! [Service] on [Date] at [Time] with [Salon Name]. Reminder: [Salon Phone]. Reply CANCEL to reschedule."

5. SEND STAFF NOTIFICATION
   Send to salon admin WhatsApp/Email:
   "New booking from chatbot: [Client Name] – [Service] – [Date/Time]"

6. SCHEDULE REMINDERS
   24 hours before: SMS reminder to client
   2 hours before: WhatsApp reminder to client
   Messages: Confirmation, what to bring, how to cancel

7. SUPABASE ANALYTICS (Update daily metrics)
   Table: trial_metrics (or customer_metrics if paid)
   Update:
   - bookings_captured +1
   - revenue_recovered += [service_price]
   - last_booking_timestamp

8. SLACK (Internal tracking)
   Channel: #bookings
   Message: "[Salon Name] captured booking: [Service] – [Date]"
   (Optional graph showing daily booking trend)

9. UPDATE CUSTOMER HEALTH SCORE
   Table: customer_health
   If bookings >= 10/month: health_score += 5
   If revenue_recovered >= 4k/month: health_score += 5

10. CHURN RISK ASSESSMENT
    If no bookings in 7 days: churn_risk = "medium"
    If no bookings in 14 days: churn_risk = "high"
    Alert: Sales team to reach out

END
```

---

## N8N WORKFLOW 6: "MONTHLY BILLING + CUSTOMER SUCCESS REVIEW"

**Trigger:** 1st of each month, for active customers

**Steps:**

```
1. SUPABASE QUERY (Pull monthly data)
   Table: bookings
   Filter: created_date >= 1st of prev month
   Get:
   - Total bookings captured
   - Total revenue recovered (sum of service prices)
   - Unique clients booked
   - Peak booking times
   - Most popular services

2. STRIPE CHARGE (Monthly subscription)
   Amount: 20,000 HKD per customer
   Process: Automatic

3. BUILD CUSTOM REPORT
   Generate PDF with:
   - Month: [Month/Year]
   - Bookings captured: [count]
   - Revenue recovered: [HKD]
   - Cost: 20,000 HKD
   - Net gain: [revenue - cost]
   - ROI: [% return]
   - vs previous month: [trend]
   - vs industry benchmark: [comparison]

4. SEND MONTHLY REPORT EMAIL
   To: customer_email
   Subject: "[Business Name] – Your Scalar results for [Month]"
   Body:
   - Executive summary (bookings, revenue, ROI)
   - Detailed breakdown (services, times, clients)
   - Performance vs previous month
   - Top insights
   - Recommendations for next month
   - Link to full dashboard (login to see real-time)

5. UPDATE CUSTOMER HEALTH SCORE
   Base score: 85
   If bookings >= 30/month: +10
   If bookings < 5/month: -10
   If customer responded to emails: +5
   If customer didn't respond to emails: -5
   New score: 85 + adjustments

6. CHURN RISK ASSESSMENT
   If revenue < 5,000 HKD (less than 10 bookings):
     churn_risk = "high"
     Action: Flag for James to call
   If revenue >= 10,000 HKD:
     churn_risk = "low"
     Action: Schedule happy customer check-in for month 3

7. NPS SURVEY (Month 3 only)
   Email: "How likely would you recommend Scalar to other [business type]? [1-10 scale]"
   Based on answer, request testimonial or address issues

8. RENEWAL AUTOMATION (Auto-renew)
   30 days before subscription end:
   - Send renewal reminder
   - Check if any issues
   - Confirm continuation

END
```

---

## ANALYTICS SETUP (Google Analytics 4 + Supabase)

### Tracking Events to Set Up:

1. **Page Views**
   - `/` (homepage)
   - `/clinic-chatbot`
   - `/salon-chatbot`
   - `/med-spa-booking`
   - etc. (all landing pages)

2. **Chatbot Events**
   - `chatbot_opened` (user clicks demo)
   - `chatbot_message_sent` (user sends message)
   - `chatbot_service_selected` (user picks service)
   - `chatbot_booking_confirmed` (appointment booked)
   - `chatbot_email_captured` (email provided)

3. **Conversion Events**
   - `demo_completed` (chatbot demo finished)
   - `trial_started` (user clicks "Start Trial")
   - `paid_signup` (user upgrades to paid)

4. **Content Events**
   - `blog_post_viewed` (which post, how long)
   - `blog_cta_clicked` (which CTA in which post)

5. **Lead Events**
   - `demo_form_submitted` (name, email, phone captured)
   - `sales_call_booked` (calendar link clicked)

### Key Dashboards to Build:

**Dashboard 1: Funnel Analysis**
- Visitors → Demo Starters → Demo Completers → Trial Signups → Paid Customers
- Conversion rate at each step
- Biggest drop-off point

**Dashboard 2: Traffic Source**
- Organic search (which keywords drive traffic)
- Direct (brand awareness)
- Referral (who's sending traffic)
- Paid ads (if you use them)

**Dashboard 3: Industry Performance**
- Which industry pages convert best (clinic vs salon vs gym)
- Which industry has highest trial-to-paid conversion
- Which industry has best payback period

**Dashboard 4: Blog Performance**
- Which blog posts drive most traffic
- Which blog posts drive most demos
- Which blog posts have highest engagement

**Dashboard 5: Customer Success**
- Active customers (by month)
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Customer lifetime value (LTV)
- Churn rate

### Supabase Queries to Create:

```sql
-- Query 1: Funnel conversion rates
SELECT
  COUNT(DISTINCT CASE WHEN event = 'demo_opened' THEN user_id END) as demo_starters,
  COUNT(DISTINCT CASE WHEN event = 'demo_completed' THEN user_id END) as demo_completers,
  COUNT(DISTINCT CASE WHEN event = 'trial_started' THEN user_id END) as trial_signups,
  COUNT(DISTINCT CASE WHEN event = 'paid_signup' THEN user_id END) as paid_customers,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN event = 'demo_completed' THEN user_id END) /
        COUNT(DISTINCT CASE WHEN event = 'demo_opened' THEN user_id END), 2) as demo_completion_rate,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN event = 'trial_started' THEN user_id END) /
        COUNT(DISTINCT CASE WHEN event = 'demo_completed' THEN user_id END), 2) as trial_conversion_rate,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN event = 'paid_signup' THEN user_id END) /
        COUNT(DISTINCT CASE WHEN event = 'trial_started' THEN user_id END), 2) as paid_conversion_rate
FROM events
WHERE created_date >= NOW() - INTERVAL '30 days';

-- Query 2: Customer acquisition by industry
SELECT
  business_type,
  COUNT(*) as total_customers,
  AVG(monthly_bookings) as avg_monthly_bookings,
  AVG(monthly_revenue) as avg_monthly_revenue,
  COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) as active_customers,
  ROUND(100.0 * COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) / COUNT(*), 2) as retention_rate
FROM customers
GROUP BY business_type;

-- Query 3: Blog post performance
SELECT
  blog_slug,
  COUNT(DISTINCT user_id) as views,
  COUNT(DISTINCT CASE WHEN event = 'blog_cta_clicked' THEN user_id END) as cta_clicks,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN event = 'blog_cta_clicked' THEN user_id END) /
        COUNT(DISTINCT user_id), 2) as cta_click_rate,
  COUNT(DISTINCT CASE WHEN event = 'demo_opened' THEN user_id END) as demos_from_blog
FROM events
WHERE event IN ('blog_post_viewed', 'blog_cta_clicked', 'demo_opened')
GROUP BY blog_slug
ORDER BY views DESC;
```

---

## REPORTING

### Weekly Report (To James)
- New leads: [#]
- Trials started: [#]
- Trials converted to paid: [#]
- Active customers: [#]
- MRR (Monthly Recurring Revenue): [HKD]
- Top converting landing page
- Top converting blog post

### Monthly Report (To Customers)
[See Workflow 6 - Monthly billing]

---

## END OF N8N + ANALYTICS SETUP

All workflows are designed to:
- Automatically move leads through the sales funnel
- Reduce manual work (especially for follow-ups)
- Capture real-time data for optimization
- Alert team to high-priority opportunities
- Track ROI at every stage

Next: Deploy this on n8n Cloud using credentials from Supabase, WATI, Stripe, and your email service.
