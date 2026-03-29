import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body

  // Validate inputs
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  // Validate API key exists
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // Call OpenAI API - use gpt-3.5-turbo for cost efficiency
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0].message.content

    return res.status(200).json({
      success: true,
      reply: reply,
    })
  } catch (error) {
    console.error('OpenAI API error:', error)

    return res.status(200).json({
      success: false,
      error: error.message,
    })
  }
}
