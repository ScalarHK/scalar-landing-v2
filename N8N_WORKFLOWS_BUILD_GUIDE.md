# n8n Workflows Build Guide — Scalar AI Lead Generation

Complete node-by-node instructions for building all three automated workflows in n8n Cloud.

---

## PREREQUISITES & CREDENTIALS

Create these 4 credentials in n8n before building workflows:

1. **Supabase Service Key** (httpHeaderAuth)
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_SUPABASE_SERVICE_KEY`
   - Get your key from: https://supabase.com/dashboard → Settings → API → Project → service_role

2. **WATI API Key** (httpHeaderAuth)
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_WATI_API_KEY`
   - Get from WATI Dashboard → Settings → API Keys

3. **OpenAI API Key** (httpHeaderAuth)
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_OPENAI_API_KEY`
   - Get from: https://platform.openai.com/account/api-keys

4. **Resend API Key** (httpHeaderAuth)
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_RESEND_API_KEY`
   - Get from: https://resend.com/api-keys

---

## WORKFLOW 1: WhatsApp AI Receptionist

### Overview
Listens for incoming WhatsApp messages via WATI webhook. During business hours (Mon-Sat 9am-7pm HKT), logs to shared inbox. After hours, uses AI to respond, capture booking intent, and forward to client CRM.

### Nodes & Configuration

#### 1. **WATI Webhook** (Webhook)
- **Type**: Webhook (n8n-nodes-base.webhook)
- **Method**: POST
- **Path**: `wati-webhook`
- **Response Mode**: "When last node finishes"

#### 2. **Return 200 OK** (Respond to Webhook)
- **Type**: Respond to Webhook
- **Response**: JSON
- **Body**: `{ "status": "ok" }`
- **Status Code**: 200

#### 3. **Filter & Extract Message** (Code)
- **Type**: Code node (JavaScript)
- **Purpose**: Extract WhatsApp message data from WATI payload
- **Code**:
```javascript
// WATI sends all events here — filter for inbound customer messages only
const body = $input.first().json.body || $input.first().json;

// Skip messages sent by the clinic team (owner = true) and non-message events
if (body.owner === true || body.eventType !== 'message') {
  return [];
}

const waId = body.waId || body.id || ''; // WhatsApp number without +
const senderName = body.senderName || body.fullName || 'Unknown';
const text = body.text || body.body || '';

if (!waId || !text) return [];

// Normalise to E.164 with HK prefix (+852)
const digits = waId.replace(/\D/g, '');
const phone = digits.startsWith('852') ? '+' + digits : '+852' + digits;

return [{ json: {
  waId,
  phone,
  senderName,
  text,
  rawPayload: body,
  receivedAt: new Date().toISOString()
} }];
```

#### 4. **Business Hours Check (HKT)** (Code)
- **Type**: Code node (JavaScript)
- **Purpose**: Determine if message arrived during business hours
- **Code**:
```javascript
const now = new Date();
const hkOffset = 8 * 60;
const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
const hkMinutes = (utcMinutes + hkOffset) % (24 * 60);
const hkDay = new Date(now.getTime() + hkOffset * 60000).getUTCDay(); // 0=Sun

// Business hours: Mon–Sat (1–6) 09:00–19:00 HKT
const isWeekday = hkDay >= 1 && hkDay <= 6;
const isOpenHours = hkMinutes >= 540 && hkMinutes < 1140;
const isBusinessHours = isWeekday && isOpenHours;

return [{ json: { ...$input.first().json, isBusinessHours } }];
```

#### 5. **Business Hours?** (If/Else)
- **Type**: If node
- **Condition**: `isBusinessHours == true`
- **True branch**: → [BH] Upsert Contact
- **False branch**: → [AH] Upsert Contact

#### 6. **[BH] Upsert Contact** (HTTP Request)
*Only runs during business hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/contacts`
- **Auth**: Use "Supabase Service Key" credential
- **Headers**:
  - `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`
  - `Prefer`: `resolution=merge-duplicates,return=representation`
- **Body** (JSON):
```json
{
  "phone": "{{ $json.phone }}",
  "name": "{{ $json.senderName }}",
  "source": "WhatsApp",
  "tags": ["whatsapp", "business-hours"]
}
```

#### 7. **[BH] Log Inbound Message** (HTTP Request)
*Only runs during business hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/messages`
- **Auth**: Use "Supabase Service Key" credential
- **Headers**: `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`
- **Body** (JSON):
```json
{
  "contact_id": "{{ $('node-wa-bh1').first().json[0]?.id }}",
  "channel": "whatsapp",
  "direction": "inbound",
  "content": "{{ $('Filter & Extract Message').first().json.text }}",
  "metadata": {
    "waId": "{{ $('Filter & Extract Message').first().json.waId }}",
    "handledBy": "receptionist-inbox"
  },
  "ai_handled": false
}
```

