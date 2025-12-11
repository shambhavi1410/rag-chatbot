from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime
import json

from document_processor import DocumentProcessor
from rag_chain import RAGChain
from chat_history import ChatHistoryManager

app = FastAPI(title="RAG Chatbot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
doc_processor = DocumentProcessor()
rag_chain = RAGChain()
chat_history = ChatHistoryManager()

# Ensure directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("chat_history", exist_ok=True)
os.makedirs("vectorstore", exist_ok=True)


class QuestionRequest(BaseModel):
    question: str
    session_id: str
    language: str = "english"


@app.get("/")
def read_root():
    return {"message": "RAG Chatbot API is running", "status": "ok"}


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/features")
def get_features():
    return {
        "features": [
            "Document Upload (PDF, PPT, JPG, PNG, DOCX, etc.)",
            "Unlimited Document Uploads",
            "RAG-based Question Answering",
            "Multilingual Support (English, Hindi, Hinglish)",
            "Chat History Saving",
            "Speech to Text Conversion",
            "Dark/Light Mode Themes",
            "Shareable Chat Links"
        ]
    }


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process documents"""
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_path = f"uploads/{file_id}{file_extension}"
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process document
        texts = await doc_processor.process_document(file_path, file_extension)
        
        # Add to vector store (run in executor since it's synchronous)
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, rag_chain.add_documents, texts)
        
        return {
            "success": True,
            "file_id": file_id,
            "filename": file.filename,
            "chunks": len(texts),
            "message": "Document processed and added to knowledge base"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: QuestionRequest):
    """Handle chat questions - supports both document-based and generic questions"""
    try:
        # Get answer from RAG chain (handles both document-based and generic)
        answer = await rag_chain.query(request.question, request.language)
        
        # Save to chat history
        chat_history.save_message(
            session_id=request.session_id,
            question=request.question,
            answer=answer,
            language=request.language
        )
        
        return {
            "answer": answer,
            "session_id": request.session_id
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        # Always return a helpful response, never an error message
        try:
            # Try to get a fallback response
            fallback_answer = await rag_chain.query("help", request.language)
            return {
                "answer": fallback_answer,
                "session_id": request.session_id
            }
        except:
            # Ultimate fallback
            return {
                "answer": "Hello! I'm here to help. Please try asking your question again, or upload some documents to get started!",
                "session_id": request.session_id
            }


@app.get("/history/{session_id}")
def get_chat_history(session_id: str):
    """Get chat history for a session"""
    history = chat_history.get_history(session_id)
    return {"history": history}


@app.get("/sessions")
def get_all_sessions():
    """Get all chat sessions"""
    sessions = chat_history.get_all_sessions()
    return {"sessions": sessions}


@app.delete("/history/{session_id}")
def delete_chat_history(session_id: str):
    """Delete chat history for a session"""
    chat_history.delete_session(session_id)
    return {"success": True, "message": "Chat history deleted"}


@app.get("/share/{session_id}")
def get_shareable_info(session_id: str):
    """Get shareable information for a session"""
    history = chat_history.get_history(session_id)
    if not history:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "message_count": len(history),
        "shareable": True
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting RAG Chatbot Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
