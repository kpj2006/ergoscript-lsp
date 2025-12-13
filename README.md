# 🚀 ErgoScript LSP - Language Server Protocol Implementation

[![Status](https://img.shields.io/badge/status-proof--of--concept-orange)]()
[![Implementation Time](https://img.shields.io/badge/implementation-2%20hours-green)]()
[![Lines of Code](https://img.shields.io/badge/lines%20of%20code-~1060-blue)]()
[![License](https://img.shields.io/badge/license-CC0-lightgrey)]()

> **Modern IDE support for ErgoScript** - The smart contract language for Ergo blockchain

Bringing professional development experience to ErgoScript with syntax highlighting, real-time diagnostics, hover information, and auto-completion.

---

## ⚡ Quick Start (5 Minutes)

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

---

## 🎯 What This Is

A **Language Server Protocol (LSP)** implementation for ErgoScript that provides modern IDE features similar to TypeScript, Python, or Rust. Built in **2 hours** as a proof-of-concept demonstration.

### Before LSP
```
📝 Notepad
❌ No syntax highlighting
❌ No error detection
❌ No auto-completion
❌ Manual docs lookup
```

### After LSP
```
✨ VS Code / IntelliJ / Vim
✅ Syntax highlighting
✅ Real-time errors
✅ Auto-completion
✅ Instant documentation
```

---

## 📊 Stats

- **Implementation Time**: 2 hours
- **Lines of Code**: ~1,060 (code) + ~900 (documentation)
- **Files Created**: 23
- **Features Working**: 4/4 core LSP features
- **Example Contracts**: 4 real ErgoScript demos

---

## 🏗️ Architecture

```
┌─────────────────┐
│   VS Code IDE   │
└────────┬────────┘
         │ Extension API
┌────────▼───────────────┐
│  Language Client       │  ergoscript-vscode/
│  (Extension)           │  ~180 lines
└────────┬───────────────┘
         │ JSON-RPC / IPC
┌────────▼───────────────┐
│  LSP Server            │  ergoscript-lsp/
│  - Diagnostics         │  ~380 lines
│  - Hover               │
│  - Completion          │
└────────┬───────────────┘
         │ 
┌────────▼───────────────┐
│  Parser Interface      │  parser.ts
│  (Basic validation     │  ~110 lines
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

## 🎬 Live Demo

### 1. Syntax Highlighting
![Syntax highlighting example](https://img.shields.io/badge/ErgoScript-Highlighted-brightgreen)
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

---

## 🤝 Contributing

- 🐛 Report bugs via GitHub issues
- 💡 Suggest features
- 📝 Improve documentation
- 🔌 Implement advanced LSP features

---

## 📣 Share & Connect

⭐ Star this repo if you find it useful  
🤝 Contribute to make it production-ready  

---

**Made for the Ergo community**

*Bringing modern developer experience to blockchain smart contracts*


