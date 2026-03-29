# Customization Quick Start — Common Changes

## 1. Change Headline & Main Copy

**File:** `ScalarLandingPage.jsx` (Hero section)

Find this:
```jsx
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
  Turn Your Website Into a{' '}
  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
    24/7 AI Receptionist
  </span>
</h1>
```

Replace with your headline. Keep the gradient span for the emphasized part.

**Other key copy locations:**
- Line ~190: Domain input placeholder
- Line ~235: Loading page headline
- Line ~650+: CTA section copy
- Line ~700: FAQ items

---

## 2. Change Brand Colors

**Current palette:**
- Primary: `emerald-500` / `emerald-600` (green)
- Accent: `teal-500` / `teal-600` (teal)
- Background: `slate-900` (dark navy)

**To change all colors at once:**
1. Find & Replace: `emerald` → `blue` (or your color)
2. Find & Replace: `teal` → `cyan` (or your secondary color)
3. Find & Replace: `slate` → `gray` (or your neutral)

**Or update individual sections:**

*Navigation bar (line ~155):*
```jsx
<div className="font-bold text-xl tracking-tight">
  <span className="text-emerald-400">Scalar</span>
</div>
```

*Input button (line ~197):*
```jsx
className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
```

*Chat interface (line ~400):*
```jsx
className="bg-emerald-500 text-white rounded-2xl px-4 py-2"  // user messages
className="bg-emerald-50" // header background
```

*CTA button (line ~670):*
```jsx
className="bg-gradient-to-r from-emerald-500 to-teal-500"
```

---

## 3. Change Business Data Sets

**File:** `ScalarLandingPage.jsx`, function `generateMockData()`

Current data sets:
- `med-aesthetic`
- `spa-wellness`
- `dental`
- `service-business` (fallback)

**To add a new type:**

1. Add detection in `parseDomain()` (~line 25):
```javascript
const businessTypes = {
  // ... existing types ...
  veterinary: {
    keywords: ['vet', 'pet', 'animal', 'clinic'],
    type: 'veterinary',
    icon: '🐾',
  }
};
```

2. Add data in `generateMockData()` (~line 75):
```javascript
'veterinary': {
  businessName: domain.replace(...),
  assistantName: 'Dr. Paws',
  greeting: 'Hello! Welcome to our veterinary clinic. How can we help your furry friend? 🐾',
  services: ['General Check-up', 'Vaccinations', 'Surgery', 'Grooming'],
  quickActions: ['Book appointment', 'Emergency', 'Vaccination schedule', 'Pricing'],
  sampleChat: [
    { type: 'user', text: 'My dog needs a check-up', time: '3:20 PM' },
    { type: 'bot', text: 'Of course! We\'d love to see your pup. When works best? 🐕', time: '3:20 PM' },
    // ... more messages ...
  ],
  profileSummary: 'Full-service veterinary clinic with 24/7 emergency care',
}
```

---

## 4. Change Sample Chat Messages

**File:** `ScalarLandingPage.jsx`, function `generateMockData()`

Each data set has a `sampleChat` array:
```javascript
sampleChat: [
  { type: 'user', text: 'Hi! I\'m interested in your services', time: '2:34 PM' },
  { type: 'bot', text: 'Great! We\'d love to help...', time: '2:34 PM' },
  // ... more messages ...
]
```

**To customize:**
- Keep `type` as `'user'` or `'bot'`
- Update `text` to match your business
- `time` is auto-formatted, leave as-is

**Example for a fitness gym:**
```javascript
{ type: 'user', text: 'Do you have crossfit classes?', time: '10:15 AM' },
{ type: 'bot', text: 'Yes! We have daily CrossFit classes at 6 AM, noon, and 5 PM. Want to try our intro class? 💪', time: '10:15 AM' },
```

---

## 5. Change Quick Actions

**File:** `ScalarLandingPage.jsx`, function `generateMockData()`

Each data set has `quickActions`:
```javascript
quickActions: ['Ask about treatments', 'Book consultation', 'Opening hours', 'Pricing', 'Location'],
```

**To customize:**
- Keep 4-5 items
- Make them action-oriented ("Book consultation" not "What is booking")
- Reference actual services

**Example for beauty salon:**
```javascript
quickActions: ['Hair styles', 'Nail services', 'Book appointment', 'Pricing', 'Promotions'],
```

---

## 6. Change Loading Steps

**File:** `ScalarLandingPage.jsx`, component `LoadingSteps()`

Current steps:
```javascript
const steps = [
  { label: 'Analyzing website', icon: '🔍' },
  { label: 'Identifying services', icon: '📋' },
  { label: 'Building knowledge base', icon: '🧠' },
  { label: 'Creating personality', icon: '✨' },
  { label: 'Generating chatbot', icon: '🤖' },
];
```

**To customize:**
- Update `label` to match your process
- Update `icon` to relevant emoji
- Keep 4-6 steps (optimal)

**Example:**
```javascript
const steps = [
  { label: 'Scanning your website', icon: '🔍' },
  { label: 'Extracting business info', icon: '📋' },
  { label: 'Understanding your services', icon: '🎯' },
  { label: 'Training AI receptionist', icon: '🤖' },
  { label: 'Setting up WhatsApp bot', icon: '💬' },
];
```

---

## 7. Change CTA Buttons & Copy

**File:** `ScalarLandingPage.jsx`, demo stage (line ~650+)

**Primary CTA:**
```jsx
<button className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl">
  Book a Demo Call
</button>
```

Replace "Book a Demo Call" with your CTA text.

**Secondary CTA:**
```jsx
<button className="w-full border-2 border-white text-white font-semibold py-2.5 rounded-xl">
  See Pricing
</button>
```

Replace "See Pricing" with your CTA text.

**Benefits list (line ~680):**
```jsx
<div className="flex items-center gap-2">
  <Zap size={14} />
  <span>Setup in 48 hours</span>
</div>
```

Update benefit text to match your service.

---

## 8. Change Domain Input Placeholder

**File:** `ScalarLandingPage.jsx`, line ~190

```jsx
placeholder="e.g., beautyspa.hk or medskin.com"
```

Change to examples relevant to your market:
```jsx
placeholder="e.g., yoursalon.hk or yourdentalclinic.com"
```

---

## 9. Change Timezone / Time Format

**File:** `ScalarLandingPage.jsx`, in `ChatInterface` component

Current (line ~515):
```javascript
const time = new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
```

**For 24-hour format:**
```javascript
const time = new Date().toLocaleTimeString('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
```

**For Hong Kong locale:**
```javascript
const time = new Date().toLocaleTimeString('zh-HK', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
```

---

## 10. Change Chat Bubble Colors

**File:** `ScalarLandingPage.jsx`, in `ChatInterface` component (line ~450)

**User message bubbles:**
```jsx
className={`bg-emerald-500 text-white rounded-2xl px-4 py-2`}
```

Change `bg-emerald-500` to your color.

**Bot message bubbles:**
```jsx
className={`bg-white text-gray-900 border border-gray-200 rounded-2xl`}
```

Change `bg-white` and `border-gray-200` as needed.

---

## 11. Add Company Logo

**Option 1: In Navigation**

File: `ScalarLandingPage.jsx`, navigation bar (~line 155)

Replace:
```jsx
<div className="font-bold text-xl tracking-tight">
  <span className="text-emerald-400">Scalar</span>
</div>
```

With:
```jsx
<img src="/logo.svg" alt="Scalar" className="h-8 w-auto" />
```

Place your logo in `public/logo.svg`

**Option 2: In Chat Header**

File: `ChatInterface` component (~line 370)

Replace:
```jsx
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
  {data.businessName.charAt(0)}
</div>
```

With:
```jsx
<img src={data.logoUrl} alt={data.businessName} className="w-10 h-10 rounded-full" />
```

Then include `logoUrl` in your business data.

---

## 12. Add Custom Footer

**File:** `ScalarLandingPage.jsx`, end of demo stage (~line 750)

Add after the last section:
```jsx
<footer className="bg-gray-900 text-gray-400 text-center py-8 mt-12">
  <p className="text-sm">© 2026 Scalar. All rights reserved. | <a href="#" className="text-emerald-400">Privacy</a> | <a href="#" className="text-emerald-400">Terms</a></p>
</footer>
```

---

## 13. Disable/Hide Sections

**To hide the FAQ section:**
Find the FAQ section (~line 730) and wrap in a conditional:
```jsx
{false && (
  <div className="bg-white rounded-2xl p-8 border border-gray-200">
    {/* FAQ content */}
  </div>
)}
```

**To hide the "What You'll Get" grid:**
Similarly, wrap that section with `{false && (...)}`

**To hide quick actions in chat:**
Find `quickActions` rendering (~line 415) and wrap in conditional.

---

## 14. Change Business Names Generation

**File:** `ScalarLandingPage.jsx`, in `generateMockData()`

Current logic:
```javascript
businessName: domain.replace(/\.[a-z]+$/, '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
```

**This converts:**
- `beautyspa-hk.com` → "Beautyspa Hk"
- `skin_clinic.hk` → "Skin Clinic"

To use static names instead:
```javascript
const businessNames = {
  'med-aesthetic': ['Glow Clinic', 'Skin Essence', 'Beauty Lab'],
  'spa-wellness': ['Zenith Spa', 'Wellness Haven', 'Serenity Spa'],
  'dental': ['Smile Studio', 'Dental Wellness', 'Bright Smile'],
};

businessName: businessNames[businessType][Math.floor(Math.random() * businessNames[businessType].length)],
```

---

## 15. A/B Test Headlines

**Create two versions:**

**Version A (current):**
```jsx
Turn Your Website Into a 24/7 AI Receptionist
```

**Version B:**
```jsx
Stop Losing Leads After Hours
```

**To switch between versions:**
```jsx
const headline = false ? "Version A" : "Version B";

<h1>{headline}</h1>
```

Set `false ? true` to switch, then swap. Or use environment variables.

---

## 16. Change Chat Font Size

**File:** `ScalarLandingPage.jsx`, in `ChatInterface`

**Message text:**
```jsx
className="text-sm"  // Change to text-xs, text-base, etc.
```

**Input field:**
```jsx
className="text-sm"  // Same options
```

---

## 17. Add Custom Icons to Quick Actions

**Current:**
```jsx
<button>{action}</button>
```

**Add icons:**
```jsx
const icons = {
  'Ask about treatments': '💆',
  'Book consultation': '📅',
  'Opening hours': '🕐',
  'Pricing': '💰',
};

<button>
  {icons[action]} {action}
</button>
```

---

## 18. Change Loading Duration

**File:** `ScalarLandingPage.jsx`, in `handleDomainSubmit()`

Current (~line 845):
```javascript
const interval = setInterval(() => {
  // ...
}, 800);  // 800ms between steps
```

Change `800` to adjust speed:
- `600` = faster loading
- `1000` = slower loading
- Total time = interval × number of steps

---

## 19. Customize Trust Signals

**File:** `ScalarLandingPage.jsx`, line ~208

```jsx
<div className="flex items-start gap-3">
  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
  <span className="text-gray-300">Works with any clinic, spa, salon, or service business</span>
</div>
```

Update the text to match your positioning.

---

## 20. Change Domain Validation

**Current:** Accepts any non-empty string

**To validate domain format:**

File: `ScalarLandingPage.jsx`, in `handleDomainSubmit()`

Add before `setError('')`:
```javascript
const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

if (!domainRegex.test(domain)) {
  setError('Please enter a valid domain (e.g., example.com)');
  return;
}
```

---

## Quick Customization Template

Copy this checklist and fill in your values:

```
[ ] Headline: ____________________________
[ ] Subheadline: ____________________________
[ ] Primary CTA text: ____________________________
[ ] Primary CTA destination: ____________________________
[ ] Brand color (primary): ____________________________
[ ] Brand color (secondary): ____________________________
[ ] Domain placeholder examples: ____________________________
[ ] Logo URL: ____________________________
[ ] Business types to support: ____________________________
[ ] Additional quick actions: ____________________________
[ ] FAQ items: ____________________________
[ ] Trust signals: ____________________________
```

---

## Testing Your Changes

After any customization:

1. **Check it looks right:**
   ```bash
   npm start
   ```

2. **Test domain detection:**
   - Enter: `beautyspa.hk` → Should show spa data
   - Enter: `skincare-clinic.com` → Should show med-aesthetic data
   - Enter: `random.com` → Should show fallback data

3. **Test interactions:**
   - Click quick actions → Messages appear
   - Type custom message → Bot responds
   - Try another domain → Page resets

4. **Test on mobile:**
   - Resize browser to 320px width
   - Verify buttons are tappable (44px+)
   - Verify text is readable

5. **Check console:**
   - Should be zero errors
   - Should be zero warnings (except maybe React strict mode)

---

## Common Mistakes

❌ **Forgetting quotes around strings**
```javascript
businessName: My Clinic  // ERROR
businessName: 'My Clinic'  // CORRECT
```

❌ **Breaking JSX syntax**
```jsx
<h1>Your Headline</h1>
// Don't put unescaped curly braces in text:
<h1>Your {unescaped} Text</h1>  // ERROR
<h1>Your {'{unescaped}'} Text</h1>  // CORRECT
```

❌ **Changing only one part of a color**
```jsx
// If using emerald-500, use same color family:
bg-emerald-500
hover:bg-emerald-600  // Good (darker shade of emerald)
hover:bg-red-600  // Bad (different color family)
```

❌ **Forgetting to test after changes**
- Always run `npm start` to verify
- Don't deploy without testing

---

## Need Help?

- Check the main `IMPLEMENTATION_GUIDE.md` for setup
- Check `ARCHITECTURE_NOTES.md` for design philosophy
- Look for comments in the code (lines starting with `//`)
- Search for the specific feature name in the file

---

**Version:** 1.0
**Last Updated:** 2026-03-29
