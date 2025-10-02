/**
 * AI-powered perfume image analyzer
 * Phân tích ảnh perfume và extract thông tin tự động
 */

/**
 * Analyze perfume image using AI (Google Vision API hoặc OpenAI Vision)
 * @param {string} imageUrl - URL of perfume image
 * @returns {Promise<Object>} Extracted perfume data
 */
export const analyzePerfumeImage = async (imageUrl) => {
  // TODO: Integrate với Google Vision API hoặc OpenAI Vision
  // Hiện tại return mock data để demo workflow

  console.log('🤖 AI analyzing image:', imageUrl)

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock AI analysis result
  // Thực tế sẽ call API để OCR + object detection
  const mockAnalysis = {
    detectedText: ['DIOR', 'SAUVAGE', 'EAU DE PARFUM'],
    colors: ['#1a1a1a', '#c0c0c0'],
    objects: ['perfume bottle', 'luxury packaging'],
    confidence: 0.85
  }

  // Extract brand và name
  const brand = extractBrand(mockAnalysis.detectedText)
  const name = extractName(mockAnalysis.detectedText, brand)
  const family = guessFamily(name, mockAnalysis.colors)
  const description = generateDescription(brand, name, family)

  return {
    brand,
    name,
    family,
    description,
    confidence: mockAnalysis.confidence,
    year: null, // AI khó detect year, để user nhập
    suggestedTags: ['luxury', 'masculine', 'fresh']
  }
}

/**
 * Extract brand name from detected text
 */
const extractBrand = (textArray) => {
  const knownBrands = [
    'DIOR', 'CHANEL', 'GUCCI', 'VERSACE', 'PRADA', 'TOM FORD',
    'YSL', 'ARMANI', 'BURBERRY', 'HERMES', 'CREED', 'JO MALONE'
  ]

  for (const text of textArray) {
    const upperText = text.toUpperCase()
    for (const brand of knownBrands) {
      if (upperText.includes(brand)) {
        return brand.charAt(0) + brand.slice(1).toLowerCase()
      }
    }
  }

  return textArray[0] || 'Unknown Brand'
}

/**
 * Extract perfume name from detected text
 */
const extractName = (textArray, brand) => {
  // Remove brand name từ text array
  const filtered = textArray.filter(text =>
    !text.toUpperCase().includes(brand.toUpperCase()) &&
    text.length > 2 &&
    !text.includes('EAU') &&
    !text.includes('PARFUM')
  )

  return filtered[0] || 'Unknown Perfume'
}

/**
 * Guess perfume family from name and colors
 */
const guessFamily = (name, colors) => {
  const nameLower = name.toLowerCase()

  // Keyword matching
  if (nameLower.includes('rose') || nameLower.includes('floral')) return 'Floral'
  if (nameLower.includes('wood') || nameLower.includes('oud')) return 'Woody'
  if (nameLower.includes('citrus') || nameLower.includes('fresh')) return 'Fresh'
  if (nameLower.includes('spice') || nameLower.includes('oriental')) return 'Oriental'

  // Color-based guess (dark = woody, light = fresh)
  const isDark = colors.some(color => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const brightness = (r + g + b) / 3
    return brightness < 100
  })

  return isDark ? 'Woody' : 'Fresh'
}

/**
 * Generate perfume description using AI
 */
const generateDescription = (brand, name, family) => {
  const templates = {
    Floral: `A sophisticated floral fragrance from ${brand}, ${name} captures the essence of blooming gardens with its elegant and timeless composition.`,
    Woody: `${brand}'s ${name} is a warm and masculine woody fragrance, perfect for those who appreciate depth and sophistication.`,
    Fresh: `Fresh and invigorating, ${name} by ${brand} is a modern fragrance that embodies vitality and elegance.`,
    Oriental: `An exotic and captivating scent, ${brand}'s ${name} takes you on an olfactory journey through oriental markets and spice routes.`
  }

  return templates[family] || `A distinctive fragrance from ${brand}, ${name} offers a unique olfactory experience.`
}

/**
 * Analyze perfume bottle design
 * @param {string} imageUrl - URL of perfume image
 * @returns {Promise<Object>} Design analysis
 */
export const analyzeBottleDesign = async (imageUrl) => {
  // Mock analysis
  return {
    shape: 'rectangular',
    material: 'glass',
    style: 'minimalist',
    luxuryScore: 8.5
  }
}

/**
 * Extract color palette from image
 * @param {string} imageUrl - URL of perfume image
 * @returns {Promise<Array>} Color palette
 */
export const extractColorPalette = async (imageUrl) => {
  // Mock colors
  return [
    { hex: '#1a1a1a', name: 'Deep Black', percentage: 45 },
    { hex: '#c0c0c0', name: 'Silver', percentage: 30 },
    { hex: '#ffffff', name: 'White', percentage: 25 }
  ]
}