#### 8. **[AH] Upsert Contact** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/contacts`
- **Auth**: Supabase Service Key
- **Headers**:
  - `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`
  - `Prefer`: `resolution=merge-duplicates,return=representation`
- **Body** (JSON):
```json
{
  "phone": "{{ $json.phone }}",
  "name": "{{ $json.senderName }}",
  "source": "WhatsApp",
  "tags": ["whatsapp", "after-hours"]
}
```

#### 9. **[AH] Get Conversation History** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/conversations?contact_id=eq.{{ $('node-wa-ah1').first().json[0]?.id }}&channel=eq.whatsapp&select=*`
- **Auth**: Supabase Service Key
- **Headers**: `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`

#### 10. **[AH] Build AI Context** (Code)
*Only runs after hours*
- **Purpose**: Prepare conversation history for OpenAI
- **Code**:
```javascript
const messageData = $('Filter & Extract Message').first().json;
const contactRow = $('node-wa-ah1').first().json[0];
const conversationRows = $('node-wa-ah2').first().json; // Array, may be empty

const contactId = contactRow?.id;
const existingConversation = conversationRows.length > 0 ? conversationRows[0] : null;
const existingHistory = existingConversation?.history || [];

// Append inbound message to working history
const updatedHistory = [
  ...existingHistory,
  { role: 'user', content: messageData.text, timestamp: new Date().toISOString() }
];

// Build OpenAI messages — use last 12 turns for context window
const recentHistory = updatedHistory.slice(-12);
const openAiMessages = recentHistory.map(m => ({
  role: m.role,
  content: m.content
}));

return [{ json: {
  contactId,
  phone: messageData.phone,
  waId: messageData.waId,
  senderName: messageData.senderName,
  inboundText: messageData.text,
  conversationId: existingConversation?.id || null,
  isNewConversation: !existingConversation,
  existingHistory,
  updatedHistory,
  openAiMessages,
  priorMessageCount: existingHistory.length
} }];
```

#### 11. **[AH] Call OpenAI (Aria)** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://api.openai.com/v1/chat/completions`
- **Auth**: Use "OpenAI API Key" credential
- **Headers**: `Authorization`: `Bearer YOUR_OPENAI_API_KEY`
- **Body** (JSON):
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "You are Aria, a warm and professional AI receptionist for a Hong Kong med-aesthetics clinic. Your job is to answer enquiries, explain services, and capture booking intent after hours.\n\nGuidelines:\n- Respond naturally in the same language the client uses (English or Traditional Chinese)\n- Keep replies concise — WhatsApp messages, not essays\n- Never quote prices; say the team will confirm during consultation\n- If the client wants to book or shows strong interest, extract their intent using this exact pattern at the END of your reply:\n[BOOKING_INTENT]{\"name\":\"<name>\",\"service\":\"<service>\",\"preferred_time\":\"<time or empty>\"}\n[/BOOKING_INTENT]\n- Clinic hours: Mon–Sat 9am–7pm HKT. Outside these hours you are handling the conversation; team will follow up next business day."
    },
    "...{{ $json.openAiMessages }}"
  ],
  "max_tokens": 400,
  "temperature": 0.6
}
```

#### 12. **[AH] Parse AI Response** (Code)
*Only runs after hours*
- **Purpose**: Extract booking intent from AI response
- **Code**:
```javascript
const aiRaw = $input.first().json.choices[0].message.content;
const ctx = $('node-wa-ah3').first().json;

// Extract booking intent block if present
let bookingIntent = null;
const intentMatch = aiRaw.match(/\[BOOKING_INTENT\]([\s\S]*?)\[\/BOOKING_INTENT\]/);
if (intentMatch) {
  try { bookingIntent = JSON.parse(intentMatch[1]); } catch(e) {}
}

// Clean reply text — strip the intent block before sending to customer
const aiText = aiRaw.replace(/\[BOOKING_INTENT\][\s\S]*?\[\/BOOKING_INTENT\]/g, '').trim();

// Append AI reply to conversation history
const finalHistory = [
  ...ctx.updatedHistory,
  { role: 'assistant', content: aiText, timestamp: new Date().toISOString() }
];

return [{ json: {
  ...ctx,
  aiText,
  bookingIntent,
  hasBookingIntent: bookingIntent !== null,
  finalHistory,
  finalMessageCount: finalHistory.length
} }];
```

#### 13. **[AH] Upsert Conversation** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/conversations`
- **Auth**: Supabase Service Key
- **Headers**:
  - `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`
  - `Prefer`: `resolution=merge-duplicates,return=representation`
