import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send, Loader, ArrowRight, CheckCircle2, Zap, Clock, MessageCircle } from 'lucide-react';

// Domain intelligence parser
const parseDomain = (domain) => {
  const normalized = domain.toLowerCase().replace(/^www\./, '').replace(/\.[a-z]+$/, '');

  const businessTypes = {
    medical: {
      keywords: ['derma', 'skin', 'aesthetic', 'clinic', 'med', 'beauty', 'facial', 'laser', 'botox', 'filler'],
      type: 'med-aesthetic',
      icon: '💆',
    },
    spa: {
      keywords: ['spa', 'massage', 'wellness', 'relax', 'therapy'],
      type: 'spa-wellness',
      icon: '🧖',
    },
    dental: {
      keywords: ['dental', 'teeth', 'smile', 'orthodont'],
      type: 'dental',
      icon: '😁',
    },
    fitness: {
      keywords: ['gym', 'fitness', 'trainer', 'yoga', 'pilates'],
      type: 'fitness',
      icon: '💪',
    },
  };

  let detected = { type: 'service-business', icon: '🏢' };

  for (const [key, category] of Object.entries(businessTypes)) {
    if (category.keywords.some(kw => normalized.includes(kw))) {
      detected = category;
      break;
    }
  }

  return { normalized, ...detected };
};

// Generate quick actions based on services
const generateQuickActions = (services) => {
  if (!services || services.length === 0) {
    return ['Services', 'Pricing', 'Hours', 'Contact', 'Booking'];
  }

  const actions = [];

  // Add service-specific actions
  if (services.length > 0) {
    actions.push(`Ask about ${services[0].toLowerCase()}`);
  }

  // Add common actions
  actions.push('Book appointment');
  actions.push('Opening hours');

  if (services.length > 1) {
    actions.push(`View ${services[1].toLowerCase()}`);
  } else {
    actions.push('Pricing');
  }

  actions.push('Location');

  return actions.slice(0, 4);
};

// Generate sample chat based on business name and services
const generateSampleChat = (businessName, services) => {
  const defaultService = services && services.length > 0 ? services[0] : 'services';

  return [
    {
      type: 'user',
      text: `Hi, I'm interested in your ${defaultService.toLowerCase()}`,
      time: '2:34 PM',
    },
    {
      type: 'bot',
      text: `Great! We offer several options for ${defaultService.toLowerCase()}. 😊 What would you like to know?`,
      time: '2:34 PM',
    },
    {
      type: 'user',
      text: 'What are the prices?',
      time: '2:35 PM',
    },
    {
      type: 'bot',
      text: 'We have flexible pricing packages available. First-time customers often receive a special rate! Would you like to book a consultation? 💫',
      time: '2:35 PM',
    },
    {
      type: 'user',
      text: 'When are you open?',
      time: '2:36 PM',
    },
    {
      type: 'bot',
      text: 'We\'re open Mon-Sun, 10AM-8PM. Perfect for fitting around your schedule! Shall I book you in? 📅',
      time: '2:36 PM',
    },
  ];
};

