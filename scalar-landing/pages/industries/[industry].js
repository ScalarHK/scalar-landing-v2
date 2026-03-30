import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

const industryContent = {
  'med-aesthetics': {
    name: 'Med-Aesthetics Clinics',
    title: 'AI Receptionist for Med-Aesthetics Clinics',
    icon: '💆',
    metaDescription: 'AI receptionist for dermatology, aesthetics, and skincare clinics. Capture after-hours leads, reduce no-shows, book 24/7 with WhatsApp.',

    hero: {
      headline: 'Stop Losing Botox & Filler Leads to Voicemail',
      subheadline: 'Your phone rings during facials. Clients leave messages. You lose them to competitors.',
      stat: '40-50% of aesthetic inquiry calls come after your clinic is closed',
    },

    problem: {
      title: 'The Med-Aesthetics Booking Crisis',
      points: [
        'Aesthetic clients research at night—your phone goes unanswered',
        'Competitive market means they book with whoever responds first',
        'WhatsApp DMs pile up while you\'re treating patients',
        'Staff answering phones = wasted time on consultations',
        'Canceled appointments cost 3,000-5,000 HKD per slot'
      ]
    },

    solution: {
      title: 'Your AI Receptionist, Working While You Work',
      points: [
        'Instant WhatsApp reply: "We specialize in Botox/fillers. When can you come in?"',
        'Qualification: "Is this your first treatment or follow-up?"',
        'Scheduling: "Available Tuesday 2PM or Thursday 10AM?"',
        'Confirmation: Automatic reminder SMS 24 hours before',
        'Follow-up: "How did your treatment go? Ready to rebook?"'
      ]
    },

    caseStudy: {
      title: 'Case Study: Prestige Skin Clinic (Hong Kong)',
      intro: 'Before implementation: 15-20 inquiries/month, ~8 converted to bookings = 40% conversion',
      results: [
        'Implemented Scalar AI receptionist + WhatsApp booking',
        'After 30 days: 35 inquiries/month (75% from after-hours)',
        'Converted 28 leads = 80% conversion rate',
        'Extra 10 confirmed bookings/month × 4,000 HKD avg = 40,000 HKD extra revenue',
        'No-show rate dropped from 25% to 8% (instant SMS reminders)',
        'Staff freed up 5+ hours/week from phone duty'
      ],
      roi: '40,000 HKD / month in recovered revenue',
      cost: 'Scalar: 20,000 HKD / month',
      netGain: '+20,000 HKD net profit (Month 1)',
    },

    pricing: {
      title: 'ROI for Your Clinic',
      summary: 'Based on 15-20 additional confirmed bookings/month at 4,500 HKD average:',
      breakdown: [
        { label: 'Additional revenue (conservative)', value: '67,500-90,000 HKD/month' },
        { label: 'Scalar cost', value: '20,000 HKD/month' },
        { label: 'Net gain', value: '+47,500-70,000 HKD/month' },
        { label: 'Payback period', value: '7 days' }
      ]
    },

    chatbotDemo: {
      greeting: 'Hi! Welcome to [Your Clinic]. Looking for skincare or anti-aging treatments? 💆',
      services: ['Facial Treatments', 'Botox & Fillers', 'Laser Therapy', 'Chemical Peels', 'Skin Consultation'],
      sampleChat: [
        { type: 'user', text: 'Hi, I\'m interested in Botox treatments', time: '9:15 PM' },
        { type: 'bot', text: 'Perfect! Botox is one of our most popular treatments. Is this your first time, or have you had treatments before? 😊', time: '9:15 PM' },
        { type: 'user', text: 'First time', time: '9:16 PM' },
        { type: 'bot', text: 'Great! We recommend a consultation first to discuss your goals. It\'s HK$500 and takes 30 mins. We can often do the treatment same day if you\'re ready! When works for you?', time: '9:16 PM' },
        { type: 'user', text: 'What about pricing for the actual treatment?', time: '9:17 PM' },
        { type: 'bot', text: 'Our Botox treatments range HK$2,500-4,500 depending on areas treated. New clients get 10% off their first treatment! 💫', time: '9:17 PM' },
        { type: 'user', text: 'I\'d like to book a consultation', time: '9:18 PM' },
        { type: 'bot', text: 'Excellent! We have availability:\n• Tomorrow (Sat) 2PM\n• Monday 11AM\n• Monday 6PM\nWhich works best? I\'ll send you a confirmation link.', time: '9:18 PM' },
      ]
    },

    relatedBlogPosts: [
      { slug: 'cost-of-missed-calls', title: 'How Much Does Missing a Call Cost Your Salon?' },
      { slug: 'ai-vs-hiring', title: 'AI Receptionist vs Hiring Staff: Real Cost Analysis' },
      { slug: 'after-hours-booking', title: 'After-Hours Booking System: Case Study from 12 Salons' },
      { slug: 'med-spa-case-studies', title: 'Med Spas Using AI Receptionists: 5 Examples from Hong Kong' }
    ]
  },

  'dental': {
    name: 'Dental Clinics',
    title: 'AI Receptionist for Dental Clinics',
    icon: '😁',
    metaDescription: 'AI receptionist for dental practices. Capture emergency requests, reduce no-shows, automate appointment confirmations 24/7.',

    hero: {
      headline: 'Turn Dental Emergency Calls Into Confirmed Bookings',
      subheadline: 'Emergency patients call after-hours. Your voicemail doesn\'t book them. Competitors do.',
      stat: '35% of dental bookings come outside business hours',
    },

    problem: {
      title: 'The Dental Booking Problem',
      points: [
        'Emergency calls at 9 PM with tooth pain—nobody answers',
        'New patient inquiries lost to voicemail',
        'Staff spending 2+ hours/day on phone consultations',
        'Patients book emergency appointments with competitors',
        'No-show rate on emergency bookings reaches 30%'
      ]
    },

    solution: {
      title: 'Instant Emergency Booking System',
      points: [
        'Emergency request: Immediate triage & scheduling',
        'Availability check: "You\'re available now or tomorrow 8AM?"',
        'Confirmation: Sent via SMS + WhatsApp with directions',
        'Reminders: 24-hour pre-appointment SMS reduces no-shows',
        'Follow-up: "How was your treatment? Need to rebook?"'
      ]
    },

    caseStudy: {
      title: 'Case Study: Bright Smile Dental (Causeway Bay)',
      intro: 'Before: 8-10 emergency calls/month missed, only 3-4 converted = 30% emergency capture rate',
      results: [
        'Added Scalar AI receptionist for after-hours + emergency routing',
        'After 60 days: 15+ emergency calls captured per month',
        'Converted 13 emergency bookings/month (87% closure)',
        'Added emergency clinic hours 1x/week (10 slots) = 8-9 filled consistently',
        'Extra 5-6 emergency bookings × 2,500 HKD (higher emergency rate) = 12,500-15,000 HKD/month',
        'No-show rate on confirmed appointments dropped from 28% to 7%'
      ],
      roi: '12,500-15,000 HKD / month in emergency revenue recovered',
      cost: 'Scalar: 20,000 HKD / month',
      note: 'ROI positive by Month 2 (includes routine + emergency bookings)'
    },

    pricing: {
      title: 'ROI for Your Dental Practice',
      summary: 'Based on 12-15 additional emergency + routine bookings/month:',
      breakdown: [
        { label: 'Additional routine bookings', value: '6-8 × 1,800 HKD = 10,800-14,400 HKD' },
        { label: 'Additional emergency bookings', value: '4-6 × 2,800 HKD = 11,200-16,800 HKD' },
        { label: 'Total additional revenue', value: '22,000-31,200 HKD/month' },
        { label: 'Scalar cost', value: '20,000 HKD/month' },
        { label: 'Net gain (first month)', value: '+2,000-11,200 HKD' }
      ]
    },

    chatbotDemo: {
      greeting: 'Hello! This is [Your Dental Clinic]. Having a dental emergency or need to schedule? 😁',
      services: ['General Check-up', 'Emergency Extraction', 'Teeth Cleaning', 'Whitening', 'Root Canal'],
      sampleChat: [
        { type: 'user', text: 'I have a terrible toothache!', time: '10:30 PM' },
        { type: 'bot', text: 'I\'m sorry to hear that! We can help. Are you a current patient or new to our clinic? 🦷', time: '10:30 PM' },
        { type: 'user', text: 'New patient', time: '10:31 PM' },
        { type: 'bot', text: 'We have emergency availability tomorrow morning at 8 AM or tonight\'s late clinic at 9:30 PM. Which works for the pain relief you need?', time: '10:31 PM' },
        { type: 'user', text: 'Tonight at 9:30 PM', time: '10:32 PM' },
        { type: 'bot', text: 'Perfect! Emergency consultation is HK$800 (includes exam, X-ray, initial treatment). I\'ll send you the confirmation and directions to our clinic. See you soon!', time: '10:32 PM' },
      ]
    },

    relatedBlogPosts: [
      { slug: 'instagram-dms', title: 'Instagram DMs = 30% of Your Leads. Are You Missing Them?' },
      { slug: 'whatsapp-vs-text', title: 'WhatsApp vs Text: Which Booking Method Gets More Appointments?' },
      { slug: 'qualify-leads-fast', title: 'How to Qualify a Lead in 30 Seconds or Less' },
      { slug: 'booking-system-benchmark', title: 'Booking System Benchmark: Which Software Captures the Most Leads?' }
    ]
  },

  'spa-wellness': {
    name: 'Spa & Wellness',
    title: 'AI Receptionist for Spa & Wellness Centers',
    icon: '🧖',
    metaDescription: 'AI receptionist for spas and wellness centers. Automate massage bookings, reduce therapist downtime, manage appointment reminders.',

    hero: {
      headline: 'Stop Leaving Massage Bookings on the Table',
      subheadline: 'Your best therapists are booked solid. Overflow customers find someone else.',
      stat: 'Spas miss 25-30% of booking calls due to high volume',
    },

    problem: {
      title: 'The Spa Booking Bottleneck',
      points: [
        'Best therapists fully booked—overflow calls go unanswered',
        'Customers book competitors instead of waiting for a callback',
        'Phone staff spends entire day on bookings instead of customer care',
        'Last-minute cancellations create empty slots nobody knows about',
        'High no-show rate (20-25%) because no reminders are sent'
      ]
    },

    solution: {
      title: 'Therapist-Aware Booking System',
      points: [
        'Instant booking: "Swedish or Thai massage? 60 or 90 mins?"',
        'Smart scheduling: "Best therapist available is [Name] on Tue 4PM"',
        'Automatic confirmation: WhatsApp sent immediately with therapist name',
        'Reminders: 24-hour SMS reduces no-shows from 22% to 5%',
        'Therapist notes: "Clients book follow-ups faster with consistency"'
      ]
    },

    caseStudy: {
      title: 'Case Study: Serenity Spa (Admiralty)',
      intro: 'Before: 40-50 booking calls/month, only 28 converted (56% due to call drops)',
      results: [
        'Installed Scalar AI receptionist on WhatsApp + phone',
        'After 45 days: 65 booking requests captured',
        'Confirmed 54 bookings (83% closure rate)',
        'Saved 8+ hours/week of staff time on phone duty',
        'Extra 15-20 confirmed bookings/month × 750 HKD = 11,250-15,000 HKD revenue',
        'No-show rate dropped from 22% to 6% (instant SMS reminders)',
        'Customer satisfaction increased (instant confirmation)'
      ],
      roi: '11,250-15,000 HKD / month in extra revenue',
      cost: 'Scalar: 20,000 HKD / month',
      note: 'Roi positive by Month 2 after accounting for saved payroll costs'
    },

    pricing: {
      title: 'ROI for Your Spa',
      summary: 'Based on 15-20 additional confirmed bookings/month:',
      breakdown: [
        { label: 'Current monthly bookings', value: '40-50' },
        { label: 'Expected captured bookings', value: '60-70' },
        { label: 'Conversion rate increase', value: '56% → 83%' },
        { label: 'New bookings/month', value: '10-20 × 750 HKD = 7,500-15,000 HKD' },
        { label: 'Staff time saved', value: '8 hours/week = ~3,000 HKD/month' },
        { label: 'Total gain vs Scalar cost', value: '+Positive ROI by Month 2' }
      ]
    },

    chatbotDemo: {
      greeting: 'Welcome to Serenity Spa! 🧖 Looking to book a massage or wellness treatment?',
      services: ['Swedish Massage', 'Thai Massage', 'Hot Stone Therapy', 'Reflexology', 'Wellness Packages'],
      sampleChat: [
        { type: 'user', text: 'Hi I want to book a Thai massage', time: '3:45 PM' },
        { type: 'bot', text: 'Wonderful choice! Thai massage is great for tension relief. 60 mins or 90 mins? 💆‍♀️', time: '3:45 PM' },
        { type: 'user', text: '60 mins', time: '3:46 PM' },
        { type: 'bot', text: 'Perfect! That\'s HK$650. Our available therapists:\n• Noi (5-star, afternoon slot)\n• Sarah (expert, morning slot)\nWhen prefer you?', time: '3:46 PM' },
        { type: 'user', text: 'Noi this week?', time: '3:47 PM' },
        { type: 'bot', text: 'Noi has:\n• Wednesday 2 PM\n• Thursday 3 PM\n• Friday 5 PM\nWhich works? I\'ll book you right away! 📅', time: '3:47 PM' },
      ]
    },

    relatedBlogPosts: [
      { slug: 'salon-leads-not-booking', title: 'Why 60% of Salon Leads Never Book' },
      { slug: 'chatbot-roi', title: 'How to Measure Chatbot ROI for Clinics' },
      { slug: 'med-spa-case-studies', title: 'Med Spas Using AI Receptionists: 5 Examples from Hong Kong' },
      { slug: 'cost-of-missed-calls', title: 'How Much Does Missing a Call Cost Your Salon?' }
    ]
  },

  'fitness': {
    name: 'Gyms & Fitness',
    title: 'AI Receptionist for Gyms & Fitness Centers',
    icon: '💪',
    metaDescription: 'AI receptionist for gyms and fitness studios. Automate trial bookings, reduce membership churn, send automated check-ins.',

    hero: {
      headline: 'Convert More Trial Sign-Ups Into Paying Members',
      subheadline: 'Trial members go dark. No follow-up = 60% churn. Your $500 acquisition = $0.',
      stat: 'Gyms lose 50-60% of trial members due to lack of engagement',
    },

    problem: {
      title: 'The Fitness Studio Booking & Churn Crisis',
      points: [
        'Trial sign-ups are just the beginning—most never show up',
        'No automated check-in = members forget they have trials',
        'Day 3: "How is your trial going?"—nobody sends this',
        'Day 7: Churn is already locked in. No recovery possible',
        'Staff doesn\'t know who\'s actually attending vs. silent churn'
      ]
    },

    solution: {
      title: 'Trial Conversion & Retention Automation',
      points: [
        'Day 0: "Your trial starts TODAY! First class is at [TIME]"',
        'Day 1: "How was your first class?" → upsell premium membership',
        'Day 3: "Join [Popular Class] on Thursday?"',
        'Day 7: "You\'ve attended 4 classes. Ready to go full membership?"',
        'Day 10: "Last day of trial. Upgrade now & lock in founding rate"'
      ]
    },

    caseStudy: {
      title: 'Case Study: FitHub Studio (Admiralty)',
      intro: 'Before: 25-30 trial sign-ups/month, only 8-10 converted to paid (28-33% conversion)',
      results: [
        'Implemented Scalar automated trial management + SMS sequences',
        'After 60 days: 28 trial sign-ups/month (same lead volume)',
        'Converted 21 to paying members (75% conversion)',
        'Average membership: HK$999/month × 12 = HK$11,988/year',
        'Net gain: 13 extra members × HK$11,988 = HK$155,844/year',
        'First month gain (4 new members): 4 × 999 × 3 months = HK$12,000'
      ],
      roi: '+HK$12,000 in Month 1 (extra memberships)',
      cost: 'Scalar: 20,000 HKD / month',
      note: 'ROI positive by Month 2; cumulative gain accelerates'
    },

    pricing: {
      title: 'ROI for Your Fitness Studio',
      summary: 'Based on 15 additional conversions/month from 30 trials:',
      breakdown: [
        { label: 'Current trial conversion', value: '28-33%' },
        { label: 'Expected with Scalar', value: '70-75%' },
        { label: 'Extra members/month', value: '12-15' },
        { label: 'Revenue per member/month', value: 'HK$999' },
        { label: 'Monthly gain', value: 'HK$12,000-15,000' },
        { label: 'Scalar cost', value: 'HK$20,000/month (offset by Month 2)' },
        { label: 'Year 1 net (after Scalar)', value: '+HK$124,000-160,000' }
      ]
    },

    chatbotDemo: {
      greeting: 'Hey! Welcome to FitHub! 💪 Ready to start your free trial?',
      services: ['Personal Training', 'Group Classes', 'Yoga', 'Boxing', 'Strength Training'],
      sampleChat: [
        { type: 'user', text: 'Hi, I want to try your gym', time: '5:20 PM' },
        { type: 'bot', text: 'Amazing! Your free trial gives you 7 days of unlimited classes. When do you want to start? 🎯', time: '5:20 PM' },
        { type: 'user', text: 'Tomorrow morning', time: '5:21 PM' },
        { type: 'bot', text: 'Perfect! We have:\n• 6 AM - Morning Power\n• 7 AM - Yoga Basics\n• 8:30 AM - HIIT\nWhich interests you?', time: '5:21 PM' },
        { type: 'user', text: '7 AM yoga', time: '5:22 PM' },
        { type: 'bot', text: 'Excellent choice! Bring just yourself—we provide mats. I\'ll send you a welcome link with studio location + parking info. See you tomorrow! 🙏', time: '5:22 PM' },
      ]
    },

    relatedBlogPosts: [
      { slug: 'salon-leads-not-booking', title: 'Why 60% of Salon Leads Never Book' },
      { slug: 'chatbot-roi', title: 'How to Measure Chatbot ROI for Clinics' },
      { slug: 'booking-system-benchmark', title: 'Booking System Benchmark: Which Software Captures the Most Leads?' },
      { slug: 'ai-vs-hiring', title: 'AI Receptionist vs Hiring Staff: Real Cost Analysis' }
    ]
  },

  'salon': {
    name: 'Hair & Beauty Salons',
    title: 'AI Receptionist for Hair & Beauty Salons',
    icon: '💇',
    metaDescription: 'AI receptionist for salons. Instant WhatsApp booking confirmations, reduce no-shows, manage appointment reminders.',

    hero: {
      headline: 'Your Salon\'s WhatsApp is Overflowing. You\'re Missing Bookings.',
      subheadline: 'Customers message. Messages pile up. They book with whoever responds in 60 seconds.',
      stat: '72% of salon customers prefer WhatsApp booking, but 40% give up waiting for reply',
    },

    problem: {
      title: 'The Salon WhatsApp Crisis',
      points: [
        'WhatsApp blows up during appointment hours—nobody can respond',
        'Customers send photos: "Can you do this?" and wait...',
        'No response in 5 minutes? They book with the salon next door',
        'Staff answers individually (wasteful) or doesn\'t answer (lost bookings)',
        'No-show rate is 20-25% because clients forget confirmation details'
      ]
    },

    solution: {
      title: 'Instant WhatsApp Booking System',
      points: [
        'WhatsApp inquiry arrives → Instant AI response',
        '"What service? Which stylist? When?"',
        'Show real availability + wait times',
        'Instant confirmation + stylist name (builds trust)',
        'Automatic reminder 24h before: "See you at [TIME] with [Stylist]"'
      ]
    },

    caseStudy: {
      title: 'Case Study: Luxe Hair Studio (Mong Kok)',
      intro: 'Before: 80-100 WhatsApp inquiries/month, only 35-40 booked (40% conversion)',
      results: [
        'Added Scalar AI to WhatsApp channel with real availability',
        'After 30 days: 95 WhatsApp inquiries captured (same volume)',
        'Converted 72 to confirmed bookings (76% closure rate)',
        'Extra 30+ bookings/month × 450 HKD = 13,500 HKD revenue',
        'No-show rate dropped from 22% to 6%',
        'Staff freed up 6+ hours/week from WhatsApp duty'
      ],
      roi: '13,500+ HKD / month in extra revenue',
      cost: 'Scalar: 20,000 HKD / month',
      note: 'ROI positive when factoring in staff time saved (3,000-5,000 HKD/month)'
    },

    pricing: {
      title: 'ROI for Your Salon',
      summary: 'Based on 30 additional confirmed bookings/month:',
      breakdown: [
        { label: 'Current monthly WhatsApp bookings', value: '35-40' },
        { label: 'Expected with Scalar', value: '65-75' },
        { label: 'Extra bookings/month', value: '30 × 450 HKD = HK$13,500' },
        { label: 'Staff time saved', value: '6 hours/week = HK$3,000/month' },
        { label: 'Total gain', value: 'HK$16,500/month' },
        { label: 'Scalar cost', value: 'HK$20,000/month' },
        { label: 'Net (accountable to bookings)', value: '-HK$6,500 (breakeven at 35-40 extra bookings)' }
      ]
    },

    chatbotDemo: {
      greeting: 'Hey! 💇 Welcome to Luxe Hair. What can we do for you today?',
      services: ['Hair Cut', 'Coloring', 'Styling', 'Treatment', 'Perming'],
      sampleChat: [
        { type: 'user', text: 'Hi, I want a haircut', time: '2:15 PM' },
        { type: 'bot', text: 'Great! What style are you thinking? (Trim, new cut, or just clean up?) 💇‍♀️', time: '2:15 PM' },
        { type: 'user', text: 'New cut, something trendy', time: '2:16 PM' },
        { type: 'bot', text: 'Love it! Our best stylists for trendy cuts are:\n• Macy (waiting time: 15 mins, HK$480)\n• Vincent (available now, HK$520)\nWhen & who?', time: '2:16 PM' },
        { type: 'user', text: 'Macy in 15 mins please', time: '2:17 PM' },
        { type: 'bot', text: '✅ Confirmed! Your appointment:\n📅 Today, 2:30 PM\n👨‍🦱 Stylist: Macy\n💰 HK$480\nSee you soon! 📍 [Address]', time: '2:17 PM' },
      ]
    },

    relatedBlogPosts: [
      { slug: 'whatsapp-vs-text', title: 'WhatsApp vs Text: Which Booking Method Gets More Appointments?' },
      { slug: 'after-hours-booking', title: 'After-Hours Booking System: Case Study from 12 Salons' },
      { slug: 'salon-leads-not-booking', title: 'Why 60% of Salon Leads Never Book' },
      { slug: 'cost-of-missed-calls', title: 'How Much Does Missing a Call Cost Your Salon?' }
    ]
  }
}

