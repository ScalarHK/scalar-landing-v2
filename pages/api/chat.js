import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Estimate tokens from text (rough: ~4 chars per token)
function estimateTokens(text) {
  return Math.ceil(text.length / 4)
}

// Detect language from user input
function detectLanguage(text) {
  // Check for Chinese characters (both simplified and traditional)
  const chineseSimplified = /[\u4E00-\u9FFF]/g
  const chineseTraditional = /[\u3400-\u4DBF\uF900-\uFAFF]/g
  const chinese = text.match(chineseSimplified) || text.match(chineseTraditional)

  if (chinese && chinese.length > text.length * 0.3) {
    // If more than 30% of characters are Chinese, it's likely Chinese
    // Simplified and Traditional detection is difficult, default to simplified for safety
    return 'zh_simplified'
  }

  // Check for Japanese hiragana/katakana
  const japanese = /[\u3040-\u309F\u30A0-\u30FF]/g
  if (text.match(japanese)) {
    return 'ja'
  }

  // Check for Korean Hangul
  const korean = /[\uAC00-\uD7AF\u1100-\u11FF]/g
  if (text.match(korean)) {
    return 'ko'
  }

  // Default to English
  return 'en'
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, businessName, services, businessType, conversationHistory, tokenEstimate, openingHours, language, knowledgeBase } = req.body

  // Validate inputs
  if (!message || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Validate API key exists
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // AUTO-DETECT language from user's message if not explicitly provided
    // This allows the bot to respond in any language the user speaks
    const detectedLanguage = detectLanguage(message)
    const responseLanguage = language || detectedLanguage

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
    const systemPrompt = createSystemPrompt(businessName, services, businessType, openingHours, responseLanguage, knowledgeBase)

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
function createSystemPrompt(businessName, services, businessType, openingHours, language = 'en', knowledgeBase = '') {
  const serviceList = services && services.length > 0
    ? services.join(', ')
    : (language === 'en' ? 'various professional services' : (language === 'zh' ? '各種專業服務' : '各种专业服务'))

  // Include website knowledge base if available (truncate to avoid token bloat)
  const kbSection = knowledgeBase && knowledgeBase.length > 100
    ? `\n\n**Website Information Reference:**\n${knowledgeBase.substring(0, 2000)}\n(Use this information to answer questions about the business accurately.)`
    : ''

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
    ja: {
      'med-aesthetic': '美しい肌と美容治療を専門とする美学クリニック',
      'spa-wellness': 'リラクゼーションと治療サービスを提供するスパ＆ウェルネスセンター',
      'dental': '歯科ケアと口腔健康サービスを提供する歯科医院',
      'fitness': 'トレーニングとフィットネスプログラムを提供するフィットネスセンター',
      'service-business': '専門サービス事業',
    },
    ko: {
      'med-aesthetic': '피부 관리 및 미용 치료를 전문으로 하는 미용 클리닉',
      'spa-wellness': '휴식 및 치료 서비스를 제공하는 스파 및 웰니스 센터',
      'dental': '치과 진료 및 구강 건강 서비스를 제공하는 치과',
      'fitness': '트레이닝 및 피트니스 프로그램을 제공하는 피트니스 센터',
      'service-business': '전문 서비스 업체',
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
- Always maintain conversation flow and reference previous context${kbSection}`,

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
- 始終保持對話流程並參考先前的背景${kbSection}`,

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
- 始终保持对话流程并参考先前的背景${kbSection}`,

    ja: `あなたは ${businessName} の専門的でフレンドリーなレセプショニスト、${typeDescriptions.ja[businessType] || typeDescriptions.ja['service-business']} です。

**${businessName} について：**
- 提供サービス：${serviceList}
- 営業時間：${openingHours ? openingHours.trim() : '月〜日、午前10時〜午後8時'}
- このAIレセプショニストで24/7利用可能

**あなたの役割：**
- サービス、料金、時間、場所に関する質問に答える
- 顧客が予約や相談を予約するのを支援する
- 専門的で温かく、協力的な対応を提供する
- 回答は簡潔に保つ（最大1～2文）
- 時々関連する絵文字を使用してフレンドリーさを示す
- 具体的な料金や詳細について不明な場合は、相談の予約を勧める
- 常に会話を予約に向けるよう努める

**会話のコンテキスト：**
- 完全な会話履歴にアクセスできます
- 顧客が以前に尋ねたことを覚えておく
- 以前のメッセージに基づいて、コンテキストに関連した関連した応答を提供する
- 顧客がサービスに言及した場合、フォローアップの応答でそれを参照する
- 彼らの暗黙の関心を使用して提案をガイドする

**重要なルール：**
- あなたは一般的なAIアシスタントではなく、${businessName} のために働いている
- レセプショニストとしてのキャラクターを保つ
- プロフェッショナルでありながらも親しみやすい
- 予約と相談を促奨励する
- 競合他社または他の事業について尋ねられた場合、丁寧に${businessName} のサービスにリダイレクトする
- 常に会話の流れを保ち、以前のコンテキストを参照する${kbSection}`,

    ko: `당신은 ${businessName}의 전문적이고 친근한 리셉셔니스트, ${typeDescriptions.ko[businessType] || typeDescriptions.ko['service-business']}입니다.

**${businessName}에 대해:**
- 제공 서비스: ${serviceList}
- 영업시간: ${openingHours ? openingHours.trim() : '월~일, 오전 10시~오후 8시'}
- 이 AI 리셉셔니스트를 통해 24/7 이용 가능

**당신의 역할:**
- 서비스, 가격, 시간 및 위치에 대한 질문에 답변하기
- 고객이 약속이나 상담을 예약하도록 돕기
- 전문적이고 따뜻하며 도움이 되는 응답 제공하기
- 응답을 간결하게 유지하기(최대 1~2문)
- 가끔 관련 이모지를 사용하여 친근함을 보여주기
- 구체적인 가격 또는 세부 사항을 모를 때는 상담 예약을 제안하기
- 항상 예약 방향으로 대화를 진행하려고 노력하기

**대화 맥락:**
- 전체 대화 기록에 접근할 수 있습니다
- 고객이 이전에 물어본 것을 기억하세요
- 이전 메시지를 기반으로 상황에 맞는 관련 응답 제공하기
- 고객이 서비스를 언급한 경우 후속 응답에서 참조하기
- 그들의 암묵적 관심을 사용하여 제안 안내하기

**주요 규칙:**
- 일반 AI 어시스턴트가 아닌 ${businessName}을 위해 일하고 있습니다
- 리셉셔니스트로서의 역할 유지하기
- 전문적이면서도 친근하게
- 예약 및 상담 권장하기
- 경쟁사 또는 다른 사업에 대해 물어보면 ${businessName}의 서비스로 정중히 리다이렉트하기
- 항상 대화 흐름을 유지하고 이전 맥락 참조하기${kbSection}`,
  }

  return prompts[language] || prompts.en
}