// Mock data generator based on business type
const generateMockData = (domain, businessType) => {
  const dataSets = {
    'med-aesthetic': {
      businessName: domain.replace(/\.[a-z]+$/, '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      assistantName: 'Dr. Sofia',
      greeting: 'Hi! Welcome to our clinic. How can I help you with your skincare concerns today? 😊',
      services: ['Facial Treatments', 'Skin Consultation', 'Botox & Fillers', 'Laser Therapy', 'Chemical Peels'],
      quickActions: ['Ask about treatments', 'Book consultation', 'Opening hours', 'Pricing', 'View location'],
      sampleChat: [
        { type: 'user', text: 'Hi! I\'m interested in facial treatments', time: '2:34 PM' },
        { type: 'bot', text: 'Great! We offer several facial treatments including hydrating facials, anti-aging treatments, and specialized skin therapies. 🧖‍♀️', time: '2:34 PM' },
        { type: 'user', text: 'How much does a treatment cost?', time: '2:35 PM' },
        { type: 'bot', text: 'Our packages range from HK$800-2,500 depending on the treatment. First-time clients get 15% off! Would you like to book a consultation with our specialist? 💫', time: '2:35 PM' },
        { type: 'user', text: 'When are you open?', time: '2:36 PM' },
        { type: 'bot', text: 'We\'re open Mon-Sun, 10AM-8PM. Perfect for a quick consultation after work! Shall I book you in for tomorrow? 📅', time: '2:36 PM' },
      ],
      profileSummary: 'Premium med-aesthetic clinic offering cutting-edge skincare and anti-aging treatments',
    },
    'spa-wellness': {
      businessName: domain.replace(/\.[a-z]+$/, '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      assistantName: 'Wellness Team',
      greeting: 'Welcome to our sanctuary! Looking for a relaxing massage or wellness treatment? 🧘',
      services: ['Swedish Massage', 'Thai Massage', 'Reflexology', 'Aromatherapy', 'Wellness Packages'],
      quickActions: ['Massage services', 'Book appointment', 'Hours', 'Packages', 'Location'],
      sampleChat: [
        { type: 'user', text: 'Hi, I want to book a massage', time: '3:45 PM' },
        { type: 'bot', text: 'Wonderful! We have several massage styles available. Are you interested in Swedish, Thai, or our signature hot stone massage? 🌿', time: '3:45 PM' },
        { type: 'user', text: 'What\'s the price for Thai massage?', time: '3:46 PM' },
        { type: 'bot', text: 'Thai massage is HK$650 for 60 mins or HK$950 for 90 mins. Very popular for tension relief! When would you like to come in? ✨', time: '3:46 PM' },
        { type: 'user', text: 'Tomorrow evening?', time: '3:47 PM' },
        { type: 'bot', text: 'Perfect! We have slots at 5:30 PM, 6:30 PM, and 7:30 PM tomorrow. Which works best for you? 📅', time: '3:47 PM' },
      ],
      profileSummary: 'Full-service wellness spa specializing in therapeutic and relaxation treatments',
    },
    'dental': {
      businessName: domain.replace(/\.[a-z]+$/, '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      assistantName: 'Dr. Chen',
      greeting: 'Hello! Welcome to our dental clinic. How can we help you achieve a perfect smile? 😁',
      services: ['General Check-up', 'Teeth Cleaning', 'Whitening', 'Braces', 'Implants'],
      quickActions: ['Book cleaning', 'Teeth whitening', 'Emergency', 'Open hours', 'Location'],
      sampleChat: [
        { type: 'user', text: 'I need a dental check-up', time: '10:15 AM' },
        { type: 'bot', text: 'Absolutely! A regular check-up is great for oral health. First visit or regular patient? 🦷', time: '10:15 AM' },
        { type: 'user', text: 'First time', time: '10:16 AM' },
        { type: 'bot', text: 'Welcome! Your first check-up includes examination, cleaning, and consultation. It\'s HK$350. Next available is tomorrow at 2 PM! 😊', time: '10:16 AM' },
        { type: 'user', text: 'Sounds good!', time: '10:17 AM' },
        { type: 'bot', text: 'Perfect! I\'ll send you a confirmation link to secure your appointment. See you soon! 💪', time: '10:17 AM' },
      ],
      profileSummary: 'Modern dental clinic with latest technology and experienced specialists',
    },
    'service-business': {
      businessName: domain.replace(/\.[a-z]+$/, '').split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      assistantName: 'Customer Support',
      greeting: 'Hello! How can we assist you today? 👋',
      services: ['Inquiries', 'Booking', 'Support', 'Information'],
      quickActions: ['Services', 'Pricing', 'Hours', 'Contact', 'Booking'],
      sampleChat: [
        { type: 'user', text: 'Hi, I\'d like to know more about your services', time: '4:20 PM' },
        { type: 'bot', text: 'Of course! We\'d love to help. What type of service are you interested in? 😊', time: '4:20 PM' },
        { type: 'user', text: 'Tell me about your packages', time: '4:21 PM' },
        { type: 'bot', text: 'We have several packages available for different needs. Would you like to book a consultation? It\'s free! 💡', time: '4:21 PM' },
        { type: 'user', text: 'Yes please!', time: '4:22 PM' },
        { type: 'bot', text: 'Great! When is best for you? We\'re available Mon-Fri 9AM-6PM, and Sat 10AM-4PM. 📅', time: '4:22 PM' },
      ],
      profileSummary: 'Professional service business ready to help customers 24/7',
    },
  };

  return dataSets[businessType] || dataSets['service-business'];
};

// Loading sequence step animation
const LoadingSteps = ({ currentStep }) => {
  const steps = [
    { label: 'Analyzing website', icon: '🔍' },
    { label: 'Identifying services', icon: '📋' },
    { label: 'Building knowledge base', icon: '🧠' },
    { label: 'Creating personality', icon: '✨' },
    { label: 'Generating chatbot', icon: '🤖' },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`flex items-center space-x-3 transition-all duration-300 ${
            idx <= currentStep ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              idx < currentStep
                ? 'bg-green-100'
                : idx === currentStep
                ? 'bg-blue-100 animate-pulse'
                : 'bg-gray-100'
            }`}
          >
            {idx < currentStep ? '✓' : step.icon}
          </div>
          <span className={`text-sm font-medium ${idx <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// WhatsApp-style chat component
const ChatInterface = ({ data, domain }) => {
  const [messages, setMessages] = useState(data.sampleChat);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (action) => {
    const userMessage = {
      type: 'user',
      text: action,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const responses = {
        'Ask about treatments': `We offer our full range of ${data.services.slice(0, 2).join(', ')} and more. What interests you most? 😊`,
        'Book consultation': 'I\'d love to help you book a consultation! When would be convenient for you? 📅',
        'Opening hours': 'We\'re open Monday to Sunday, 10 AM to 8 PM. What time works best for you?',
        'Pricing': 'Our services range from HK$500-2,500 depending on the treatment. First-time clients get special rates! 💫',
        'View location': 'We\'re located in the heart of the district. Easy access via MTR! Would you like directions? 📍',
        'Massage services': 'We offer Swedish, Thai, and specialty massage treatments. Which would you prefer? 🧖‍♀️',
        'Book appointment': 'Great! What day and time would you prefer? We have availability throughout the week 📅',
        'Hours': 'Open daily 10 AM - 8 PM. What time can we see you?',
        'Packages': 'Check out our wellness packages! Many include discounts on recurring visits. Interested? ✨',
        'Location': 'We\'re centrally located with easy parking. Would you like directions? 📍',
        'Emergency': 'In case of dental emergency, we have same-day appointments. Are you in pain? 🚨',
        'Services': 'We specialize in bringing your business 24/7 customer support. What would help most? 💡',
        'Contact': 'You can reach us via WhatsApp, call, or email. What\'s easiest for you? 📞',
        'Booking': 'Let\'s get you booked! When works best for your schedule? 📅',
      };

      const response = responses[action] || 'Great question! Tell me more about what you\'re looking for. 😊';

      const botMessage = {
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const genericResponses = [
        'That\'s a great question! Let me help you with that. 😊',
        'I\'m so glad you asked! Here\'s what I can tell you... ✨',
        'Perfect! That\'s something we can definitely help with. 💫',
        'Absolutely! We\'ve helped many customers with that. What else would you like to know? 🙌',
      ];

      const response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      const botMessage = {
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-96 sm:h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{data.businessName}</h3>
            <p className="text-xs text-gray-500">AI Receptionist • Always available</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            {data.businessName.charAt(0)}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.type === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 bg-white p-3 max-h-24 overflow-x-auto">
        <div className="flex gap-2 flex-nowrap pb-1">
          {data.quickActions.slice(0, 4).map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action)}
              className="flex-shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors whitespace-nowrap"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-3 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2.5 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// Business Profile Card
const BusinessProfileCard = ({ data, domain }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{data.businessName}</h3>
            <p className="text-sm text-emerald-600 font-medium mt-1">✓ Trained on your services</p>
          </div>
          <div className="text-4xl">{data.icon || '🏢'}</div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">{data.profileSummary}</p>

        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Services</p>
          <div className="flex flex-wrap gap-2">
            {data.services.slice(0, 4).map((service, idx) => (
              <span key={idx} className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full border border-emerald-200">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-200 flex items-center text-xs text-gray-600">
          <Zap size={14} className="mr-2 text-amber-500" />
          AI-powered 24/7 responses • Never miss a lead
        </div>
      </div>
    </div>
  );
};

// Main Landing Page Component
export default function ScalarLandingPage() {
  const [domain, setDomain] = useState('');
  const [stage, setStage] = useState('hero'); // hero, loading, demo
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [businessData, setBusinessData] = useState(null);
  const [domainParsed, setDomainParsed] = useState(null);
  const [error, setError] = useState('');

  const handleDomainSubmit = async (e) => {
    e.preventDefault();

    if (!domain.trim()) {
      setError('Please enter a domain');
      return;
    }

    setError('');
    setStage('loading');
    setCurrentLoadingStep(0);

    // Show loading steps
    let step = 0;
    const interval = setInterval(() => {
      if (step < 5) {
        setCurrentLoadingStep(step);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      // Call the scraper API
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Use real scraped data
        const parsed = parseDomain(domain);
        setDomainParsed(parsed);

        // Create business data object from scraped content
        const businessData = {
          businessName: result.data.businessName,
          assistantName: result.data.assistantName,
          greeting: `Hi! Welcome to ${result.data.businessName}. How can I help you today? 😊`,
          services: result.data.services && result.data.services.length > 0
            ? result.data.services
            : generateMockData(domain, parsed.type).services,
          quickActions: generateQuickActions(result.data.services),
          sampleChat: generateSampleChat(result.data.businessName, result.data.services),
          profileSummary: result.data.profileSummary || `Professional ${parsed.type.replace(/-/g, ' ')} service`,
          icon: parsed.icon,
        };

        setBusinessData(businessData);
      } else {
        // Fallback to mock data if scraping failed
        console.log('Scraping failed, using mock data');
        const parsed = parseDomain(domain);
        setDomainParsed(parsed);
        const mockData = generateMockData(domain, parsed.type);
        setBusinessData(mockData);
      }

      clearInterval(interval);
      setTimeout(() => {
        setStage('demo');
      }, 600);
    } catch (err) {
      console.error('Error scraping domain:', err);
      // Fallback to mock data on error
      const parsed = parseDomain(domain);
      setDomainParsed(parsed);
      const mockData = generateMockData(domain, parsed.type);
      setBusinessData(mockData);

      clearInterval(interval);
      setTimeout(() => {
        setStage('demo');
      }, 600);
    }
  };

  const handleReset = () => {
    setDomain('');
    setStage('hero');
    setBusinessData(null);
    setDomainParsed(null);
    setError('');
  };

  // Hero Stage
  if (stage === 'hero') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
        {/* Nav */}
        <nav className="border-b border-emerald-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/">
              <div className="font-bold text-xl tracking-tight cursor-pointer hover:text-emerald-300 transition">
                <span className="text-emerald-400">Scalar</span>
              </div>
            </Link>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6 text-sm">
                <Link href="/blog">
                  <span className="text-gray-300 hover:text-emerald-400 transition cursor-pointer">Blog</span>
                </Link>
                <Link href="/industries">
                  <span className="text-gray-300 hover:text-emerald-400 transition cursor-pointer">Industries</span>
                </Link>
                <Link href="/compare">
                  <span className="text-gray-300 hover:text-emerald-400 transition cursor-pointer">Compare</span>
                </Link>
              </div>
              <div className="text-sm text-gray-400">AI Receptionist for Local Business</div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  Turn Your Website Into a{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    24/7 AI Receptionist
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Never miss a lead again. Instantly preview how your clinic, spa, or salon would handle inquiries with AI-powered WhatsApp, Instagram, and web chat.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                  ✓ See it in 30 seconds
                </p>
                <p className="text-gray-400">Enter your domain and we'll generate a custom demo instantly</p>
              </div>

              {/* Domain Input Form */}
              <form onSubmit={handleDomainSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g., beautyspa.hk or medskin.com"
                    className="w-full px-6 py-4 bg-white/10 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/50"
                  >
                    Preview <ArrowRight size={18} />
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </form>

              {/* Trust Signals */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Works with any clinic, spa, salon, or service business</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Responses in seconds • 24/7 availability</span>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">WhatsApp, Instagram, website chat, and more</span>
                </div>
              </div>
            </div>

            {/* Right Column - Preview Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                    <div className="h-10 bg-white rounded-lg opacity-50"></div>
                  </div>
                  <div className="p-4 space-y-3 h-96">
                    <div className="flex justify-end">
                      <div className="bg-emerald-500 text-white rounded-2xl px-4 py-2 max-w-xs rounded-br-none">
                        <div className="h-3 bg-emerald-400 rounded opacity-50 w-32"></div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs rounded-bl-none">
                        <div className="h-3 bg-gray-300 rounded w-40"></div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-emerald-500 text-white rounded-2xl px-4 py-2 max-w-xs rounded-br-none">
                        <div className="h-3 bg-emerald-400 rounded opacity-50 w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid sm:grid-cols-3 gap-6 mt-20 pt-20 border-t border-emerald-800/30">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-emerald-400">24/7</div>
              <p className="text-gray-400">Always-on customer support, no more missed leads</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-emerald-400">90%</div>
              <p className="text-gray-400">Faster response times than manual assistants</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-emerald-400">∞</div>
              <p className="text-gray-400">Scales to your busiest hours without extra cost</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading Stage
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Generating your AI receptionist...</h2>
            <p className="text-gray-400">
              Analyzing <span className="text-emerald-400 font-semibold">{domain}</span>
            </p>
          </div>

          <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <LoadingSteps currentStep={currentLoadingStep} />
          </div>

          <div className="flex justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Demo Stage
  if (stage === 'demo' && businessData && domainParsed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/">
              <div className="font-bold text-xl text-emerald-600 cursor-pointer hover:text-emerald-700 transition">
                Scalar
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-6 text-sm">
                <Link href="/blog">
                  <span className="text-gray-600 hover:text-emerald-600 transition cursor-pointer">Blog</span>
                </Link>
                <Link href="/industries">
                  <span className="text-gray-600 hover:text-emerald-600 transition cursor-pointer">Industries</span>
                </Link>
                <Link href="/compare">
                  <span className="text-gray-600 hover:text-emerald-600 transition cursor-pointer">Compare</span>
                </Link>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                Try Another Domain
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Your AI Receptionist is ready!</h3>
              <p className="text-gray-700 text-sm mt-1">
                We've analyzed <span className="font-medium text-emerald-600">{domain}</span> and generated a custom chatbot. Try asking questions below.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Demo</h2>
              <ChatInterface data={businessData} domain={domain} />
              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Tip: Click quick actions or type your own questions
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Profile</h2>
                <BusinessProfileCard data={businessData} domain={domain} />
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white space-y-4 sticky top-24">
                <h3 className="text-xl font-bold">Ready to go live?</h3>
                <p className="text-sm text-emerald-50">
                  Get this AI receptionist running for your clinic in 48 hours.
                </p>

                <div className="space-y-2">
                  <button className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    Book a Demo Call
                  </button>
                  <button className="w-full border-2 border-white text-white font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                    See Pricing
                  </button>
                </div>

                <div className="pt-3 border-t border-emerald-400/50 space-y-2 text-xs text-emerald-50">
                  <div className="flex items-center gap-2">
                    <Zap size={14} />
                    <span>Setup in 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span>WhatsApp + Instagram ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">What You'll Get</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💬', label: 'WhatsApp Bot', desc: 'Instant replies 24/7' },
                { icon: '📱', label: 'Instagram DMs', desc: 'Auto-respond to inquiries' },
                { icon: '📞', label: 'Voice Receptionist', desc: 'AI call handling' },
                { icon: '📊', label: 'Analytics', desc: 'Lead tracking & insights' },
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <div className="text-4xl">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Placeholder */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Common Questions</h3>
            <div className="space-y-4">
              {[
                { q: 'How long does setup take?', a: '48 hours from demo booking to launch.' },
                { q: 'Can I customize the responses?', a: 'Yes, fully customizable to match your brand and services.' },
                { q: 'What if I have questions after launch?', a: 'Dedicated support team available 24/7 for your clinic.' },
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learn More Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Learn More About Scalar</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link href="/blog">
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">📖 Blog</h4>
                  <p className="text-sm text-gray-600 mb-4">Read case studies, ROI breakdowns, and booking strategy guides.</p>
                  <span className="text-emerald-600 font-semibold text-sm">Explore blog →</span>
                </div>
              </Link>

              <Link href="/industries">
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🏢 Industries</h4>
                  <p className="text-sm text-gray-600 mb-4">See how Scalar works for clinics, salons, gyms, dental, and spas.</p>
                  <span className="text-emerald-600 font-semibold text-sm">View industries →</span>
                </div>
              </Link>

              <Link href="/compare">
                <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">⚔️ Compare</h4>
                  <p className="text-sm text-gray-600 mb-4">Scalar vs hiring staff, manual booking, and competitor tools.</p>
                  <span className="text-emerald-600 font-semibold text-sm">Compare options →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Stop losing leads to missed calls and slow responses.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your AI receptionist is ready. Book a call with our team to go live this week.
            </p>
            <button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/50">
              Schedule Your Demo Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
