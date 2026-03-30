import Head from 'next/head'
import Link from 'next/link'

const industries = [
  {
    slug: 'med-aesthetics',
    name: 'Med-Aesthetics Clinics',
    icon: '💆',
    description: 'Skincare, Botox, fillers, and laser treatments',
    pain: 'Miss 40% of inquiry calls during lunch and evening bookings',
    opportunity: 'Recover 60,000-80,000 HKD/month in lost appointments',
    relatedPosts: ['cost-of-missed-calls', 'ai-vs-hiring', 'after-hours-booking']
  },
  {
    slug: 'dental',
    name: 'Dental Clinics',
    icon: '😁',
    description: 'Cleanings, whitening, implants, orthodontics',
    pain: 'Emergency requests come in after-hours with no one to answer',
    opportunity: 'Capture 30% of bookings that come outside business hours',
    relatedPosts: ['instagram-dms', 'whatsapp-vs-text', 'qualify-leads-fast']
  },
  {
    slug: 'spa-wellness',
    name: 'Spa & Wellness',
    icon: '🧖',
    description: 'Massage, therapies, relaxation, beauty treatments',
    pain: 'Popular therapists are fully booked—clients book with competitors instead',
    opportunity: 'Add 20-30 bookings/month with instant confirmation system',
    relatedPosts: ['salon-leads-not-booking', 'chatbot-roi', 'med-spa-case-studies']
  },
  {
    slug: 'fitness',
    name: 'Gyms & Fitness',
    icon: '💪',
    description: 'Personal training, classes, memberships, consultations',
    pain: 'Trial sign-ups go dark—no follow-up system means 50% churn',
    opportunity: 'Double trial-to-paid conversion with automated check-ins',
    relatedPosts: ['salon-leads-not-booking', 'chatbot-roi', 'booking-system-benchmark']
  },
  {
    slug: 'salon',
    name: 'Hair & Beauty Salons',
    icon: '💇',
    description: 'Hair, nails, beauty services, treatments',
    pain: 'WhatsApp overflows while customers book with whoever responds fastest',
    opportunity: 'Instant WhatsApp confirmation = 72% higher booking rate',
    relatedPosts: ['whatsapp-vs-text', 'after-hours-booking', 'salon-leads-not-booking']
  }
]

export default function IndustriesIndex() {
  return (
    <>
      <Head>
        <title>AI Receptionists by Industry - Scalar</title>
        <meta name="description" content="Industry-specific AI receptionist solutions. Capture after-hours leads, reduce no-shows, and automate 24/7 booking across med-aesthetics, dental, spa, fitness, and salons." />
      </Head>

      <main className="bg-gray-50">
        {/* Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">AI Receptionist for Your Industry</h1>
            <p className="text-xl text-blue-100">Purpose-built for your business type. Same platform. Different results.</p>
          </div>
        </div>

        {/* Industry Cards */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-xl transition h-full p-6 cursor-pointer border-l-4 border-blue-900">
                  <div className="text-4xl mb-3">{industry.icon}</div>

                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {industry.name}
                  </h2>

                  <p className="text-sm text-gray-600 mb-4">
                    {industry.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-xs font-bold text-red-800">The Problem</p>
                      <p className="text-sm text-red-900">{industry.pain}</p>
                    </div>

                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs font-bold text-green-800">Your Opportunity</p>
                      <p className="text-sm text-green-900">{industry.opportunity}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-blue-900 font-semibold inline-flex items-center">
                      See your solution <span className="ml-2">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">How Scalar Works for Your Business</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="font-bold mb-2">1. Incoming Lead</h3>
                <p className="text-sm text-gray-600">Call, WhatsApp, DM, or web chat arrives</p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="font-bold mb-2">2. AI Answers</h3>
                <p className="text-sm text-gray-600">Instant response 24/7, your services + pricing</p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="font-bold mb-2">3. Booking Captured</h3>
                <p className="text-sm text-gray-600">Lead automatically scheduled in your system</p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold mb-2">4. Revenue Recovered</h3>
                <p className="text-sm text-gray-600">Client shows up, you get paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Stats */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">What Happens When You Don't Respond Instantly</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">60%</div>
                <p className="font-semibold mb-2">Of leads go to competitors</p>
                <p className="text-sm text-gray-600">if you don't respond within 60 seconds</p>
              </div>

              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">40%</div>
                <p className="font-semibold mb-2">Of your calls are after-hours</p>
                <p className="text-sm text-gray-600">but you're not available to answer them</p>
              </div>

              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">72%</div>
                <p className="font-semibold mb-2">Higher conversion with WhatsApp</p>
                <p className="text-sm text-gray-600">when clients get instant confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to recover your missed leads?</h2>
            <p className="text-lg text-blue-100 mb-8">Choose your industry above or try our demo free today.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Try Your AI Receptionist
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
