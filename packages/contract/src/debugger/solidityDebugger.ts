import { Buffer } from 'buffer'; // Or use Node.js 'buffer' module

import { type AbiItem, bytesToString } from 'viem';
import {
  type Abi,
  // type AbiError,
  type Address,
  bytesToHex,
  decodeAbiParameters,
  decodeErrorResult,
  type Hex,
  toHex,
} from '@tevm/utils';
import {
  createSolc,
  type SolcInputSources,
  type SolcOutput,
  type SolcSourceEntry,
} from '@tevm/solc';
import { type InterpreterStep } from '@tevm/evm';
import { type Contract } from '../Contract.js';
import { artifacts } from './fixtures.js';

// TODO: this should be exported from tevm
type AbiError = AbiItem & { type: 'error' };

// --- Types ---

interface DecodedSourceMapEntry {
  s: number; // start
  l: number; // length
  f: number; // file index
  j: string; // jump type
  m?: number; // modifier depth
}

type SourceFile = { fileName: string; content: string };
type FileIndexMap = Map<number, SourceFile>;

type SourceInfoResult = {
  fileName: string;
  lineNumber: number;
  sourceSnippet: string;
  fileContent: string;
  start: number;
  length: number;
};

interface ContractDebugInfo {
  pcToInstructionMap: Map<number, number>;
  decodedSourceMap: Array<DecodedSourceMapEntry | null>;
  fileIndexMap: FileIndexMap;
}

// --- Helper Functions ---

/**
 * Parses EVM bytecode to create a map from Program Counter (PC) to instruction index, reliably excluding the appended
 * metadata section based on its length marker.
 *
 * @param bytecode The contract DEPLOYED bytecode as a hex string.
 * @param contractName The name of the contract for logging purposes.
 * @returns A Map where keys are PCs and values are instruction indices.
 */
function parseBytecode(
  bytecode: string,
  contractName: string,
): Map<number, number> {
  const pcToInstructionIndex = new Map<number, number>();
  const hexBytecode = bytecode.startsWith('0x')
    ? bytecode.substring(2)
    : bytecode;

  if (hexBytecode.length === 0) {
    console.warn(`[${contractName}] Received empty bytecode for parsing.`);
    return pcToInstructionIndex;
  }
  // Ensure hex string length is even for valid buffer conversion
  if (hexBytecode.length % 2 !== 0) {
    console.warn(
      `[${contractName}] Received bytecode with odd length: ${hexBytecode.length}. Cannot parse.`,
    );
    return pcToInstructionIndex;
  }

  const bytecodeBytes = Buffer.from(hexBytecode, 'hex');
  const totalBufferLength = bytecodeBytes.length;

  // --- Determine Executable Code Length ---
  let executableCodeLength = totalBufferLength; // Default to full length
  if (totalBufferLength >= 2) {
    // Read the last two bytes to get the metadata length
    const metadataLengthBytes = bytecodeBytes.slice(totalBufferLength - 2);
    const metadataLength = metadataLengthBytes.readUInt16BE(0); // Read as Big Endian Uint16

    // Sanity check: metadata length shouldn't be larger than the total length minus the 2 length bytes themselves
    if (metadataLength <= totalBufferLength - 2) {
      executableCodeLength = totalBufferLength - metadataLength - 2; // Subtract metadata AND the 2 length bytes
      console.log(
        `[${contractName}] Detected metadata length: ${metadataLength} bytes. ` +
          `Parsing executable code up to PC ${executableCodeLength}.`,
      );
    } else {
      console.warn(
        `[${contractName}] Warning: Reported metadata length (${metadataLength}) seems invalid ` +
          `for total bytecode length (${totalBufferLength}). Parsing full bytecode.`,
      );
      // Keep executableCodeLength = totalBufferLength
    }
  } else {
    console.warn(
      `[${contractName}] Bytecode too short (${totalBufferLength} bytes) to contain metadata length. Parsing full bytecode.`,
    );
    // Keep executableCodeLength = totalBufferLength
  }
  // --- End Determine Executable Code Length ---

  console.log(
    `[${contractName}] Starting parse. Total length: ${totalBufferLength}, Executable length: ${executableCodeLength}`,
  );

  let currentPc = 0;
  let instructionIndex = 0;

  // Loop only through the executable part
  while (currentPc < executableCodeLength) {
    // --- Removed Metadata Start Pattern Check ---

    pcToInstructionIndex.set(currentPc, instructionIndex);

    const opcode = bytecodeBytes[currentPc];
    if (!opcode) {
      console.warn(
        `[${contractName}] PARSE WARNING: Incomplete instruction within determined executable code.`,
      );
      break;
    }

    let instructionLength = 1;
    if (opcode >= 0x60 && opcode <= 0x7f) {
      // PUSH1 to PUSH32
      const pushDataLength = opcode - 0x60 + 1;
      instructionLength += pushDataLength;
    } else if (opcode === 0xfe) {
      // INVALID opcode
      instructionLength = 1;
    } else if (opcode > 0xfd) {
      // SELFDESTRUCT (0xff) or others
      instructionLength = 1;
    }

    const nextPc = currentPc + instructionLength;

    // Check if this instruction *would* read past the end of the *executable* code
    if (nextPc > executableCodeLength) {
      console.warn(
        `[${contractName}] PARSE WARNING: Incomplete instruction within determined executable code.` +
          `\n  PC = ${currentPc}, Opcode = 0x${opcode.toString(16)}, ` +
          `Needed Length = ${instructionLength}, Executable Length = ${executableCodeLength}`,
      );
      break; // Stop parsing
    }

    currentPc = nextPc;
    instructionIndex++;
  }

  console.log(
    `[${contractName}] Parse finished. Mapped ${instructionIndex} instructions up to PC ${currentPc}.`,
  );
  return pcToInstructionIndex;
}

