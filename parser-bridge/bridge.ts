/**
 * JVM Bridge for ErgoScript Parser
 * 
 * This module provides a bridge between Node.js and the Scala-based ErgoScript parser.
 * It uses child_process to spawn a JVM and communicate with the SigmaParser.
 * 
 * For production use, consider:
 * - Using GraalVM native-image for faster startup
 * - Implementing a persistent JVM process with IPC
 * - Adding caching for repeated parses
 */

import { spawn } from 'child_process';
import * as path from 'path';

export interface ParseResult {
  success: boolean;
  errors?: Array<{
    message: string;
    line?: number;
    column?: number;
    offset?: number;
  }>;
  ast?: any;
}

export class ErgoScriptParserBridge {
  private jarPath: string;

  constructor() {
    // Path to the compiled Scala JAR
    this.jarPath = path.join(__dirname, '..', 'sigmastate-interpreter', 'target', 'scala-2.13', 'sigma.jar');
  }

  /**
   * Parse ErgoScript code using the Scala parser
   * @param code ErgoScript source code
   * @returns Promise with parse result
   */
  async parse(code: string): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      // Escape the code for command line
      const escapedCode = code.replace(/"/g, '\\"');
      
      // Spawn JVM process
      const javaProcess = spawn('java', [
        '-cp', this.jarPath,
        'sigma.compiler.ParserCLI',
        escapedCode
      ]);

      let stdout = '';
      let stderr = '';

      javaProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      javaProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      javaProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            resolve({ success: true }); // No errors, but no AST
          }
        } else {
          // Parse failed - extract error info
          const errors = this.parseErrorOutput(stderr);
          resolve({ success: false, errors });
        }
      });

      javaProcess.on('error', (err) => {
        reject(new Error(`Failed to start JVM: ${err.message}`));
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        javaProcess.kill();
        reject(new Error('Parser timeout'));
      }, 5000);
    });
  }

  private parseErrorOutput(stderr: string): Array<{ message: string; line?: number; column?: number }> {
    const errors: Array<{ message: string; line?: number; column?: number }> = [];
    
    // Try to extract error information from stderr
    const lines = stderr.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        // Look for line:column pattern
        const match = line.match(/(\d+):(\d+):\s*(.+)/);
        if (match) {
          errors.push({
            line: parseInt(match[1]) - 1, // Convert to 0-based
            column: parseInt(match[2]) - 1,
            message: match[3]
          });
        } else {
          errors.push({ message: line.trim() });
        }
      }
    }
    
    return errors.length > 0 ? errors : [{ message: stderr || 'Parse error' }];
  }
}

// CLI entry point for testing
if (require.main === module) {
  const bridge = new ErgoScriptParserBridge();
  const testCode = process.argv[2] || '{ sigmaProp(HEIGHT > 100) }';
  
  bridge.parse(testCode)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}
