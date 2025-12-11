import React from 'react'
import './LanguageSelector.css'

const LanguageSelector = ({ language, setLanguage }) => {
  const languages = [
    { code: 'english', label: '🇬🇧 English' },
    { code: 'hindi', label: '🇮🇳 Hindi' },
    { code: 'hinglish', label: '🌐 Hinglish' }
  ]

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector

