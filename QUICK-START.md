# Quick Start


### 1. Install Dependencies
```powershell
.\setup.ps1
```

Or manually:
```bash
cd ergoscript-lsp && npm install && npm run compile && cd ..
cd ergoscript-vscode && npm install && npm run compile && cd ..
```

### 2. Launch Extension
1. Open `ergoscript-vscode` in VS Code
2. Press **F5**
3. Open any `.ergo` file from `examples/`

### 3. Test Features
- See syntax highlighting
- Hover over `HEIGHT` for type info
- Type `SIG` + Ctrl+Space for completions
- Open `error-example.ergo` for error detection

---

## 🎯 Expected Results

### Syntax Highlighting
- Keywords (`val`, `def`, `if`) → Purple/Blue
- Types (`Box`, `SigmaProp`) → Green/Teal
- Globals (`HEIGHT`, `SELF`) → Light blue
- Functions (`sigmaProp`, `blake2b256`) → Yellow
- Comments → Gray/Green

### Hover Information
Hover over any of these to see documentation:
- `HEIGHT` → "Int - Current blockchain height"
- `SELF` → "Box - The box being spent"
- `sigmaProp` → "sigmaProp(condition: Boolean): SigmaProp"
- `proveDlog` → "proveDlog(value: GroupElement): SigmaProp"

### Auto-completion
Type these and press Ctrl+Space:
- `HEI` → Shows `HEIGHT`
- `OUT` → Shows `OUTPUTS`
- `sigma` → Shows `sigmaProp()`
- `blake` → Shows `blake2b256()`

### Error Detection
Open `error-example.ergo` to see:
- Unclosed parenthesis → Red squiggle
- Missing closing brace → Red squiggle
- Incomplete val declaration → Red squiggle

---

## 🐛 Troubleshooting

**Extension doesn't start:**
- Make sure you ran `npm install` and `npm run compile` in both folders
- Check Output panel (View → Output) for errors

**No syntax highlighting:**
- Make sure file has `.ergo` extension
- Close and reopen the file
- Restart Extension Development Host

**No hover/completion:**
- Wait a few seconds for LSP to initialize
- Check if server is running (Output → ErgoScript Language Server)
- Make sure cursor is on a valid identifier

**Still not working:**
1. Close Extension Development Host
2. In main VS Code window, run: Developer: Reload Window
3. Press F5 again

---

## 📁 File Structure Reference

```
ergoscript-lsp/
├── src/
│   ├── server.ts          ← Main LSP server
│   └── parser.ts          ← Parser interface
├── out/                   ← Compiled JS (after npm run compile)
└── package.json

ergoscript-vscode/
├── src/
│   └── extension.ts       ← Extension entry point
├── syntaxes/
│   └── ergoscript.tmLanguage.json  ← Syntax grammar
├── .vscode/
│   ├── launch.json        ← Debug configuration
│   └── tasks.json         ← Build tasks
├── out/                   ← Compiled JS
└── package.json

examples/
├── simple-timelock.ergo   ← Basic example
├── crowdfunding.ergo      ← Complex example
├── multisig.ergo          ← Multi-sig example
└── error-example.ergo     ← Shows error detection
```

## ✅ Checklist Before Presentation

- [ ] Ran `setup.ps1` or manual install
- [ ] Tested F5 launch → New window opens
- [ ] Opened `simple-timelock.ergo` → Syntax highlighted
- [ ] Hovered over `HEIGHT` → Tooltip appears
- [ ] Triggered completion → List appears
- [ ] Opened `error-example.ergo` → Errors shown
- [ ] Prepared talking points from DEMO-GUIDE.md
- [ ] Screenshots taken (optional)
- [ ] Rehearsed 5-minute demo

---


