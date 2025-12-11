# Troubleshooting Guide

## Connection Refused Error

If you see `ERR_CONNECTION_REFUSED`, follow these steps:

### 1. Check if Backend is Running

**Windows:**
```bash
cd backend
python main.py
```

**macOS/Linux:**
```bash
cd backend
python3 main.py
```

You should see:
```
Starting RAG Chatbot Backend Server...
Server will be available at: http://localhost:8000
```

### 2. Check if Frontend is Running

In a separate terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### 3. Verify Ports

- Backend should be on port **8000**
- Frontend should be on port **3000**

If ports are in use:
- Backend: Change port in `backend/main.py` (line 146)
- Frontend: Change port in `frontend/vite.config.js`

### 4. Check Connection Status

The app now shows a connection status indicator at the top:
- 🟢 **Green**: Connected to backend
- 🔴 **Red**: Backend not running
- 🟡 **Yellow**: Checking connection

Click "Retry" if disconnected.

### 5. Common Issues

#### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check for port conflicts

#### Frontend won't start
- Install Node.js dependencies: `npm install`
- Check Node.js version: `node --version` (need 16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

#### CORS Errors
- Backend CORS is configured to allow all origins
- Make sure backend is running before frontend
- Check browser console for specific errors

#### API Calls Failing
- Verify backend is accessible: Open `http://localhost:8000` in browser
- Check browser console for network errors
- Verify API_URL in `frontend/src/config/api.js`

## Quick Fix Commands

### Reset Everything
```bash
# Stop all processes (Ctrl+C)

# Backend
cd backend
rm -rf __pycache__ venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r ../requirements.txt

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### Test Backend Directly
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test features endpoint
curl http://localhost:8000/features
```

### Check Logs
- Backend logs appear in the terminal running `python main.py`
- Frontend logs appear in browser console (F12)
- Check for error messages in both

## Still Having Issues?

1. **Check all dependencies are installed**
2. **Verify Python and Node.js versions**
3. **Check firewall/antivirus isn't blocking ports**
4. **Try different browser (Chrome recommended)**
5. **Restart your computer** (sometimes helps with port issues)

## Getting Help

If issues persist:
1. Check the error message in browser console (F12)
2. Check backend terminal for Python errors
3. Verify all setup steps in README.md
4. Check SETUP.md for detailed installation

