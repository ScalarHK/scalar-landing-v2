# Scalar: AI Lead Generation Agency for HK Med-Aesthetics Clinics

## Executive Summary
Scalar is a 90% automated lead generation and appointment booking agency targeting owner-operated med-aesthetics clinics in Hong Kong. The core offering is an AI-powered voice receptionist and WhatsApp chatbot that captures and books leads 24/7, wrapped in a full-stack retainer including content, ads, and reporting.

**Target MRR**: $10,000 USD
**Pilot Price**: 20,000 HKD / 3 months
**Retainer Price**: 20,000 HKD / month

---

## Target Market (ICP)
- **Type**: Owner-operated med-aesthetics clinics (aesthetic clinics, med spas, cosmetic dermatology)
- **Location**: Hong Kong
- **Size**: 300–1,500 Instagram followers
- **Pain Point**: Manual WhatsApp/phone bookings; missing calls after hours or during appointments
- **Behavioral Profile**: Social media presence exists but no automated lead capture; willing to adopt AI tools to reduce operational friction

---

## Core Offer

### What We Do
1. **24/7 AI Voice Receptionist** — Answers calls, qualifies leads, books appointments
2. **WhatsApp Chatbot** — Handles booking inquiries, sends appointment confirmations, collects lead info
3. **Full-Stack Retainer** — Monthly content calendar, Meta ads management, performance reporting, client success

### What Clients Get
- Zero missed calls or messages
- Instant appointment confirmations and reminders
- Lead qualification and CRM automation
- Monthly performance reports (leads captured, conversion rate, booking pipeline)
- Ad strategy and creative management (optional upsell)

---

## Technology Stack

### Voice AI & Telephony
- **Voice AI**: Retell AI (AI model: GPT-4o, persona: "Aria")
- **Telephony**: Twilio (PSTN inbound, call recording, transcription)
- **Status**: Not yet built (future sprint)

### Lead Capture & Messaging
- **WhatsApp**: WATI (WhatsApp Business API integration)
- **Instagram DMs**: Meta Graph API v19
- **Web Forms**: Custom HTML forms that feed to automation layer

### Automation & Orchestration
- **Primary Orchestration**: n8n Cloud (self-hosted alternative available)
- **Workflows**:
  - WhatsApp inbound → Supabase lead capture → WATI auto-reply
  - Instagram DMs → Supabase contact log → WATI outreach
  - Web form submission → Supabase → Resend email + Slack notification

### Data Layer & CRM
- **Database**: Supabase (PostgreSQL) — single source of truth
- **Schema**:
  - `contacts` — clinic prospect/lead data
  - `conversations` — WhatsApp/IG/voice threads
  - `leads` — qualified pipeline (status, source, contact ID)
  - `messages` — message history (WhatsApp, IG, email)
  - `crm_payloads` — formatted JSON ready to push to clinic's existing system
- **Views**:
  - `leads_with_contacts` — joined view for lead scoring
  - `conversations_summary` — recent activity feed
- **Row-Level Security (RLS)**: Enabled; service role can bypass for automation

### Email & Notifications
- **Email**: Resend (transactional emails, clinic domain verification)
- **Internal Alerts**: Slack Incoming Webhooks (lead notifications, failed workflows)

### Booking & Calendar
- **Calendar Integration**: Cal.com (future sprint — not yet wired)
- **Clinic System Bridge**: n8n "CRM Adapter" node formats Supabase records into clinic's native booking system JSON payload

### AI & Language
- **Model**: OpenAI GPT-4o
- **Persona**: Aria (friendly, professional med-aesthetics specialist persona)
- **Language**: English-first (Cantonese voice not viable with current models)

---

## MVP Flow (Current State)

```
Lead Inbound → Capture → Store → Respond → Book → Notify
```

1. **Lead Inbound**
   - WhatsApp message to clinic number (via WATI)
   - Instagram DM to clinic page (via Meta API)
   - Web form on clinic's site

2. **Capture**
   - n8n webhook receives inbound data
   - Standardizes contact info (name, phone, service interest, preferred time)
   - Checks if contact exists in Supabase; if not, creates new record

3. **Store**
   - Contact record and message stored in Supabase
   - Triggers `leads` table entry with status = "new"

4. **Respond**
   - n8n sends WATI/WhatsApp auto-reply with: greeting, available times, booking link or next steps
   - For qualified leads: escalate to Slack for manual follow-up or trigger email via Resend

5. **Book**
   - Lead clicks booking link (Cal.com — future) or calls clinic directly
   - Appointment confirmed via WATI/email

6. **Notify**
   - Slack webhook pings clinic owner with new lead summary
   - Email confirmation sent to lead via Resend
   - CRM payload formatted in Supabase, ready to push to clinic's system (e.g., Zendesk, HubSpot, custom database)

---

## Architecture: How Data Flows

```
Inbound Event (WhatsApp, IG, Form)
        ↓
n8n Webhook (parses, normalizes)
        ↓
Supabase (write: contacts, conversations, leads)
        ↓
Trigger: n8n automation nodes
        ├→ WATI (send WhatsApp reply)
        ├→ Resend (send email)
        ├→ Slack (notify owner)
        └→ CRM Adapter (format for clinic's system)
```

### Key Design Principle: Supabase as Single Source of Truth
- All lead data flows into Supabase first
- n8n reads from Supabase, orchestrates downstream actions
- Clinic's existing system (Zendesk, HubSpot, custom) receives formatted payloads via n8n adapter
- This decouples Scalar from clinic dependencies and enables rapid integration with any booking/CRM system

---

