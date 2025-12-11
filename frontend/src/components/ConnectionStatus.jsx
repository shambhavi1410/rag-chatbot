import React, { useState, useEffect } from 'react'
import { API_URL } from '../config/api'
import axios from 'axios'
import './ConnectionStatus.css'

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking') // checking, connected, disconnected
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const checkConnection = async () => {
    try {
      const response = await axios.get(`${API_URL}/`, { timeout: 5000 })
      if (response.data) {
        setStatus('connected')
        setMessage('')
      }
    } catch (error) {
      setStatus('disconnected')
      setMessage('Backend server is not running. Please start the backend server.')
    }
  }

  if (status === 'checking') {
    return (
      <div className="connection-status checking">
        <span className="status-dot"></span>
        <span>Checking connection...</span>
      </div>
    )
  }

  if (status === 'disconnected') {
    return (
      <div className="connection-status disconnected">
        <span className="status-dot"></span>
        <span>{message || 'Not connected to backend'}</span>
        <button onClick={checkConnection} className="retry-button">Retry</button>
      </div>
    )
  }

  return (
    <div className="connection-status connected">
      <span className="status-dot"></span>
      <span>Connected</span>
    </div>
  )
}

export default ConnectionStatus