- **Body** (JSON):
```json
{
  "contact_id": "{{ $json.contactId }}",
  "channel": "whatsapp",
  "history": "{{ $json.finalHistory }}",
  "last_message_at": "{{ now.toISOString() }}",
  "message_count": "{{ $json.finalMessageCount }}"
}
```

#### 14. **[AH] Log Inbound Message** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/messages`
- **Auth**: Supabase Service Key
- **Body** (JSON):
```json
{
  "contact_id": "{{ $json.contactId }}",
  "channel": "whatsapp",
  "direction": "inbound",
  "content": "{{ $json.inboundText }}",
  "metadata": { "waId": "{{ $json.waId }}" },
  "ai_handled": true
}
```

#### 15. **[AH] Log Outbound Message** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/messages`
- **Auth**: Supabase Service Key
- **Body** (JSON):
```json
{
  "contact_id": "{{ $json.contactId }}",
  "channel": "whatsapp",
  "direction": "outbound",
  "content": "{{ $json.aiText }}",
  "metadata": {
    "model": "gpt-4o",
    "hasBookingIntent": "{{ $json.hasBookingIntent }}"
  },
  "ai_handled": true
}
```

#### 16. **[AH] Send WATI Reply** (HTTP Request)
*Only runs after hours*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://live-mt-server.wati.io/YOUR_WATI_TENANT_ID/api/v1/sendSessionMessage/{{ $('node-wa-ah5').first().json.waId }}`
- **Auth**: WATI API Key
- **Body** (JSON):
```json
{
  "messageText": "{{ $('node-wa-ah5').first().json.aiText }}"
}
```

#### 17. **Booking Intent?** (If/Else)
*Only runs after hours*
- **Condition**: `hasBookingIntent == true`
- **True branch**: → Insert Lead (Supabase) + Slack: Booking Alert
- **False branch**: → End

#### 18. **Insert Lead (Supabase)** (HTTP Request)
*Only runs if booking intent detected*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/leads`
- **Auth**: Supabase Service Key
- **Headers**:
  - `Authorization`: `Bearer YOUR_SUPABASE_SERVICE_KEY`
  - `Prefer`: `return=representation`
- **Body** (JSON):
```json
{
  "contact_id": "{{ $('node-wa-ah5').first().json.contactId }}",
  "status": "consultation_requested",
  "channel": "whatsapp",
  "service_interest": "{{ $('node-wa-ah5').first().json.bookingIntent?.service || 'Unspecified' }}",
  "preferred_time": "{{ $('node-wa-ah5').first().json.bookingIntent?.preferred_time || '' }}",
  "booking_data": "{{ $('node-wa-ah5').first().json.bookingIntent || {} }}",
  "notes": "Captured after hours via WhatsApp AI"
}
```

#### 19. **Slack: Booking Alert** (HTTP Request)
*Only runs if booking intent detected*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `YOUR_SLACK_WEBHOOK_URL` *(Get from Slack App → Incoming Webhooks)*
- **Body** (JSON):
```json
{
  "text": ":calendar: *New booking intent captured (WhatsApp — after hours)*\n*Client:* {{ $('node-wa-ah5').first().json.senderName }} ({{ $('node-wa-ah5').first().json.phone }})\n*Service:* {{ $('node-wa-ah5').first().json.bookingIntent?.service || 'Not specified' }}\n*Preferred time:* {{ $('node-wa-ah5').first().json.bookingIntent?.preferred_time || 'Not specified' }}\n_Follow up next business day via WATI inbox_"
}
```

#### 20. **CRM Adapter** (Code)
*Only runs if booking intent detected*
- **Purpose**: Format lead for client's CRM system
- **Code**:
```javascript
const ctx = $('node-wa-ah5').first().json;
const leadRow = $input.first().json[0];

const crmPayload = {
  source: 'Scalar AI Receptionist',
  channel: 'whatsapp',
  lead_id: leadRow?.id,
  contact_id: ctx.contactId,
  name: ctx.senderName,
  phone: ctx.phone,
  service_interest: ctx.bookingIntent?.service,
  preferred_time: ctx.bookingIntent?.preferred_time,
  status: 'consultation_requested',
  captured_at: new Date().toISOString()
};

const CLIENT_CRM_ENDPOINT = 'YOUR_CLIENT_CRM_WEBHOOK_URL';
const CLIENT_NAME = 'Demo Clinic';

