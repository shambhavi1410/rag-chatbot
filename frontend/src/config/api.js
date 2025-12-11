// API Configuration
// Use proxy in development, direct URL in production
const isDevelopment = import.meta.env.DEV
export const API_URL = isDevelopment 
  ? '/api'  // Use Vite proxy
  : 'http://localhost:9000'

export const API_ENDPOINTS = {
  UPLOAD: '/upload',
  CHAT: '/chat',
  HISTORY: '/history',
  SESSIONS: '/sessions',
  FEATURES: '/features'
}

