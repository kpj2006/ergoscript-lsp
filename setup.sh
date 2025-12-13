#!/bin/bash
# Quick setup script for ErgoScript LSP

echo "🚀 Setting up ErgoScript LSP..."

# Install LSP Server
echo "📦 Installing LSP Server dependencies..."
cd ergoscript-lsp
npm install
npm run compile
cd ..

# Install VS Code Extension
echo "📦 Installing VS Code Extension dependencies..."
cd ergoscript-vscode
npm install
npm run compile
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open 'ergoscript-vscode' folder in VS Code"
echo "2. Press F5 to launch Extension Development Host"
echo "3. Open any .ergo file from examples/ folder"
echo "4. Enjoy syntax highlighting, hover, and completions!"
