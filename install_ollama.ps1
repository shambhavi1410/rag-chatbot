# Ollama Installation Script for Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ollama Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is already installed
$ollamaPath = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaPath) {
    Write-Host "✅ Ollama is already installed!" -ForegroundColor Green
    Write-Host "Location: $($ollamaPath.Source)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Checking for models..." -ForegroundColor Yellow
    $models = ollama list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host $models
    } else {
        Write-Host "No models found. Let's install one..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Ollama is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps to install Ollama:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Download Ollama from: https://ollama.ai/download" -ForegroundColor White
    Write-Host "2. Run the installer (OllamaSetup.exe)" -ForegroundColor White
    Write-Host "3. After installation, run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or download directly:" -ForegroundColor Cyan
    Write-Host "https://ollama.ai/download/windows" -ForegroundColor Blue
    Write-Host ""
    
    $download = Read-Host "Would you like to open the download page? (y/n)"
    if ($download -eq "y" -or $download -eq "Y") {
        Start-Process "https://ollama.ai/download/windows"
    }
    
    exit
}

# Check if Ollama service is running
Write-Host ""
Write-Host "Checking if Ollama service is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Ollama service is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Ollama service is not running. Starting it..." -ForegroundColor Yellow
    Write-Host "Please start Ollama manually or it will start automatically when you use it." -ForegroundColor Gray
}

# Install models
Write-Host ""
Write-Host "Available models to install:" -ForegroundColor Cyan
Write-Host "1. llama3 (Recommended - 4.7GB)" -ForegroundColor White
Write-Host "2. llama2 (Alternative - 3.8GB)" -ForegroundColor White
Write-Host "3. mistral (Smaller - 4.1GB)" -ForegroundColor White
Write-Host "4. Skip model installation" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Which model would you like to install? (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Installing llama3... This may take a few minutes..." -ForegroundColor Yellow
        ollama pull llama3
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ llama3 installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install llama3" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Installing llama2... This may take a few minutes..." -ForegroundColor Yellow
        ollama pull llama2
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ llama2 installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install llama2" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Installing mistral... This may take a few minutes..." -ForegroundColor Yellow
        ollama pull mistral
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ mistral installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install mistral" -ForegroundColor Red
        }
    }
    default {
        Write-Host "Skipping model installation." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure Ollama is running (it should start automatically)" -ForegroundColor White
Write-Host "2. Restart your backend server" -ForegroundColor White
Write-Host "3. Test the chatbot - it should now give AI-powered responses!" -ForegroundColor White
Write-Host ""
Write-Host "To start Ollama manually, run: ollama serve" -ForegroundColor Gray
Write-Host ""