return [{ json: { crmPayload, CLIENT_CRM_ENDPOINT, CLIENT_NAME, leadRow } }];
```

#### 21. **Send to Client CRM** (HTTP Request)
*Only runs if booking intent detected*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `{{ $json.CLIENT_CRM_ENDPOINT }}`
- **Body** (JSON):
```json
{{ $json.crmPayload }}
```
- **Options**: Enable "Never Error" to prevent workflow failure if CRM is down

#### 22. **Log CRM Payload** (HTTP Request)
*Only runs if booking intent detected*
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/crm_payloads`
- **Auth**: Supabase Service Key
- **Body** (JSON):
```json
{
  "lead_id": "{{ $('Insert Lead (Supabase)').first().json[0]?.id }}",
  "contact_id": "{{ $('node-wa-ah5').first().json.contactId }}",
  "client_name": "{{ $('CRM Adapter').first().json.CLIENT_NAME }}",
  "payload": "{{ $('CRM Adapter').first().json.crmPayload }}",
  "endpoint": "{{ $('CRM Adapter').first().json.CLIENT_CRM_ENDPOINT }}",
  "response_code": "{{ $('Send to Client CRM').first().json.statusCode || 0 }}",
  "success": "{{ $('Send to Client CRM').first().json.statusCode >= 200 && $('Send to Client CRM').first().json.statusCode < 300 }}"
}
```

### Connections for WhatsApp Workflow
```
WATI Webhook
  ├─→ Return 200 OK
  └─→ Filter & Extract Message
       └─→ Business Hours Check (HKT)
            └─→ Business Hours?
                 ├─ YES (Business Hours)
                 │   └─→ [BH] Upsert Contact
                 │        └─→ [BH] Log Inbound Message
                 │
                 └─ NO (After Hours)
                     └─→ [AH] Upsert Contact
                          └─→ [AH] Get Conversation History
                               └─→ [AH] Build AI Context
                                    └─→ [AH] Call OpenAI (Aria)
                                         └─→ [AH] Parse AI Response
                                              └─→ [AH] Upsert Conversation
                                                   ├─→ [AH] Log Inbound Message
                                                   ├─→ [AH] Log Outbound Message
                                                   └─→ [AH] Send WATI Reply
                                                        └─→ Booking Intent?
                                                             ├─ YES
                                                             │  ├─→ Insert Lead (Supabase)
                                                             │  │    └─→ CRM Adapter
                                                             │  │         └─→ Send to Client CRM
                                                             │  │              └─→ Log CRM Payload
                                                             │  └─→ Slack: Booking Alert
                                                             │
                                                             └─ NO (No intent)
                                                                  └─→ End
```

---

## WORKFLOW 2: Instagram DM AI Receptionist

*Same logic as WhatsApp, but triggered by Instagram DM webhook instead.*

**Key Differences:**
- Webhook path: `instagram-webhook`
- Message extraction adapts for Instagram's payload structure
- All Supabase tables receive `channel: 'instagram'` instead of `'whatsapp'`
- WATI integration replaced with Instagram Graph API for replies

*Use the same node structure as WhatsApp, adjusting paths and channel tags as needed.*

---

## WORKFLOW 3: Web Form Lead Capture

**Overview:**
Captures form submissions from your website, upserts contact in Supabase, and forwards to client CRM.

### Simplified Node Structure:
1. **Web Form Webhook** (Webhook) → path: `web-form-webhook`
2. **Extract Form Data** (Code) → Normalize form payload
3. **Upsert Contact** (HTTP) → POST to Supabase contacts
4. **Create Lead** (HTTP) → POST to Supabase leads
5. **CRM Adapter** (Code) → Format for client CRM
6. **Send to Client CRM** (HTTP) → POST to client's endpoint
7. **Log Payload** (HTTP) → Audit trail in Supabase

---

## SETUP CHECKLIST

- [ ] Create 4 credentials in n8n (Supabase, WATI, OpenAI, Resend)
- [ ] Build WhatsApp workflow (22 nodes)
- [ ] Build Instagram workflow (22 nodes, adapted)
- [ ] Build Web Form workflow (7 nodes)
- [ ] Test WhatsApp webhook: Set WATI Dashboard → Webhook → https://YOUR_N8N_INSTANCE/webhook/wati-webhook
- [ ] Test Instagram webhook: Instagram Graph API → your n8n instance
- [ ] Test Web Form webhook: Add to your website form submission handler
- [ ] Replace placeholders:
  - `YOUR_WATI_TENANT_ID`
  - `YOUR_CLIENT_CRM_WEBHOOK_URL`
  - `YOUR_SLACK_WEBHOOK_URL`
  - `YOUR_N8N_URL` (for webhook URLs sent to external services)
- [ ] Verify Supabase tables exist: `contacts`, `conversations`, `messages`, `leads`, `crm_payloads`
- [ ] Test end-to-end: Send test message → Verify in Supabase

---

## NOTES

- All HTTP nodes use **credentials** system in n8n — select the credential from the dropdown, don't hardcode keys
- JavaScript code blocks use `$input.first().json` to access incoming data
- Use `$('Node Name').first().json` to reference previous nodes
- Enable "Continue on error" for non-critical nodes (e.g., Slack alert should not break the workflow)
- All timestamps use ISO 8601 format with `new Date().toISOString()`
