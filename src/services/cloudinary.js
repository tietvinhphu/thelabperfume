import { Cloudinary } from '@cloudinary/url-gen'

// Initialize Cloudinary instance
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
})

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder name in Cloudinary (e.g., 'perfumes', 'ingredients')
 * @returns {Promise<Object>} Upload result with secure_url
 */
export const uploadImage = async (file, folder = 'perfumes') => {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Cloudinary error details:', errorData)
      throw new Error(errorData.error?.message || 'Upload failed')
    }

    const data = await response.json()
    return {
      publicId: data.public_id,
      url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Get optimized image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options

  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`
}

/**
 * Get thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Thumbnail URL (200x200)
 */
export const getThumbnailUrl = (publicId) => {
  return getOptimizedImageUrl(publicId, {
    width: 200,
    height: 200,
    crop: 'thumb',
    quality: 'auto:low'
  })
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteImage = async (publicId) => {
  // Note: This requires backend API endpoint for security
  // Cannot delete directly from frontend
  console.warn('Delete must be done from backend for security')
  throw new Error('Delete operation requires backend API')
}

export { cloudinary }
