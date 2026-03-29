import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Estimate tokens from text (rough: ~4 chars per token)
function estimateTokens(text) {
  return Math.ceil(text.length / 4)
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, businessName, services, businessType, conversationHistory, tokenEstimate, openingHours } = req.body

  // Validate inputs
  if (!message || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Validate API key exists
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // GUARDRAIL 1: Validate token estimate on server side
    const maxContextTokens = 2500 // Strict limit including system prompt and response
    let contextTokens = tokenEstimate || 0

    // Add estimated tokens for system prompt (~400 tokens)
    contextTokens += 400

    // Add buffer for response (~150 tokens)
    contextTokens += 150

    if (contextTokens > maxContextTokens) {
      console.warn(`Token limit exceeded: ${contextTokens} > ${maxContextTokens}. Truncating history.`)
      // If exceeded, only use last 3 messages
      if (conversationHistory && conversationHistory.length > 3) {
        conversationHistory.splice(0, conversationHistory.length - 3)
      }
    }

    // Create a system prompt that makes the AI act as a receptionist for this business
    const systemPrompt = createSystemPrompt(businessName, services, businessType, openingHours)

    // Build messages array from conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })
      }
    } else {
      // Fallback: just the current message
      messages.push({
        role: 'user',
        content: message,
      })
    }

    // GUARDRAIL 2: Hard limit on total messages to prevent context bloat
    if (messages.length > 15) {
      console.warn(`Message count high: ${messages.length}. Trimming to last 7 messages + system.`)
      const systemMsg = messages[0]
      messages.splice(1, messages.length - 8)
      messages.unshift(systemMsg)
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
    })

    const reply = completion.choices[0].message.content

    // Log token usage for monitoring
    if (completion.usage) {
      console.log(`Token usage - Prompt: ${completion.usage.prompt_tokens}, Completion: ${completion.usage.completion_tokens}, Total: ${completion.usage.total_tokens}`)
    }

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
function createSystemPrompt(businessName, services, businessType, openingHours) {
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

  // Use extracted opening hours if available, otherwise use default
  const hoursText = openingHours ? openingHours.trim() : 'Monday to Sunday, 10 AM to 8 PM'

  return `You are a professional, friendly receptionist for ${businessName}, a ${typeDescription}.

**About ${businessName}:**
- Services offered: ${serviceList}
- Operating hours: ${hoursText}
- Always available 24/7 via this AI receptionist

**Your role:**
- Answer questions about services, pricing, hours, and location
- Help customers book appointments or consultations
- Provide professional, warm, and helpful responses
- Keep responses concise (1-2 sentences max)
- Use relevant emojis occasionally to be friendly
- When asked about specific pricing or details you don't know, suggest booking a consultation
- Always try to move conversations toward booking

**Conversation context:**
- You have access to the full conversation history
- Remember what the customer asked about previously
- Build on previous messages to provide contextual, relevant responses
- If the customer mentions a service, reference it in follow-up responses
- Use their implied interests to guide suggestions

**Key rules:**
- You work for ${businessName}, not a general AI assistant
- Stay in character as their receptionist
- Be professional but approachable
- Encourage bookings and consultations
- If asked about competitors or other businesses, politely redirect to ${businessName}'s services
- Always maintain conversation flow and reference previous context`
}