## Current Build Status (as of 2026-03-29)

### ✅ Completed
- Supabase schema (contacts, conversations, leads, messages, crm_payloads) deployed
- n8n workflows: WhatsApp, Instagram, web form → Supabase built
- Aria (GPT-4o) system prompt written
- Tech stack finalized (switched from GoHighLevel to Supabase + Resend)
- Demo booking form HTML created
- Credentials file (.env) set up

### 🔄 In Progress
- n8n workflow import and testing (credentials setup required in n8n Cloud)

### ⏳ Not Yet Built
| Task | Sprint | Notes |
|------|--------|-------|
| Import workflows to n8n Cloud | Current | User must add Supabase, WATI, OpenAI, Resend creds to n8n |
| Fill workflow placeholders | Current | WATI Tenant ID, Meta tokens, Slack webhook, Resend domain |
| Set webhooks (WATI, Meta) | Current | Point to n8n Cloud trigger URLs |
| Resend domain verification | Current | User verifies clinic domain in Resend for email sending |
| Update setup guide | Current | Scalar-Demo-Setup-Guide-WATI.docx needs Supabase section |
| Retell AI voice integration | Sprint 2 | Voice receptionist calling inbound leads |
| Cal.com booking layer | Sprint 2 | Link calendar availability to clinic's system |
| Performance dashboard | Sprint 3 | Real-time lead pipeline, conversion, revenue tracking |

---

## Pricing Model

### For Clinics (B2C)
- **Pilot**: 20,000 HKD per month (3-month minimum, no long-term lock-in)
- **Retainer**: 20,000 HKD per month (unlimited leads, 24/7 automation, full-stack support)
- **Add-ons**: Meta ads management (+5,000 HKD/month), content calendar premium tier

### Unit Economics (Target)
- **CAC**: 2,000 HKD (cold outreach + demo setup)
- **LTV**: 60,000 HKD (3 × 20,000 HKD average retainer)
- **Runway**: ~3 months to breakeven per client

---

## Copy/Writing Assets Built

### System Prompt (Aria Persona)
- Friendly, professional, specialized in med-aesthetics consultations
- Handles FAQs, objection handling, and lead qualification
- Drives to booking or clinic callback

### Messaging Sequences (to be built)
- **WhatsApp Welcome**: New lead receives greeting, available services, booking link
- **24h Follow-up**: Automated check-in if no response
- **Post-Booking**: Confirmation, reminder 24h before appointment
- **Nurture (inactive leads)**: Monthly content carousel, special offers

### Email Templates (to be built)
- Lead confirmation
- Appointment reminder
- Post-appointment follow-up
- Weekly clinic performance report

---

## Success Metrics

### For Scalar
- **Lead Gen**: Capture 20+ qualified leads per clinic per month
- **Conversion**: 30% of captured leads → booked appointments
- **Retention**: 90% month-over-month (3-month+ retainer clients)
- **MRR Growth**: $10,000 USD target (5 clinics at 20,000 HKD = ~$12,800 USD/month)

### For Clinics
- **Missed Calls Reduced**: 90% fewer after-hours missed bookings (baseline: 20-30% miss rate)
- **Lead Cost**: 500-1,000 HKD per qualified lead (vs. 2,000+ HKD for paid ads alone)
- **Appointment Fill Rate**: +25% monthly bookings vs. pre-Scalar baseline
- **Customer Satisfaction**: <2h response time on all inbound inquiries

---

## Deployment & Security

### Infrastructure
- **n8n**: Cloud (US) with Supabase triggers
- **Supabase**: Hosted in US region (scalar-demo project)
- **WATI**: SaaS (no self-hosting needed)
- **Resend**: SaaS

### Security
- Row-level security (RLS) on Supabase — each clinic sees only their own data
- API keys stored in .env (not in git)
- Service role key used only by n8n in automated workflows
- Anon key restricted to read-only on contacts/leads (client dashboard future feature)

### Compliance
- GDPR-ready (Supabase EU region available on demand)
- WhatsApp ToS compliant (WATI handles Biz API compliance)
- Data retention: Clinic can request deletion of all records at any time

---

## Next Steps (Immediate)

1. **Set up n8n Cloud credentials**
   - Create Supabase connection (Project URL + Service Role Key)
   - Create WATI connection (API Key)
   - Create OpenAI connection (API Key)
   - Create Resend connection (API Key)

2. **Import and test workflows**
   - Import n8n-whatsapp-workflow-supabase.json to n8n Cloud
   - Test with sample WhatsApp message
   - Verify Supabase inserts working

3. **Configure live integrations**
   - Get WATI Tenant ID, set up webhook in WATI dashboard
   - Get Meta Page Access Token, configure webhook in Meta App
   - Verify Slack webhook URL in environment

4. **Launch demo**
   - Send test lead through all three inbound channels (WhatsApp, IG, web form)
   - Confirm full workflow: capture → store → respond → notify

5. **Pitch to first client**
   - Run through full demo
   - Collect clinic domain for Resend verification
   - Sign pilot agreement (20,000 HKD / 3 months)

---

## Questions for ChatGPT

Use this brief as context for:
- **Copy iterations** ("Refine the WhatsApp welcome message for med-aesthetics clinics")
- **Workflow logic review** ("Does this n8n flow handle duplicate leads correctly?")
- **Scaling strategy** ("What's the fastest way to onboard 10 clinics in parallel?")
- **Pricing feedback** ("Is 20,000 HKD/month competitive for HK med-aesthetics?")
- **Feature prioritization** ("Which feature should we build next for maximum LTV?")
