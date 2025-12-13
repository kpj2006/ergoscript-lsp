import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  CompletionItem,
  CompletionItemKind,
  Hover,
  MarkupKind,
  Diagnostic,
  DiagnosticSeverity
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { ErgoScriptParser } from './parser';

// Create LSP connection
const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const parser = new ErgoScriptParser();

connection.onInitialize((params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.', ' ']
      },
      hoverProvider: true,
      definitionProvider: false,
      documentSymbolProvider: false
    }
  };
});

// Validate document on change
documents.onDidChangeContent((change: { document: TextDocument }) => {
  validateDocument(change.document);
});

async function validateDocument(document: TextDocument): Promise<void> {
  const text = document.getText();
  const diagnostics: Diagnostic[] = [];

  try {
    const result = parser.parse(text);
    
    if (!result.success && result.errors) {
      for (const error of result.errors) {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: document.positionAt(error.offset || 0),
            end: document.positionAt((error.offset || 0) + (error.length || 1))
          },
          message: error.message,
          source: 'ergoscript'
        });
      }
    }
  } catch (e) {
    // Parse error - show at beginning of file
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 100 }
      },
      message: e instanceof Error ? e.message : 'Syntax error',
      source: 'ergoscript'
    });
  }

  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

// Hover provider
connection.onHover((params: any): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // Get word at position
  const word = getWordAtPosition(text, offset);
  
  if (!word) return null;

  // Provide hover information for known symbols
  const hoverInfo = getHoverInfo(word);
  
  if (hoverInfo) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: hoverInfo
      }
    };
  }

  return null;
});

// Completion provider
connection.onCompletion((params: any): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];

  return getCompletionItems();
});

function getWordAtPosition(text: string, offset: number): string | null {
  const before = text.slice(0, offset);
  const after = text.slice(offset);
  
  const beforeMatch = before.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
  const afterMatch = after.match(/^[a-zA-Z0-9_]*/);
  
  if (!beforeMatch) return null;
  
  return beforeMatch[0] + (afterMatch ? afterMatch[0] : '');
}

function getHoverInfo(word: string): string | null {
  const typeInfo: Record<string, string> = {
    'HEIGHT': '**HEIGHT**: Int\n\nCurrent blockchain height',
    'SELF': '**SELF**: Box\n\nThe box being spent by this transaction',
    'INPUTS': '**INPUTS**: Coll[Box]\n\nCollection of all input boxes of the spending transaction',
    'OUTPUTS': '**OUTPUTS**: Coll[Box]\n\nCollection of all output boxes of the spending transaction',
    'CONTEXT': '**CONTEXT**: Context\n\nThe context of the current transaction',
    'Global': '**Global**: Global\n\nGlobal functions and constants',
    'sigmaProp': '**sigmaProp**(condition: Boolean): SigmaProp\n\nConverts boolean to SigmaProp',
    'proveDlog': '**proveDlog**(value: GroupElement): SigmaProp\n\nCreates a sigma proposition for discrete log proof',
    'blake2b256': '**blake2b256**(input: Coll[Byte]): Coll[Byte]\n\nBlake2b 256-bit hash function',
    'sha256': '**sha256**(input: Coll[Byte]): Coll[Byte]\n\nSHA-256 hash function',
    'Box': '**Box**\n\nRepresents a box (UTXO) in Ergo blockchain',
    'SigmaProp': '**SigmaProp**\n\nSigma proposition that can be proven via zero-knowledge proof',
    'GroupElement': '**GroupElement**\n\nElliptic curve point',
    'BigInt': '**BigInt**\n\n256-bit signed integer',
    'Coll': '**Coll[T]**\n\nCollection type',
    'AvlTree': '**AvlTree**\n\nAuthenticated AVL+ tree'
  };

  return typeInfo[word] || null;
}

function getCompletionItems(): CompletionItem[] {
  return [
    // Global variables
    {
      label: 'HEIGHT',
      kind: CompletionItemKind.Variable,
      detail: 'Int',
      documentation: 'Current blockchain height'
    },
    {
      label: 'SELF',
      kind: CompletionItemKind.Variable,
      detail: 'Box',
      documentation: 'The box being spent'
    },
    {
      label: 'INPUTS',
      kind: CompletionItemKind.Variable,
      detail: 'Coll[Box]',
      documentation: 'Input boxes of the transaction'
    },
    {
      label: 'OUTPUTS',
      kind: CompletionItemKind.Variable,
      detail: 'Coll[Box]',
      documentation: 'Output boxes of the transaction'
    },
    {
      label: 'CONTEXT',
      kind: CompletionItemKind.Variable,
      detail: 'Context',
      documentation: 'Transaction context'
    },
    {
      label: 'Global',
      kind: CompletionItemKind.Variable,
      detail: 'Global',
      documentation: 'Global functions and constants'
    },
    // Keywords
    {
      label: 'val',
      kind: CompletionItemKind.Keyword,
      documentation: 'Declare a value'
    },
    {
      label: 'def',
      kind: CompletionItemKind.Keyword,
      documentation: 'Define a function'
    },
    {
      label: 'if',
      kind: CompletionItemKind.Keyword,
      documentation: 'Conditional expression'
    },
    {
      label: 'else',
      kind: CompletionItemKind.Keyword,
      documentation: 'Else branch'
    },
    // Functions
    {
      label: 'sigmaProp',
      kind: CompletionItemKind.Function,
      detail: '(Boolean) => SigmaProp',
      documentation: 'Convert boolean to SigmaProp',
      insertText: 'sigmaProp($1)'
    },
    {
      label: 'proveDlog',
      kind: CompletionItemKind.Function,
      detail: '(GroupElement) => SigmaProp',
      documentation: 'Create discrete log proof',
      insertText: 'proveDlog($1)'
    },
    {
      label: 'blake2b256',
      kind: CompletionItemKind.Function,
      detail: '(Coll[Byte]) => Coll[Byte]',
      documentation: 'Blake2b 256-bit hash',
      insertText: 'blake2b256($1)'
    },
    {
      label: 'sha256',
      kind: CompletionItemKind.Function,
      detail: '(Coll[Byte]) => Coll[Byte]',
      documentation: 'SHA-256 hash',
      insertText: 'sha256($1)'
    },
    {
      label: 'deserialize',
      kind: CompletionItemKind.Function,
      detail: '(String) => T',
      documentation: 'Deserialize from Base64',
      insertText: 'deserialize[$1]("$2")'
    },
    // Types
    {
      label: 'Box',
      kind: CompletionItemKind.Class,
      documentation: 'Box type'
    },
    {
      label: 'SigmaProp',
      kind: CompletionItemKind.Class,
      documentation: 'Sigma proposition type'
    },
    {
      label: 'GroupElement',
      kind: CompletionItemKind.Class,
      documentation: 'Elliptic curve point'
    },
    {
      label: 'BigInt',
      kind: CompletionItemKind.Class,
      documentation: '256-bit signed integer'
    },
    {
      label: 'Int',
      kind: CompletionItemKind.Class,
      documentation: '32-bit integer'
    },
    {
      label: 'Long',
      kind: CompletionItemKind.Class,
      documentation: '64-bit integer'
    },
    {
      label: 'Boolean',
      kind: CompletionItemKind.Class,
      documentation: 'Boolean type'
    },
    {
      label: 'Coll',
      kind: CompletionItemKind.Class,
      documentation: 'Collection type',
      insertText: 'Coll[$1]'
    }
  ];
}

// Initialize document manager
documents.listen(connection);
connection.listen();