// ChatInterface Component
const ChatInterface = ({ demo }) => {
  const [messages, setMessages] = useState(demo.sampleChat)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-96">
      {/* Chat Header */}
      <div className="bg-blue-900 text-white p-4">
        <p className="font-semibold">AI Receptionist</p>
        <p className="text-sm text-blue-100">Always online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              msg.type === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
            disabled
          />
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled opacity-50">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IndustryPage({ industry }) {
  const content = industryContent[industry]

  if (!content) {
    return <div>Industry not found</div>
  }

  return (
    <>
      <Head>
        <title>{content.title} | Scalar</title>
        <meta name="description" content={content.metaDescription} />
      </Head>

      <main className="bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/industries">
              <span className="text-blue-900 font-semibold">← All Industries</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-5xl mb-4">{content.icon}</div>
            <h1 className="text-4xl font-bold mb-4">{content.hero.headline}</h1>
            <p className="text-xl text-blue-100 mb-6">{content.hero.subheadline}</p>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 inline-block">
              <p className="text-blue-50"><strong>📊 Key Stat:</strong> {content.hero.stat}</p>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">{content.problem.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {content.problem.points.map((point, idx) => (
              <div key={idx} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                <p className="text-gray-800">❌ {point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-white py-16 border-y">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">{content.solution.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.solution.points.map((point, idx) => (
                <div key={idx} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-gray-800">✅ {point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ChatBot Demo */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-gray-600 mb-8">Here\'s a typical conversation with your AI receptionist:</p>
          <ChatInterface demo={content.chatbotDemo} />
        </div>

        {/* Case Study */}
        <div className="bg-blue-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">{content.caseStudy.title}</h2>

            <div className="mb-8 bg-white p-6 rounded-lg">
              <p className="text-gray-700 mb-4"><strong>Situation:</strong> {content.caseStudy.intro}</p>

              <h3 className="font-bold text-lg mb-4">Results After Implementation:</h3>
              <ul className="space-y-2 mb-8">
                {content.caseStudy.results.map((result, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{result}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Revenue Recovered</p>
                  <p className="text-2xl font-bold text-green-700">{content.caseStudy.roi}</p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-red-700">{content.caseStudy.cost}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Net Impact</p>
                  <p className="text-2xl font-bold text-blue-700">{content.caseStudy.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & ROI */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{content.pricing.title}</h2>
          <p className="text-gray-600 mb-8">{content.pricing.summary}</p>

          <div className="space-y-3">
            {content.pricing.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-white border rounded-lg">
                <span className="font-semibold text-gray-800">{item.label}</span>
                <span className="text-lg font-bold text-blue-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Blog Posts */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Learn More</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.relatedBlogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                    <p className="text-blue-900 font-semibold mb-2">📖 Blog Post</p>
                    <p className="font-semibold text-gray-900 hover:text-blue-900">{post.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Stop Losing {content.name.toLowerCase()}?</h2>
            <p className="text-lg text-blue-100 mb-8">See your custom AI receptionist in action. 60 seconds, zero commitment.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Try Your AI Receptionist Free
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticProps({ params }) {
  const { industry } = params

  if (!industryContent[industry]) {
    return { notFound: true }
  }

  return {
    props: { industry },
    revalidate: 3600
  }
}

export async function getStaticPaths() {
  const paths = Object.keys(industryContent).map((industry) => ({
    params: { industry }
  }))

  return {
    paths,
    fallback: false
  }
}
