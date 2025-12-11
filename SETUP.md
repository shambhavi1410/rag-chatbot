# Setup Guide

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r ../requirements.txt
```

### 2. Install Node.js Dependencies

```bash
cd frontend
npm install
```

### 3. Install Tesseract OCR

**Windows:**
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location: `C:\Program Files\Tesseract-OCR\`
3. The code will auto-detect it

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-hin  # For Hindi support
```

### 4. Setup LLM (Choose one)

#### Option A: Use Ollama (Local, Free)
1. Download from: https://ollama.ai
2. Install and run Ollama
3. Pull the model:
```bash
ollama pull llama2
```

#### Option B: Use OpenAI (Cloud, Paid)
1. Get API key from: https://platform.openai.com/api-keys
2. Create `backend/.env` file:
```
OPENAI_API_KEY=your_api_key_here
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

Open your browser and go to: `http://localhost:3000`

## Troubleshooting

### Tesseract Not Found
- Windows: Update the path in `backend/document_processor.py`
- Make sure Tesseract is installed and in PATH

### Ollama Connection Error
- Make sure Ollama is running: `ollama serve`
- Check if model is downloaded: `ollama list`

### ChromaDB Errors
- Delete the `vectorstore` folder and restart
- Make sure you have write permissions

### Port Already in Use
- Backend: Change port in `backend/main.py` (line 146)
- Frontend: Change port in `frontend/vite.config.js`

## Features Testing

1. **Upload Documents**: Try uploading a PDF, PPT, or image
2. **Ask Questions**: Ask questions about uploaded documents
3. **Speech to Text**: Click microphone icon (Chrome/Edge only)
4. **Theme Toggle**: Switch between dark and light modes
5. **Language**: Change language in the dropdown
6. **History**: View and manage chat history

## Notes

- First document upload may take longer as it downloads the embedding model
- Speech recognition works best in Chrome or Edge browsers
- Large documents may take time to process
- Chat history is saved locally in `chat_history/` folder

