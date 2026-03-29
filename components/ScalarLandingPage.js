import React, { useState, useEffect, useRef } from 'react';
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

// Generate dynamic sample chat using OpenAI
const generateSampleChatWithAI = async (businessName, services, businessType) => {
  try {
    const servicesList = services && services.length > 0
      ? services.slice(0, 3).join(', ')
      : 'services';

    const prompt = `Generate a realistic 3-turn customer service conversation for ${businessName}.

Business Type: ${businessType}
Services: ${servicesList}

Create a JSON array with exactly 3 user-bot exchanges (6 messages total). The conversation should:
1. Start with a customer asking about a service
2. Show the bot responding naturally and helpfully
3. Customer asks a follow-up question
4. Show relevant bot response
5. Customer expresses interest or asks about availability
6. Bot provides helpful response with call-to-action

Return ONLY valid JSON array, nothing else. Format:
[
  {"type": "user", "text": "...", "time": "2:34 PM"},
  {"type": "bot", "text": "...", "time": "2:34 PM"},
  ...
]

Rules:
- Make it feel natural and specific to this business
- Include at least one emoji
- Keep messages concise (1-2 sentences)
- Times should be realistic (2-3 minutes apart)
- Show the AI being helpful and moving toward a booking`;

    const response = await fetch('/api/chat-helper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      console.error('Failed to generate sample chat');
      return null;
    }

    const result = await response.json();

    if (result.reply) {
      try {
        // Try to parse the JSON from the response
        const jsonMatch = result.reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const sampleChat = JSON.parse(jsonMatch[0]);
          if (Array.isArray(sampleChat) && sampleChat.length > 0) {
            console.log('AI generated sample chat:', sampleChat);
            return sampleChat;
          }
        }
      } catch (parseError) {
        console.error('Failed to parse sample chat JSON:', parseError);
      }
    }
  } catch (error) {
    console.error('Error generating sample chat:', error);
  }

  return null;
};

