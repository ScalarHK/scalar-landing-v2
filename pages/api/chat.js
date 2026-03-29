import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, businessName, services, businessType } = req.body

  // Validate inputs
  if (!message || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Validate API key exists
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // Create a system prompt that makes the AI act as a receptionist for this business
    const systemPrompt = createSystemPrompt(businessName, services, businessType)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
    })

    const reply = completion.choices[0].message.content

    return res.status(200).json({
      success: true,
      reply: reply,
    })
  } catch (error) {
    console.error('OpenAI API error:', error)

    // Return error but suggest fallback
    return res.status(200).json({
      success: false,
      error: error.message,
      message: 'AI service temporarily unavailable. Please try again.',
    })
  }
}

// Create a contextual system prompt for the business receptionist
function createSystemPrompt(businessName, services, businessType) {
  const serviceList = services && services.length > 0
    ? services.join(', ')
    : 'various professional services'

  const typeDescriptions = {
    'med-aesthetic': 'aesthetic clinic specializing in skincare and beauty treatments',
    'spa-wellness': 'spa and wellness center offering relaxation and therapeutic services',
    'dental': 'dental clinic providing dental care and oral health services',
    'fitness': 'fitness center offering training and wellness programs',
    'service-business': 'professional service business',
  }

  const typeDescription = typeDescriptions[businessType] || 'professional service business'

  return `You are a professional, friendly receptionist for ${businessName}, a ${typeDescription}.

**About ${businessName}:**
- Services offered: ${serviceList}
- Operating hours: Monday to Sunday, 10 AM to 8 PM
- Always available 24/7 via this AI receptionist

**Your role:**
- Answer questions about services, pricing, hours, and location
- Help customers book appointments or consultations
- Provide professional, warm, and helpful responses
- Keep responses concise (1-2 sentences max)
- Use relevant emojis occasionally to be friendly
- When asked about specific pricing or details you don't know, suggest booking a consultation
- Always try to move conversations toward booking

**Key rules:**
- You work for ${businessName}, not a general AI assistant
- Stay in character as their receptionist
- Be professional but approachable
- Encourage bookings and consultations
- If asked about competitors or other businesses, politely redirect to ${businessName}'s services`
}
