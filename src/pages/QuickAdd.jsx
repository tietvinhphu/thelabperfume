import { useState } from 'react'
import { autoCreatePerfumeFromUrl, batchCreatePerfumes } from '../services/automationService'
import './QuickAdd.css'

export default function QuickAdd() {
  const [imageUrl, setImageUrl] = useState('')
  const [batchUrls, setBatchUrls] = useState('')
  const [mode, setMode] = useState('single') // 'single' or 'batch'
  const [processing, setProcessing] = useState(false)
  const [steps, setSteps] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Handle single URL submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageUrl.trim()) {
      setError('Please enter an image URL')
      return
    }

    setProcessing(true)
    setSteps([])
    setResult(null)
    setError(null)

    try {
      const automation = await autoCreatePerfumeFromUrl(imageUrl.trim())

      setSteps(automation.steps)

      if (automation.success) {
        setResult(automation.perfume)
        setImageUrl('') // Reset form

        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = `/perfume/${automation.perfume.id}`
        }, 3000)
      } else {
        setError(automation.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  // Handle batch URLs submission
  const handleBatchSubmit = async (e) => {
    e.preventDefault()

    const urls = batchUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    if (urls.length === 0) {
      setError('Please enter at least one image URL')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const batchResult = await batchCreatePerfumes(urls)

      setResult({
        batch: true,
        total: batchResult.total,
        successful: batchResult.successful,
        failed: batchResult.failed
      })

      if (batchResult.successful > 0) {
        setBatchUrls('')
        setTimeout(() => {
          window.location.href = '/browse'
        }, 3000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="quick-add-page">
      <div className="container">
        <h1>🤖 AI Quick Add Perfume</h1>
        <p className="subtitle">Paste image URL, AI will do the rest!</p>

        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            className={mode === 'single' ? 'active' : ''}
            onClick={() => setMode('single')}
          >
            Single URL
          </button>
          <button
            className={mode === 'batch' ? 'active' : ''}
            onClick={() => setMode('batch')}
          >
            Batch URLs
          </button>
        </div>

        {/* Single URL Mode */}
        {mode === 'single' && (
          <form onSubmit={handleSubmit} className="quick-add-form">
            <div className="form-group">
              <label htmlFor="imageUrl">Perfume Image URL</label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/perfume-image.jpg"
                disabled={processing}
              />
              <small>Paste a direct link to perfume image (jpg, png, webp)</small>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={processing}
            >
              {processing ? '🤖 AI Processing...' : '✨ Auto Create'}
            </button>
          </form>
        )}

        {/* Batch URLs Mode */}
        {mode === 'batch' && (
          <form onSubmit={handleBatchSubmit} className="quick-add-form">
            <div className="form-group">
              <label htmlFor="batchUrls">Image URLs (one per line)</label>
              <textarea
                id="batchUrls"
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                placeholder="https://example.com/perfume1.jpg&#10;https://example.com/perfume2.jpg&#10;https://example.com/perfume3.jpg"
                rows="8"
                disabled={processing}
              />
              <small>Paste multiple URLs, one per line</small>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={processing}
            >
              {processing ? '🤖 Batch Processing...' : '✨ Auto Create All'}
            </button>
          </form>
        )}

        {/* Processing Steps */}
        {steps.length > 0 && (
          <div className="steps-container">
            <h3>Processing Steps:</h3>
            <ul className="steps-list">
              {steps.map((step, index) => (
                <li key={index} className={`step ${step.status}`}>
                  <span className="step-number">{step.step}</span>
                  <span className="step-message">{step.message}</span>
                  {step.status === 'processing' && <div className="spinner-small" />}
                  {step.status === 'completed' && <span className="checkmark">✓</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Result */}
        {result && !result.batch && (
          <div className="result-card success">
            <h3>✅ Perfume Created Successfully!</h3>
            <div className="perfume-preview">
              <img src={result.image_url} alt={result.name} />
              <div className="perfume-info">
                <h4>{result.name}</h4>
                <p className="brand">{result.brand}</p>
                <p className="family">{result.family}</p>
                <p className="description">{result.description}</p>
              </div>
            </div>
            <p className="redirect-message">Redirecting to perfume page...</p>
          </div>
        )}

        {/* Batch Result */}
        {result && result.batch && (
          <div className="result-card success">
            <h3>✅ Batch Processing Complete!</h3>
            <div className="batch-stats">
              <div className="stat">
                <span className="stat-number">{result.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat success">
                <span className="stat-number">{result.successful}</span>
                <span className="stat-label">Success</span>
              </div>
              <div className="stat error">
                <span className="stat-number">{result.failed}</span>
                <span className="stat-label">Failed</span>
              </div>
            </div>
            <p className="redirect-message">Redirecting to browse page...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="result-card error">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h3>📝 How it works:</h3>
          <ol>
            <li>Paste perfume image URL (direct link to jpg/png/webp)</li>
            <li>AI downloads & uploads to Cloudinary</li>
            <li>AI analyzes image → extracts brand, name, style</li>
            <li>AI generates description</li>
            <li>Saves to database automatically</li>
            <li>Done! 🎉</li>
          </ol>

          <h3>💡 Tips:</h3>
          <ul>
            <li>Use high-quality product images</li>
            <li>Images with clear brand/name text work best</li>
            <li>For batch: max 10 URLs at once to avoid rate limits</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
