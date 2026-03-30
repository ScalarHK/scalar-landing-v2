# Agency Blueprint — AI Lead Generation for Med-Aesthetics Clinics (HK)

---

## Company Overview

**Type:** AI-powered lead generation agency
**Market:** Hong Kong med-aesthetics clinics
**Goal:** $10,000 USD MRR within 30 days
**Positioning:** Full-stack lead generation agency — not an SMMA. Default offer is the complete package; modules are deducted based on what the client already has covered.

---

## Ideal Client Profile (ICP)

Owner-operated med-aesthetics clinics in Hong Kong with:

- 300–1,500 Instagram followers
- Inconsistent posting (gaps of 7–10+ days)
- No reels or weak before/after content system
- Clear services and contact info in bio
- Taking bookings manually (WhatsApp, phone, or no system at all)
- Missing calls after hours or when staff are occupied

---

## The Core Problem We Solve

Brick-and-mortar clinic owners lose bookings constantly because:

1. **After-hours calls go unanswered** — potential clients call, no one picks up, they move on to the next clinic
2. **Concurrent calls can't be handled** — one staff member, one line; overflow is missed revenue
3. **Staff aren't trained to convert** — even when answered, inquiries don't get qualified or booked properly

This is a direct, quantifiable revenue leak. The goal is to close it.

---

## Full-Stack Service Offer

### Core Modules

| Module | Description |
|---|---|
| AI Voice Receptionist | Handles inbound calls 24/7, qualifies leads, books appointments |
| WhatsApp AI Bot | Parallel channel — handles WA inquiries, follow-ups, and booking |
| Lead Capture System | Captures caller/inquiry info, feeds into CRM pipeline |
| Lead Retargeting | Automated follow-up sequences for unconverted leads |
| Organic Content | Posts, reels, captions in English + Cantonese |
| Paid Ad Management | Ad strategy + management (ad spend billed separately to client) |
| Bi-weekly Reporting | Performance dashboard and results summary |
| Strategy + Audit | Ongoing optimisation and initial clinic audit |

### Not Yet Offered
- AI call receptionist is the current build focus — to be added to the live offer once validated

---

## Pricing

| Offer | Price | Notes |
|---|---|---|
| Monthly Retainer | 20,000 HKD/month | Ongoing, post-pilot |
| 3-Month Pilot | 20,000 HKD flat (~6,667/mo) | ~⅓ of retainer rate — low-risk entry to prove results |
| Ad Spend | Billed separately | Direct to client |

**Pilot rationale:** Enough runway (3 months) to demonstrate results. Success benchmarks agreed during onboarding make retainer conversion at month 3 a natural conversation, not a hard sell.

**Open question:** What is the floor price when modules are deducted for clients who already have some components covered?

---

## Tech Stack

### Voice AI (Receptionist)
- **Retell AI** — primary choice for inbound/outbound voice agents
- LLM layer: Claude or GPT-4o for conversation logic

### Telephony
- **Twilio** — phone number provisioning and call routing (used under the hood by Retell)

### WhatsApp (HK-critical channel)
- **WhatsApp Business API** via Twilio or 360dialog
- **Manychat** — for easier WA + Instagram DM automation if going no-code

### Booking Integration
- **Cal.com** — open source, API-friendly, easiest to connect to voice agents
- **n8n** — bridge layer to Fresha, Timely, Calendly, or clinic-specific systems

### CRM + Follow-up Automations
- **GoHighLevel (GHL)** — central hub: CRM, lead pipeline, SMS/email/WA follow-up sequences, landing pages, reporting. Resellable to clients.

### Automation Glue
- **n8n** — primary workflow automation (Retell → GHL → booking system → WA notifications). Self-hosted for cost efficiency and control.

### Minimum Viable Stack
> **Retell AI + Twilio → n8n → GoHighLevel + WhatsApp Business API**
> Add Cal.com once the clinic's booking system is confirmed during discovery.

### Language Note
English-first for now. Cantonese voice support is not viable with current voice models — deprioritised until the technology improves.

---

## Discovery Questions (Booking System Audit)

Before pitching or building, confirm how each clinic currently handles bookings:

1. *"How are you currently taking bookings — phone, WhatsApp, a booking system?"*
2. *"What happens when someone calls after hours or when you're with a client?"*
3. *"How many inquiries do you think you're missing per week?"*

The third question converts the pain into a dollar figure on the spot:
> Missed inquiries/week × average treatment value = visible revenue leak

---

## Sales Motion

1. **Cold call** — identify ICP clinics, call direct
2. **Book strategy call** — no free audit as entry point
3. **Pitch retainer** — 20,000 HKD/month full-stack
4. **Close on pilot** — 20,000 HKD / 3 months as low-risk entry
5. **Onboarding** — agree on success benchmarks (e.g. leads/month, bookings/month)
6. **Month 3** — retainer conversion is a natural outcome, not a cold ask

---

## Division of Labor

| Task | Owner |
|---|---|
| Build target list | User |
| Cold calls + DMs | User |
| Strategy calls + closing | User |
| DM sequences | Claude |
| Clinic audit reports | Claude |
| Content calendars + captions (EN/Cantonese) | Claude |
| Reel scripts + shot lists | Claude |
| Reporting templates | Claude |
| Tech stack build + automations | User (with Claude support) |

---

## Open Questions

- [ ] What is the floor price when modules are deducted?
- [ ] Which booking systems are most common across HK med-aesthetics clinics? (Validate during discovery calls)
- [ ] WhatsApp Business API approval timeline — apply early, can take days to weeks
- [ ] Is the AI receptionist the lead offer, or an upsell on top of the content/ads package?
