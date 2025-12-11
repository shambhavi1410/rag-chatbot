import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpeechToText from './SpeechToText';
import ShareChat from './ShareChat';
import { API_URL } from '../config/api';
import './ChatInterface.css';

const ChatInterface = ({ sessionId, language, onNewSession }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // ⭐ FIXED NEW CHAT FUNCTION (correct storage key)
  const startNewChat = () => {
    const newSessionId = "session-" + Date.now();

    // Fix: Store using same key App.jsx expects
    localStorage.setItem("sessionId", newSessionId);

    // Clear messages + input
    setMessages([]);
    setInput("");

    // Notify parent to update ID
    if (onNewSession) {
      onNewSession(newSessionId);
    }
  };

  // Load history on session change
  useEffect(() => {
    loadChatHistory();
  }, [sessionId]);

  // Auto-scroll down
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history/${sessionId}`);

      if (response.data?.history?.length > 0) {
        const formatted = response.data.history.flatMap(msg => [
          { type: 'user', text: msg.question },
          { type: 'assistant', text: msg.answer }
        ]);
        setMessages(formatted);
      } else {
        setMessages([]); // ensures old messages never appear again
      }

    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        question: userMessage,
        session_id: sessionId,
        language: language
      });

      setMessages(prev => [
        ...prev,
        { type: 'assistant', text: response.data.answer }
      ]);

    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend. Ensure the backend is running.';
      } else if (error.response) {
        errorMessage = `Error: ${error.response.data?.detail || error.response.statusText}`;
      }

      setMessages(prev => [...prev, { type: 'assistant', text: errorMessage }]);

    } finally {
      setLoading(false);
    }
  };

  const handleSpeechResult = (text) => {
    setInput(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">

      {/* ⭐ NEW CHAT BUTTON */}
      <div className="new-chat-container" style={{ marginBottom: "10px", textAlign: "right" }}>
        <button
          onClick={startNewChat}
          className="new-chat-button"
          style={{
            padding: "8px 16px",
            background: "#6a5acd",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          + New Chat
        </button>
      </div>

      {messages.length > 0 && (
        <div className="chat-header-actions">
          <ShareChat sessionId={sessionId} messages={messages} />
        </div>
      )}

      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>👋 Welcome to RAG Chatbot!</h2>
            <p>Ask me anything about your uploaded documents.</p>
            <p>You can use speech-to-text by clicking the microphone icon.</p>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <SpeechToText
            onResult={handleSpeechResult}
            isListening={isListening}
            setIsListening={setIsListening}
          />

          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here... (Press Enter to send)"
            rows="1"
          />

          <button
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatInterface;

