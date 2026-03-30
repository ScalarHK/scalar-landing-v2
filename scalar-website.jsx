import React, { useState } from 'react';
import { ChevronRight, MessageSquare, Check, Star, ArrowRight, Phone, Mail } from 'lucide-react';

const ScalarWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: "Hi! I'm Aria, your AI receptionist. What service are you interested in?" }
  ]);
  const [chatStep, setChatStep] = useState(0);
  const [userInput, setUserInput] = useState('');

  const chatFlow = [
    { prompt: "What service are you interested in?", options: ["Haircut", "Manicure", "Facial", "Other"] },
    { prompt: "What date works for you?", options: ["Today", "Tomorrow", "This week", "Next week"] },
    { prompt: "What time?", options: ["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "After 6 PM"] },
    { prompt: "What's your phone number?", options: [], isInput: true }
  ];

  const handleChatMessage = (message) => {
    setChatMessages([...chatMessages, { type: 'user', text: message }]);

    if (chatStep < chatFlow.length - 1) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: chatFlow[chatStep + 1].prompt }]);
        setChatStep(chatStep + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', text: '✅ Perfect! Your appointment is confirmed. You\'ll get a reminder 24h before. See you soon!' }]);
      }, 500);
    }
    setUserInput('');
  };

  // PAGE: HOMEPAGE
  const HomePage = () => (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Stop Losing Revenue From Missed Leads</h1>
          <p className="text-2xl mb-8 text-blue-100">24/7 AI Receptionist + WhatsApp Booking. Capture Every Lead. Automatically.</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Your clinic, salon, or gym misses calls when you're busy. After hours. On weekends. Every missed call is money walking out the door. Scalar AI captures every lead automatically.</p>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 inline-flex items-center gap-2">
            Try Your Chatbot (60-Second Demo)
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-red-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 text-red-900">You're Losing Revenue Right Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">After-Hours Calls</h3>
              <p>Missed calls go unanswered. Average value: 50-100 HKD per call.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Slow Replies</h3>
              <p>80% of people switch providers after 1 hour of waiting.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">No-Shows</h3>
              <p>Appointment no-shows cost 400-800 HKD per slot.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Overwhelmed Team</h3>
              <p>One receptionist can't handle 3 channels: phone, WhatsApp, Instagram.</p>
            </div>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mt-8 rounded">
            <p className="text-lg font-bold">Typical monthly lead loss: 150-300 leads × 400 HKD = <span className="text-2xl">60,000-120,000 HKD</span> in missing revenue</p>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">How Scalar Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: 1, text: "Message sent\n(WhatsApp/IG)" },
              { num: 2, text: "Instant response\n+ qualification" },
              { num: 3, text: "Appointment\nbooked" },
              { num: 4, text: "Client confirms\n+ reminder sent" },
              { num: 5, text: "You get qualified\nlead ready" }
            ].map((step, idx) => (
              <div key={idx}>
                <div className="bg-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mb-3 mx-auto">{step.num}</div>
                <p className="text-center text-sm whitespace-pre-line">{step.text}</p>
                {idx < 4 && <div className="text-center text-2xl mt-2">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Trusted by 100+ Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900">28</div>
              <p className="text-gray-700">Avg bookings recovered/month</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900">15k</div>
              <p className="text-gray-700">HKD revenue recovered/month</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900">97%</div>
              <p className="text-gray-700">Booking confirmation rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-900 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">See It In Action. Right Now.</h2>
        <p className="text-lg mb-8">Enter your website URL. We'll generate a working chatbot in 60 seconds.</p>
        <button
          onClick={() => setChatOpen(true)}
          className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50">
          Try Your Chatbot Free
        </button>
      </div>
    </div>
  );

  // PAGE: INDUSTRY PAGES
  const IndustryPage = ({ industry, pain, solution, stats }) => (
    <div className="w-full">
      <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">{pain}</h1>
          <p className="text-xl text-blue-100">Capture 20+ missed {industry} leads monthly. Automatically.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Problem</h2>
            <p className="text-lg mb-4">{pain} is costing you real money.</p>
            <ul className="space-y-4">
              {stats.map((stat, idx) => (
                <li key={idx} className="flex gap-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">The Solution</h2>
            <p className="text-lg mb-4">{solution}</p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="font-bold mb-2">Average {industry} client results:</p>
              <ul className="space-y-2 text-sm">
                <li>• 25-40 bookings recovered/month</li>
                <li>• 10,000-20,000 HKD revenue/month</li>
                <li>• Set up in &lt;5 minutes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setChatOpen(true)}
            className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 inline-flex items-center gap-2">
            See Demo for {industry}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // PAGE: BLOG POST
  const BlogPage = ({ title, excerpt, content }) => (
    <div className="w-full">
      <div className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700">{excerpt}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          {content.split('\n\n').map((para, idx) => (
            <p key={idx} className="mb-6 text-gray-800">{para}</p>
          ))}
        </div>

        <div className="bg-blue-50 p-8 rounded-lg mt-12 text-center">
          <p className="text-lg font-bold mb-4">Ready to recover your missed leads?</p>
          <button
            onClick={() => setChatOpen(true)}
            className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800">
            See How Scalar Works
          </button>
        </div>
      </div>
    </div>
  );

  // CHATBOT WIDGET
  const ChatWidget = () => (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border-t-4 border-blue-900">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <p className="font-bold">Scalar AI</p>
          <p className="text-sm text-blue-100">Your AI Receptionist</p>
        </div>
        <button onClick={() => setChatOpen(false)} className="text-2xl">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${
              msg.type === 'user'
                ? 'bg-blue-900 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        {chatStep < chatFlow.length && (
          <div className="space-y-2">
            {chatFlow[chatStep].isInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userInput && handleChatMessage(userInput)}
                  placeholder="Type here..."
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={() => userInput && handleChatMessage(userInput)}
                  className="bg-blue-900 text-white px-4 py-2 rounded">
                  Send
                </button>
              </div>
            ) : (
              chatFlow[chatStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChatMessage(option)}
                  className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded text-sm">
                  {option}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Navigation
  const pages = {
    home: <HomePage />,
    clinic: <IndustryPage
      industry="Clinic"
      pain="Stop Losing Dermatology Leads to Slow Response"
      solution="Scalar instantly responds to appointment requests on WhatsApp, qualifies leads, and books directly into your calendar. Clinic staff notified of each booking."
      stats={["Missing after-hours calls", "Slow WhatsApp replies losing 60% of leads", "No-show rate affects revenue", "Manual appointment confirmation taking staff time"]}
    />,
    salon: <IndustryPage
      industry="Salon"
      pain="Stop Losing Salon Bookings to Slow Text Reply"
      solution="Respond to every WhatsApp booking request in seconds. Scalar handles service selection, time slot booking, and client confirmation automatically."
      stats={["20-40 texts/day going unanswered", "60% of texters book elsewhere while waiting", "Clients expect instant response", "Manual booking process is error-prone"]}
    />,
    blog1: <BlogPage
      title="How Much Does Missing a Call Cost Your Salon?"
      excerpt="The real numbers behind missed revenue."
      content={`Most salon owners don't track how much money they lose from missed calls. Let's do the math.

An average salon gets 20-40 booking calls/texts per day. If you're closed after hours or busy with clients, you miss calls. Studies show 60% of people who can't reach a business book with a competitor instead.

That's 12-24 missed bookings per day = 60-120 per week = 240-480 per month. At an average service value of 400 HKD, that's 96,000-192,000 HKD in monthly revenue loss.

Most salons discover this only when cash flow drops. Scalar AI answers every call. No missed bookings. No lost revenue.

Want to know your exact number? We can calculate it based on your current booking volume. See how Scalar would change your bottom line.`}
    />,
  };

  return (
    <div className="w-full bg-white">
      {/* Header Navigation */}
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-2xl cursor-pointer" onClick={() => setCurrentPage('home')}>Scalar AI</div>
        <div className="flex gap-6">
          <button onClick={() => setCurrentPage('clinic')} className="hover:text-blue-200">Clinic</button>
          <button onClick={() => setCurrentPage('salon')} className="hover:text-blue-200">Salon</button>
          <button onClick={() => setCurrentPage('blog1')} className="hover:text-blue-200">Blog</button>
          <button onClick={() => setChatOpen(true)} className="bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-blue-50">Try Demo</button>
        </div>
      </div>

      {/* Current Page */}
      {pages[currentPage]}

      {/* Chatbot */}
      {chatOpen && <ChatWidget />}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-900 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 z-40">
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ScalarWebsite;
