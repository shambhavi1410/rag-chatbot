# RAG Chatbot with LangChain

A powerful Retrieval-Augmented Generation (RAG) chatbot built with LangChain, FastAPI, and React. Upload documents, ask questions, and get accurate answers based on your document content.

## Features

✨ **Unlimited Document Uploads** - Upload PDF, PPT, DOCX, JPG, PNG, and more  
🤖 **RAG-Based Q&A** - Ask questions and get accurate answers from your documents  
🌐 **Multilingual Support** - Chat in English, Hindi, or Hinglish  
💾 **Chat History** - All conversations are automatically saved  
🎤 **Speech to Text** - Use your voice to ask questions  
🌓 **Dark & Light Mode** - Beautiful themes for comfortable viewing  
🔍 **Smart Document Processing** - Advanced OCR and text extraction  
⚡ **Fast & Accurate** - Powered by LangChain and vector databases  
🔗 **Shareable Chats** - Share chat conversations via links  
📊 **Connection Status** - Real-time backend connection monitoring  

## Prerequisites

- Python 3.8+
- Node.js 16+
- Tesseract OCR (for image processing)
- Ollama (for local LLM) OR OpenAI API key

### Installing Tesseract OCR

**Windows:**
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install and add to PATH
3. Update the path in `backend/document_processor.py` if needed

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### Installing Ollama (Optional - for local LLM)

1. Download from: https://ollama.ai
2. Install and run:
```bash
ollama pull llama2
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r ../requirements.txt
```

5. (Optional) Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Quick Start (Recommended)

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

Then open: **http://localhost:3000**

> ⚠️ **Important**: Always start the backend BEFORE the frontend!

### Detailed Steps

#### Start the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate your virtual environment (if not already activated)

3. Run the FastAPI server:
```bash
python main.py
```

You should see:
```
Starting RAG Chatbot Backend Server...
Server will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs
```

The backend will be available at `http://localhost:8000`

#### Start the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

The frontend will be available at `http://localhost:3000`

### Connection Status

The app now includes a **connection status indicator** at the top:
- 🟢 **Green "Connected"**: Backend is running and connected
- 🔴 **Red "Not connected"**: Backend is not running - start it!
- 🟡 **Yellow "Checking"**: Checking connection status

If you see red, make sure the backend is running on port 8000.

## Usage

1. **Upload Documents**: Go to the "Upload Documents" tab and upload your files
2. **Ask Questions**: Switch to the "Chat" tab and ask questions about your documents
3. **Use Speech**: Click the microphone icon to use voice input
4. **View History**: Check the "History" tab to see all your past conversations
5. **Switch Themes**: Use the theme toggle to switch between dark and light modes
6. **Change Language**: Select your preferred language from the dropdown

## Project Structure

```
rag-chatbot2/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── document_processor.py   # Document processing logic
│   ├── rag_chain.py           # RAG chain implementation
│   └── chat_history.py        # Chat history management
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   └── package.json
├── requirements.txt           # Python dependencies
└── README.md
```

## API Endpoints

- `GET /` - API status
- `GET /features` - Get list of features
- `POST /upload` - Upload a document
- `POST /chat` - Send a chat message
- `GET /history/{session_id}` - Get chat history
- `GET /sessions` - Get all chat sessions
- `DELETE /history/{session_id}` - Delete chat history

## Technologies Used

### Backend
- FastAPI - Web framework
- LangChain - LLM framework
- ChromaDB - Vector database
- HuggingFace Embeddings - Text embeddings
- PyPDF, python-pptx, python-docx - Document processing
- Tesseract OCR - Image text extraction

### Frontend
- React - UI framework
- Vite - Build tool
- Axios - HTTP client
- React Icons - Icons
- Web Speech API - Speech recognition

## Troubleshooting

### Connection Refused Error

If you see `ERR_CONNECTION_REFUSED`:

1. **Check if backend is running** - Look for "Server will be available at: http://localhost:8000" message
2. **Check connection status** - Top of page should show green "Connected"
3. **Verify ports** - Backend on 8000, Frontend on 3000
4. **Start backend first** - Always start backend before frontend

See **TROUBLESHOOTING.md** for detailed help.

### Backend Issues

1. **Tesseract not found**: Make sure Tesseract is installed and in your PATH
2. **Ollama connection error**: Ensure Ollama is running (`ollama serve`)
3. **ChromaDB errors**: Delete the `vectorstore` folder and restart
4. **Port already in use**: Change port in `main.py` or kill process using port 8000

### Frontend Issues

1. **CORS errors**: Backend CORS is configured - make sure backend is running
2. **Speech recognition not working**: Use Chrome or Edge browser
3. **API connection errors**: Check connection status indicator, verify backend is running
4. **Proxy errors**: Check `vite.config.js` proxy configuration

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

