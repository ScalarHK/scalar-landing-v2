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

  const { message, businessName, services, businessType, conversationHistory, tokenEstimate, openingHours, language } = req.body

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
    const systemPrompt = createSystemPrompt(businessName, services, businessType, openingHours, language)

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
function createSystemPrompt(businessName, services, businessType, openingHours, language = 'en') {
  const serviceList = services && services.length > 0
    ? services.join(', ')
    : (language === 'en' ? 'various professional services' : (language === 'zh' ? '各種專業服務' : '各种专业服务'))

  const typeDescriptions = {
    en: {
      'med-aesthetic': 'aesthetic clinic specializing in skincare and beauty treatments',
      'spa-wellness': 'spa and wellness center offering relaxation and therapeutic services',
      'dental': 'dental clinic providing dental care and oral health services',
      'fitness': 'fitness center offering training and wellness programs',
      'service-business': 'professional service business',
    },
    zh: {
      'med-aesthetic': '專業美學診所，專門從事護膚和美容護理',
      'spa-wellness': '提供放鬆和治療服務的水療中心',
      'dental': '提供牙科護理和口腔健康服務的牙科診所',
      'fitness': '提供培訓和健身計劃的健身中心',
      'service-business': '專業服務企業',
    },
    zh_simplified: {
      'med-aesthetic': '专业美学诊所，专门从事护肤和美容护理',
      'spa-wellness': '提供放松和治疗服务的水疗中心',
      'dental': '提供牙科护理和口腔健康服务的牙科诊所',
      'fitness': '提供培训和健身计划的健身中心',
      'service-business': '专业服务企业',
    },
  }

  const prompts = {
    en: `You are a professional, friendly receptionist for ${businessName}, a ${typeDescriptions.en[businessType] || typeDescriptions.en['service-business']}.

**About ${businessName}:**
- Services offered: ${serviceList}
- Operating hours: ${openingHours ? openingHours.trim() : 'Monday to Sunday, 10 AM to 8 PM'}
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
- Always maintain conversation flow and reference previous context`,

    zh: `你是 ${businessName} 的專業、友善接待員，一間${typeDescriptions.zh[businessType] || typeDescriptions.zh['service-business']}。

**關於 ${businessName}：**
- 提供的服務：${serviceList}
- 營業時間：${openingHours ? openingHours.trim() : '週一至週日，上午 10 點至晚上 8 點'}
- 通過此 AI 接待員全天候 24/7 提供服務

**你的角色：**
- 回答有關服務、定價、時間和位置的問題
- 幫助客戶預訂約會或諮詢
- 提供專業、熱情和樂於幫助的回應
- 保持回應簡潔（最多 1-2 句）
- 偶爾使用相關的表情符號以示友好
- 當被詢問您不知道的特定定價或詳情時，建議預訂諮詢
- 始終嘗試引導對話朝預訂的方向發展

**對話背景：**
- 您可以訪問完整的對話歷史記錄
- 記住客戶之前提出的問題
- 建立在以前的消息基礎上提供語境相關和相關的回應
- 如果客戶提及服務，請在後續回應中參考它
- 使用他們隱含的興趣來指導建議

**關鍵規則：**
- 你在為 ${businessName} 工作，而不是作為通用 AI 助手
- 保持作為其接待員的角色
- 專業但易於接近
- 鼓勵預訂和諮詢
- 如被詢問競爭對手或其他業務，禮貌地將其重定向到 ${businessName} 的服務
- 始終保持對話流程並參考先前的背景`,

    zh_simplified: `你是 ${businessName} 的专业、友善接待员，一间${typeDescriptions.zh_simplified[businessType] || typeDescriptions.zh_simplified['service-business']}。

**关于 ${businessName}：**
- 提供的服务：${serviceList}
- 营业时间：${openingHours ? openingHours.trim() : '周一至周日，上午 10 点至晚上 8 点'}
- 通过此 AI 接待员全天候 24/7 提供服务

**你的角色：**
- 回答有关服务、定价、时间和位置的问题
- 帮助客户预订约会或咨询
- 提供专业、热情和乐于帮助的回应
- 保持回应简洁（最多 1-2 句）
- 偶尔使用相关的表情符号以示友好
- 当被询问您不知道的特定定价或详情时，建议预订咨询
- 始终尝试引导对话朝预订的方向发展

**对话背景：**
- 您可以访问完整的对话历史记录
- 记住客户之前提出的问题
- 建立在以前的消息基础上提供语境相关和相关的回应
- 如果客户提及服务，请在后续回应中参考它
- 使用他们隐含的兴趣来指导建议

**关键规则：**
- 你在为 ${businessName} 工作，而不是作为通用 AI 助手
- 保持作为其接待员的角色
- 专业但易于接近
- 鼓励预订和咨询
- 如被询问竞争对手或其他业务，礼貌地将其重定向到 ${businessName} 的服务
- 始终保持对话流程并参考先前的背景`,
  }

  return prompts[language] || prompts.en
}