/**
 * Parses a Solidity compiler source map string into structured entries. Handles inheritance of missing values from the
 * previous entry.
 *
 * @param sourceMap The source map string from solc output.
 * @returns An array of decoded source map entries or null if invalid.
 */
export function parseSourceMap(
  sourceMap: string,
): Array<DecodedSourceMapEntry | null> {
  const entries: Array<DecodedSourceMapEntry | null> = [];
  let lastS = -1;
  let lastL = -1;
  let lastF = -1;
  let lastJ = '';
  let lastM: number | undefined = undefined;

  sourceMap.split(';').forEach((segment) => {
    const parts = segment.split(':');
    const sStr = parts[0] ?? '';
    const lStr = parts[1] ?? '';
    const fStr = parts[2] ?? '';
    const jStr = parts[3] ?? '';
    const mStr = parts[4] ?? '';

    // Inherit values if the current part is empty
    const s = sStr !== '' ? parseInt(sStr, 10) : lastS;
    const l = lStr !== '' ? parseInt(lStr, 10) : lastL;
    const f = fStr !== '' ? parseInt(fStr, 10) : lastF;
    const j = jStr !== '' ? jStr : lastJ;
    const m = mStr !== '' && mStr !== undefined ? parseInt(mStr, 10) : lastM;

    // Check if the essential parts (s, l, f) are valid numbers >= 0
    if (s >= 0 && l >= 0 && f >= 0 && !isNaN(s) && !isNaN(l) && !isNaN(f)) {
      const entry: DecodedSourceMapEntry = { s, l, f, j };
      if (m !== undefined && !isNaN(m)) {
        entry.m = m;
      }
      entries.push(entry);
      // Update last known values for inheritance
      lastS = s;
      lastL = l;
      lastF = f;
      lastJ = j;
      lastM = entry.m; // Update lastM only if it was present and valid
    } else {
      // If the current segment is invalid on its own, push the *inherited* state if it was valid.
      if (lastS >= 0 && lastL >= 0 && lastF >= 0) {
        const inheritedEntry: DecodedSourceMapEntry = {
          s: lastS,
          l: lastL,
          f: lastF,
          j: lastJ,
        };
        if (lastM !== undefined) {
          inheritedEntry.m = lastM;
        }
        entries.push(inheritedEntry);
      } else {
        // No valid state yet or segment is invalid without inheritance
        entries.push(null);
      }
    }
  });

  return entries;
}

/**
 * Builds a map from file index (ID) to source file details (name, content).
 *
 * @param solcInputSources Sources object from the solc input description.
 * @param solcOutputSources Sources object from the solc output.
 * @returns Map where keys are file indices and values are {fileName, content}.
 */
function buildFileIndexMap(
  solcInputSources: SolcInputSources,
  solcOutputSources: SolcOutput['sources'],
): FileIndexMap {
  const fileIndexMap = new Map<number, SourceFile>();
  const pathToId: { [filePath: string]: number } = {};

  // 1. Get the ID for each file path from the solc output sources
  for (const filePath in solcOutputSources) {
    if (solcOutputSources[filePath]?.id !== undefined) {
      pathToId[filePath] = solcOutputSources[filePath].id;
    }
  }

  // 2. Map the ID to the file content from the solc input sources
  for (const filePath in solcInputSources) {
    const id = pathToId[filePath];
    const sourceEntry = solcInputSources[filePath];

    // Ensure we have a valid ID and the input entry contains 'content'
    if (
      id !== undefined &&
      sourceEntry &&
      'content' in sourceEntry &&
      typeof sourceEntry.content === 'string'
    ) {
      fileIndexMap.set(id, {
        fileName: filePath,
        content: sourceEntry.content,
      });
    }
    // TODO: Handle 'urls' case if needed - requires async fetching logic.
    // else if (id !== undefined && sourceEntry && 'urls' in sourceEntry) {
    //   console.warn(`Source file ${filePath} (ID ${id}) uses URLs, content not available directly.`);
    //   // Potentially fetch content here if implementing URL support
    // }
  }
  return fileIndexMap;
}

/** Precomputes debugging information for a contract to speed up lookups. */
function precomputeContractDebugInfo(
  compileResult: CompileResult,
): ContractDebugInfo {
  const { bytecode, sourceMap, inputSources, outputSources, contractName } =
    compileResult;
  return {
    pcToInstructionMap: parseBytecode(bytecode, contractName),
    decodedSourceMap: parseSourceMap(sourceMap),
    fileIndexMap: buildFileIndexMap(inputSources, outputSources),
  };
}

/**
 * Maps an EVM Program Counter (PC) to a specific line in the Solidity source code.
 *
 * @param pc The program counter from the EVM step.
 * @param debugInfo Precomputed contract debug information.
 * @returns An object with file name, line number, and source snippet, or null if mapping fails.
 */
