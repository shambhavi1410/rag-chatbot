# Install Ollama for AI-Powered Responses

## Quick Installation Guide

### Option 1: Automatic Installation Script

Run the PowerShell script:
```powershell
.\install_ollama.ps1
```

This will:
- Check if Ollama is installed
- Guide you through installation if needed
- Help you download and install a model

### Option 2: Manual Installation

1. **Download Ollama**
   - Visit: https://ollama.ai/download/windows
   - Download `OllamaSetup.exe`
   - Run the installer

2. **Install a Model**
   Open PowerShell and run:
   ```powershell
   ollama pull llama3
   ```
   
   Or try other models:
   ```powershell
   ollama pull llama2
   ollama pull mistral
   ```

3. **Verify Installation**
   ```powershell
   ollama list
   ```

4. **Start Ollama** (if not running automatically)
   ```powershell
   ollama serve
   ```

5. **Restart Backend**
   - Stop your backend server (Ctrl+C)
   - Start it again: `cd backend && python main.py`
   - The backend will automatically detect Ollama

## What You Get

✅ **AI-Powered Responses** - Natural language answers instead of just document snippets
✅ **Better Context Understanding** - The LLM understands your questions better
✅ **Intelligent Summaries** - Better document summaries and answers
✅ **Conversational AI** - More natural conversations

## Troubleshooting

### Ollama Not Detected
- Make sure Ollama is running: `ollama serve`
- Check if it's accessible: Open http://localhost:11434 in browser
- Restart the backend after installing Ollama

### Model Not Found
- Make sure you've pulled a model: `ollama pull llama3`
- Check available models: `ollama list`

### Still Getting Fallback Responses
- Check backend console for Ollama connection messages
- Verify Ollama is running: `ollama list` should work
- Restart backend server

## Test It

After installation, try asking:
- "What is machine learning?"
- "Explain quantum computing"
- Questions about your uploaded documents

You should get AI-generated responses instead of just document snippets!

