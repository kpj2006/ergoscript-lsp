## 🚀 ErgoScript LSP - Language Server Protocol Implementation

> **Modern IDE support for ErgoScript** - The smart contract language for Ergo blockchain

Bringing professional development experience to ErgoScript with syntax highlighting, real-time diagnostics, hover information, and auto-completion.



## This addresses [ergoplatform/sigmastate-interpreter#1091](https://github.com/ergoplatform/sigmastate-interpreter/issues/1091)
---

## ⚡ Quick Start 

```powershell
# Clone or navigate to this directory
cd ergoscript-lsp-implementation

# Run setup (Windows)
.\setup.ps1

# Or manually:
cd ergoscript-lsp && npm install && npm run compile && cd ..
cd ergoscript-vscode && npm install && npm run compile && cd ..

# Open VS Code
code ergoscript-vscode

# Press F5 to launch Extension Development Host
# Open any .ergo file from examples/ folder
# Enjoy syntax highlighting, hover, completions, and diagnostics!
```

**[📖 Full Setup Guide](QUICK-START.md)**

---

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Syntax Highlighting** | ✅ Working | Keywords, types, functions, variables |
| **Real-time Diagnostics** | ✅ Working | Syntax errors, unbalanced braces |
| **Hover Information** | ✅ Working | Type info, documentation |
| **Auto-completion** | ✅ Working | Globals, functions, types, keywords |
| **Go-to-definition** | 🚧 Future | Jump to definitions |
| **Find References** | 🚧 Future | Find all usages |
| **Rename Refactoring** | 🚧 Future | Rename symbols |




## 🏗️ Architecture

```
┌─────────────────┐
│   VS Code IDE   │
└────────┬────────┘
         │ Extension API
┌────────▼───────────────┐
│  Language Client       │  ergoscript-vscode/
│  (Extension)           │  
└────────┬───────────────┘
         │ JSON-RPC / IPC
┌────────▼───────────────┐
│  LSP Server            │  ergoscript-lsp/
│  - Diagnostics         │
│  - Hover               │
│  - Completion          │
└────────┬───────────────┘
         │ 
┌────────▼───────────────┐
│  Parser Interface      │  parser.ts
│  (Basic validation     │ 
│   + Future JVM bridge) │
└────────┬───────────────┘
         │ Future integration
┌────────▼───────────────┐
│  SigmaParser (Scala)   │  Existing compiler
│  - Full AST            │  (Already exists)
│  - Type checking       │
│  - Semantic analysis   │
└────────────────────────┘
```

---

## 📁 Project Structure

```
ergoscript-lsp/              ← LSP Server (TypeScript)
├── src/
│   ├── server.ts           ← Main LSP implementation (270 lines)
│   └── parser.ts           ← Parser interface (110 lines)
└── package.json

ergoscript-vscode/           ← VS Code Extension
├── src/
│   └── extension.ts        ← Extension entry point (48 lines)
├── syntaxes/
│   └── ergoscript.tmLanguage.json  ← Syntax grammar (115 lines)
└── package.json

parser-bridge/               ← JVM Bridge (Future)
└── bridge.ts               ← Node.js ↔ JVM communication (130 lines)

examples/                    ← Demo ErgoScript Contracts
├── simple-timelock.ergo    ← Basic time-lock contract
├── crowdfunding.ergo       ← Crowdfunding campaign
├── multisig.ergo           ← Multi-signature wallet
└── error-example.ergo      ← Shows error detection
```

---



### 1. Syntax Highlighting
```scala
{
  val deadlineHeight = 1000000
  val heightCondition = HEIGHT > deadlineHeight
  sigmaProp(heightCondition)
}
```
Keywords in purple, types in green, globals in blue!

### 2. Hover Information
Hover over `HEIGHT` → See tooltip:
```
HEIGHT: Int
Current blockchain height
```

### 3. Auto-completion
Type `SIG` + Ctrl+Space → Get:
```
sigmaProp(condition: Boolean): SigmaProp
```

### 4. Error Detection
```scala
{ val x = (10 + 20  // ← Red squiggle: Unclosed parenthesis
```

https://github.com/user-attachments/assets/4d274b01-a13c-40ea-aa2a-fa97b9cede43
