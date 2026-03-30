import Head from 'next/head'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function ScalarVsCompetitors() {
  const competitors = [
    {
      name: 'Calendly',
      cost: '12-20 USD/month',
      features: {
        'Phone booking': { scalar: true, competitor: false },
        'WhatsApp integration': { scalar: true, competitor: false },
        'AI chat responses': { scalar: true, competitor: false },
        'SMS reminders': { scalar: true, competitor: false },
        'Automatic qualification': { scalar: true, competitor: false },
        'Email reminders': { scalar: true, competitor: true },
        'Calendar sync': { scalar: true, competitor: true },
        'Payment integration': { scalar: true, competitor: true },
        'Admin dashboard': { scalar: true, competitor: true },
      },
      pros: ['Affordable', 'Simple interface', 'Wide integrations'],
      cons: ['Not AI (just a link)', 'No phone answering', 'Requires user to book own slot', 'Can\'t qualify leads', 'Manual WhatsApp'],
      ideal: 'Consultants who send booking links (not automatic)',
      price_hong_kong: '~160-260 HKD/month'
    },
    {
      name: 'Cal.com',
      cost: '0-20 USD/month',
      features: {
        'Phone booking': { scalar: true, competitor: false },
        'WhatsApp integration': { scalar: true, competitor: false },
        'AI chat responses': { scalar: true, competitor: false },
        'SMS reminders': { scalar: true, competitor: false },
        'Automatic qualification': { scalar: true, competitor: false },
        'Email reminders': { scalar: true, competitor: true },
        'Calendar sync': { scalar: true, competitor: true },
        'Payment integration': { scalar: true, competitor: true },
        'Admin dashboard': { scalar: true, competitor: true },
      },
      pros: ['Open-source option', 'Low cost', 'Technical customization'],
      cons: ['Still just a booking calendar', 'No AI receptionist', 'Customer has to find the link', 'No inbound call handling', 'Manual WhatsApp'],
      ideal: 'Developers who want to self-host their scheduler',
      price_hong_kong: '0-260 HKD/month (plus hosting)'
    },
    {
      name: 'Acuity Scheduling',
      cost: '15-35 USD/month',
      features: {
        'Phone booking': { scalar: true, competitor: false },
        'WhatsApp integration': { scalar: true, competitor: false },
        'AI chat responses': { scalar: true, competitor: false },
        'SMS reminders': { scalar: true, competitor: true },
        'Automatic qualification': { scalar: true, competitor: false },
        'Email reminders': { scalar: true, competitor: true },
        'Calendar sync': { scalar: true, competitor: true },
        'Payment integration': { scalar: true, competitor: true },
        'Admin dashboard': { scalar: true, competitor: true },
      },
      pros: ['Powerful integrations', 'Form builder', 'Email sequences'],
      cons: ['Still not AI-powered', 'No phone answering', 'No WhatsApp chatbot', 'Manual responses', 'Can\'t capture leads automatically'],
      ideal: 'Service businesses with existing customer database',
      price_hong_kong: '~195-455 HKD/month'
    },
    {
      name: 'Freshworks/Freshdesk',
      cost: '39-165 USD/month',
      features: {
        'Phone booking': { scalar: true, competitor: true },
        'WhatsApp integration': { scalar: true, competitor: true },
        'AI chat responses': { scalar: true, competitor: true },
        'SMS reminders': { scalar: true, competitor: false },
        'Automatic qualification': { scalar: true, competitor: false },
        'Email reminders': { scalar: true, competitor: true },
        'Calendar sync': { scalar: true, competitor: true },
        'Payment integration': { scalar: true, competitor: false },
        'Admin dashboard': { scalar: true, competitor: true },
      },
      pros: ['Full CRM included', 'Multi-channel support', 'Team collaboration'],
      cons: ['Extremely expensive for small business', 'Overkill if you just need booking', 'Slow customer service', 'Steep learning curve', 'Requires multiple add-ons'],
      ideal: 'Large enterprises with 50+ agents',
      price_hong_kong: '~500-2,145 HKD/month'
    }
  ]

  const coreComparison = [
    {
      feature: 'Primary Use',
      scalar: 'AI receptionist (inbound lead capture)',
      description: 'Answers calls/messages, qualifies, books automatically'
    },
    {
      feature: 'Calendly/Cal',
      scalar: 'Booking calendar (outbound link sharing)',
      description: 'You send link, customer picks time'
    },
    {
      feature: 'Key Difference',
      scalar: 'Customer never sees a link. AI does the work.',
      description: 'You have to manually send booking link to each lead'
    }
  ]

  return (
    <>
      <Head>
        <title>Scalar vs Booking Systems | Cal.com, Calendly, Acuity</title>
        <meta name="description" content="Compare Scalar AI receptionist vs Calendly, Cal.com, Acuity Scheduling, and Freshworks. See why AI beats traditional booking systems." />
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
            <h1 className="text-4xl font-bold mb-4">Scalar vs Traditional Booking Systems</h1>
            <p className="text-xl text-blue-100 mb-6">Why AI receptionist beats booking calendars</p>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 inline-block">
              <p className="text-blue-50"><strong>🤖 AI Answers Inbound:</strong> No need for customers to find a link</p>
            </div>
          </div>
        </div>

        {/* The Fundamental Difference */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">The Fundamental Difference</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="font-bold text-xl mb-6 text-blue-600">Scalar AI Receptionist</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">1. Inbound Lead Arrives</p>
                  <p className="text-gray-800">Call, WhatsApp, Instagram DM, web chat</p>
                </div>
                <div className="border-l-2 border-blue-300 pl-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">2. AI Answers Immediately</p>
                  <p className="text-gray-800">"Hi! Ready to book? We have slots at..."</p>
                </div>
                <div className="border-l-2 border-blue-300 pl-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">3. Customer Confirms Time</p>
                  <p className="text-gray-800">Types "Tuesday 2PM" and they're booked</p>
                </div>
                <div className="border-l-2 border-green-300 pl-4 bg-green-50 p-4 rounded">
                  <p className="text-sm font-bold text-green-700">✅ Booking Captured</p>
                  <p className="text-green-800">No link needed. No back-and-forth.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="font-bold text-xl mb-6 text-orange-600">Traditional Booking Calendar</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">1. Customer Inquires</p>
                  <p className="text-gray-800">Email, phone, WhatsApp: "Do you have availability?"</p>
                </div>
                <div className="border-l-2 border-orange-300 pl-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">2. You Send Booking Link</p>
                  <p className="text-gray-800">Reply manually with Calendly link</p>
                </div>
                <div className="border-l-2 border-orange-300 pl-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">3. Customer Clicks Link</p>
                  <p className="text-gray-800">(If they bother to click at all)</p>
                </div>
                <div className="border-l-2 border-red-300 pl-4 bg-red-50 p-4 rounded">
                  <p className="text-sm font-bold text-red-700">❌ Often Lost</p>
                  <p className="text-red-800">40% of people don't click booking links</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="font-bold text-gray-900 mb-2">📌 Key Insight</p>
            <p className="text-gray-700">Calendly/Cal.com are <strong>outbound tools</strong> (you send the link). Scalar is an <strong>inbound tool</strong> (the AI answers before you even know about the lead).</p>
          </div>
        </div>

        {/* Detailed Competitor Comparison */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Detailed Feature Comparison</h2>

          {competitors.map((competitor, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow mb-8 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{competitor.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{competitor.cost} USD/month (~{competitor.price_hong_kong})</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Key Differences */}
                <div className="mb-8">
                  <h4 className="font-bold text-lg mb-4 text-gray-900">How It Works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-blue-600 mb-3">Scalar Approach</p>
                      <ul className="space-y-2 text-sm">
                        {competitor.features['Phone booking'] && (
                          <li className="flex items-center space-x-2">
                            <Check size={18} className="text-green-600 flex-shrink-0" />
                            <span>Answers phone calls</span>
                          </li>
                        )}
                        {competitor.features['WhatsApp integration'] && (
                          <li className="flex items-center space-x-2">
                            <Check size={18} className="text-green-600 flex-shrink-0" />
                            <span>Responds to WhatsApp</span>
                          </li>
                        )}
                        {competitor.features['AI chat responses'] && (
                          <li className="flex items-center space-x-2">
                            <Check size={18} className="text-green-600 flex-shrink-0" />
                            <span>Answers with AI</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-3">{competitor.name} Approach</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <span>ℹ️</span>
                          <span>Requires customer to find/click link</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>ℹ️</span>
                          <span>No proactive outreach</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span>ℹ️</span>
                          <span>You send after inquiry</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pros/Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg text-green-600 mb-4">Pros</h4>
                    <ul className="space-y-2 text-sm">
                      {competitor.pros.map((pro, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-red-600 mb-4">Cons</h4>
                    <ul className="space-y-2 text-sm">
                      {competitor.cons.map((con, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <X size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal For */}
                <div className="mt-6 bg-yellow-50 p-4 rounded border-l-4 border-yellow-600">
                  <p className="text-sm"><strong className="text-yellow-800">Best for:</strong> {competitor.ideal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Matrix */}
        <div className="bg-white border-y py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Full Feature Matrix</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-4 px-4 font-bold">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-green-600 bg-green-50">Scalar</th>
                    <th className="text-center py-4 px-4 font-bold">Calendly</th>
                    <th className="text-center py-4 px-4 font-bold">Cal.com</th>
                    <th className="text-center py-4 px-4 font-bold">Acuity</th>
                    <th className="text-center py-4 px-4 font-bold">Freshworks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white">
                    <td className="py-3 px-4 font-semibold">Phone booking answering</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center">⚠️ Limited</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-semibold">AI chat responses</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b bg-white">
                    <td className="py-3 px-4 font-semibold">WhatsApp integration</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-semibold">Automatic lead qualification</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center">⚠️ Limited</td>
                  </tr>
                  <tr className="border-b bg-white">
                    <td className="py-3 px-4 font-semibold">SMS reminders</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 font-semibold">Calendar sync</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-b bg-white">
                    <td className="py-3 px-4 font-semibold">Payment processing</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center">⚠️ Limited</td>
                    <td className="text-center"><Check className="text-green-600 mx-auto" size={20} /></td>
                    <td className="text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 font-semibold">Cost (HKD/month)</td>
                    <td className="text-center font-bold text-green-600">20,000</td>
                    <td className="text-center">160-260</td>
                    <td className="text-center">0-260</td>
                    <td className="text-center">195-455</td>
                    <td className="text-center text-red-600">500-2,145</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* When Each Makes Sense */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">When to Use Each Tool</h2>

          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
              <h3 className="font-bold text-lg text-green-700 mb-2">✅ Choose Scalar if:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• You want to capture <strong>inbound</strong> calls/messages (not send booking links)</li>
                <li>• You need <strong>24/7 answering</strong> (phone rings while you're with a client)</li>
                <li>• You want <strong>AI qualification</strong> before booking</li>
                <li>• You get inquiries via <strong>WhatsApp or phone</strong></li>
                <li>• Your business closes after hours but inquiries don't</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-bold text-lg text-blue-700 mb-2">ℹ️ Choose Calendly/Cal if:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• You're a <strong>consultant who sends booking links</strong> in emails/proposals</li>
                <li>• Your customers <strong>ask for your availability</strong> and you email a link back</li>
                <li>• You have <strong>existing leads</strong> that you manage via email</li>
                <li>• You're doing <strong>outbound</strong> scheduling (you control the process)</li>
                <li>• Budget is extremely limited (&lt;300 HKD/month)</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-lg text-yellow-700 mb-2">⚠️ Choose Freshworks if:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• You have a <strong>large team</strong> (50+ agents)</li>
                <li>• You need <strong>full customer service</strong> management (not just booking)</li>
                <li>• You manage <strong>support tickets, complaints, follow-ups</strong></li>
                <li>• Budget allows for enterprise pricing (500-2,000 HKD/month)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The ROI Case */}
        <div className="bg-blue-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-900">ROI: Scalar vs the Competition</h2>

            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-gray-700 mb-6">For a med-aesthetic clinic getting 50 inbound WhatsApp/calls per month:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-3">Calendly Approach</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Cost: 260 HKD/month</div>
                    <div>Booking capture: 40% (you have to send 50 links)</div>
                    <div>Conversions: 8-10 bookings</div>
                    <div className="bg-red-50 p-2 rounded text-red-700">
                      Loss: 40 people who didn't click the link
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-3">Manual WhatsApp</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Cost: 5,000 HKD (staff time)</div>
                    <div>Booking capture: 50% (slow responses)</div>
                    <div>Conversions: 12-15 bookings</div>
                    <div className="bg-orange-50 p-2 rounded text-orange-700">
                      Staff burnout + missed after-hours
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-3">Scalar AI</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Cost: 20,000 HKD/month</div>
                    <div>Booking capture: 75% (instant response)</div>
                    <div>Conversions: 30-35+ bookings</div>
                    <div className="bg-green-50 p-2 rounded text-green-700">
                      +20-25 extra bookings/month
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-green-100 p-6 rounded-lg border-l-4 border-green-600">
                <p className="font-bold text-gray-900 mb-2">💰 Monthly Gain with Scalar</p>
                <p className="text-gray-800">20-25 extra bookings × 500 HKD = <span className="text-2xl font-bold text-green-700">10,000-12,500 HKD</span></p>
                <p className="text-sm text-gray-600 mt-2">Minus 20,000 HKD cost = Positive ROI by Month 2-3</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Stop Settling for Calendar Tools</h2>
            <p className="text-lg text-blue-100 mb-8">Get an AI receptionist that actually answers inbound leads. All in one platform.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              See Scalar Demo
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
              <Link href="/compare/scalar-vs-manual">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">📱 Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Manual WhatsApp</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
