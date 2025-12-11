import os
import json
from datetime import datetime
from typing import List, Dict, Optional
import uuid


class ChatHistoryManager:
    def __init__(self):
        self.history_dir = "chat_history"
        os.makedirs(self.history_dir, exist_ok=True)
    
    def save_message(self, session_id: str, question: str, answer: str, language: str):
        """Save a chat message to history"""
        history_file = os.path.join(self.history_dir, f"{session_id}.json")
        
        # Load existing history
        if os.path.exists(history_file):
            with open(history_file, "r", encoding="utf-8") as f:
                history = json.load(f)
        else:
            history = {
                "session_id": session_id,
                "created_at": datetime.now().isoformat(),
                "messages": []
            }
        
        # Add new message
        message = {
            "question": question,
            "answer": answer,
            "language": language,
            "timestamp": datetime.now().isoformat()
        }
        history["messages"].append(message)
        history["updated_at"] = datetime.now().isoformat()
        
        # Save history
        with open(history_file, "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    
    def get_history(self, session_id: str) -> List[Dict]:
        """Get chat history for a session"""
        history_file = os.path.join(self.history_dir, f"{session_id}.json")
        
        if os.path.exists(history_file):
            with open(history_file, "r", encoding="utf-8") as f:
                history = json.load(f)
            return history.get("messages", [])
        return []
    
    def get_all_sessions(self) -> List[Dict]:
        """Get all chat sessions"""
        sessions = []
        
        for filename in os.listdir(self.history_dir):
            if filename.endswith(".json"):
                session_id = filename[:-5]  # Remove .json extension
                history_file = os.path.join(self.history_dir, filename)
                
                with open(history_file, "r", encoding="utf-8") as f:
                    history = json.load(f)
                
                sessions.append({
                    "session_id": session_id,
                    "created_at": history.get("created_at"),
                    "updated_at": history.get("updated_at"),
                    "message_count": len(history.get("messages", []))
                })
        
        # Sort by updated_at (most recent first)
        sessions.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        return sessions
    
    def delete_session(self, session_id: str):
        """Delete a chat session"""
        history_file = os.path.join(self.history_dir, f"{session_id}.json")
        if os.path.exists(history_file):
            os.remove(history_file)

