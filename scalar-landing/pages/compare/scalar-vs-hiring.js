import Head from 'next/head'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function ScalarVsHiring() {
  const comparison = [
    {
      feature: 'Monthly Cost',
      scalar: '20,000 HKD',
      hiring: '50,000-70,000 HKD',
      winner: 'scalar'
    },
    {
      feature: 'Availability',
      scalar: '24/7 (365 days)',
      hiring: '9 AM-6 PM (5 days/week)',
      winner: 'scalar'
    },
    {
      feature: 'Response Time',
      scalar: '<60 seconds',
      hiring: '2-5 minutes',
      winner: 'scalar'
    },
    {
      feature: 'Calls Handled/Month',
      scalar: 'Unlimited',
      hiring: '200-300 (8 hours/day)',
      winner: 'scalar'
    },
    {
      feature: 'Booking Accuracy',
      scalar: '100% (auto-recorded)',
      hiring: '85-90% (manual notes)',
      winner: 'scalar'
    },
    {
      feature: 'Sick Days / Time Off',
      scalar: 'Never',
      hiring: '10-15 days/year',
      winner: 'scalar'
    },
    {
      feature: 'Training Required',
      scalar: 'None (instant deployment)',
      hiring: '2-4 weeks onboarding',
      winner: 'scalar'
    },
    {
      feature: 'Scaling to Multiple Locations',
      scalar: 'Instant (same cost)',
      hiring: '+50,000 HKD per location',
      winner: 'scalar'
    },
    {
      feature: 'Personal Touch / Local Knowledge',
      scalar: 'Customizable (learns your services)',
      hiring: 'High (knows regular customers)',
      winner: 'hiring'
    },
    {
      feature: 'Handling Complex Questions',
      scalar: 'Escalates to staff via Slack',
      hiring: 'Can think creatively',
      winner: 'hiring'
    }
  ]

  const yearlyCalculation = [
    { label: 'Receptionist salary', value: '600,000-840,000 HKD' },
    { label: 'CPF/Benefits (15%)', value: '90,000-126,000 HKD' },
    { label: 'Training costs', value: '10,000 HKD' },
    { label: 'Sick leave/vacation cover', value: '20,000 HKD' },
    { label: 'Total Year 1', value: '720,000-996,000 HKD' },
    { label: 'Scalar annual cost', value: '240,000 HKD' },
    { label: 'Savings Year 1', value: '480,000-756,000 HKD' }
  ]

  return (
    <>
      <Head>
        <title>Scalar vs Hiring a Receptionist | ROI Comparison</title>
        <meta name="description" content="Compare the cost of AI receptionist vs hiring staff. See the ROI breakdown for med-aesthetic clinics and salons in Hong Kong." />
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
            <h1 className="text-4xl font-bold mb-4">Scalar vs Hiring a Receptionist</h1>
            <p className="text-xl text-blue-100 mb-6">The real cost comparison: AI vs Staff</p>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 inline-block">
              <p className="text-blue-50"><strong>💰 Year 1 savings:</strong> 480,000-756,000 HKD</p>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">Scalar Cost</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">20,000 HKD</div>
              <p className="text-sm text-gray-600">per month</p>
              <p className="text-xs text-gray-500 mt-2">240,000 HKD/year</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">Receptionist Cost</h3>
              <div className="text-4xl font-bold text-red-600 mb-2">50,000-70,000 HKD</div>
              <p className="text-sm text-gray-600">per month (salary only)</p>
              <p className="text-xs text-gray-500 mt-2">600,000-840,000 HKD/year</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-4">You Save</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">60-70%</div>
              <p className="text-sm text-gray-600">on reception costs</p>
              <p className="text-xs text-gray-500 mt-2">Plus unlimited uptime</p>
            </div>
          </div>
        </div>

        {/* Full Cost Breakdown */}
        <div className="bg-white py-16 border-y">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Year 1 Cost Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Hiring Column */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-600">If You Hire a Receptionist</h3>
                <div className="space-y-3">
                  {yearlyCalculation.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-semibold text-red-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scalar Column */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">If You Choose Scalar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-700">Scalar monthly cost</span>
                    <span className="font-semibold text-green-700">20,000 HKD</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-700">Annual cost (12 months)</span>
                    <span className="font-semibold text-green-700">240,000 HKD</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-700">Training required</span>
                    <span className="font-semibold text-green-700">0 HKD</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-700">Sick cover costs</span>
                    <span className="font-semibold text-green-700">0 HKD</span>
                  </div>
                  <div className="border-t-2 border-green-200 flex justify-between items-center p-3 bg-green-100 rounded mt-2">
                    <span className="text-gray-800 font-bold">Year 1 Total</span>
                    <span className="text-2xl font-bold text-green-700">240,000 HKD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="text-lg font-bold text-gray-900 mb-2">💰 Your Savings: 480,000-756,000 HKD in Year 1</p>
              <p className="text-gray-700">Plus: No hiring costs, training, vacation coverage, or sick leave replacements</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">Feature Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-bold text-green-600">Scalar AI</th>
                  <th className="text-center py-4 px-4 font-bold text-red-600">Hired Staff</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr key={idx} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-4 font-semibold text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.winner === 'scalar' ? (
                          <div className="flex flex-col items-center">
                            <Check className="text-green-600" size={24} />
                            <span className="text-sm text-gray-700 mt-1">{row.scalar}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700">{row.scalar}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.winner === 'hiring' ? (
                          <div className="flex flex-col items-center">
                            <Check className="text-green-600" size={24} />
                            <span className="text-sm text-gray-700 mt-1">{row.hiring}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700">{row.hiring}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* The Hidden Costs of Hiring */}
        <div className="bg-red-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-red-900">Hidden Costs of Hiring</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">📅 Time Off Coverage</h3>
                <p className="text-gray-700 mb-3">Your receptionist will take approximately:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 10-15 days annual leave</li>
                  <li>• 5-7 sick days per year</li>
                  <li>• Public holidays</li>
                  <li>• Maternity/paternity leave</li>
                </ul>
                <p className="text-sm text-red-600 font-bold mt-4">Cost to cover: ~20,000 HKD/year</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">📞 After-Hours Emergencies</h3>
                <p className="text-gray-700 mb-3">Your receptionist won't answer:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Calls after 6 PM (lost leads)</li>
                  <li>• Weekend inquiries (competitors win)</li>
                  <li>• Emergency requests at 10 PM (crisis)</li>
                  <li>• Voicemails pile up until morning</li>
                </ul>
                <p className="text-sm text-red-600 font-bold mt-4">Cost to address: Hire second person or lose revenue</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">🎓 Training & Onboarding</h3>
                <p className="text-gray-700 mb-3">Every new hire requires:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 2-4 weeks to ramp up</li>
                  <li>• Your time spent training</li>
                  <li>• Mistakes during learning period</li>
                  <li>• Testing of systems and procedures</li>
                </ul>
                <p className="text-sm text-red-600 font-bold mt-4">Cost in lost productivity: ~10,000 HKD</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">🚪 High Turnover</h3>
                <p className="text-gray-700 mb-3">Receptionist positions average:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 18-24 month tenure</li>
                  <li>• Recruitment costs: 10,000-15,000 HKD</li>
                  <li>• Lost continuity with customers</li>
                  <li>• Training new person = repeat costs</li>
                </ul>
                <p className="text-sm text-red-600 font-bold mt-4">Over 5 years: 4-5 people = 40,000-75,000 HKD</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Scalar Advantage */}
        <div className="bg-green-50 border-y py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-green-900">The Scalar Advantage</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Truly 24/7</h3>
                <p className="text-gray-700">Scalar answers every call, WhatsApp, and message—even while you're treating patients. 365 days a year, including holidays.</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Instant Setup</h3>
                <p className="text-gray-700">No 2-4 week onboarding. Deploy in 24 hours. Your AI knows your services, pricing, and scheduling rules immediately.</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Predictable Cost</h3>
                <p className="text-gray-700">20,000 HKD/month. No surprises. No benefits, no training costs, no turnover.</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Perfect Accuracy</h3>
                <p className="text-gray-700">Every booking is recorded, confirmed, and logged automatically. Zero manual entry errors.</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Scales Infinitely</h3>
                <p className="text-gray-700">Add locations and it costs the same. One receptionist can't handle 10 locations. Scalar does.</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Human Backup</h3>
                <p className="text-gray-700">Complex questions escalate to your team via Slack. Best of both worlds: automation + human judgment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* When to Hire */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">When Should You Still Hire a Receptionist?</h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-lg mb-2">✓ You need premium customer experience consultations</h3>
              <p className="text-gray-700">If your average consultation requires 15+ mins of creative problem-solving, a person might be better.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-lg mb-2">✓ You're a high-touch luxury brand</h3>
              <p className="text-gray-700">If customers expect to speak with a real person, Scalar can escalate to staff for premium clients.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-lg mb-2">✓ You have 100+ calls/day</h3>
              <p className="text-gray-700">At massive scale, a team might help for relationship building. But Scalar handles unlimited volume.</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="font-bold text-gray-900 mb-2">Recommendation: Use Scalar as your primary receptionist</p>
            <p className="text-gray-700">Then hire a customer success person to handle premium requests, follow-ups, and complaints. This gives you the best ROI: 80% of calls handled by AI, 20% by staff focused on retention rather than reception.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">See the Difference for Yourself</h2>
            <p className="text-lg text-blue-100 mb-8">Schedule a 15-minute demo and we'll show you exactly how much you'll save.</p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Related Comparisons */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Also Compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/compare/scalar-vs-manual">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <p className="text-blue-900 font-semibold mb-2">📱 Comparison</p>
                  <p className="font-semibold text-gray-900">Scalar vs Manual WhatsApp</p>
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
