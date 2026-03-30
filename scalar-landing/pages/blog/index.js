import Head from 'next/head'
import Link from 'next/link'

const blogPosts = [
  {
    slug: 'cost-of-missed-calls',
    title: 'How Much Does Missing a Call Cost Your Salon?',
    excerpt: 'The real numbers behind missed revenue. Most salons lose 60,000-120,000 HKD/month.',
    category: 'Revenue',
    readTime: '5 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'salon-leads-not-booking',
    title: 'Why 60% of Salon Leads Never Book',
    excerpt: 'The lead leakage happens in seconds. Here\'s how to stop it.',
    category: 'Conversion',
    readTime: '6 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'whatsapp-vs-text',
    title: 'WhatsApp vs Text: Which Booking Method Gets More Appointments?',
    excerpt: 'WhatsApp converts 72% when answered instantly. Text converts 28%. Here\'s why.',
    category: 'Strategy',
    readTime: '6 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'ai-vs-hiring',
    title: 'AI Receptionist vs Hiring Staff: Real Cost Analysis',
    excerpt: 'You\'re paying 24,500 HKD/month for a receptionist. Scalar costs 20,000 HKD and never sleeps.',
    category: 'ROI',
    readTime: '7 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'chatbot-roi',
    title: 'How to Measure Chatbot ROI for Clinics',
    excerpt: 'The metrics that matter (forget vanity metrics). Real ROI calculation.',
    category: 'Analytics',
    readTime: '6 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'after-hours-booking',
    title: 'After-Hours Booking System: Case Study from 12 Salons',
    excerpt: '30-40% of booking requests come after hours. 12 salons recovered 114,800 HKD in 90 days.',
    category: 'Case Study',
    readTime: '8 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'instagram-dms',
    title: 'Instagram DMs = 30% of Your Leads. Are You Missing Them?',
    excerpt: 'Your #2 booking source is sitting in a folder you don\'t check.',
    category: 'Channel',
    readTime: '5 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'qualify-leads-fast',
    title: 'How to Qualify a Lead in 30 Seconds or Less',
    excerpt: 'Stop accepting bookings from people who won\'t show up. Here\'s the framework.',
    category: 'Strategy',
    readTime: '5 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'med-spa-case-studies',
    title: 'Med Spas Using AI Receptionists: 5 Examples from Hong Kong',
    excerpt: 'Real med spas, real results. 25-50% lead increase, 20-25% no-show reduction.',
    category: 'Case Study',
    readTime: '7 min',
    date: 'Mar 30, 2026'
  },
  {
    slug: 'booking-system-benchmark',
    title: 'Booking System Benchmark: Which Software Captures the Most Leads?',
    excerpt: 'Calendly vs Acuity vs Scalar. We tested 5 systems over 30 days.',
    category: 'Comparison',
    readTime: '7 min',
    date: 'Mar 30, 2026'
  },
]

export default function BlogIndex() {
  const categoryColors = {
    Revenue: 'bg-red-100 text-red-800',
    Conversion: 'bg-blue-100 text-blue-800',
    Strategy: 'bg-purple-100 text-purple-800',
    ROI: 'bg-green-100 text-green-800',
    Analytics: 'bg-orange-100 text-orange-800',
    'Case Study': 'bg-pink-100 text-pink-800',
    Channel: 'bg-indigo-100 text-indigo-800',
    Comparison: 'bg-cyan-100 text-cyan-800',
  }

  return (
    <>
      <Head>
        <title>Scalar Blog - Lead Recovery & Booking Automation</title>
        <meta name="description" content="Learn how to recover lost leads, improve booking rates, and stop losing revenue. Real data, real results." />
      </Head>

      <main className="bg-gray-50">
        {/* Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">Scalar Blog</h1>
            <p className="text-xl text-blue-100">Recover your lost leads. Improve your booking rate. Stop leaving money on the table.</p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-900">
                    {post.title}
                  </h2>

                  <p className="text-gray-700 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-blue-900 font-semibold">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to recover your missed leads?</h2>
            <p className="text-lg text-blue-100 mb-8">See how Scalar works with your business in 60 seconds.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Try Your Chatbot Free
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
