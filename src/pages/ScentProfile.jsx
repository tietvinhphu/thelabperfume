import { useState } from 'react'
import './ScentProfile.css'

function ScentProfile() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    preferredFamilies: [],
    preferredNotes: [],
    intensity: '',
    occasion: [],
    season: []
  })

  const families = ['Floral', 'Woody', 'Fresh', 'Oriental', 'Citrus', 'Fruity', 'Aromatic', 'Gourmand']
  const notes = ['Rose', 'Vanilla', 'Bergamot', 'Sandalwood', 'Jasmine', 'Patchouli', 'Lavender', 'Musk']
  const intensities = ['Light', 'Moderate', 'Strong']
  const occasions = ['Casual', 'Work', 'Evening', 'Special Events', 'Sport']
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']

  const toggleSelection = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = () => {
    // Save to localStorage
    localStorage.setItem('scentProfile', JSON.stringify(profile))
    alert('Scent profile saved! We will use this to recommend perfumes for you.')
  }

  return (
    <div className="scent-profile">
      <div className="container">
        <h1>Create Your Scent Profile</h1>
        <p>Help us understand your fragrance preferences</p>

        <div className="profile-steps">
          <div className={`step ${step === 1 ? 'active' : ''}`}>1. Families</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>2. Notes</div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>3. Preferences</div>
        </div>

        <div className="profile-content">
          {step === 1 && (
            <div className="profile-section">
              <h2>Which fragrance families do you prefer?</h2>
              <p className="section-description">Select all that apply</p>
              <div className="options-grid">
                {families.map(family => (
                  <button
                    key={family}
                    className={`option-btn ${profile.preferredFamilies.includes(family) ? 'selected' : ''}`}
                    onClick={() => toggleSelection('preferredFamilies', family)}
                  >
                    {family}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="profile-section">
              <h2>Which notes do you enjoy?</h2>
              <p className="section-description">Select your favorite scent notes</p>
              <div className="options-grid">
                {notes.map(note => (
                  <button
                    key={note}
                    className={`option-btn ${profile.preferredNotes.includes(note) ? 'selected' : ''}`}
                    onClick={() => toggleSelection('preferredNotes', note)}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="profile-section">
              <h2>Tell us more about your preferences</h2>

              <div className="preference-group">
                <h3>Preferred Intensity</h3>
                <div className="options-row">
                  {intensities.map(intensity => (
                    <button
                      key={intensity}
                      className={`option-btn ${profile.intensity === intensity ? 'selected' : ''}`}
                      onClick={() => setProfile(prev => ({ ...prev, intensity }))}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="preference-group">
                <h3>Occasions</h3>
                <div className="options-grid">
                  {occasions.map(occasion => (
                    <button
                      key={occasion}
                      className={`option-btn ${profile.occasion.includes(occasion) ? 'selected' : ''}`}
                      onClick={() => toggleSelection('occasion', occasion)}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="preference-group">
                <h3>Seasons</h3>
                <div className="options-row">
                  {seasons.map(season => (
                    <button
                      key={season}
                      className={`option-btn ${profile.season.includes(season) ? 'selected' : ''}`}
                      onClick={() => toggleSelection('season', season)}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="profile-actions">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                Previous
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScentProfile
