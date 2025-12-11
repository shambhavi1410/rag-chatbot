import React, { useState, useEffect, useRef } from 'react'
import { FaShare, FaCopy, FaCheck } from 'react-icons/fa'
import './ShareChat.css'

const ShareChat = ({ sessionId, messages }) => {
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  const generateShareableLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}?session=${sessionId}`
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const exportChat = () => {
    const chatText = messages.map((msg, idx) => {
      const prefix = msg.type === 'user' ? 'Q' : 'A'
      return `${prefix}: ${msg.text}\n`
    }).join('\n')

    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${sessionId}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareLink = () => {
    const link = generateShareableLink()
    copyToClipboard(link)
  }

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RAG Chatbot Conversation',
          text: 'Check out this chat conversation',
          url: generateShareableLink()
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          shareLink() // Fallback to copy
        }
      }
    } else {
      shareLink() // Fallback to copy
    }
  }

  if (messages.length === 0) {
    return null
  }

  return (
    <div className="share-chat-container" ref={menuRef}>
      <button
        className="share-button"
        onClick={() => setShowShareMenu(!showShareMenu)}
        title="Share Chat"
      >
        <FaShare />
        <span>Share</span>
      </button>

      {showShareMenu && (
        <div className="share-menu">
          <button onClick={shareViaWebAPI} className="share-option">
            <FaShare />
            <span>Share Link</span>
          </button>
          <button onClick={shareLink} className="share-option">
            {copied ? <FaCheck /> : <FaCopy />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button onClick={exportChat} className="share-option">
            <FaCopy />
            <span>Export as Text</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ShareChat

