import React, { useState, useEffect } from 'react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import './SpeechToText.css'

const SpeechToText = ({ onResult, isListening, setIsListening }) => {
  const [recognition, setRecognition] = useState(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setSupported(true)
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true // Show interim results for better UX
      recognitionInstance.lang = 'en-US' // Default to English

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }
        
        // Use final transcript if available, otherwise use interim
        const textToUse = finalTranscript.trim() || interimTranscript.trim()
        if (textToUse) {
          onResult(textToUse)
        }
        
        if (finalTranscript) {
          setIsListening(false)
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        let errorMessage = 'Speech recognition error'
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your connection.'
            break
          default:
            errorMessage = `Error: ${event.error}`
        }
        
        alert(errorMessage)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      setRecognition(recognitionInstance)
    } else {
      setSupported(false)
    }
  }, [onResult, setIsListening])

  const toggleListening = () => {
    if (!supported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (!recognition) {
      alert('Speech recognition not initialized. Please refresh the page.')
      return
    }

    try {
      if (isListening) {
        recognition.stop()
        setIsListening(false)
      } else {
        // Request microphone permission first
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            recognition.start()
            setIsListening(true)
          })
          .catch((err) => {
            alert('Microphone access denied. Please allow microphone permission in your browser settings.')
            console.error('Microphone access error:', err)
          })
      }
    } catch (error) {
      console.error('Speech recognition error:', error)
      alert('Failed to start speech recognition. Please try again.')
      setIsListening(false)
    }
  }

  if (!supported) {
    return null
  }

  return (
    <button
      className={`speech-button ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
    </button>
  )
}

export default SpeechToText