// Fallback static sample chat
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
const ChatInterface = ({ data, domain, language }) => {
  const [messages, setMessages] = useState(data.sampleChat);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // Scroll within the container only, not the entire page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = async (action) => {
    const userMessage = {
      type: 'user',
      text: action,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get conversation context with token limits
      const { messages: contextMessages, tokenEstimate } = getConversationContext([...messages, userMessage]);

      // Call the OpenAI chat API with the quick action
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: action,
          conversationHistory: contextMessages,
          businessName: data?.businessName || 'Our Business',
          services: data?.services || [],
          businessType: data?.type || 'service-business',
          openingHours: data?.openingHours || null,
          tokenEstimate: tokenEstimate,
          language: language,
          knowledgeBase: data?.knowledgeBase || '',
        }),
      });

      const result = await response.json();

      let botResponse = result.reply || 'Great question! How can I help you further? 😊';

      if (!result.success) {
        botResponse = 'Thanks for your interest! What else can I help you with? 😊';
      }

      const botMessage = {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Quick action error:', error);

      // Fallback response
      const fallbackMessage = {
        type: 'bot',
        text: 'Great question! How can I help you further? 😊',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  // Estimate tokens (rough: ~4 chars per token)
  const estimateTokens = (text) => Math.ceil(text.length / 4);

  // Get conversation history with token limits
  const getConversationContext = (allMessages) => {
    const maxHistoryTokens = 2000; // Limit context to ~2000 tokens (~8000 chars)
    const maxMessages = 10; // Never include more than last 10 messages

    let contextMessages = [];
    let totalTokens = 0;

    // Work backwards from most recent message
    for (let i = allMessages.length - 1; i >= 0 && contextMessages.length < maxMessages; i--) {
      const msg = allMessages[i];
      const msgTokens = estimateTokens(msg.text);

      if (totalTokens + msgTokens > maxHistoryTokens) {
        break; // Stop if would exceed token limit
      }

      contextMessages.unshift(msg);
      totalTokens += msgTokens;
    }

    return { messages: contextMessages, tokenEstimate: totalTokens };
  };

  const handleSendMessage = async (e) => {
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

    try {
      // Get conversation context with token limits
      const { messages: contextMessages, tokenEstimate } = getConversationContext([...messages, userMessage]);

      // Warn if getting close to token limit
      if (tokenEstimate > 1800) {
        console.warn(`Token usage high: ~${tokenEstimate} tokens. Conversation will be reset if it exceeds limits.`);
      }

      // Call the OpenAI chat API with full conversation context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: contextMessages, // Include full context
          businessName: data?.businessName || 'Our Business',
          services: data?.services || [],
          businessType: data?.type || 'service-business',
          openingHours: data?.openingHours || null,
          tokenEstimate: tokenEstimate, // Pass token estimate for server-side validation
          language: language,
          knowledgeBase: data?.knowledgeBase || '',
        }),
      });

      const result = await response.json();

      let botResponse = result.reply || 'That\'s a great question! Let me help you with that. 😊';

      // Fallback if API fails
      if (!result.success) {
        botResponse = 'Thanks for your message! Our team will get back to you shortly. 😊';
      }

      const botMessage = {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback response on error
      const fallbackMessage = {
        type: 'bot',
        text: 'Sorry, I\'m having trouble responding right now. Please try again. 😊',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[550px] sm:h-[700px]">
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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
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

// Instagram DM-style chat component
const InstagramChatInterface = ({ data, domain, language }) => {
  const [messages, setMessages] = useState(data.sampleChat);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Estimate tokens (rough: ~4 chars per token)
  const estimateTokens = (text) => Math.ceil(text.length / 4);

  // Get conversation history with token limits
  const getConversationContext = (allMessages) => {
    const maxHistoryTokens = 2000;
    const maxMessages = 10;

    let contextMessages = [];
    let totalTokens = 0;

    for (let i = allMessages.length - 1; i >= 0 && contextMessages.length < maxMessages; i--) {
      const msg = allMessages[i];
      const msgTokens = estimateTokens(msg.text);

      if (totalTokens + msgTokens > maxHistoryTokens) {
        break;
      }

      contextMessages.unshift(msg);
      totalTokens += msgTokens;
    }

    return { messages: contextMessages, tokenEstimate: totalTokens };
  };

  const handleSendMessage = async (e) => {
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

    try {
      const { messages: contextMessages, tokenEstimate } = getConversationContext([...messages, userMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: contextMessages,
          businessName: data?.businessName || 'Our Business',
          services: data?.services || [],
          businessType: data?.type || 'service-business',
          openingHours: data?.openingHours || null,
          tokenEstimate: tokenEstimate,
          language: language,
          knowledgeBase: data?.knowledgeBase || '',
        }),
      });

      const result = await response.json();

      let botResponse = result.reply || 'That\'s a great question! Let me help you with that. 😊';

      if (!result.success) {
        botResponse = 'Thanks for your message! Our team will get back to you shortly. 😊';
      }

      const botMessage = {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);

      const fallbackMessage = {
        type: 'bot',
        text: 'Sorry, I\'m having trouble responding right now. Please try again. 😊',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[550px] sm:h-[700px]">
      {/* Header - Instagram Style */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              {data.businessName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{data.businessName}</h3>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Messages - Instagram Style */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input - Instagram Style */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-3 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Aa"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="flex-shrink-0 text-blue-500 hover:text-blue-600 font-semibold transition-colors"
        >
          Send
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

        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{data.profileSummary}</p>

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

// Translations
const translations = {
  en: {
    turnYour: 'Turn Your',
    intoAI: 'Into a 24/7 AI Receptionist',
    neverMiss: 'Never miss a lead again. Instantly preview how your business would handle inquiries with AI-powered WhatsApp, Instagram, and web chat.',
    seeIn30: '✓ See it in 30 seconds',
    enterDomain: 'Enter your domain and we\'ll generate a custom demo instantly',
    placeholder: 'e.g., yourcompany.com or business.hk',
    preview: 'Preview',
    anyBusiness: 'Works with any business type • No coding required',
    responses: 'Instant responses • 24/7 lead capture',
    channels: 'WhatsApp • Instagram • Website • Phone',
    withoutAI: '❌ Without AI',
    withAI: '✅ With AI',
    liveDemo: 'Live Demo',
    whatsapp: '💬 WhatsApp',
    instagram: '📱 Instagram',
    tryAnother: 'Try Another Domain',
    success: 'Your AI Receptionist is ready!',
    analyzed: 'We\'ve analyzed',
    generated: 'and generated a custom chatbot. Try asking questions below.',
    whatYouGet: 'What You\'ll Get',
    faq: 'Common Questions',
    ready: 'Ready to go live?',
    aiReceptionist: 'Get your AI receptionist live in 48 hours. No setup headaches.',
    bookDemo: 'Book a Demo Call',
    seePricing: 'See Pricing',
    setupHours: 'Setup in 48 hours',
    whatsappInsta: 'WhatsApp + Instagram ready',
    support24: '24/7 customer support',
    howLong: 'How long does setup take?',
    hours48: '48 hours from demo booking to launch.',
    customize: 'Can I customize the responses?',
    customizeAns: 'Yes, fully customizable to match your brand and services.',
    questions: 'What if I have questions after launch?',
    questionsAns: 'Dedicated support team available 24/7 for all clients.',
    stopLosing: 'Stop losing leads to missed calls and slow responses.',
    aiReady: 'Your AI receptionist is ready. Book a call with our team to go live this week.',
    scheduleDemo: 'Schedule Your Demo Call',
    channels_en: ['Website', 'WhatsApp', 'Instagram', 'Phone'],
    // Demo section
    demoWithoutAI_header: 'Business',
    demoWithoutAI_away: '⚪ Away',
    demoWithoutAI_msg1: 'Hi, do you have availability?',
    demoWithoutAI_time1: '2:34 PM',
    demoWithoutAI_waiting: 'Waiting... (6+ hours)',
    demoWithoutAI_response: 'Let me check our schedule...',
    demoWithoutAI_time2: '8:45 PM (same day)',
    demoWithoutAI_footer: '❌ Potential customer moved on',
    demoWithAI_header: 'Business',
    demoWithAI_active: 'Active now ✓',
    demoWithAI_msg1: 'Hi, do you have availability?',
    demoWithAI_time1: '2:34 PM',
    demoWithAI_resp1: 'Yes! Our team is ready to help. When would you like to book?',
    demoWithAI_instant: '⚡ Instant',
    demoWithAI_msg2: 'Tomorrow at 3pm?',
    demoWithAI_time2: '2:35 PM',
    demoWithAI_resp2: 'Perfect! I\'ve booked you in. See you tomorrow! 🎯',
    demoWithAI_footer: '💡 Lead captured & booked instantly',
  },
  zh: {
    turnYour: '將你的',
    intoAI: '轉變為 24/7 AI 接待員',
    neverMiss: '永遠不會錯過潛在客戶。立即預覽您的業務如何透過 AI 驅動的 WhatsApp、Instagram 和網頁聊天來處理詢問。',
    seeIn30: '✓ 30 秒內查看',
    enterDomain: '輸入您的域名，我們將立即為您生成自訂示演',
    placeholder: '例如：yourcompany.com 或 business.hk',
    preview: '預覽',
    anyBusiness: '適用於任何業務類型 • 無需編碼',
    responses: '即時回應 • 全天候 24/7 潛在客戶捕捉',
    channels: 'WhatsApp • Instagram • 網站 • 電話',
    withoutAI: '❌ 無 AI',
    withAI: '✅ 有 AI',
    liveDemo: '即時示演',
    whatsapp: '💬 WhatsApp',
    instagram: '📱 Instagram',
    tryAnother: '嘗試其他域名',
    success: '您的 AI 接待員已準備就緒！',
    analyzed: '我們已分析',
    generated: '並生成了自訂聊天機器人。請嘗試在下方提問。',
    whatYouGet: '您將獲得什麼',
    faq: '常見問題',
    ready: '準備上線了嗎？',
    aiReceptionist: '在 48 小時內啟動您的 AI 接待員。無需設置煩惱。',
    bookDemo: '預訂演示通話',
    seePricing: '查看定價',
    setupHours: '48 小時內完成設置',
    whatsappInsta: 'WhatsApp + Instagram 已準備就緒',
    support24: '全天候 24/7 客戶支持',
    howLong: '設置需要多長時間？',
    hours48: '從演示預訂到啟動 48 小時。',
    customize: '我可以自訂回應嗎？',
    customizeAns: '是的，完全可自訂以匹配您的品牌和服務。',
    questions: '上線後我有疑問怎麼辦？',
    questionsAns: '為所有客戶提供全天候 24/7 專屬支持團隊。',
    stopLosing: '停止因未接來電和緩慢回應而失去潛在客戶。',
    aiReady: '您的 AI 接待員已準備就緒。致電我們的團隊，本週上線。',
    scheduleDemo: '預約演示通話',
    channels_en: ['網站', 'WhatsApp', 'Instagram', '電話'],
    // Demo section
    demoWithoutAI_header: '業務',
    demoWithoutAI_away: '⚪ 離線',
    demoWithoutAI_msg1: '你好，你們有檔期嗎？',
    demoWithoutAI_time1: '下午 2:34',
    demoWithoutAI_waiting: '等待中... (6+ 小時)',
    demoWithoutAI_response: '讓我檢查一下我們的日程...',
    demoWithoutAI_time2: '晚上 8:45（同日）',
    demoWithoutAI_footer: '❌ 潛在客戶已轉身離去',
    demoWithAI_header: '業務',
    demoWithAI_active: '在線 ✓',
    demoWithAI_msg1: '你好，你們有檔期嗎？',
    demoWithAI_time1: '下午 2:34',
    demoWithAI_resp1: '有的！我們的團隊已準備好幫助您。您想什麼時候預訂？',
    demoWithAI_instant: '⚡ 即時',
    demoWithAI_msg2: '明天下午3點？',
    demoWithAI_time2: '下午 2:35',
    demoWithAI_resp2: '完美！我已為您預訂。明天見！ 🎯',
    demoWithAI_footer: '💡 潛在客戶已捕捉並立即預訂',
  },
  zh_simplified: {
    turnYour: '将你的',
    intoAI: '转变为 24/7 AI 接待员',
    neverMiss: '永远不会错过潜在客户。立即预览您的业务如何通过 AI 驱动的 WhatsApp、Instagram 和网页聊天来处理询问。',
    seeIn30: '✓ 30 秒内查看',
    enterDomain: '输入您的域名，我们将立即为您生成自定义演示',
    placeholder: '例如：yourcompany.com 或 business.hk',
    preview: '预览',
    anyBusiness: '适用于任何业务类型 • 无需编码',
    responses: '即时回应 • 全天候 24/7 潜在客户捕获',
    channels: 'WhatsApp • Instagram • 网站 • 电话',
    withoutAI: '❌ 无 AI',
    withAI: '✅ 有 AI',
    liveDemo: '即时演示',
    whatsapp: '💬 WhatsApp',
    instagram: '📱 Instagram',
    tryAnother: '尝试其他域名',
    success: '您的 AI 接待员已准备就绪！',
    analyzed: '我们已分析',
    generated: '并生成了自定义聊天机器人。请尝试在下方提问。',
    whatYouGet: '您将获得什么',
    faq: '常见问题',
    ready: '准备上线了吗？',
    aiReceptionist: '在 48 小时内启动您的 AI 接待员。无需设置烦恼。',
    bookDemo: '预订演示通话',
    seePricing: '查看定价',
    setupHours: '48 小时内完成设置',
    whatsappInsta: 'WhatsApp + Instagram 已准备就绪',
    support24: '全天候 24/7 客户支持',
    howLong: '设置需要多长时间？',
    hours48: '从演示预订到启动 48 小时。',
    customize: '我可以自定义回应吗？',
    customizeAns: '是的，完全可自定义以匹配您的品牌和服务。',
    questions: '上线后我有疑问怎么办？',
    questionsAns: '为所有客户提供全天候 24/7 专属支持团队。',
    stopLosing: '停止因未接来电和缓慢回应而失去潜在客户。',
    aiReady: '您的 AI 接待员已准备就绪。致电我们的团队，本周上线。',
    scheduleDemo: '预约演示通话',
    channels_en: ['网站', 'WhatsApp', 'Instagram', '电话'],
    // Demo section
    demoWithoutAI_header: '业务',
    demoWithoutAI_away: '⚪ 离线',
    demoWithoutAI_msg1: '你好，你们有档期吗？',
    demoWithoutAI_time1: '下午 2:34',
    demoWithoutAI_waiting: '等待中... (6+ 小时)',
    demoWithoutAI_response: '让我检查一下我们的日程...',
    demoWithoutAI_time2: '晚上 8:45（同日）',
    demoWithoutAI_footer: '❌ 潜在客户已转身离去',
    demoWithAI_header: '业务',
    demoWithAI_active: '在线 ✓',
    demoWithAI_msg1: '你好，你们有档期吗？',
    demoWithAI_time1: '下午 2:34',
    demoWithAI_resp1: '有的！我们的团队已准备好帮助您。您想什么时候预订？',
    demoWithAI_instant: '⚡ 即时',
    demoWithAI_msg2: '明天下午3点？',
    demoWithAI_time2: '下午 2:35',
    demoWithAI_resp2: '完美！我已为您预订。明天见！ 🎯',
    demoWithAI_footer: '💡 潜在客户已捕获并立即预订',
  },
};

// Main Landing Page Component
export default function ScalarLandingPage() {
  const [domain, setDomain] = useState('');
  const [stage, setStage] = useState('hero'); // hero, loading, demo
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [businessData, setBusinessData] = useState(null);
  const [domainParsed, setDomainParsed] = useState(null);
  const [error, setError] = useState('');
  const [chatSkin, setChatSkin] = useState('whatsapp'); // whatsapp or instagram
  const [showAIDemo, setShowAIDemo] = useState(true); // true for AI demo, false for without AI
  const [currentChannelWord, setCurrentChannelWord] = useState(0); // 0: Website, 1: WhatsApp, 2: Instagram, 3: Phone
  const [language, setLanguage] = useState('en'); // en, zh, zh_simplified

  const t = translations[language];
  const channels = t.channels_en;

  const channelColors = {
    0: 'from-blue-400 to-blue-600', // Website - blue
    1: 'from-green-400 to-green-600', // WhatsApp - green
    2: 'from-pink-500 via-purple-500 to-indigo-600', // Instagram - purple/pink
    3: 'from-blue-500 to-cyan-500', // Phone - cyan/blue
  };

  // Auto-cycle through channel words in hero
  useEffect(() => {
    if (stage === 'hero') {
      const interval = setInterval(() => {
        setCurrentChannelWord((prev) => (prev + 1) % 4);
      }, 3000); // Change every 3 seconds
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleDomainSubmit = async (e) => {
    e.preventDefault();

    if (!domain.trim()) {
      const errorMessages = {
        en: 'Please enter a domain',
        zh: '請輸入您的域名',
        zh_simplified: '请输入您的域名',
      };
      setError(errorMessages[language] || errorMessages.en);
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
        const services = result.data.services && result.data.services.length > 0
          ? result.data.services
          : generateMockData(domain, parsed.type).services;

        // Try to generate AI sample chat, fall back to static if it fails
        let sampleChat = null;
        if (process.env.NEXT_PUBLIC_ENABLE_AI_SAMPLES !== 'false') {
          sampleChat = await generateSampleChatWithAI(result.data.businessName, services, parsed.type);
        }

        // Fallback to static sample chat if AI generation failed
        if (!sampleChat || sampleChat.length === 0) {
          sampleChat = generateSampleChat(result.data.businessName, services);
        }

        const businessData = {
          businessName: result.data.businessName,
          assistantName: result.data.assistantName,
          greeting: `Hi! Welcome to ${result.data.businessName}. How can I help you today? 😊`,
          services: services,
          quickActions: generateQuickActions(services),
          sampleChat: sampleChat,
          profileSummary: result.data.profileSummary || `Professional ${parsed.type.replace(/-/g, ' ')} service`,
          openingHours: result.data.openingHours || null,
          icon: parsed.icon,
          type: parsed.type,
        };

        setBusinessData(businessData);
      } else {
        // Fallback to mock data if scraping failed
        console.log('Scraping failed, using mock data');
        const parsed = parseDomain(domain);
        setDomainParsed(parsed);
        const mockData = generateMockData(domain, parsed.type);

        // Try to generate AI sample chat for mock data too
        let sampleChat = null;
        if (process.env.NEXT_PUBLIC_ENABLE_AI_SAMPLES !== 'false') {
          sampleChat = await generateSampleChatWithAI(mockData.businessName, mockData.services, parsed.type);
        }

        if (!sampleChat || sampleChat.length === 0) {
          sampleChat = mockData.sampleChat;
        }

        mockData.sampleChat = sampleChat;
        mockData.type = parsed.type;

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

      // Try to generate AI sample chat for mock data
      let sampleChat = null;
      if (process.env.NEXT_PUBLIC_ENABLE_AI_SAMPLES !== 'false') {
        sampleChat = await generateSampleChatWithAI(mockData.businessName, mockData.services, parsed.type);
      }

      if (!sampleChat || sampleChat.length === 0) {
        sampleChat = mockData.sampleChat;
      }

      mockData.sampleChat = sampleChat;
      mockData.type = parsed.type;

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
            <div className="font-bold text-xl tracking-tight">
              <span className="text-emerald-400">Scalar</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-400">AI Receptionist for Local Business</div>
              <div className="flex gap-2 text-sm text-gray-400">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded transition-colors ${language === 'en' ? 'text-emerald-400 bg-emerald-400/10' : 'hover:text-gray-300'}`}
                >
                  EN
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-2 py-1 rounded transition-colors ${language === 'zh' ? 'text-emerald-400 bg-emerald-400/10' : 'hover:text-gray-300'}`}
                >
                  繁
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setLanguage('zh_simplified')}
                  className={`px-2 py-1 rounded transition-colors ${language === 'zh_simplified' ? 'text-emerald-400 bg-emerald-400/10' : 'hover:text-gray-300'}`}
                >
                  简
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight space-y-2">
                  <div>{t.turnYour}</div>
                  <div className={`bg-gradient-to-r ${channelColors[currentChannelWord]} bg-clip-text text-transparent transition-all duration-500`}>
                    {channels[currentChannelWord]}
                  </div>
                  <div>
                    {language === 'en' ? 'Into a' : ''}{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      {t.intoAI}
                    </span>
                  </div>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {t.neverMiss}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                  {t.seeIn30}
                </p>
                <p className="text-gray-400">{t.enterDomain}</p>
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
                    placeholder={t.placeholder}
                    className="w-full px-6 py-4 bg-white/10 border border-emerald-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/50"
                  >
                    {t.preview} <ArrowRight size={18} />
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </form>

              {/* Trust Signals */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">{t.anyBusiness}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">{t.responses}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">{t.channels}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Before/After Comparison */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>

                {/* Toggle Button */}
                <div className="relative mb-4 flex gap-2 bg-white rounded-xl p-1 shadow-lg">
                  <button
                    onClick={() => setShowAIDemo(!showAIDemo)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      !showAIDemo
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.withoutAI}
                  </button>
                  <button
                    onClick={() => setShowAIDemo(!showAIDemo)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      showAIDemo
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.withAI}
                  </button>
                </div>

                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  {showAIDemo ? (
                    // With AI - Instant Response
                    <>
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900 text-sm">{t.demoWithAI_header}</div>
                          <div className="text-xs text-gray-500">{t.demoWithAI_active}</div>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-xs rounded-br-none">
                            <p className="text-sm">{t.demoWithAI_msg1}</p>
                            <p className="text-xs mt-1 text-blue-100">{t.demoWithAI_time1}</p>
                          </div>
                        </div>
                        {/* AI response - instant */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-xs rounded-bl-none">
                            <p className="text-sm">{t.demoWithAI_resp1}</p>
                            <p className="text-xs mt-1 text-gray-500">2:34 PM {t.demoWithAI_instant}</p>
                          </div>
                        </div>
                        {/* User follow-up */}
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-xs rounded-br-none">
                            <p className="text-sm">{t.demoWithAI_msg2}</p>
                            <p className="text-xs mt-1 text-blue-100">{t.demoWithAI_time2}</p>
                          </div>
                        </div>
                        {/* AI response - instant */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-xs rounded-bl-none">
                            <p className="text-sm">{t.demoWithAI_resp2}</p>
                            <p className="text-xs mt-1 text-gray-500">2:35 PM {t.demoWithAI_instant}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-200">
                        <p className="text-xs text-emerald-700 font-semibold">{t.demoWithAI_footer}</p>
                      </div>
                    </>
                  ) : (
                    // Without AI - Slow Response
                    <>
                      <div className="bg-gray-100 p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900 text-sm">{t.demoWithoutAI_header}</div>
                          <div className="text-xs text-gray-500">{t.demoWithoutAI_away}</div>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* User message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-xs rounded-br-none">
                            <p className="text-sm">{t.demoWithoutAI_msg1}</p>
                            <p className="text-xs mt-1 text-blue-100">{t.demoWithoutAI_time1}</p>
                          </div>
                        </div>

                        {/* Long wait indicator */}
                        <div className="text-center py-4">
                          <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-red-700">{t.demoWithoutAI_waiting}</span>
                          </div>
                        </div>

                        {/* Delayed response */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-900 rounded-2xl px-4 py-2 max-w-xs rounded-bl-none opacity-60">
                            <p className="text-sm text-gray-600">{t.demoWithoutAI_response}</p>
                            <p className="text-xs mt-1 text-gray-500">{t.demoWithoutAI_time2} 😞</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-red-50 border-t border-red-200">
                        <p className="text-xs text-red-700 font-semibold">{t.demoWithoutAI_footer}</p>
                      </div>
                    </>
                  )}
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
            <div className="font-bold text-xl text-emerald-600">
              Scalar
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              {t.tryAnother}
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">{t.success}</h3>
              <p className="text-gray-700 text-sm mt-1">
                {t.analyzed} <span className="font-medium text-emerald-600">{domain}</span> {t.generated}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t.liveDemo}</h2>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setChatSkin('whatsapp')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      chatSkin === 'whatsapp'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t.whatsapp}
                  </button>
                  <button
                    onClick={() => setChatSkin('instagram')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      chatSkin === 'instagram'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t.instagram}
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                {chatSkin === 'whatsapp' ? (
                  <ChatInterface data={businessData} domain={domain} language={language} />
                ) : (
                  <InstagramChatInterface data={businessData} domain={domain} language={language} />
                )}
              </div>
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
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white space-y-4 lg:sticky lg:top-24">
                <h3 className="text-xl font-bold">{t.ready}</h3>
                <p className="text-sm text-emerald-50">
                  {t.aiReceptionist}
                </p>

                <div className="space-y-2">
                  <button className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    {t.bookDemo}
                  </button>
                  <button className="w-full border-2 border-white text-white font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
                    {t.seePricing}
                  </button>
                </div>

                <div className="pt-3 border-t border-emerald-400/50 space-y-2 text-xs text-emerald-50">
                  <div className="flex items-center gap-2">
                    <Zap size={14} />
                    <span>{t.setupHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span>{t.whatsappInsta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{t.support24}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.whatYouGet}</h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.faq}</h3>
            <div className="space-y-4">
              {[
                { q: t.howLong, a: t.hours48 },
                { q: t.customize, a: t.customizeAns },
                { q: t.questions, a: t.questionsAns },
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</p>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {t.stopLosing}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.aiReady}
            </p>
            <button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/50">
              {t.scheduleDemo}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
