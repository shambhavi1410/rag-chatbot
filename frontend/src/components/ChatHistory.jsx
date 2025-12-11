import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import './ChatHistory.css'

const ChatHistory = ({ sessionId, setCurrentView }) => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (selectedSession) {
      loadHistory(selectedSession)
    }
  }, [selectedSession])

  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`)
      setSessions(response.data.sessions)
      setLoading(false)
    } catch (error) {
      console.error('Error loading sessions:', error)
      setLoading(false)
    }
  }

  const loadHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/history/${sessionId}`)
      setHistory(response.data.history)
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this chat session?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/history/${sessionId}`)
      if (selectedSession === sessionId) {
        setSelectedSession(null)
        setHistory([])
      }
      loadSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return <div className="loading">Loading chat history...</div>
  }

  return (
    <div className="chat-history">
      <h2>📚 Chat History</h2>
      
      <div className="history-container">
        <div className="sessions-list">
          <h3>Sessions</h3>
          {sessions.length === 0 ? (
            <div className="empty-state">No chat sessions yet</div>
          ) : (
            <div className="sessions">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`session-item ${selectedSession === session.session_id ? 'active' : ''}`}
                  onClick={() => setSelectedSession(session.session_id)}
                >
                  <div className="session-info">
                    <div className="session-id">{session.session_id}</div>
                    <div className="session-meta">
                      {session.message_count} messages
                    </div>
                    <div className="session-date">
                      {formatDate(session.updated_at)}
                    </div>
                  </div>
                  <button
                    className="delete-session-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.session_id)
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="history-view">
          {selectedSession ? (
            <>
              <div className="history-header">
                <h3>Chat Messages</h3>
                <button
                  className="back-button"
                  onClick={() => setCurrentView('chat')}
                >
                  Continue Chat →
                </button>
              </div>
              {history.length === 0 ? (
                <div className="empty-state">No messages in this session</div>
              ) : (
                <div className="messages-list">
                  {history.map((msg, idx) => (
                    <div key={idx} className="history-message">
                      <div className="message-question">
                        <strong>Q:</strong> {msg.question}
                      </div>
                      <div className="message-answer">
                        <strong>A:</strong> {msg.answer}
                      </div>
                      <div className="message-meta">
                        {formatDate(msg.timestamp)} • {msg.language}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              Select a session to view chat history
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatHistory

