/**
 * Source mapper for Solidity debugging
 * Maps EVM program counter (PC) values to Solidity source code lines
 */

/**
 * Represents a decoded segment from the sourceMap string
 */
interface SourceMapEntry {
  start: number;
  length: number;
  fileIndex: number;
  jumpType: string;
  modifierDepth: number;
}

/**
 * Represents a source file
 */
interface SourceFile {
  content: string;
  name: string;
}

/**
 * Maps an EVM program counter (PC) to a line in a Solidity source file
 */
interface SourceLocation {
  line: number;
  column: number;
  snippet: string;
  fileName: string;
  fileContent: string;
}

/**
 * Parse a source map string into an array of source map entries.
 * Handles the relative format used in source maps (empty fields carry over)
 */
export function parseSourceMap(sourceMapStr: string): SourceMapEntry[] {
  const segments = sourceMapStr.split(';');
  const result: SourceMapEntry[] = [];
  
  let prevEntry: SourceMapEntry = {
    start: 0,
    length: 0,
    fileIndex: 0,
    jumpType: '',
    modifierDepth: 0
  };
  
  for (const segment of segments) {
    if (!segment) {
      result.push({ ...prevEntry });
      continue;
    }
    
    const parts = segment.split(':');
    const currentEntry: SourceMapEntry = { ...prevEntry };
    
    // Parse each part, only override if it exists
    if (parts[0] !== '') currentEntry.start = parseInt(parts[0], 10);
    if (parts[1] !== '') currentEntry.length = parseInt(parts[1], 10);
    if (parts[2] !== '') currentEntry.fileIndex = parseInt(parts[2], 10);
    if (parts[3] !== '') currentEntry.jumpType = parts[3];
    if (parts[4] !== '') currentEntry.modifierDepth = parseInt(parts[4], 10);
    
    result.push(currentEntry);
    prevEntry = currentEntry;
  }
  
  return result;
}

/**
 * Finds the line and column number in the source file for a given offset
 */
export function findLineAndColumn(source: string, offset: number): { line: number; column: number } {
  const lines = source.split('\n');
  let position = 0;
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLength = lines[lineIndex].length + 1; // +1 for the newline
    
    if (position + lineLength > offset) {
      return {
        line: lineIndex + 1, // 1-based line numbers
        column: offset - position + 1 // 1-based column numbers
      };
    }
    
    position += lineLength;
  }
  
  // Default if we can't find it
  return { line: 1, column: 1 };
}

/**
 * Maps an EVM program counter to a source location
 */
export function mapPcToSource(
  pc: number,
  bytecode: string,
  sourceMap: string,
  sources: Record<string, SourceFile>
): SourceLocation | null {
  try {
    // Parse the source map
    const sourceMapEntries = parseSourceMap(sourceMap);
    
    // Calculate the corresponding index in the source map
    // This is a simplification - in practice, you'd need to map opcodes to PCs
    // Each bytecode instruction is 2 characters in the bytecode string
    const instructionIndex = Math.floor(pc / 2);
    
    // Get the source map entry for this instruction
    const entry = sourceMapEntries[instructionIndex];
    if (!entry || entry.fileIndex === -1) {
      return null; // No mapping available
    }
    
    // Get the source file
    const fileNames = Object.keys(sources);
    if (entry.fileIndex >= fileNames.length) {
      return null; // Invalid file index
    }
    
    const fileName = fileNames[entry.fileIndex];
    const sourceFile = sources[fileName];
    
    // Find line and column
    const { line, column } = findLineAndColumn(sourceFile.content, entry.start);
    
    // Extract the relevant snippet
    const snippet = sourceFile.content.substring(
      entry.start,
      entry.start + entry.length
    );
    
    return {
      line,
      column,
      snippet,
      fileName,
      fileContent: sourceFile.content
    };
  } catch (error) {
    console.error('Error mapping PC to source:', error);
    return null;
  }
}

/**
 * Generate a mock source map for a given Solidity contract
 * This is used for demonstration when we don't have the actual compiled output
 */
export function generateMockSourceMap(sourceCode: string): {
  sourceMap: string;
  bytecode: string;
  sources: Record<string, SourceFile>;
} {
  const lines = sourceCode.split('\n');
  const mockSourceMap: string[] = [];
  const mockBytecode = '';
  
  // Create a simple source map that maps each line to a PC
  let offset = 0;
  lines.forEach((line, index) => {
    // For each line, create a source map entry
    mockSourceMap.push(`${offset}:${line.length}:0::`);
    offset += line.length + 1; // +1 for newline
  });
  
  const sources: Record<string, SourceFile> = {
    'Contract.sol': {
      content: sourceCode,
      name: 'Contract.sol'
    }
  };
  
  return {
    sourceMap: mockSourceMap.join(';'),
    bytecode: mockBytecode,
    sources
  };
}

/**
 * Creates a debug formatter function for printing source mapping information
 */
export function createDebugFormatter(
  bytecode: string,
  sourceMap: string,
  sources: Record<string, SourceFile>
) {
  return function formatDebugLine(pc: number): string {
    const location = mapPcToSource(pc, bytecode, sourceMap, sources);
    
    if (!location) {
      return `🪛 PC=${pc} → [No source mapping available]`;
    }
    
    // Clean up the snippet (remove extra whitespace, etc.)
    const cleanSnippet = location.snippet.trim().replace(/\s+/g, ' ');
    
    return `🪛 PC=${pc} → ${location.fileName}:${location.line}: ${cleanSnippet}`;
  };
}