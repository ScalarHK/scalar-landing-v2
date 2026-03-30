import Head from 'next/head'
import Link from 'next/link'
import { Check, X, Clock } from 'lucide-react'

export default function ScalarVsManual() {
  const timingComparison = [
    { action: 'Customer sends WhatsApp', manual: '0s', scalar: '0s' },
    { action: 'AI responds (if available)', manual: 'Waiting for staff...', scalar: '<5 seconds' },
    { action: 'Customer waits', manual: 'Avg 8-12 minutes', scalar: 'Instant' },
    { action: 'Confirmation sent', manual: 'Staff types manually', scalar: 'Automatic' },
    { action: 'Booking recorded', manual: 'Manual note/Airtable entry', scalar: 'Auto in CRM' },
    { action: 'Reminder sent 24h before', manual: 'Staff has to remember', scalar: 'Automatic SMS' },
    { action: 'Total staff time per booking', manual: '5-10 minutes', scalar: '0 minutes' }
  ]

  const monthlyCalculation = [
    { metric: 'Monthly bookings', manual: '40-50', scalar: '60-70' },
    { metric: 'Staff time on WhatsApp', manual: '8-10 hours/week = 32-40 hours/month', scalar: '0 hours' },
    { metric: 'Response time avg', manual: '8-12 minutes', scalar: '<60 seconds' },
    { metric: 'Conversion rate', manual: '40-50%', scalar: '70-80%' },
    { metric: 'Bookings confirmed', manual: '16-25', scalar: '42-56' },
    { metric: 'No-shows', manual: '20-25%', scalar: '5-10%' },
    { metric: 'Revenue from bookings', manual: '7,200-11,250 HKD', scalar: '18,900-25,200 HKD' }
  ]

  const painPoints = [
    {
      title: 'You\'re treating a patient when messages pile up',
      manual: 'Messages wait while you\'re with client',
      scalar: 'Instant responses, client never left hanging'
    },
    {
      title: 'Multiple people texting at once',
      manual: 'Overwhelm. Who responds? Duplication?',
      scalar: 'Single AI thread, logged, tracked'
    },
    {
      title: 'Customers give up and book competitors',
      manual: '60% of people switch if no response in 5 mins',
      scalar: 'Instant response = captured'
    },
    {
      title: 'Manual note-taking errors',
      manual: 'Date wrong, time unclear, number incomplete',
      scalar: 'Perfect accuracy, auto-logged'
    },
    {
      title: 'Reminders never sent',
      manual: 'Staff forgets. 20-25% no-show rate',
      scalar: 'Automatic 24h SMS. 5-10% no-show rate'
    },
    {
      title: 'After-hours messages lost',
      manual: 'Nobody sees WhatsApp at night',
      scalar: '24/7 booking capture'
    },
    {
      title: 'Staff burnout from WhatsApp',
      manual: 'Constant interruptions all day',
      scalar: 'Staff freed up for real work'
    }
  ]

  return (
    <>
      <Head>
        <title>Scalar vs Manual WhatsApp | Automation ROI</title>
        <meta name="description" content="Compare manual WhatsApp booking vs automated Scalar. See the conversion rate difference, time savings, and revenue impact." />
      </Head>

      <main className="bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/compare">
              <span className="text-blue-900 font-semibold">← Compare Options</span>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">Scalar vs Manual WhatsApp</h1>
            <p className="text-xl text-blue-100 mb-6">Automation vs answering messages yourself</p>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 inline-block">
              <p className="text-blue-50"><strong>📱 60-second response:</strong> +40% conversion vs 8-minute wait</p>
            </div>
          </div>
        </div>

        {/* The Problem with Manual */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">The Reality of Manual WhatsApp</h2>

          <div className="space-y-6">
            {painPoints.map((point, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">{point.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-red-600 mb-2">What Actually Happens</p>
                    <p className="text-gray-700">{point.manual}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-2">With Scalar</p>
                    <p className="text-gray-700">{point.scalar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Impact */}
        <div className="bg-white border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Response Time = Conversion</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-lg mb-6 text-red-600">Manual WhatsApp Response</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">Customer texts at 2:15 PM</p>
                      <p className="text-sm text-gray-600">While you're with a patient</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-red-300 pl-6">
                    <p className="text-sm text-gray-600">⏳ Waiting... message sits unread</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">You finish appointment at 2:23 PM</p>
                      <p className="text-sm text-gray-600">Finally see WhatsApp</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-orange-300 pl-6">
                    <p className="text-sm text-gray-600">You type: "Hi! Sorry for wait. We offer..."</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">2:27 PM - Message finally sent</p>
                      <p className="text-sm text-gray-600"><strong>12 minutes later</strong></p>
                    </div>
                  </div>
                  <div className="border-l-2 border-red-600 pl-6 bg-red-50 p-3 rounded">
                    <p className="text-sm font-bold text-red-800">❌ Result: Customer already booked competitor</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-6 text-green-600">Scalar Response</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">Customer texts at 2:15 PM</p>
                      <p className="text-sm text-gray-600">While you're with a patient</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-green-300 pl-6">
                    <p className="text-sm text-gray-600">⚡ Instant AI response (5 seconds)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">2:15:05 PM - Message arrives</p>
                      <p className="text-sm text-gray-600"><strong>Instant response</strong></p>
                    </div>
                  </div>
                  <div className="border-l-2 border-green-300 pl-6">
                    <p className="text-sm text-gray-600">AI: "Hi! Interested in Botox? Available Tue 2PM or Thu 10AM?"</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">2:16 PM - Customer replies</p>
                      <p className="text-sm text-gray-600"><strong>Booking confirmed automatically</strong></p>
                    </div>
                  </div>
                  <div className="border-l-2 border-green-600 pl-6 bg-green-50 p-3 rounded">
                    <p className="text-sm font-bold text-green-800">✅ Result: Lead captured and booked</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="font-bold text-gray-900 mb-2">📊 The Math on Response Time</p>
              <p className="text-gray-700 mb-4">Research shows that leads contacted within 60 seconds have 50x higher conversion rate than those contacted after 5 minutes.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-600">Your response: 8-12 min</p>
                  <p className="text-2xl font-bold text-red-600">20-30%</p>
                  <p className="text-xs text-gray-600">conversion</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-600">Average response: 2-3 min</p>
                  <p className="text-2xl font-bold text-orange-600">40-50%</p>
                  <p className="text-xs text-gray-600">conversion</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-600">Scalar response: <60 sec</p>
                  <p className="text-2xl font-bold text-green-600">70-80%</p>
                  <p className="text-xs text-gray-600">conversion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Impact */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Monthly Impact Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Metric</th>
                  <th className="text-left py-4 px-4 font-bold text-red-600">Manual WhatsApp</th>
                  <th className="text-left py-4 px-4 font-bold text-green-600">Scalar AI</th>
                  <th className="text-left py-4 px-4 font-bold text-blue-600">Difference</th>
                </tr>
              </thead>
              <tbody>
                {monthlyCalculation.map((row, idx) => (
                  <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4 font-semibold text-gray-900">{row.metric}</td>
                    <td className="py-4 px-4 text-red-700">{row.manual}</td>
                    <td className="py-4 px-4 text-green-700">{row.scalar}</td>
                    <td className="py-4 px-4 font-bold text-blue-700">
                      {row.metric.includes('Revenue') && <span>+{row.scalar.split('-')[1].trim().split(' ')[0]} HKD</span>}
                      {row.metric.includes('Conversion') && <span>+30-35%</span>}
                      {row.metric.includes('confirmed') && <span>+17-31</span>}
                      {row.metric.includes('No-shows') && <span>-10-15%</span>}
                      {row.metric.includes('Staff time') && <span>-32-40 hrs</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
            <p className="font-bold text-gray-900 mb-2">💰 Additional Revenue from Automation</p>
            <p className="text-gray-700 mb-4">Going from manual to Scalar generates approximately:</p>
            <div className="bg-white p-4 rounded text-center">
              <p className="text-4xl font-bold text-green-600">+11,700 HKD</p>
              <p className="text-gray-700 mt-2">Per month in additional revenue</p>
              <p className="text-xs text-gray-600 mt-1">From 17-31 additional confirmed bookings at 450-800 HKD average</p>
            </div>
          </div>
        </div>

        {/* Staff Time Savings */}
        <div className="bg-blue-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-900">Staff Time Savings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-red-600">Manual WhatsApp Reality</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">WhatsApp interruptions/day</p>
                    <p className="text-2xl font-bold text-red-600">40-60</p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">Avg response + booking time</p>
                    <p className="text-2xl font-bold text-red-600">5-10 min</p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">Total staff hours per month</p>
                    <p className="text-2xl font-bold text-red-600">32-40 hrs</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-red-600">
                    <p className="text-sm text-gray-600 mb-1">Cost (at 150 HKD/hr)</p>
                    <p className="text-2xl font-bold text-red-600">4,800-6,000 HKD</p>
                    <p className="text-xs text-red-600 mt-1">Plus staff burnout + errors</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-green-600">With Scalar</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">WhatsApp interruptions/day</p>
                    <p className="text-2xl font-bold text-green-600">0</p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">Staff time on messages</p>
                    <p className="text-2xl font-bold text-green-600">0 min</p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">Staff hours freed up per month</p>
                    <p className="text-2xl font-bold text-green-600">32-40 hrs</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-green-600">
                    <p className="text-sm text-gray-600 mb-1">Reclaim for customer success</p>
                    <p className="text-2xl font-bold text-green-600">High-value work</p>
                    <p className="text-xs text-green-600 mt-1">Retention, upsells, followups</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <p className="font-bold text-gray-900 mb-2">💡 What to Do With 40 Hours/Month</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Schedule VIP consultations (higher margin)</li>
                <li>• Build relationships with high-value clients</li>
                <li>• Handle premium customer issues personally</li>
                <li>• Develop loyalty programs and retention campaigns</li>
                <li>• Cross-sell additional services</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Quality */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Booking Quality & Accuracy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-lg mb-4 text-red-700">Manual Booking Issues</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Time written wrong (2 PM vs 2 AM?)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Phone number incomplete or wrong</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Stylist/service name unclear</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Double-booked (staff missed note)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Follow-up notes never recorded</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h3 className="font-bold text-lg mb-4 text-green-700">Scalar Booking Quality</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Time auto-confirmed in booking slot</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Phone validated before booking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Service selected from dropdown menu</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Sync to calendar prevents double-booking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Full conversation history logged for notes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Real Cost */}
        <div className="bg-red-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-red-900">The Real Cost of Manual</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">Direct Costs</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Staff hours: 32-40 hrs/mo × 150 HKD</span>
                    <span className="font-bold">4,800-6,000 HKD</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-red-600">
                    <span>Monthly cost</span>
                    <span>4,800-6,000 HKD</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-orange-700">Hidden Costs</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Lost conversions: 25-35 leads × 500 HKD</span>
                    <span className="font-bold">12,500-17,500 HKD</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-orange-600">
                    <span>Monthly loss</span>
                    <span>12,500-17,500 HKD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-red-100 p-6 rounded-lg border-l-4 border-red-600">
              <p className="font-bold text-red-900 text-lg">❌ Total Monthly Cost of Manual: 17,300-23,500 HKD</p>
              <p className="text-red-800 mt-2">(Staff time + lost revenue)</p>
            </div>
          </div>
        </div>

        {/* Scalar ROI */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Scalar ROI</h2>

          <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded text-center">
                <p className="text-sm text-gray-600 mb-2">Monthly Cost</p>
                <p className="text-3xl font-bold text-blue-600">20,000 HKD</p>
              </div>

              <div className="bg-white p-6 rounded text-center">
                <p className="text-sm text-gray-600 mb-2">Additional Revenue</p>
                <p className="text-3xl font-bold text-green-600">+11,700 HKD</p>
              </div>

              <div className="bg-white p-6 rounded text-center">
                <p className="text-sm text-gray-600 mb-2">Net Gain (Month 1)</p>
                <p className="text-3xl font-bold text-green-700">-8,300 HKD</p>
                <p className="text-xs text-gray-600 mt-2">Positive by Month 2-3</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-bold text-gray-900">Cumulative Year 1 Gain: +100,000-150,000 HKD</p>
              <p className="text-gray-700 mt-2">After paying for Scalar + accounting for staff time savings (4,800-6,000 HKD/month)</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Stop Losing Leads to Slow Response Times</h2>
            <p className="text-lg text-blue-100 mb-8">Go from 8-minute waits to 60-second responses. Free demo included.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Try Scalar Free
            </button>
          </div>
        </div>

        {/* Related Comparisons */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Also Compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/compare/scalar-vs-hiring">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">👤 Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Hiring a Receptionist</p>
                </div>
              </Link>
              <Link href="/compare/scalar-vs-competitors">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">⚔️ Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Booking Systems</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