function mapPcToSourceLine(
  pc: number,
  debugInfo: ContractDebugInfo,
): SourceInfoResult | null {
  const { pcToInstructionMap, decodedSourceMap, fileIndexMap } = debugInfo;

  // 1. Find the instruction index corresponding to the PC
  const instructionIndex = pcToInstructionMap.get(pc);
  if (instructionIndex === undefined) {
    // This PC doesn't correspond to the start of a known instruction.
    // This can happen, e.g., if pc points within PUSH data.
    // For tracing, we might want the mapping for the *instruction* at this PC.
    // However, the current logic maps PC start -> index. Return null for now.
    return null;
  }

  // 2. Get the corresponding source map entry
  const sourceMapEntry = decodedSourceMap[instructionIndex];
  if (!sourceMapEntry) {
    // console.warn(`No valid source map entry for instruction index ${instructionIndex} (PC ${pc}).`);
    return null; // No source mapping for this instruction (e.g., compiler-generated code)
  }

  let { s, l, f } = sourceMapEntry;

  // 3. Find the source file using the file index
  const sourceFile = fileIndexMap.get(f);
  if (!sourceFile) {
    // console.warn(`File index ${f} not found in file map (Instruction Index: ${instructionIndex}, PC: ${pc}).`);
    return null; // File index is invalid or file content wasn't provided
  }

  const { fileName, content } = sourceFile;

  // 4. Validate source range and calculate line number
  if (s < 0 || l < 0 || s > content.length || s + l > content.length) {
    // console.warn(`Invalid source map range: start=${s}, length=${l} for file ${fileName} (PC: ${pc}). Max length: ${content.length}`);
    // Attempt to gracefully handle slightly off lengths, but invalid start is problematic.
    // If start is invalid, we cannot calculate line number correctly.
    if (s < 0 || s > content.length) return null;
    // Adjust length if it goes out of bounds, but start is okay
    const adjustedLength = Math.min(l, content.length - s);
    if (adjustedLength < 0) return null; // Should not happen if s is valid

    // Proceed with adjusted length, but maybe log a warning.
    // console.warn(`Adjusted source map length from ${l} to ${adjustedLength}`);
    l = adjustedLength; // Use adjusted length locally for snippet extraction
  }

  // Calculate line number (1-based) by counting newlines before the start offset
  const contentUpToStart = content.substring(0, s);
  const lineNumber = (contentUpToStart.match(/\n/g) || []).length + 1;

  // 5. Extract the source code snippet
  const sourceSnippet = content.substring(s, s + l); // Don't trim here, preserve original formatting

  return {
    fileName,
    lineNumber,
    sourceSnippet: sourceSnippet.trim(), // Trim for cleaner display if needed elsewhere
    fileContent: content, // Return full content for potential context display
    start: s,
    length: l,
  };
}

// --- Formatting Helpers ---

/** Formats a slice of memory for display (string or hex) */
function formatMemory(
  memory: Uint8Array,
  offset: number,
  size: number,
): string | Hex {
  if (size === 0 || !memory) return "''"; // Empty slice
  // Ensure offset and size are numbers and non-negative
  offset = Number(offset);
  size = Number(size);
  if (isNaN(offset) || isNaN(size) || offset < 0 || size < 0) {
    return `<invalid memory range: offset=${offset}, size=${size}>`;
  }
  if (offset > memory.length) {
    return `<invalid memory offset: offset=${offset}, memory size=${memory.length}>`;
  }
  // Adjust size if it extends beyond memory buffer
  const effectiveSize = Math.min(size, memory.length - offset);
  if (effectiveSize <= 0) return "''";

  const slice = memory.slice(offset, offset + effectiveSize);
  const hex = bytesToHex(slice);
  // Try decoding as UTF-8 string
  try {
    const str = bytesToString(slice);
    // Check if it's mostly printable ASCII/common characters, otherwise return hex
    // Allow newline, tab, carriage return along with printables
    // eslint-disable-next-line no-control-regex
    if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
      return JSON.stringify(str); // Use JSON.stringify to handle quotes and escapes
    }
  } catch {
    /* ignore decoding errors */
  }
  return hex; // Fallback to hex
}

// --- Main Context Function ---

/**
 * Extracts relevant context information based on the EVM opcode being executed.
 *
 * @param step The current InterpreterStep from Tevm's onStep callback.
 * @param fullTxData Optional context from the transaction/message (caller, value, data, code).
 * @param abi Optional contract ABI (specifically error definitions) for decoding reverts.
 * @returns An object containing opcode-specific context, or null if none is relevant.
 */
