import Head from 'next/head'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'

const comparisons = [
  {
    slug: 'scalar-vs-hiring',
    title: 'Scalar vs Hiring a Receptionist',
    icon: '👤',
    description: 'Compare the cost and efficiency of AI vs hiring full-time staff',
    metric: 'Monthly cost comparison for med-aesthetic clinics'
  },
  {
    slug: 'scalar-vs-manual',
    title: 'Scalar vs Manual WhatsApp',
    icon: '📱',
    description: 'AI automation vs answering messages yourself',
    metric: 'Conversion rate and time spent per booking'
  },
  {
    slug: 'scalar-vs-competitors',
    title: 'Scalar vs Booking Systems',
    icon: '⚔️',
    description: 'Compare features against Calendly, Cal.com, Acuity, and others',
    metric: 'Feature matrix and lead capture rates'
  },
  {
    slug: 'features-matrix',
    title: 'Complete Features Matrix',
    icon: '📊',
    description: 'Side-by-side comparison of all booking and receptionist features',
    metric: 'Everything you need to know in one table'
  }
]

export default function CompareIndex() {
  return (
    <>
      <Head>
        <title>Compare Scalar | Pricing & Features vs Alternatives</title>
        <meta name="description" content="Compare Scalar AI receptionist against hiring staff, manual booking systems, and competitor platforms. See the ROI difference." />
      </Head>

      <main className="bg-gray-50">
        {/* Header */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">Compare Scalar</h1>
            <p className="text-xl text-blue-100">Why businesses choose AI over the alternatives</p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comparisons.map((comparison) => (
              <Link key={comparison.slug} href={`/compare/${comparison.slug}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-xl transition h-full p-6 cursor-pointer border-t-4 border-blue-900">
                  <div className="text-4xl mb-3">{comparison.icon}</div>

                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    {comparison.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {comparison.description}
                  </p>

                  <div className="bg-blue-50 p-3 rounded mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>📈</strong> {comparison.metric}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-blue-900 font-semibold inline-flex items-center">
                      Compare now <span className="ml-2"><ArrowRight size={18} /></span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Businesses Switch to Scalar</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">90%</div>
                <p className="font-semibold mb-2">Lower cost than hiring</p>
                <p className="text-sm text-gray-600">20,000 HKD vs 50,000+ HKD salary</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">24/7</div>
                <p className="font-semibold mb-2">Always available</p>
                <p className="text-sm text-gray-600">No sick days, no time off</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">60s</div>
                <p className="font-semibold mb-2">Response time</p>
                <p className="text-sm text-gray-600">Instant answers capture leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to See the Difference?</h2>
            <p className="text-lg text-blue-100 mb-8">See which option makes sense for your business.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Start Free Trial
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
