import { uploadImage } from './cloudinary'
import { analyzePerfumeImage } from './aiAnalyzer'
import { supabase } from './supabase'

/**
 * 🤖 AUTOMATION: Paste URL → Auto create perfume
 * Workflow:
 * 1. Download image from URL
 * 2. Upload to Cloudinary
 * 3. AI analyze image
 * 4. Generate perfume data
 * 5. Save to Supabase
 */
export const autoCreatePerfumeFromUrl = async (imageUrl, options = {}) => {
  const steps = []

  try {
    // Step 1: Validate URL
    steps.push({ step: 1, status: 'processing', message: 'Validating image URL...' })
    if (!isValidImageUrl(imageUrl)) {
      throw new Error('Invalid image URL. Please provide a direct image link.')
    }
    steps.push({ step: 1, status: 'completed', message: '✓ URL validated' })

    // Step 2: Download & convert to File object
    steps.push({ step: 2, status: 'processing', message: 'Downloading image...' })
    const imageFile = await downloadImageAsFile(imageUrl)
    steps.push({ step: 2, status: 'completed', message: `✓ Downloaded (${formatFileSize(imageFile.size)})` })

    // Step 3: Upload to Cloudinary
    steps.push({ step: 3, status: 'processing', message: 'Uploading to Cloudinary...' })
    const cloudinaryResult = await uploadImage(imageFile, 'perfumes')
    steps.push({ step: 3, status: 'completed', message: '✓ Uploaded & optimized' })

    // Step 4: AI analyze image
    steps.push({ step: 4, status: 'processing', message: 'AI analyzing image...' })
    const aiAnalysis = await analyzePerfumeImage(cloudinaryResult.url)
    steps.push({ step: 4, status: 'completed', message: `✓ Detected: ${aiAnalysis.brand} ${aiAnalysis.name}` })

    // Step 5: Prepare perfume data
    const perfumeData = {
      name: aiAnalysis.name,
      brand: aiAnalysis.brand,
      family: aiAnalysis.family,
      description: aiAnalysis.description,
      year: options.year || null,
      image_url: cloudinaryResult.url,
      cloudinary_public_id: cloudinaryResult.publicId,
      ai_confidence: aiAnalysis.confidence,
      ...options.customData
    }

    // Step 6: Save to Supabase
    steps.push({ step: 5, status: 'processing', message: 'Saving to database...' })
    const { data, error } = await supabase
      .from('perfumes')
      .insert(perfumeData)
      .select()
      .single()

    if (error) throw error

    steps.push({ step: 5, status: 'completed', message: '✓ Saved to database' })

    return {
      success: true,
      perfume: data,
      aiAnalysis,
      steps
    }

  } catch (error) {
    console.error('❌ Automation failed:', error)
    return {
      success: false,
      error: error.message,
      steps
    }
  }
}

/**
 * Download image from URL and convert to File object
 */
const downloadImageAsFile = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to download image')
  }

  const blob = await response.blob()

  // Generate filename from URL or use timestamp
  const urlPath = new URL(url).pathname
  const filename = urlPath.split('/').pop() || `perfume-${Date.now()}.jpg`

  return new File([blob], filename, { type: blob.type })
}

/**
 * Validate if URL is a valid image
 */
const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname.toLowerCase()
    return /\.(jpg|jpeg|png|webp|gif)$/.test(path) || url.includes('image')
  } catch {
    return false
  }
}

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * 🚀 Batch automation: Multiple URLs at once
 */
export const batchCreatePerfumes = async (imageUrls, options = {}) => {
  const results = []

  for (const [index, url] of imageUrls.entries()) {
    console.log(`\n📦 Processing ${index + 1}/${imageUrls.length}: ${url}`)

    const result = await autoCreatePerfumeFromUrl(url, {
      ...options,
      batchIndex: index
    })

    results.push(result)

    // Delay giữa các requests để tránh rate limit
    if (index < imageUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return {
    total: imageUrls.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }
}
