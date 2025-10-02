import { useState } from 'react'
import { uploadImage } from '../../services/cloudinary'
import './ImageUpload.css'

export default function ImageUpload({ folder = 'perfumes', onUploadSuccess, onUploadError }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    setError(null)

    try {
      const result = await uploadImage(file, folder)

      if (onUploadSuccess) {
        onUploadSuccess(result)
      }
    } catch (err) {
      const errorMessage = err.message || 'Upload failed. Please try again.'
      setError(errorMessage)

      if (onUploadError) {
        onUploadError(err)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setPreview(null)
    setError(null)
  }

  return (
    <div className="image-upload">
      <div className="upload-area">
        {!preview ? (
          <label className="upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="upload-input"
            />
            <div className="upload-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Click to upload image</p>
              <span className="upload-hint">PNG, JPG up to 5MB</span>
            </div>
          </label>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            {uploading && (
              <div className="upload-overlay">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            )}
            {!uploading && (
              <button onClick={handleReset} className="reset-button">
                Change Image
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
