/**
 * ErgoScript parser interface
 * This is a simple parser that provides basic syntax validation
 * In production, this would interface with the Scala parser via JVM bridge
 */

export interface ParseError {
  message: string;
  offset?: number;
  length?: number;
  line?: number;
  column?: number;
}

export interface ParseResult {
  success: boolean;
  errors?: ParseError[];
  ast?: any;
}

export class ErgoScriptParser {
  /**
   * Parse ErgoScript source code
   * Currently provides basic syntax checking
   * TODO: Integrate with actual SigmaParser from JVM
   */
  parse(source: string): ParseResult {
    const errors: ParseError[] = [];

    try {
      // Basic syntax validation
      this.validateBasicSyntax(source, errors);

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true };
    } catch (e) {
      return {
        success: false,
        errors: [{
          message: e instanceof Error ? e.message : 'Unknown parse error',
          offset: 0
        }]
      };
    }
  }

  private validateBasicSyntax(source: string, errors: ParseError[]): void {
    // Check for unbalanced braces
    let braceDepth = 0;
    let parenDepth = 0;
    let bracketDepth = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      
      if (char === '{') braceDepth++;
      if (char === '}') braceDepth--;
      if (char === '(') parenDepth++;
      if (char === ')') parenDepth--;
      if (char === '[') bracketDepth++;
      if (char === ']') bracketDepth--;

      if (braceDepth < 0) {
        errors.push({
          message: 'Unexpected closing brace }',
          offset: i,
          length: 1
        });
        braceDepth = 0;
      }
      if (parenDepth < 0) {
        errors.push({
          message: 'Unexpected closing parenthesis )',
          offset: i,
          length: 1
        });
        parenDepth = 0;
      }
      if (bracketDepth < 0) {
        errors.push({
          message: 'Unexpected closing bracket ]',
          offset: i,
          length: 1
        });
        bracketDepth = 0;
      }
    }

    if (braceDepth > 0) {
      errors.push({
        message: `Unclosed brace { (${braceDepth} unclosed)`,
        offset: source.length - 1
      });
    }
    if (parenDepth > 0) {
      errors.push({
        message: `Unclosed parenthesis ( (${parenDepth} unclosed)`,
        offset: source.length - 1
      });
    }
    if (bracketDepth > 0) {
      errors.push({
        message: `Unclosed bracket [ (${bracketDepth} unclosed)`,
        offset: source.length - 1
      });
    }

    // Check for common syntax errors
    this.checkCommonErrors(source, errors);
  }

  private checkCommonErrors(source: string, errors: ParseError[]): void {
    // Check for invalid val/def declarations
    const valDefRegex = /(val|def)\s*$/gm;
    let match;
    while ((match = valDefRegex.exec(source)) !== null) {
      errors.push({
        message: `Incomplete ${match[1]} declaration`,
        offset: match.index,
        length: match[0].length
      });
    }

    // Check for standalone => without lambda context
    const lines = source.split('\n');
    lines.forEach((line, lineNum) => {
      if (line.trim().startsWith('=>')) {
        errors.push({
          message: 'Unexpected => at start of line',
          offset: source.split('\n').slice(0, lineNum).join('\n').length + line.indexOf('=>'),
          length: 2
        });
      }
    });
  }
}
