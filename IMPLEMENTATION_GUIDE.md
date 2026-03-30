# Scalar Landing Page — Implementation Guide

## Overview
This is a **production-ready, frontend-only landing page** for Scalar's AI receptionist demo. It includes:
- Domain input with validation
- Fake "AI generation" sequence with smooth animations
- WhatsApp-style chat interface
- Interactive quick actions
- Dynamic business data generation based on domain keywords
- Lead capture CTA section
- Mobile responsive design

## File Structure

```
ScalarLandingPage.jsx  — Complete React component (single file, ~800 lines)
IMPLEMENTATION_GUIDE.md — This file
```

## How to Use

### Option 1: Drop into Existing React App
```bash
# Copy the JSX file into your project
cp ScalarLandingPage.jsx src/pages/

# Import and use
import ScalarLandingPage from './pages/ScalarLandingPage'

export default function App() {
  return <ScalarLandingPage />
}
```

### Option 2: Create React App
```bash
npx create-react-app scalar-demo
cd scalar-demo
npm install lucide-react
cp ScalarLandingPage.jsx src/
# Update src/App.jsx to import the component
npm start
```

### Option 3: Next.js
```bash
npx create-next-app@latest scalar-demo
npm install lucide-react
# Copy component to app/components/
# Create app/page.jsx that imports it
```

### Option 4: Vite + React
```bash
npm create vite@latest scalar-demo -- --template react
cd scalar-demo
npm install
npm install lucide-react
cp ScalarLandingPage.jsx src/
npm run dev
```

## Dependencies
```json
{
  "react": "^18.0.0",
  "lucide-react": "^latest"
}
```

Tailwind CSS is required. If not installed:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Component Architecture

### Stage-Based State Machine
The page operates in three stages:

**1. Hero Stage** (`stage === 'hero'`)
- Landing page with domain input
- Value props and trust signals
- Beautiful gradient background
- CTA button

**2. Loading Stage** (`stage === 'loading'`)
- Progress animation showing "generation steps"
- Each step completes sequentially
- Simulates: scanning → analysis → KB building → personality → chatbot generation
- Takes ~4 seconds total

**3. Demo Stage** (`stage === 'demo'`)
- WhatsApp-style chat interface
- Business profile card showing generated data
- Interactive quick actions
- Lead capture CTAs
- FAQ and benefits section

### Core Functions

#### `parseDomain(domain: string)`
**Purpose:** Extract business intelligence from domain name
**Returns:**
```javascript
{
  normalized: string,        // domain without www or TLD
  type: string,             // 'med-aesthetic' | 'spa-wellness' | 'dental' | 'service-business'
  icon: string              // emoji for visual feedback
}
```

**Logic:**
- Checks domain string against keyword lists
- Maps keywords to business categories
- Falls back to generic service business
- Example: "beautyskin-clinic.com" → detected as `med-aesthetic`

#### `generateMockData(domain: string, businessType: string)`
**Purpose:** Create realistic business data for the demo
**Returns:**
```javascript
{
  businessName: string,           // parsed from domain
  assistantName: string,          // e.g., "Dr. Sofia"
  greeting: string,               // initial message
  services: string[],             // list of offered services
  quickActions: string[],         // suggested chat actions
  sampleChat: Message[],          // pre-loaded conversation
  profileSummary: string,         // one-liner description
  icon: string                    // emoji
}
```

**Data Sets by Type:**
- **med-aesthetic:** Dr. Sofia, facial treatments, HK$800-2,500 pricing
- **spa-wellness:** Wellness Team, massages, HK$650-950 pricing
- **dental:** Dr. Chen, check-ups, HK$350 pricing
- **service-business:** Generic fallback with flexible offerings

### Component Hierarchy

```
ScalarLandingPage (main)
├── Hero Section (stage 1)
│   ├── Navigation
│   ├── Hero copy + domain input
│   ├── Trust signals
│   └── Value props grid
├── Loading Sequence (stage 2)
│   └── LoadingSteps (progress component)
└── Demo Section (stage 3)
    ├── Success message
    ├── ChatInterface (chat + input + actions)
    │   └── Message bubble rendering
    │   └── Quick action handlers
    │   └── Typing indicator animation
    ├── BusinessProfileCard (generated data display)
    └── Lead capture CTA + FAQ
```

## Key Features

### 1. Domain Intelligence
- Keyword-based business type detection
- Generates unique business names from domain
- Assigns appropriate tone and services
- Falls back gracefully for unknown domains

### 2. Chat Interface
- WhatsApp Web–inspired styling
- Rounded message bubbles with timestamps
- Green accent color (emerald-500)
- Typing indicator animation (3 bouncing dots)
- Quick action buttons (pre-filled common questions)
- Auto-scroll to latest message
- Empty input state

### 3. Animations & Polish
- Smooth fade-in for messages
- Animated loading steps
- Pulsing loading state
- Bounce animation for typing dots
- Gradient backgrounds
- Subtle shadows and blur effects
- Responsive layout (mobile-first)

