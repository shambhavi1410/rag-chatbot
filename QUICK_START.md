# Quick Start Guide

## 🚀 Start the Application (3 Steps)

### Step 1: Start Backend Server

Open Terminal 1:
```bash
cd backend
python main.py
```

Wait for: `Server will be available at: http://localhost:8000`

### Step 2: Start Frontend Server

Open Terminal 2:
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:3000/`

### Step 3: Open Browser

Go to: **http://localhost:3000**

## ✅ Verify It's Working

1. **Check Connection Status**: Top of page should show 🟢 "Connected"
2. **Upload a Document**: Go to "Upload Documents" tab
3. **Ask a Question**: Go to "Chat" tab and ask about your document

## 🔧 If You See "Connection Refused"

### Quick Fix:
1. **Make sure backend is running** - Check Terminal 1
2. **Check the connection status** - Should be green at top of page
3. **Click "Retry"** if status is red
4. **Verify ports**:
   - Backend: http://localhost:8000 (should show JSON response)
   - Frontend: http://localhost:3000

### Still Not Working?
See **TROUBLESHOOTING.md** for detailed help.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ Backend dependencies installed (`pip install -r requirements.txt`)
- ✅ Frontend dependencies installed (`npm install`)
- ✅ Tesseract OCR installed (for image processing)
- ✅ Ollama running OR OpenAI API key set (for LLM)

## 🎯 First Time Setup

If you haven't set up yet:

```bash
# 1. Install Python dependencies
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # macOS/Linux
pip install -r ../requirements.txt

# 2. Install Node.js dependencies
cd ../frontend
npm install

# 3. Install Tesseract OCR (see README.md)
# 4. Setup LLM (Ollama or OpenAI - see README.md)
```

Then follow the 3 steps above to start!

