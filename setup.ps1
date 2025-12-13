# Quick setup script for ErgoScript LSP (Windows)

Write-Host "🚀 Setting up ErgoScript LSP..." -ForegroundColor Green

# Install LSP Server
Write-Host "📦 Installing LSP Server dependencies..." -ForegroundColor Cyan
Set-Location ergoscript-lsp
npm install
npm run compile
Set-Location ..

# Install VS Code Extension
Write-Host "📦 Installing VS Code Extension dependencies..." -ForegroundColor Cyan
Set-Location ergoscript-vscode
npm install
npm run compile
Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open 'ergoscript-vscode' folder in VS Code"
Write-Host "2. Press F5 to launch Extension Development Host"
Write-Host "3. Open any .ergo file from examples/ folder"
Write-Host "4. Enjoy syntax highlighting, hover, and completions!"
