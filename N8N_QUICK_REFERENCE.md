# n8n Quick Reference — Key Configs

## Supabase Base URL
```
https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/
```

## All HTTP Request Endpoints

### Contacts
```
POST   https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/contacts
GET    https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/contacts?phone=eq.PHONE
```

### Conversations
```
POST   https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/conversations
GET    https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/conversations?contact_id=eq.ID&channel=eq.whatsapp
```

### Messages
```
POST   https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/messages
```

### Leads
```
POST   https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/leads
```

### CRM Payloads (Audit)
```
POST   https://qnzaiplsqgiywfaebyrj.supabase.co/rest/v1/crm_payloads
```

## Supabase Headers (All Requests)
```
Authorization: Bearer YOUR_SUPABASE_SERVICE_KEY
Prefer: resolution=merge-duplicates,return=representation
Content-Type: application/json
```

## Key Expressions

### Extract WhatsApp Number (Normalize to E.164)
```javascript
const digits = waId.replace(/\D/g, '');
const phone = digits.startsWith('852') ? '+' + digits : '+852' + digits;
```

### Check Business Hours (HKT)
```javascript
const now = new Date();
const hkOffset = 8 * 60;
const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
const hkMinutes = (utcMinutes + hkOffset) % (24 * 60);
const hkDay = new Date(now.getTime() + hkOffset * 60000).getUTCDay();

const isWeekday = hkDay >= 1 && hkDay <= 6;
const isOpenHours = hkMinutes >= 540 && hkMinutes < 1140; // 9am-7pm
const isBusinessHours = isWeekday && isOpenHours;
```

### Extract Booking Intent from AI Response
```javascript
const aiRaw = $input.first().json.choices[0].message.content;
let bookingIntent = null;
const intentMatch = aiRaw.match(/\[BOOKING_INTENT\]([\s\S]*?)\[\/BOOKING_INTENT\]/);
if (intentMatch) {
  try { bookingIntent = JSON.parse(intentMatch[1]); } catch(e) {}
}
const aiText = aiRaw.replace(/\[BOOKING_INTENT\][\s\S]*?\[\/BOOKING_INTENT\]/g, '').trim();
```

## OpenAI System Prompt (for Aria)
```
You are Aria, a warm and professional AI receptionist for a Hong Kong med-aesthetics clinic. Your job is to answer enquiries, explain services, and capture booking intent after hours.

Guidelines:
- Respond naturally in the same language the client uses (English or Traditional Chinese)
- Keep replies concise — WhatsApp messages, not essays
- Never quote prices; say the team will confirm during consultation
- If the client wants to book or shows strong interest, extract their intent using this exact pattern at the END of your reply:
[BOOKING_INTENT]{"name":"<name>","service":"<service>","preferred_time":"<time or empty>"}[/BOOKING_INTENT]
- Clinic hours: Mon–Sat 9am–7pm HKT. Outside these hours you are handling the conversation; team will follow up next business day.
```

## Webhook Paths
- **WhatsApp**: `/webhook/wati-webhook`
- **Instagram**: `/webhook/instagram-webhook`
- **Web Form**: `/webhook/web-form-webhook`

## Credentials to Create

1. **Supabase Service Key** → Used in: All Supabase HTTP requests
2. **WATI API Key** → Used in: Send WATI Reply node
3. **OpenAI API Key** → Used in: Call OpenAI node
4. **Resend API Key** → Used in: (Future email notifications)

## Node Type Reference

| Node Type | Purpose |
|-----------|---------|
| `n8n-nodes-base.webhook` | Receive HTTP POST events |
| `n8n-nodes-base.respondToWebhook` | Send 200 OK back to caller |
| `n8n-nodes-base.code` | JavaScript code execution |
| `n8n-nodes-base.if` | Conditional branching |
| `n8n-nodes-base.httpRequest` | Make HTTP requests (GET/POST/etc) |

## Common n8n Syntax

### Access incoming data
```javascript
$input.first().json          // First item from input
$input.first().json.field    // Specific field
```

### Reference another node's output
```javascript
$('Node Name').first().json         // First item from named node
$('Node Name').first().json.field   // Specific field from node
```

### Date/Time
```javascript
new Date().toISOString()     // Current time in ISO 8601
```

### Expressions in JSON bodies
Wrap in double braces:
```json
{
  "field": "{{ $json.value }}",
  "nested": "{{ $('Other Node').first().json.id }}"
}
```

## Testing Webhooks

### WhatsApp (WATI)
Send test from WATI Dashboard → Webhooks → Send Test Event
Expected payload:
```json
{
  "waId": "+85298765432",
  "senderName": "Test User",
  "text": "Hello",
  "eventType": "message",
  "owner": false
}
```

### Web Form
Simulate from your website or use curl:
```bash
curl -X POST https://YOUR_N8N_INSTANCE/webhook/web-form-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+85298765432",
    "email": "john@example.com",
    "service": "Botox",
    "preferred_date": "2026-04-01"
  }'
```

## Debugging Tips

1. **View node output**: Click node → "Execute Node" → Open "Output" tab
2. **Check Supabase data**: https://supabase.com → project → Tables
3. **Monitor n8n executions**: Dashboard → Executions → Filter by workflow
4. **Test HTTP requests**: Set "Never Error" temporarily to see response in next node
5. **Log to console**: Use `console.log()` in Code nodes (visible in n8n execution logs)

## Placeholder Replacements Needed

Before going live:
```
YOUR_WATI_TENANT_ID          → From WATI Dashboard
YOUR_CLIENT_CRM_WEBHOOK_URL  → Client's CRM webhook endpoint
YOUR_SLACK_WEBHOOK_URL       → Your Slack App Incoming Webhook
YOUR_N8N_URL                 → Your n8n Cloud instance URL (e.g., https://scalartest.app.n8n.cloud)
```
