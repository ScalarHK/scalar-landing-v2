import axios from 'axios'
import * as cheerio from 'cheerio'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to extract business name from domain
function extractBusinessName(domain) {
  return domain
    .replace(/^www\./, '')
    .replace(/\.[a-z]+$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Crawl multiple pages of the website to get comprehensive content
async function crawlWebsite(baseUrl) {
  const visited = new Set()
  const content = []
  const queue = [baseUrl]
  const maxPages = 8

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift()

    if (visited.has(url)) continue
    visited.add(url)

    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        maxRedirects: 3,
      })

      const $ = cheerio.load(response.data)
      const pageText = $('body').text()

      if (pageText.length > 100) {
        content.push(pageText)
      }

      // Extract links to other pages on same domain
      $('a[href]').each((i, el) => {
        let href = $(el).attr('href')
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          const absoluteUrl = new URL(href, url).href
          if (absoluteUrl.startsWith(baseUrl) && !visited.has(absoluteUrl) && queue.length < 20) {
            queue.push(absoluteUrl)
          }
        }
      })
    } catch (error) {
      console.error(`Error crawling ${url}:`, error.message)
    }
  }

  return content.join('\n\n')
}

// Use AI to create a structured knowledge base from website content
async function createKnowledgeBase(websiteContent, businessName) {
  try {
    const truncated = websiteContent.substring(0, 8000)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `You are analyzing a business website. Extract and structure the key information from this website content.

Business Name: ${businessName}

Website Content:
${truncated}

Return a JSON object with this structure (use actual values from the content):
{
  "businessName": "official name",
  "openingHours": "specific hours from the website",
  "services": ["service1", "service2", ...],
  "contactInfo": "phone, email, or contact method",
  "location": "address or location",
  "keyInfo": "important business facts and details",
  "description": "what the business does"
}

Be specific - extract actual values from the content, not generic answers. Return only valid JSON.`,
        },
      ],
      temperature: 0,
      max_tokens: 500,
    })

    const result = response.choices[0].message.content.trim()

    try {
      return JSON.parse(result)
    } catch (e) {
      console.error('Failed to parse KB:', result)
      return null
    }
  } catch (error) {
    console.error('Knowledge base creation failed:', error.message)
    return null
  }
}

// Helper function to get favicon
function extractFavicon(domain) {
  return `https://${domain}/favicon.ico`
}

// Generate assistant name based on business type
function generateAssistantName(businessType) {
  const names = {
    'med-aesthetic': ['Dr. Sofia', 'Dr. Elena', 'Dr. Sarah'],
    'spa-wellness': ['Maya', 'Wellness Team', 'Serenity'],
    'dental': ['Dr. Chen', 'Dr. James', 'Dr. Park'],
    'fitness': ['Coach Alex', 'Trainer Max', 'Fitness Team'],
    'service-business': ['Support Team', 'Customer Care', 'Hello'],
  }

  const nameList = names[businessType] || names['service-business']
  return nameList[Math.floor(Math.random() * nameList.length)]
}

// Detect business type from content
function detectBusinessType(content) {
  const lowercaseContent = content.toLowerCase()

  const types = {
    'med-aesthetic': ['derma', 'skin', 'aesthetic', 'clinic', 'beauty', 'facial', 'laser', 'botox', 'filler', 'skincare'],
    'spa-wellness': ['spa', 'massage', 'wellness', 'relax', 'therapy', 'sauna'],
    'dental': ['dental', 'teeth', 'smile', 'orthodont'],
    'fitness': ['gym', 'fitness', 'trainer', 'yoga', 'pilates'],
  }

  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowercaseContent.includes(keyword))) {
      return type
    }
  }

  return 'service-business'
}

// Main scraper function
async function scrapeDomain(domain) {
  try {
    // Normalize domain
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    const url = `https://${cleanDomain}`
    const businessName = extractBusinessName(cleanDomain)

    // Crawl the entire website
    console.log(`Crawling website: ${url}`)
    const websiteContent = await crawlWebsite(url)

    if (!websiteContent || websiteContent.length < 100) {
      throw new Error('Could not retrieve sufficient website content')
    }

    // Detect business type
    const businessType = detectBusinessType(websiteContent)

    // Create AI-powered knowledge base from all website content
    console.log('Creating knowledge base with AI...')
    const knowledgeBase = await createKnowledgeBase(websiteContent, businessName)

    if (!knowledgeBase) {
      throw new Error('Failed to create knowledge base')
    }

    // Extract key information from knowledge base
    const services = knowledgeBase.services || ['Service 1', 'Service 2', 'Service 3']
    const openingHours = knowledgeBase.openingHours || 'Monday to Sunday, 10 AM to 8 PM'
    const profileSummary = knowledgeBase.description || `Professional ${businessType.replace(/-/g, ' ')} service`

    return {
      success: true,
      businessName: knowledgeBase.businessName || businessName,
      domain: cleanDomain,
      businessType,
      services: services.slice(0, 6),
      profileSummary,
      openingHours,
      contactInfo: knowledgeBase.contactInfo || '',
      location: knowledgeBase.location || '',
      knowledgeBase: websiteContent, // Full website content for chatbot reference
      favicon: extractFavicon(cleanDomain),
      assistantName: generateAssistantName(businessType),
    }
  } catch (error) {
    console.error(`Scrape error for ${domain}:`, error.message)
    return {
      success: false,
      error: error.message,
      domain,
    }
  }
}

// API handler
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { domain } = req.body

  // Validate domain
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Invalid domain' })
  }

  // Prevent abuse - basic validation
  if (domain.length > 200 || !domain.includes('.')) {
    return res.status(400).json({ error: 'Invalid domain format' })
  }

  // Scrape the domain
  const result = await scrapeDomain(domain)

  if (!result.success) {
    // Return fallback data if scraping fails
    return res.status(200).json({
      success: false,
      useFallback: true,
      domain: domain,
      message: 'Could not scrape domain, using demo data',
    })
  }

  // Return scraped data
  return res.status(200).json({
    success: true,
    data: result,
  })
}
