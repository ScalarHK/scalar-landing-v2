import axios from 'axios'
import * as cheerio from 'cheerio'

// Helper function to extract business name from domain
function extractBusinessName(domain) {
  return domain
    .replace(/^www\./, '')
    .replace(/\.[a-z]+$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to detect business type from content
function detectBusinessType(text) {
  const lowercaseText = text.toLowerCase()

  const types = {
    'med-aesthetic': ['derma', 'skin', 'aesthetic', 'clinic', 'beauty', 'facial', 'laser', 'botox', 'filler', 'skincare'],
    'spa-wellness': ['spa', 'massage', 'wellness', 'relax', 'therapy', 'sauna'],
    'dental': ['dental', 'teeth', 'smile', 'orthodont'],
    'fitness': ['gym', 'fitness', 'trainer', 'yoga', 'pilates'],
  }

  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return type
    }
  }

  return 'service-business'
}

// Helper function to extract services from text
function extractServices(text) {
  // Common service keywords
  const servicePatterns = [
    /(?:our\s+)?services?[:\s]*([^.]+)/gi,
    /(?:we\s+offer|offering|provides?)[:\s]*([^.]+)/gi,
    /treatment(?:s)?[:\s]*([^.]+)/gi,
    /package(?:s)?[:\s]*([^.]+)/gi,
  ]

  // Filter out common marketing phrases and fillers
  const blacklist = [
    'that suits your exact needs',
    'that suits your needs',
    'your exact needs',
    'exact needs',
    'that you need',
    'you deserve',
    'we believe',
    'we are',
    'we have',
    'our team',
    'best quality',
    'high quality',
    'professional',
    'experienced',
    'qualified',
    'dedicated',
    'committed',
    'passion',
    'excellence',
    'trusted',
    'reliable',
    'serving',
    'years of',
    'since',
    'contact us',
    'call us',
    'visit us',
    'book now',
    'learn more',
    'read more',
    'more information',
    'available',
    'open',
    'hours',
    'location',
    'address',
    'phone',
    'email',
    'and much more',
    'much more',
    'etc',
    'all types of',
    'all kinds of',
    'various',
    'different',
  ]

  const foundServices = new Set()

  for (const pattern of servicePatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const serviceText = match[1]
      const services = serviceText
        .split(/[,&\n]/)
        .map(s => s.trim().toLowerCase())
        .filter(s => {
          // Basic length and format checks
          if (s.length < 3 || s.length > 60) return false
          if (s.match(/^https?:/)) return false
          if (s.match(/^\d+$/)) return false

          // Check against blacklist
          const isBlacklisted = blacklist.some(phrase =>
            s.includes(phrase.toLowerCase())
          )
          if (isBlacklisted) return false

          // Filter out common words without actual service name
          if (s.match(/^(the|our|your|and|or|with|for|of|in|at)$/)) return false

          // Require at least one "real" word (not just pronouns/articles)
          const words = s.split(/\s+/)
          if (words.length === 0) return false

          return true
        })

      services.forEach(service => {
        // Capitalize first letter of each word
        const formattedService = service
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        if (formattedService.length > 3) {
          foundServices.add(formattedService)
        }
      })
    }
  }

  // If we found services, return them. Otherwise return generic ones
  if (foundServices.size > 0) {
    return Array.from(foundServices).slice(0, 8)
  }

  return ['Service 1', 'Service 2', 'Service 3', 'Consultation', 'Booking Available']
}

// Helper function to get favicon
function extractFavicon(domain, $) {
  // Try to find favicon in head
  const iconLink = $('link[rel="icon"]').attr('href') ||
                   $('link[rel="apple-touch-icon"]').attr('href') ||
                   $('link[rel="shortcut icon"]').attr('href')

  if (iconLink) {
    if (iconLink.startsWith('http')) {
      return iconLink
    }
    return `https://${domain}${iconLink}`
  }

  // Fallback to standard favicon location
  return `https://${domain}/favicon.ico`
}

// Main scraper function
async function scrapeDomain(domain) {
  try {
    // Normalize domain
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    const url = `https://${cleanDomain}`

    // Fetch the website
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      maxRedirects: 5,
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Extract text content
    const fullText = $('body').text()
    const headText = $('head').text()
    const combinedText = `${headText} ${fullText}`

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') ||
                           $('meta[property="og:description"]').attr('content') ||
                           ''

    // Extract title
    const title = $('title').text() || $('h1').first().text() || extractBusinessName(cleanDomain)

    // Extract all text from common service/content areas
    const serviceTexts = []
    $('section, .services, .treatments, .packages, [class*="service"], [class*="treatment"]').each((i, el) => {
      const text = $(el).text().substring(0, 500)
      if (text.length > 20) {
        serviceTexts.push(text)
      }
    })

    const allServiceText = [metaDescription, ...serviceTexts, combinedText].join(' ')

    // Detect business type
    const businessType = detectBusinessType(allServiceText)

    // Extract services
    const services = extractServices(allServiceText)

    // Create profile summary
    const profileSummary = metaDescription.substring(0, 150) ||
                          `Professional ${businessType.replace(/-/g, ' ')} service`

    return {
      success: true,
      businessName: title || extractBusinessName(cleanDomain),
      domain: cleanDomain,
      businessType,
      services: services.slice(0, 6),
      profileSummary,
      favicon: extractFavicon(cleanDomain, $),
      metaDescription,
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

// Generate assistant name based on business type
function generateAssistantName(businessType) {
  const names = {
    'med-aesthetic': ['Dr. Sofia', 'Dr. Elena', 'Dr. Sarah'],
    'spa-wellness': ['Wellness Team', 'Maya', 'Serenity'],
    'dental': ['Dr. Chen', 'Dr. James', 'Dr. Park'],
    'fitness': ['Coach Alex', 'Trainer Max', 'Fitness Team'],
    'service-business': ['Support Team', 'Customer Care', 'Hello'],
  }

  const nameList = names[businessType] || names['service-business']
  return nameList[Math.floor(Math.random() * nameList.length)]
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
