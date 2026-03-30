import Head from 'next/head'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function FeaturesMatrix() {
  const categories = [
    {
      name: 'INBOUND LEAD CAPTURE',
      features: [
        { name: 'Phone call answering', scalar: true, description: 'Answers calls 24/7, even after-hours' },
        { name: 'WhatsApp Business API', scalar: true, description: 'Responds to WhatsApp messages with AI' },
        { name: 'Instagram DM responses', scalar: true, description: 'Auto-reply to Instagram inquiries' },
        { name: 'Website chat widget', scalar: true, description: 'Live chat on your website' },
        { name: 'SMS message handling', scalar: true, description: 'Receive and respond to text messages' },
        { name: 'Multi-channel integration', scalar: true, description: 'Single AI handles all channels' },
      ]
    },
    {
      name: 'AI QUALIFICATION',
      features: [
        { name: 'Service assessment', scalar: true, description: '"Which service interests you?"' },
        { name: 'Price-sensitivity detection', scalar: true, description: 'Identifies if lead can afford your pricing' },
        { name: 'Appointment history check', scalar: true, description: 'Spots returning vs new customers' },
        { name: 'Emergency/urgent detection', scalar: true, description: 'Identifies true emergencies (dental pain, skin reaction)' },
        { name: 'Insurance/payment verification', scalar: true, description: 'Asks coverage questions before booking' },
        { name: 'Referral source tracking', scalar: true, description: 'Tracks where lead came from (Instagram, Google, etc)' },
      ]
    },
    {
      name: 'BOOKING & SCHEDULING',
      features: [
        { name: 'Calendar integration', scalar: true, description: 'Syncs to Google Calendar, Outlook, Cal.com' },
        { name: 'Real-time availability', scalar: true, description: 'Shows actual open slots to customers' },
        { name: 'Booking confirmation', scalar: true, description: 'Instant message confirms date/time/provider' },
        { name: 'Double-booking prevention', scalar: true, description: 'Prevents overbooking' },
        { name: 'Staff availability mapping', scalar: true, description: 'Smart routing to correct stylist/doctor' },
        { name: 'Waitlist management', scalar: true, description: 'Auto-offer standby slots when available' },
        { name: 'Recurring appointment setup', scalar: true, description: 'Books regular clients on schedule' },
      ]
    },
    {
      name: 'CUSTOMER COMMUNICATION',
      features: [
        { name: '24-hour pre-appointment SMS', scalar: true, description: 'Automatic reminder texts' },
        { name: 'Booking confirmation email', scalar: true, description: 'Email receipt with all details' },
        { name: 'Pre-visit instructions', scalar: true, description: '"Avoid caffeine before appointment"' },
        { name: 'Parking/location info', scalar: true, description: 'Directions automatically sent' },
        { name: 'Post-visit follow-up', scalar: true, description: '"How was your experience?"' },
        { name: 'Rescheduling offers', scalar: true, description: 'Automatically offer new times if cancelled' },
      ]
    },
    {
      name: 'CUSTOMER RELATIONSHIP MANAGEMENT',
      features: [
        { name: 'Contact database', scalar: true, description: 'Store customer info automatically' },
        { name: 'Conversation history', scalar: true, description: 'Review past interactions' },
        { name: 'Customer notes', scalar: true, description: 'Record preferences ("allergic to X", "loves Y")' },
        { name: 'Purchase history', scalar: true, description: 'Track what services they bought' },
        { name: 'No-show tracking', scalar: true, description: 'Flag chronic no-shows' },
        { name: 'Loyalty points integration', scalar: true, description: 'Auto-assign rewards' },
      ]
    },
    {
      name: 'PAYMENT & BILLING',
      features: [
        { name: 'Stripe integration', scalar: true, description: 'Process credit cards, Apple Pay, Google Pay' },
        { name: 'Deposit collection', scalar: true, description: 'Charge deposits before booking' },
        { name: 'Invoice generation', scalar: true, description: 'Automatic receipt creation' },
        { name: 'Payment reminders', scalar: true, description: 'Send payment due reminders' },
        { name: 'Multiple payment methods', scalar: true, description: 'Credit card, bank transfer, BNPL' },
      ]
    },
    {
      name: 'AUTOMATION & WORKFLOWS',
      features: [
        { name: 'n8n workflow builder', scalar: true, description: 'Build custom automations (no-code)' },
        { name: 'Slack notifications', scalar: true, description: 'Alert team to new bookings' },
        { name: 'Email sequences', scalar: true, description: 'Multi-email follow-up campaigns' },
        { name: 'Conditional logic', scalar: true, description: 'Different flows based on customer type' },
        { name: 'Trial management', scalar: true, description: 'Auto-check-ins Day 1, 5, 10 for trials' },
        { name: 'Lead scoring', scalar: true, description: 'Rank leads by conversion likelihood' },
      ]
    },
    {
      name: 'ANALYTICS & REPORTING',
      features: [
        { name: 'Conversion funnel tracking', scalar: true, description: 'See: calls → bookings → shows' },
        { name: 'Lead source attribution', scalar: true, description: 'Track ROI by channel (Instagram, Google, etc)' },
        { name: 'Response time analytics', scalar: true, description: 'Monitor how fast you answer' },
        { name: 'No-show rate tracking', scalar: true, description: 'Identify patterns in cancellations' },
        { name: 'Revenue attribution', scalar: true, description: 'Connect bookings to actual revenue' },
        { name: 'Monthly dashboard', scalar: true, description: 'Automatic report generation' },
        { name: 'Custom Looker Studio reports', scalar: true, description: 'Build your own dashboards' },
      ]
    },
    {
      name: 'TEAM COLLABORATION',
      features: [
        { name: 'Role-based permissions', scalar: true, description: 'Control who sees what' },
        { name: 'Assigned agent routing', scalar: true, description: 'Route to specific staff members' },
        { name: 'Team inbox', scalar: true, description: 'Shared message queue' },
        { name: 'Staff performance tracking', scalar: true, description: 'See who books most appointments' },
        { name: 'Escalation rules', scalar: true, description: 'Route complex questions to manager' },
      ]
    },
    {
      name: 'INTEGRATIONS',
      features: [
        { name: 'Retell AI voice', scalar: true, description: 'Voice receptionist for phone calls' },
        { name: 'Twilio telephony', scalar: true, description: 'VoIP phone number routing' },
        { name: 'Supabase database', scalar: true, description: 'Secure customer data storage' },
        { name: 'Google Calendar sync', scalar: true, description: 'Two-way calendar sync' },
        { name: 'Stripe payments', scalar: true, description: 'Payment processing' },
        { name: 'Resend email delivery', scalar: true, description: 'Reliable email sending' },
        { name: 'Airtable sync', scalar: true, description: 'Export to Airtable' },
        { name: 'Zapier compatibility', scalar: true, description: 'Connect to 1000+ apps' },
      ]
    },
    {
      name: 'DEPLOYMENT & SUPPORT',
      features: [
        { name: 'Cloud hosting', scalar: true, description: 'No servers to manage' },
        { name: 'Multi-location support', scalar: true, description: 'Manage multiple clinics/salons' },
        { name: 'Custom onboarding', scalar: true, description: '1-on-1 setup call' },
        { name: 'Documentation', scalar: true, description: 'Step-by-step guides' },
        { name: 'Email support', scalar: true, description: 'Help when you need it' },
        { name: '99.9% uptime SLA', scalar: true, description: 'Reliability guarantee' },
      ]
    }
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: '15,000 HKD',
      period: '/month',
      description: 'Perfect for small salons and clinics',
      features: [
        'Up to 100 bookings/month',
        '1 calendar integration',
        'WhatsApp + Phone',
        'Basic SMS reminders',
        'Email support',
        'Supabase database'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '20,000 HKD',
      period: '/month',
      description: 'For growing med-aesthetics businesses',
      features: [
        'Unlimited bookings',
        'Multi-calendar (3)',
        'WhatsApp + Phone + Instagram + Chat',
        'Advanced SMS + Email sequences',
        'AI qualification + lead scoring',
        'Priority email support',
        'Supabase database',
        'Basic analytics dashboard'
      ],
      cta: 'Start Free Trial',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For chains and multi-location businesses',
      features: [
        'Unlimited everything',
        'Unlimited calendars',
        'All channels + custom integrations',
        'Advanced workflows (n8n)',
        'Dedicated support team',
        '1-on-1 onboarding',
        'Custom SLA',
        'Phone support (HK +852)'
      ],
      cta: 'Schedule Demo'
    }
  ]

  return (
    <>
      <Head>
        <title>Scalar Features Matrix | Complete Comparison</title>
        <meta name="description" content="Complete breakdown of Scalar AI receptionist features. Phone, WhatsApp, booking, CRM, payments, analytics, and more." />
      </Head>

      <main className="bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link href="/compare">
              <span className="text-blue-900 font-semibold">← Compare Options</span>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">Everything in Scalar</h1>
            <p className="text-xl text-blue-100">Complete features breakdown. All you need for 24/7 lead capture and booking automation.</p>
          </div>
        </div>

        {/* Features by Category */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">{category.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.features.map((feature, fIdx) => (
                  <div key={fIdx} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
                    <div className="flex items-start space-x-3">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white border-y py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Simple, Transparent Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg shadow-lg overflow-hidden transition transform ${
                    tier.recommended ? 'ring-2 ring-blue-600 md:scale-105' : ''
                  }`}
                >
                  {tier.recommended && (
                    <div className="bg-blue-600 text-white text-center py-2 text-sm font-bold">
                      RECOMMENDED
                    </div>
                  )}

                  <div className={`p-8 ${tier.recommended ? 'bg-blue-50' : 'bg-white'}`}>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                    <div className="mb-8">
                      <span className="text-5xl font-bold text-blue-900">{tier.price}</span>
                      {tier.period && <span className="text-gray-600">{tier.period}</span>}
                    </div>

                    <button className={`w-full py-3 rounded-lg font-bold mb-8 transition ${
                      tier.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}>
                      {tier.cta}
                    </button>

                    <ul className="space-y-4">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-3">
                          <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <p className="text-gray-900 mb-2"><strong>💰 First Month 50% Off</strong></p>
              <p className="text-gray-700">Start with Professional at 10,000 HKD/month. No credit card required.</p>
            </div>
          </div>
        </div>

        {/* What's NOT Included */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">What You Get With Any Tier</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
              <h3 className="font-bold text-lg mb-4 text-green-700">✅ Always Included</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All core features (no pay-per-feature)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Supabase database included</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Phone call handling (unlimited)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>WhatsApp integration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>SMS + Email sequences</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-400">
              <h3 className="font-bold text-lg mb-4 text-gray-700">❌ NOT Included</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Hidden setup fees</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Per-call or per-SMS charges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Long-term contracts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Cancellation fees</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Expensive phone numbers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Feature paywalls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white border-y py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Feature Matrix Summary</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-3 px-4 font-bold">Feature Category</th>
                    <th className="text-center py-3 px-4 font-bold">Included</th>
                    <th className="text-left py-3 px-4 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, idx) => (
                    <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-4 px-4 font-semibold text-gray-900">{category.name}</td>
                      <td className="py-4 px-4 text-center">
                        <Check className="text-green-600 mx-auto" size={24} />
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {category.features.length} features included
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <p className="font-bold text-gray-900 mb-2">✅ Total: {categories.reduce((sum, cat) => sum + cat.features.length, 0)} Features</p>
              <p className="text-gray-700">All included in every Scalar plan. No surprises, no hidden costs.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Lead Capture?</h2>
            <p className="text-lg text-blue-100 mb-8">See every feature in action. Free 14-day trial, no credit card required.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Start Your Free Trial
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Questions?</h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Can I try it free first?</h3>
              <p className="text-gray-700">Yes. 14 days free on Professional tier, includes everything. No credit card needed.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Can I cancel anytime?</h3>
              <p className="text-gray-700">Yes. No contracts, no penalties. Cancel anytime via your dashboard.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2 text-gray-900">Do you offer discounts for annual billing?</h3>
              <p className="text-gray-700">Yes. Pay annually and save 20% (160,000 HKD/year vs 240,000 HKD). 30-day free trial applies to both.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2 text-gray-900">What if I need more calendars or integrations?</h3>
              <p className="text-gray-700">All integrations are included. Need 10 calendars? No problem. Upgrade to Enterprise for unlimited.</p>
            </div>
          </div>
        </div>

        {/* Related Comparisons */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Back to Comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/compare/scalar-vs-hiring">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">👤 Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Hiring</p>
                </div>
              </Link>
              <Link href="/compare/scalar-vs-manual">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">📱 Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Manual</p>
                </div>
              </Link>
              <Link href="/compare/scalar-vs-competitors">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">⚔️ Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Competitors</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