function getOpcodeContext(
  step: InterpreterStep,
  //   fullTxData?: { caller?: Address; value?: bigint; data?: Uint8Array; code?: Uint8Array },
  abi?: Abi,
): Record<string, Hex | string | number | Array<Hex | string | number>> {
  const context: Record<
    string,
    Hex | string | number | Array<Hex | string | number>
  > = {};
  const stack = step.stack; // Stack *before* operation
  const stackDepth = stack.length;
  //   const txData = fullTxData ?? {}; // Use provided tx data if available
  const errorsAbi = abi?.filter((item) => item.type === 'error') as
    | AbiError[]
    | undefined; // Extract error definitions

  // Helper to safely get stack items (0 = top, 1 = second, etc.)
  const getStack = (index: number): Hex => {
    const item = stack[stackDepth - 1 - index];
    if (!item) return '0x00'; // Represent empty as 0
    return toHex(item);
  };

  try {
    switch (step.opcode.name) {
      // --- Stack Ops ---
      case 'POP':
        if (stackDepth > 0) context['popped'] = getStack(0);
        break;
      case 'PUSH0': // Added in Shanghai
        context['value'] = '0x0';
        break;
      // PUSH1-PUSH32: Value pushed isn't on stack *yet*. Could parse from bytecode if needed.
      case 'DUP1':
      case 'DUP2':
      case 'DUP3':
      case 'DUP4':
      case 'DUP5':
      case 'DUP6':
      case 'DUP7':
      case 'DUP8':
      case 'DUP9':
      case 'DUP10':
      case 'DUP11':
      case 'DUP12':
      case 'DUP13':
      case 'DUP14':
      case 'DUP15':
      case 'DUP16':
        const dupN = parseInt(step.opcode.name.substring(3), 10);
        if (stackDepth >= dupN) context['value'] = getStack(dupN - 1);
        else context['error'] = `<stack underflow DUP${dupN}>`;
        break;
      case 'SWAP1':
      case 'SWAP2':
      case 'SWAP3':
      case 'SWAP4':
      case 'SWAP5':
      case 'SWAP6':
      case 'SWAP7':
      case 'SWAP8':
      case 'SWAP9':
      case 'SWAP10':
      case 'SWAP11':
      case 'SWAP12':
      case 'SWAP13':
      case 'SWAP14':
      case 'SWAP15':
      case 'SWAP16':
        const swapN = parseInt(step.opcode.name.substring(4), 10);
        if (stackDepth > swapN) {
          context['item_0'] = getStack(0); // Top item
          context[`item_${swapN}`] = getStack(swapN); // Nth item
        } else context['error'] = `<stack underflow SWAP${swapN}>`;
        break;

      // --- Arithmetic/Logic ---
      case 'ADD':
      case 'MUL':
      case 'SUB':
      case 'DIV':
      case 'SDIV':
      case 'MOD':
      case 'SMOD':
      case 'EXP':
      case 'AND':
      case 'OR':
      case 'XOR':
      case 'LT':
      case 'GT':
      case 'SLT':
      case 'SGT':
      case 'EQ':
        if (stackDepth >= 2) {
          context['a'] = getStack(0);
          context['b'] = getStack(1);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'ADDMOD':
      case 'MULMOD':
        if (stackDepth >= 3) {
          context['a'] = getStack(0);
          context['b'] = getStack(1);
          context['N'] = getStack(2);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'SIGNEXTEND':
        if (stackDepth >= 2) {
          context['byte_index'] = getStack(0); // b
          context['value'] = getStack(1); // x
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'NOT':
      case 'ISZERO':
        if (stackDepth >= 1) context['value'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'SHL':
      case 'SHR':
      case 'SAR':
        if (stackDepth >= 2) {
          context['shift_bits'] = getStack(0);
          context['value'] = getStack(1);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'BYTE':
        if (stackDepth >= 2) {
          context['byte_index'] = getStack(0); // i
          context['value'] = getStack(1); // x
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;

      // --- Memory ---
      case 'MLOAD':
        if (stackDepth >= 1) {
          const offset = Number(getStack(0));
          context['offset'] = offset;
          if (!isNaN(offset)) {
            context['value_loaded'] = formatMemory(step.memory, offset, 32);
          } else context['error'] = '<invalid offset>';
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'MSTORE':
        if (stackDepth >= 2) {
          const offset = Number(getStack(0));
          context['offset'] = offset;
          context['value_to_store'] = getStack(1);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'MSTORE8':
        if (stackDepth >= 2) {
          const offset = Number(getStack(0));
          context['offset'] = offset;
          context['value_to_store'] = getStack(1); // Note: only lowest byte is stored
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'MSIZE':
        context['current_memory_size_bytes'] = (
          step.memoryWordCount * 32n
        ).toString();
        break;

      // --- Storage ---
      case 'SLOAD':
        if (stackDepth >= 1) context['storage_key'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        // Value loaded requires stateManager access - skipping for now
        break;
      case 'SSTORE':
        if (stackDepth >= 2) {
          context['storage_key'] = getStack(0);
          context['value_to_store'] = getStack(1);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;

      // --- Control Flow ---
      case 'JUMP':
        if (stackDepth >= 1) context['destination_pc'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'JUMPI':
        if (stackDepth >= 2) {
          context['destination_pc'] = getStack(0);
          context['condition'] = getStack(1);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'PC':
        context['current_pc'] = step.pc;
        break;
      case 'JUMPDEST':
        break; // Marker, no stack effect or context needed
      case 'STOP':
        break; // Halts execution
      case 'RETURN':
      case 'REVERT':
        if (stackDepth >= 2) {
          const offset = Number(getStack(0));
          const size = Number(getStack(1));
          context['memory_offset'] = offset;
          context['memory_size'] = size;

          if (isNaN(offset) || isNaN(size) || offset < 0 || size < 0) {
            context['error'] = '<invalid offset/size>';
            break; // Don't proceed if offset/size are invalid
          }

          const returnDataHex = formatMemory(step.memory, offset, size);
          context['data'] = returnDataHex;

          // Try decoding REVERT data if it's a hex string and size > 0
          if (
            step.opcode.name === 'REVERT' &&
            typeof returnDataHex === 'string' &&
            returnDataHex.startsWith('0x') &&
            size > 0
          ) {
            const hexData = returnDataHex as Hex;

            // Handle specific known selectors first
            // Error(string) selector: 0x08c379a0
            if (hexData.startsWith('0x08c379a0') && size >= 4) {
              // Need at least 4 bytes for selector
              try {
                // Decode the string part (abi.decode(bytes, (string)))
                // The actual string data starts after the selector (4 bytes) and offset (32 bytes)
                const decoded = decodeAbiParameters(
                  [{ type: 'string' }],
                  `0x${hexData.slice(10)}`,
                ); // Viem handles offset/length decoding
                context['decoded_error'] = `REVERT ${JSON.stringify(
                  decoded[0],
                )}`;
              } catch (e: any) {
                context[
                  'decoded_error'
                ] = `<failed to decode revert string: ${e.message}>`;
              }
            }
            // Panic(uint256) selector: 0x4e487b71
            else if (hexData.startsWith('0x4e487b71') && size >= 4) {
              // Need at least 4 bytes for selector
              try {
                const decoded = decodeAbiParameters(
                  [{ type: 'uint256' }],
                  hexData,
                ); // Viem handles offset/length decoding
                context['decoded_error'] = `Panic(errorCode: ${decoded[0]})`; // Display panic code
              } catch (e: any) {
                context[
                  'decoded_error'
                ] = `<failed to decode panic code: ${e.message}>`;
              }
            }
            // Try decoding custom errors if ABI is provided and data is long enough for a selector
            else if (errorsAbi && errorsAbi.length > 0 && size >= 4) {
              try {
                const decoded = decodeErrorResult({
                  abi: errorsAbi, // Provide only error ABI fragments
                  data: hexData,
                });
                // Format the decoded error
                context['decoded_error'] = `${
                  decoded.errorName
                }(${Object.entries(decoded.args ?? {})
                  .map(
                    ([key, value]) =>
                      `${key}: ${JSON.stringify(value, (_, val) =>
                        typeof val === 'bigint' ? val.toString() : val,
                      )}`,
                  )
                  .join(', ')})`;
              } catch (e: any) {
                // If decoding fails, it might be an unknown custom error or just arbitrary data
                const selector = hexData.slice(0, 10);
                context[
                  'decoded_error'
                ] = `UnknownErrorOrData(selector=${selector}, data=${
                  hexData.slice(10) || '0x'
                })`;
                // Optionally log the decoding error: console.warn(`Failed to decode custom error ${selector}:`, e);
              }
            }
            // Fallback for data that doesn't match known patterns
            else if (size >= 4) {
              const selector = hexData.slice(0, 10);
              context[
                'decoded_error'
              ] = `UnknownErrorOrData(selector=${selector}, data=${
                hexData.slice(10) || '0x'
              })`;
            } else {
              // Data is too short for even a selector
              context['decoded_error'] = `<revert data too short: ${hexData}>`;
            }
          } else if (step.opcode.name === 'REVERT' && size === 0) {
            // Explicitly handle empty revert data
            context['decoded_error'] = '<empty revert data>';
          }
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;

      // --- Calls ---
      case 'CREATE':
        if (stackDepth >= 3) {
          context['value_wei'] = getStack(0);
          context['memory_offset'] = Number(getStack(1));
          context['memory_size'] = Number(getStack(2));
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'CREATE2':
        if (stackDepth >= 4) {
          context['value_wei'] = getStack(0);
          context['memory_offset'] = Number(getStack(1));
          context['memory_size'] = Number(getStack(2));
          context['salt'] = getStack(3);
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'CALL':
      case 'CALLCODE': // Note: Deprecated
      case 'DELEGATECALL':
      case 'STATICCALL':
        // Stack order (top first): gas, addr, value*, argsOffset, argsSize, retOffset, retSize
        // *value is only present for CALL and CALLCODE
        const hasValue =
          step.opcode.name === 'CALL' || step.opcode.name === 'CALLCODE';
        const expectedArgs = hasValue ? 7 : 6;
        if (stackDepth >= expectedArgs) {
          let stackIdx = 0;
          context['gas_limit'] = getStack(stackIdx++);
          context['target_address'] = getStack(stackIdx++);
          if (hasValue) {
            context['value_wei'] = getStack(stackIdx++);
          }
          const argsOffset = Number(getStack(stackIdx++));
          const argsSize = Number(getStack(stackIdx++));
          const retOffset = Number(getStack(stackIdx++));
          const retSize = Number(getStack(stackIdx++));

          context['call_args_offset'] = argsOffset;
          context['call_args_size'] = argsSize;
          context['return_data_offset'] = retOffset;
          context['return_data_size'] = retSize;

          if (!isNaN(argsOffset) && !isNaN(argsSize)) {
            context['call_args_data'] = formatMemory(
              step.memory,
              argsOffset,
              argsSize,
            );
          } else context['error'] = '<invalid args offset/size>';
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;

      // --- Contract Info ---
      case 'ADDRESS':
        context['this_address'] = step.address.toString();
        break;
      case 'BALANCE': // Requires stateManager
        if (stackDepth >= 1) context['address_to_check'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        context['balance'] = '<balance unavailable>';
        break;
      //   case "CALLER":
      //     context["caller_address"] = txData.caller ?? "<caller unavailable>";
      //     break;
      case 'ORIGIN':
        context['tx_origin'] = '<tx origin unavailable>';
        break; // Requires tx context
      //   case "CALLVALUE":
      //     context["call_value_wei"] = (txData.value ?? 0n).toString();
      //     break;
      //   case "CALLDATALOAD":
      //     if (stackDepth >= 1) {
      //       const offset = Number(getStack(0));
      //       context["calldata_offset"] = offset;
      //       if (!isNaN(offset) && txData.data) {
      //         const dataSlice = txData.data.slice(offset, offset + 32);
      //         // Pad to 32 bytes if needed
      //         const paddedSlice = Buffer.concat([Buffer.from(dataSlice), Buffer.alloc(32)]).slice(0, 32);
      //         context["value_loaded"] = bytesToHex(paddedSlice);
      //       } else if (!txData.data) {
      //         context["value_loaded"] = "<calldata unavailable>";
      //       } else context["error"] = "<invalid offset>";
      //     } else context["error"] = `<stack underflow ${step.opcode.name}>`;
      //     break;
      //   case "CALLDATASIZE":
      //     context["calldata_size_bytes"] = txData.data?.length ?? "<calldata unavailable>";
      //     break;
      case 'CALLDATACOPY':
        if (stackDepth >= 3) {
          context['memory_offset'] = Number(getStack(0));
          context['calldata_offset'] = Number(getStack(1));
          context['copy_length_bytes'] = Number(getStack(2));
          // Actual copy happens after this step
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      //   case "CODESIZE":
      //     context["this_codesize_bytes"] = txData.code?.length ?? "<code unavailable>";
      //     break;
      case 'CODECOPY':
        if (stackDepth >= 3) {
          context['memory_offset'] = Number(getStack(0));
          context['code_offset'] = Number(getStack(1));
          context['copy_length_bytes'] = Number(getStack(2));
          // Actual copy happens after this step
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'EXTCODESIZE': // Requires stateManager
        if (stackDepth >= 1) context['address_to_check'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        context['codesize'] = '<codesize unavailable>';
        break;
      case 'EXTCODECOPY': // Requires stateManager
        if (stackDepth >= 4) {
          context['address_to_copy'] = getStack(0);
          context['memory_offset'] = Number(getStack(1));
          context['code_offset'] = Number(getStack(2));
          context['copy_length_bytes'] = Number(getStack(3));
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'RETURNDATASIZE':
        context['last_return_data_size'] = '<returndatasize unavailable>';
        break; // Requires tracking last call result
      case 'RETURNDATACOPY': // Requires tracking last call result
        if (stackDepth >= 3) {
          context['memory_offset'] = Number(getStack(0));
          context['returndata_offset'] = Number(getStack(1));
          context['copy_length_bytes'] = Number(getStack(2));
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'EXTCODEHASH': // Requires stateManager
        if (stackDepth >= 1) context['address_to_check'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        context['codehash'] = '<codehash unavailable>';
        break;

      // --- Block Info --- (Mostly require external context)
      case 'BLOCKHASH':
        if (stackDepth >= 1) context['block_number'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        context['hash'] = '<blockhash unavailable>';
        break;
      case 'COINBASE':
        context['beneficiary'] = '<coinbase unavailable>';
        break;
      case 'TIMESTAMP':
        context['block_timestamp'] = '<timestamp unavailable>';
        break;
      case 'NUMBER':
        context['block_number'] = '<block number unavailable>';
        break;
      case 'DIFFICULTY':
      case 'PREVRANDAO':
        context['block_difficulty'] = '<difficulty unavailable>';
        break;
      case 'GASLIMIT':
        context['block_gaslimit'] = '<gas limit unavailable>';
        break;
      case 'CHAINID':
        context['chain_id'] = '<chain id unavailable>';
        break;
      case 'SELFBALANCE':
        context['this_balance'] = '<balance unavailable>';
        break; // Requires stateManager
      case 'BASEFEE':
        context['block_basefee'] = '<base fee unavailable>';
        break; // EIP-1559

      // --- Logs ---
      case 'LOG0':
      case 'LOG1':
      case 'LOG2':
      case 'LOG3':
      case 'LOG4':
        const topicCount = parseInt(step.opcode.name.substring(3), 10);
        if (stackDepth >= 2 + topicCount) {
          const offset = Number(getStack(0));
          const size = Number(getStack(1));
          context['memory_offset'] = offset;
          context['memory_size'] = size;
          if (!isNaN(offset) && !isNaN(size)) {
            context['log_data'] = formatMemory(step.memory, offset, size);
          } else context['error'] = '<invalid offset/size>';

          context['topics'] = [];
          for (let i = 0; i < topicCount; i++) {
            // Topics are stack items 2, 3, ...
            context['topics'].push(getStack(2 + i));
          }
        } else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;

      // --- System ---
      case 'GAS':
        context['gas_remaining'] = step.gasLeft.toString();
        break; // Gas *before* this instruction cost
      case 'SELFDESTRUCT':
        if (stackDepth >= 1) context['beneficiary_address'] = getStack(0);
        else context['error'] = `<stack underflow ${step.opcode.name}>`;
        break;
      case 'INVALID':
        context['error'] = 'Executed INVALID opcode';
        break;

      default:
        // Opcode not handled or has no interesting context
        return {};
    }
  } catch (error: any) {
    console.error(
      `Error getting context for ${step.opcode.name} at PC ${step.pc}:`,
      error,
    );
    context['error'] = `<internal error getting context: ${error.message}>`;
  }

  // Return context only if it contains any keys (including 'error')
  return Object.keys(context).length > 0 ? context : {};
}

export type Debugger = (step: InterpreterStep, next?: () => void) => void;

/**
 * Creates a debugger onStep function for detailed execution tracing.
 *
 * @example
 *   ```ts
 *   const debug = await solidityDebugger({ contracts: [SimpleContract] });
 *   await client.tevmContract({
 *     to: contractAddress,
 *     abi: SimpleContract.abi,
 *     functionName: "set",
 *     args: [1n],
 *     onStep: debug,
 *   });
 *   ```
 *
 * @param contracts The contracts to trace.
 * @returns An onStep function.
 */
export async function solidityDebugger({
  contracts,
}: {
  contracts: Array<Contract<string, readonly string[], Hex, Hex, Hex>>;
}): Promise<Debugger> {
  const compileResults: Record<Address, ContractDebugInfo & { abi: Abi }> =
    Object.fromEntries(
      await Promise.all(
        contracts.map(async (contract) => {
          const result = await compile({ contract });
          return [
            contract.address.toLowerCase(),
            { ...precomputeContractDebugInfo(result), abi: contract.abi },
          ];
        }),
      ),
    );

  return (step: InterpreterStep, next?: () => void) => {
    const stepAddressLower = step.address.toString().toLowerCase() as Address;
    const debugInfo = compileResults[stepAddressLower];

    let sourceInfo: SourceInfoResult | null = null;
    let opcodeContext: Record<
      string,
      Hex | string | number | Array<Hex | string | number>
    > = {};

    if (debugInfo) {
      try {
        sourceInfo = mapPcToSourceLine(step.pc, debugInfo);
      } catch (e: any) {
        console.error(
          `Source Info Error: <error mapping PC ${step.pc}: ${e.message}>`,
        );
      }
      try {
        opcodeContext = getOpcodeContext(step, debugInfo.abi);
      } catch (e: any) {
        console.error(
          `Opcode Context Error: <error getting context for PC ${step.pc}: ${e.message}>`,
        );
      }
    }

    // --- Generate Table Output ---
    const tableRows: { param: string; value: string }[] = [
      { param: 'PC', value: step.pc.toString() },
      { param: 'Opcode', value: step.opcode.name },
      { param: 'Gas', value: step.gasLeft.toString() },
    ];

    if (Object.keys(opcodeContext).length > 0) {
      for (const [key, value] of Object.entries(opcodeContext)) {
        tableRows.push({
          param: key,
          value: Array.isArray(value)
            ? value.map((v) => v.toString()).join(', ')
            : value.toString(),
        });
      }
    }

    // Calculate column widths
    const terminalWidth = process.stdout.columns || 80;
    const minParamWidth = 15; // Ensure enough space for "Context[...]"
    const maxParamNameLength = tableRows.reduce(
      (max, row) => Math.max(max, row.param.length),
      0,
    );
    const paramColWidth = Math.max(minParamWidth, maxParamNameLength);
    // Calculate value width: Terminal - paramWidth - borders/padding (│ P │ V │)
    const valueColWidth = Math.max(10, terminalWidth - paramColWidth - 5); // Ensure minimum value width

    // Helper to truncate values for the table
    function truncateValue(value: string, width: number): string {
      if (value.length <= width) return value.padEnd(width);
      return value.substring(0, width - 3) + '...';
    }

    const tableOutputLines: string[] = [];
    const topBorder = `┌─${'─'.repeat(paramColWidth)}─┬─${'─'.repeat(
      valueColWidth,
    )}─┐`;
    const separator = `├─${'─'.repeat(paramColWidth)}─┼─${'─'.repeat(
      valueColWidth,
    )}─┤`;
    const bottomBorder = `└─${'─'.repeat(paramColWidth)}─┴─${'─'.repeat(
      valueColWidth,
    )}─┘`;

    tableOutputLines.push(topBorder);
    tableRows.forEach((row, index) => {
      const paramPadded = row.param.padEnd(paramColWidth);
      const valueTruncated = truncateValue(row.value, valueColWidth);
      tableOutputLines.push(`│ ${paramPadded} │ ${valueTruncated} │`);
      if (index < tableRows.length - 1) {
        tableOutputLines.push(separator);
      }
    });
    tableOutputLines.push(bottomBorder);
    const tableString = tableOutputLines.join('\n');
    // --- End Generate Table Output ---

    // --- Generate Source Snippet ---
    let sourceSnippetString = '';
    if (sourceInfo) {
      const { fileName, lineNumber, fileContent, start, length } = sourceInfo;
      const lines = fileContent.split('\n');
      const targetLineIndex = lineNumber - 1;

      if (targetLineIndex >= 0 && targetLineIndex < lines.length) {
        const lineNumWidth = 5;
        // Use the *full* terminal width for the snippet box now
        const snippetMaxContentWidth = Math.max(
          10,
          terminalWidth - lineNumWidth - 4,
        );
        const contentUpToStart = fileContent.substring(0, start);
        const lineStartCharIndex = contentUpToStart.lastIndexOf('\n') + 1;
        const startColumn = start - lineStartCharIndex;
        const highlightLength = Math.max(1, length);
        const prevLine =
          targetLineIndex > 0 ? lines[targetLineIndex - 1] : undefined;
        const currLine = lines[targetLineIndex];
        const nextLine =
          targetLineIndex < lines.length - 1
            ? lines[targetLineIndex + 1]
            : undefined;
        const desiredWidth = Math.max(
          prevLine?.length ?? 0,
          currLine?.length ?? 0,
          nextLine?.length ?? 0,
          startColumn + highlightLength,
        );
        // Use the smaller of the desired width and the max allowed content width for the snippet
        const effectiveSnippetMaxWidth = Math.min(
          desiredWidth,
          snippetMaxContentWidth,
        );

        function truncateLine(line: string | undefined, width: number): string {
          if (line === undefined) return ''.padEnd(width);
          if (line.length <= width) return line.padEnd(width);
          return line.substring(0, width - 3) + '...';
        }

        const snippetOutputLines: string[] = [];
        snippetOutputLines.push(`→ ${fileName}:${lineNumber}`);
        snippetOutputLines.push(
          `┌─${'─'.repeat(lineNumWidth)}─┬─${'─'.repeat(
            effectiveSnippetMaxWidth,
          )}─┐`,
        );
        if (prevLine !== undefined) {
          snippetOutputLines.push(
            `│ ${`${lineNumber - 1}`.padStart(lineNumWidth)} │ ${truncateLine(
              prevLine,
              effectiveSnippetMaxWidth,
            )} │`,
          );
        }
        snippetOutputLines.push(
          `│ ${`>${lineNumber}`.padStart(lineNumWidth)} │ ${truncateLine(
            currLine,
            effectiveSnippetMaxWidth,
          )} │`,
        );
        const effectiveStartColumn = Math.min(
          startColumn,
          effectiveSnippetMaxWidth,
        );
        const highlightPadding = ' '.repeat(effectiveStartColumn);
        const availableHighlightSpace =
          effectiveSnippetMaxWidth - effectiveStartColumn;
        const actualHighlightCharsCount = Math.min(
          highlightLength,
          availableHighlightSpace,
        );
        const highlightChars =
          actualHighlightCharsCount > 0
            ? '^'.repeat(actualHighlightCharsCount)
            : '';
        const highlightLineContent = (highlightPadding + highlightChars).padEnd(
          effectiveSnippetMaxWidth,
        );
        snippetOutputLines.push(
          `│ ${' '.repeat(lineNumWidth)} │ ${highlightLineContent} │`,
        );
        if (nextLine !== undefined) {
          snippetOutputLines.push(
            `│ ${`${lineNumber + 1}`.padStart(lineNumWidth)} │ ${truncateLine(
              nextLine,
              effectiveSnippetMaxWidth,
            )} │`,
          );
        }
        snippetOutputLines.push(
          `└─${'─'.repeat(lineNumWidth)}─┴─${'─'.repeat(
            effectiveSnippetMaxWidth,
          )}─┘`,
        );
        sourceSnippetString = snippetOutputLines.join('\n');
      } else {
        sourceSnippetString = `→ ${fileName}:${lineNumber} (Error: Line number out of bounds)`;
      }
    } else {
      sourceSnippetString = `→ (No source map)`;
    }
    // --- End Generate Source Snippet ---

    // Combine snippet and table (Reordered)
    console.log(`\n${sourceSnippetString}\n${tableString}`); // Print snippet first, then table

    next?.();
  };
}

// TODO: these need to be handled better
// TODO: also need to support multi file (multi source maps)
// TODO: this would need to be done when creating the debugger, but problem is that it makes it async (need to do before the call entirely if debugger is passed)
type CompileResult = {
  sourceMap: string;
  bytecode: Hex;
  inputSources: SolcInputSources;
  outputSources: { [sourceFile: string]: SolcSourceEntry };
  abi: Abi;
  contractName: string;
};

// TODO: this should basically just be 1. retrieve sources with whatsabi 2. compile with solc
const compileCache = new Map<Hex, CompileResult>();
export const compile = async ({
  contract,
}: {
  contract: Contract<string, readonly string[], Hex, Hex, Hex>;
}): Promise<CompileResult> => {
  const cached = compileCache.get(contract.address);
  if (cached) return cached;

  // This would be done by fetching the sources with whatsabi
  const inputSources = artifacts.solcInput.sources;

  const solc = await createSolc('0.8.23');
  const output = solc.compile({
    language: 'Solidity',
    settings: {
      evmVersion: 'paris',
      outputSelection: {
        '*': {
          '*': ['evm.deployedBytecode.sourceMap'],
        },
      },
    },
    sources: inputSources,
  });

  if (output.errors?.some((e) => e.severity === 'error'))
    throw new Error(
      output.errors.find((e) => e.severity === 'error')?.formattedMessage ??
        'Unknown compilation error',
    );

  // TODO: we don't want to use contract key & name here, we want to pass all source maps with some identifier that we can use
  // to map some interpreter step to the source map, and to support multi file contracts
  const contractKey = Object.keys(output.contracts).find(
    (key) =>
      key.endsWith(`${contract.name}.s.sol`) ||
      key.endsWith(`${contract.name}.sol`),
  );
  const contractOutput = contractKey
    ? output.contracts[contractKey]?.[contract.name ?? '']
    : undefined;
  if (!contractOutput)
    throw new Error(
      `Contract ${contract.name} not found in compilation output`,
    );

  const result: CompileResult = {
    sourceMap: contractOutput.evm.deployedBytecode.sourceMap ?? '',
    bytecode: contract.deployedBytecode,
    inputSources,
    outputSources: output.sources,
    abi: contract.abi,
    contractName: contract.name ?? '',
  };

  compileCache.set(contract.address, result);
  return result;
};
