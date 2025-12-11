import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import DocumentUpload from './components/DocumentUpload'
import Features from './components/Features'
import ThemeToggle from './components/ThemeToggle'
import LanguageSelector from './components/LanguageSelector'
import ChatHistory from './components/ChatHistory'
import ConnectionStatus from './components/ConnectionStatus'
import './App.css'

function App() {
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('english')
  const [currentView, setCurrentView] = useState('chat')
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('sessionId') || `session-${Date.now()}`
  })

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
    localStorage.setItem('theme', theme)
  }, [sessionId, theme])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // Check for shared session in URL
    const urlParams = new URLSearchParams(window.location.search)
    const sharedSession = urlParams.get('session')
    if (sharedSession) {
      setSessionId(sharedSession)
      setCurrentView('chat')
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 RAG Chatbot</h1>
          <div className="header-controls">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <nav className="nav-menu">
          <button 
            className={currentView === 'chat' ? 'active' : ''}
            onClick={() => setCurrentView('chat')}
          >
            💬 Chat
          </button>
          <button 
            className={currentView === 'upload' ? 'active' : ''}
            onClick={() => setCurrentView('upload')}
          >
            📄 Upload Documents
          </button>
          <button 
            className={currentView === 'history' ? 'active' : ''}
            onClick={() => setCurrentView('history')}
          >
            📚 History
          </button>
          <button 
            className={currentView === 'features' ? 'active' : ''}
            onClick={() => setCurrentView('features')}
          >
            ✨ Features
          </button>
        </nav>
      </header>

      <main className="app-main">
        <ConnectionStatus />
        {currentView === 'chat' && (
          <ChatInterface sessionId={sessionId} language={language} />
        )}
        {currentView === 'upload' && (
          <DocumentUpload />
        )}
        {currentView === 'history' && (
          <ChatHistory sessionId={sessionId} setCurrentView={setCurrentView} />
        )}
        {currentView === 'features' && (
          <Features language={language} />
        )}
      </main>
    </div>
  )
}

export default App