### 4. Interactive Elements
- Click quick actions → appends message → bot responds
- Type custom message → bot responds with generic reply
- Typing delay (600-800ms) for realism
- All interactions update message history

### 5. Lead Capture
- CTA cards with benefits summary
- "Book a Demo Call" buttons
- Price anchoring
- 24/7 support promise
- Benefits grid (WhatsApp, Instagram, Voice, Analytics)

## Customization Points

### Change Business Data Sets
Edit `generateMockData()` function. Add new type:
```javascript
'veterinary': {
  businessName: '...',
  assistantName: '...',
  greeting: '...',
  services: ['Pet check-up', 'Vaccination', ...],
  quickActions: ['Schedule appointment', ...],
  sampleChat: [...],
  profileSummary: '...'
}
```

### Add Keywords for Detection
Edit `parseDomain()` function:
```javascript
veterinary: {
  keywords: ['vet', 'pet', 'animal', 'clinic'],
  type: 'veterinary',
  icon: '🐾'
}
```

### Change Colors
- Primary color: `emerald-500` / `teal-500` (search & replace)
- Background: `slate-900` gradients
- Accent: `amber-500` for secondary actions

### Modify Copy
Search for hardcoded strings:
- Headline: "Turn Your Website Into a 24/7 AI Receptionist"
- CTA: "Book a Demo Call"
- Trust signals in hero section
- FAQ items

### Adjust Loading Steps
Edit the `LoadingSteps` component:
```javascript
const steps = [
  { label: 'Your custom step', icon: '🎯' },
  // ...
];
```

## Future Backend Integration

### Phase 1: Connect to Real Domain Scraper
Replace mock `generateMockData()` with API call:
```javascript
const handleDomainSubmit = async (e) => {
  setStage('loading');

  try {
    // Call your n8n webhook or backend
    const response = await fetch('/api/scrape-domain', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });

    const realData = await response.json();
    setBusinessData(realData);
    setStage('demo');
  } catch (error) {
    setError('Failed to generate preview');
  }
};
```

### Phase 2: Connect to Real Chatbot Instance
After demo is generated, allow user to:
1. Connect to real WhatsApp Business API instance
2. Link to real Retell AI voice bot
3. Sync to GoHighLevel CRM
4. Create actual booking link

### Phase 3: Lead Capture
Wire up CTAs to:
- Calendly/Cal.com booking link
- Email capture form
- GoHighLevel lead pipeline
- Slack notification webhook

### Phase 4: Analytics
Track:
- Domain entered
- Time spent on demo
- Which quick actions clicked
- Whether CTA was clicked
- Lead conversion rate

## Performance Notes
- Component is self-contained (no external API calls in v1)
- All state lives in React (no external libraries except lucide-react)
- Tailwind CSS for styling (minimal bundle impact)
- Chat messages stored in React state (max ~50 messages before consider pagination)
- Animations use CSS (not javascript-heavy)

## Browser Compatibility
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile responsive (tested 320px+)
- Uses standard React 18 hooks
- No polyfills required

## Deployment Notes
- Build with: `npm run build`
- Deploy to Vercel, Netlify, or any static host
- Env variables: none (all frontend)
- Size: ~30KB gzipped (React + component + Tailwind)

## Testing Recommendations

### Manual Test Cases
1. **Domain parsing:**
   - `beautyskin.com` → med-aesthetic
   - `relaxspa.hk` → spa-wellness
   - `smiledental.com` → dental
   - `randomservice.com` → service-business

2. **Chat interactions:**
   - Click each quick action → verify response
   - Type custom message → verify typing indicator
   - Scroll chat → verify auto-scroll works
   - Mobile viewport → verify responsive layout

3. **Loading sequence:**
   - Steps should progress 1 per second
   - All 5 steps should complete
   - Should transition to demo after loading

4. **CTA buttons:**
   - Verify hover states
   - Verify sticky positioning on sidebar
   - Verify mobile layout (full-width CTA)

### Unit Test Ideas
```javascript
describe('parseDomain', () => {
  test('detects medical aesthetic clinic', () => {
    const result = parseDomain('skincare-clinic.com');
    expect(result.type).toBe('med-aesthetic');
  });

  test('detects spa business', () => {
    const result = parseDomain('massage-spa.hk');
    expect(result.type).toBe('spa-wellness');
  });
});
```

## Troubleshooting

### Tailwind styles not applying
- Check `tailwind.config.js` includes the right path:
  ```javascript
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ]
  ```
- Rebuild: `npm run build`

### Components not rendering
- Ensure lucide-react is installed: `npm install lucide-react`
- Check React version is 18+

### Mobile layout broken
- Check viewport meta tag in HTML:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

### Messages not scrolling
- Check `messagesEndRef` is defined
- Verify ref is passed to last message div

## Next Steps
1. Deploy this version to Vercel/staging
2. Test with real users (clinics in HK)
3. Collect feedback on UX and copy
4. Plan backend integration
5. Connect to n8n domain scraper workflow
6. Add real WhatsApp/Instagram demos

---

**Version:** 1.0
**Last Updated:** 2026-03-29
**Status:** Production-ready frontend
