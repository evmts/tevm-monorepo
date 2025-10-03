# Shadow Compilation Implementation Guide

> **CRITICAL POINTS (Read First)**
>
> 1. **Node IDs**: NO remapping needed - `appendChild` MOVES nodes (not copies), IDs stay same, references stay valid
> 2. **Metadata Format**: Use Scribble's EXACT format - `instrToOriginalMap`, `otherInstrumentation`, `propertyMap`, etc.
>
> See [Two Critical Clarifications](#two-critical-clarifications) in Summary for details.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concept](#core-concept)
3. [The Fundamental Problem & Solution](#the-fundamental-problem--solution)
4. [Complete Implementation Flow](#complete-implementation-flow)
5. [AST Manipulation Details](#ast-manipulation-details)
6. [Validation Requirements](#validation-requirements)
7. [Advanced Features](#advanced-features)
8. [Edge Cases & Considerations](#edge-cases--considerations)
9. [Limitations & Workarounds](#limitations--workarounds)
10. [Source Code Examples](#source-code-examples)

---

## Overview

Shadow compilation allows injecting "shadow methods" into a Solidity contract for testing and debugging purposes without modifying the original source code. Shadow methods can:

- Access private/internal functions
- Access state variables
- Add debug helpers
- Inject pre/post condition checks
- Add instrumentation code

**Key Principle**: All shadow code is for **development/testing only** and should never be deployed to production.

---

## Core Concept

### What Are Shadow Methods?

Shadow methods are additional functions, state variables, types, events, or errors that are injected into a compiled contract for testing purposes.

**Example:**

```solidity
// Original Contract
contract MyContract {
    uint256 private balance;

    function transfer(address to, uint256 amount) internal {
        balance -= amount;
    }
}

// Shadow Methods (injected)
function debugBalance() public view returns (uint256) {
    return balance;  // Access private state
}

function debugTransfer(address to, uint256 amount) public {
    transfer(to, amount);  // Call internal function
}
```

### Why AST-Level Injection?

**Options Considered:**
1. **Source-level injection**: Simple string manipulation
2. **AST-level injection**: Type-safe, validated by compiler
3. **Bytecode manipulation**: Too low-level, fragile

**Chosen Approach**: AST-level injection using `solc-typed-ast` library

**Rationale:**
- ✅ Type-safe manipulation
- ✅ Compiler validates everything
- ✅ Supports complex transformations (wrappers, pre/post)
- ✅ Access to full semantic information
- ✅ Can regenerate clean Solidity source

---

## The Fundamental Problem & Solution

### The Problem: Shadow References Undefined Identifiers

**Initial naive approach (DOESN'T WORK):**

```javascript
// ❌ WRONG: Compile shadow in isolation
const shadowSource = `
contract __TevmShadow__ {
  function debugBalance() public view returns (uint256) {
    return balance;  // ← ERROR: Undeclared identifier "balance"
  }
}
`

const shadowAst = await compileSource({
  sources: { '__TevmShadow__.sol': { content: shadowSource } }
})
// Compilation FAILS - can't get AST
```

**Why it fails:**
- `balance` doesn't exist in `__TevmShadow__`
- Solc's semantic analysis phase fails
- No AST is generated for invalid code
- Can't extract nodes from non-existent AST

### The Solution: Compile Together with Inheritance

**✅ CORRECT: Compile shadow with target in single compilation**

```javascript
const sources = {
  'Target.sol': {
    content: await fs.readFile(targetPath, 'utf-8')
  },
  'Shadow.sol': {
    content: `
      import "./Target.sol";

      contract __TevmShadow__ is MyContract {
        function debugBalance() public view returns (uint256) {
          return balance;  // ✅ Inherited from MyContract
        }
      }
    `
  }
}

// Single compilation = single ASTContext = consistent node IDs
const result = await compileSource({
  sources,
  compilationOutput: ['ast']
})
```

**Why this works:**
1. **Single compilation** = single `ASTContext`
2. All node IDs assigned uniquely within this context
3. `MyContract.balance` gets ID (e.g., `50`)
4. Shadow inherits from `MyContract` → sees `balance`
5. `Identifier` node for `balance` has `referencedDeclaration: 50`
6. When we move shadow methods to `MyContract`, references stay valid
7. No manual ID remapping needed!

**Evidence:**
- From Solidity issue #11907: "AST IDs get assigned uniquely for the whole compilation run"
- solc-typed-ast docs: "astDereferencer works across multiple source files" (requires entire compilation output)

---

## Complete Implementation Flow

### Phase 1: Preparation & Validation

```javascript
/**
 * Validates shadow compilation options
 * @returns {ValidatedShadowOptions}
 */
export const validateShadowOptions = (options, sourceLanguage, logger) => {
  // 1. If source is AST, we need both path and name
  if (sourceLanguage === 'SolidityAST') {
    if (!options.injectIntoContractPath || !options.injectIntoContractName) {
      throw new ShadowValidationError(
        'Both injectIntoContractPath and injectIntoContractName required for AST source',
        {
          meta: {
            code: 'missing_inject_options',
            providedPath: options.injectIntoContractPath,
            providedName: options.injectIntoContractName,
          },
        }
      )
    }
  } else {
    // For Solidity source, warn if incomplete
    if (!options.injectIntoContractName) {
      logger.warn(
        'No injectIntoContractName provided; if source has exactly one contract, this is safe'
      )
    }
  }

  return {
    sourceLanguage,
    shadowLanguage: options.shadowLanguage ?? defaults.language,
    injectIntoContractPath: options.injectIntoContractPath ?? defaults.anonymousSourcePath,
    injectIntoContractName: options.injectIntoContractName,
  }
}
```

### Phase 2: Create Shadow Source with Inheritance

```javascript
/**
 * Creates shadow contract source that inherits from target
 */
const createShadowSource = (targetContractName, shadowMethods, shadowLanguage) => {
  if (shadowLanguage === 'SolidityAST') {
    throw new Error('Shadow language cannot be AST - must be Solidity or Yul')
  }

  return `
// GENERATED: Shadow contract for testing
import "./Target.sol";

contract __TevmShadow__ is ${targetContractName} {
  ${shadowMethods}
}
`
}
```

### Phase 3: Compile Target + Shadow Together

```javascript
/**
 * Compiles source and shadow together in single compilation
 */
const compileWithShadow = async (
  sourcePath,
  sourceContent,
  shadowMethods,
  targetContractName,
  options,
  logger
) => {
  const shadowSource = createShadowSource(
    targetContractName,
    shadowMethods,
    options.shadowLanguage
  )

  // Single compilation with both contracts
  const sources = {
    [sourcePath]: { content: sourceContent },
    '__TevmShadow__.sol': { content: shadowSource },
  }

  logger.debug('Compiling source with shadow contract')
  logger.debug('Shadow source:', shadowSource)

  const compilationResult = await compileSource({
    sources,
    compilationOutput: ['ast'],
    hardfork: options.hardfork,
    optimizer: options.optimizer,
    viaIR: options.viaIR,
    debug: options.debug,
    metadata: options.metadata,
    remappings: options.remappings,
    libraries: options.libraries,
    language: options.language,
    solcVersion: options.solcVersion,
  })

  return compilationResult
}
```

### Phase 4: Parse AST and Extract Contracts

```javascript
import { ASTReader, ASTKind } from 'solc-typed-ast'

/**
 * Parses compilation output into typed AST
 */
const parseAST = (compilationOutput, sources) => {
  const reader = new ASTReader()
  const sourceUnits = reader.read(compilationOutput, ASTKind.Any, sources)
  return sourceUnits
}

/**
 * Finds target and shadow contracts in AST
 */
const findContracts = (sourceUnits, targetContractName) => {
  const contracts = sourceUnits.flatMap(su => su.vContracts)

  const targetContract = contracts.find(c => c.name === targetContractName)
  if (!targetContract) {
    throw new CompilerOutputError(
      `Target contract '${targetContractName}' not found in compilation output`,
      {
        meta: {
          code: 'contract_output_not_found',
          availableSources: contracts.map(c => c.name),
        },
      }
    )
  }

  const shadowContract = contracts.find(c => c.name === '__TevmShadow__')
  if (!shadowContract) {
    throw new CompilerOutputError(
      'Shadow contract __TevmShadow__ not found in compilation output',
      {
        meta: { code: 'contract_output_not_found' },
      }
    )
  }

  return { targetContract, shadowContract }
}
```

### Phase 5: Extract Shadow Elements and Inject into Target

```javascript
/**
 * Extracts all injectable elements from shadow contract
 */
const extractShadowElements = (shadowContract, logger) => {
  const elements = {
    structs: shadowContract.vStructs.filter(s => !isInherited(s, shadowContract)),
    enums: shadowContract.vEnums.filter(e => !isInherited(e, shadowContract)),
    events: shadowContract.vEvents.filter(e => !isInherited(e, shadowContract)),
    errors: shadowContract.vErrors.filter(e => !isInherited(e, shadowContract)),
    stateVariables: shadowContract.vStateVariables.filter(v => !isInherited(v, shadowContract)),
    functions: shadowContract.vFunctions.filter(f => !isInherited(f, shadowContract)),
    modifiers: shadowContract.vModifiers.filter(m => !isInherited(m, shadowContract)),
    usingForDirectives: shadowContract.vUsingForDirectives.filter(
      u => !isInherited(u, shadowContract)
    ),
  }

  logger.debug('Extracted shadow elements:', {
    structs: elements.structs.length,
    enums: elements.enums.length,
    events: elements.events.length,
    errors: elements.errors.length,
    stateVariables: elements.stateVariables.length,
    functions: elements.functions.length,
    modifiers: elements.modifiers.length,
    usingForDirectives: elements.usingForDirectives.length,
  })

  return elements
}

// TODO: need to copy using for directives into the target contract and conversely

/**
 * Helper to check if element is inherited (not declared in shadow)
 */
const isInherited = (element, shadowContract) => {
  // Check if element's scope is the shadow contract
  return element.vScope?.id !== shadowContract.id
}

/**
 * Injects shadow elements into target contract
 * Order matters: types → state → functions
 */
const injectShadowElements = (targetContract, elements, logger) => {
  let injectedCount = 0

  // 1. Inject types first (functions may reference them)
  for (const struct of elements.structs) {
    targetContract.appendChild(struct)
    injectedCount++
    logger.debug(`Injected struct: ${struct.name}`)
  }

  for (const enumDef of elements.enums) {
    targetContract.appendChild(enumDef)
    injectedCount++
    logger.debug(`Injected enum: ${enumDef.name}`)
  }

  // 2. Inject events and errors (functions may emit/revert with them)
  for (const event of elements.events) {
    targetContract.appendChild(event)
    injectedCount++
    logger.debug(`Injected event: ${event.name}`)
  }

  for (const error of elements.errors) {
    targetContract.appendChild(error)
    injectedCount++
    logger.debug(`Injected error: ${error.name}`)
  }

  // 3. Inject state variables (functions may reference them)
  for (const stateVar of elements.stateVariables) {
    targetContract.appendChild(stateVar)
    injectedCount++
    logger.debug(`Injected state variable: ${stateVar.name}`)
  }

  // 4. Inject using-for directives
  for (const usingFor of elements.usingForDirectives) {
    targetContract.appendChild(usingFor)
    injectedCount++
    logger.debug('Injected using-for directive')
  }

  // 5. Inject modifiers (functions may use them)
  for (const modifier of elements.modifiers) {
    targetContract.appendChild(modifier)
    injectedCount++
    logger.debug(`Injected modifier: ${modifier.name}`)
  }

  // 6. Inject functions last
  for (const func of elements.functions) {
    targetContract.appendChild(func)
    injectedCount++
    logger.debug(`Injected function: ${func.name}`)
  }

  logger.info(`Injected ${injectedCount} shadow elements into ${targetContract.name}`)

  return injectedCount
}
```

### Phase 6: Remove Shadow Contract from AST

```javascript
/**
 * Removes shadow contract from source unit
 */
const removeShadowContract = (shadowContract, logger) => {
  const sourceUnit = shadowContract.vScope
  if (!sourceUnit) {
    logger.warn('Shadow contract has no parent SourceUnit, cannot remove')
    return
  }

  sourceUnit.removeChild(shadowContract)
  logger.debug('Removed shadow contract from AST')
}
```

### Phase 7: Generate Source from Modified AST

```javascript
import { ASTWriter, DefaultASTWriterMapping, PrettyFormatter } from 'solc-typed-ast'

/**
 * Generates Solidity source from modified AST
 */
const generateSourceFromAST = (sourceUnit, compilerVersion, logger) => {
  const formatter = new PrettyFormatter(4, 0)
  const writer = new ASTWriter(
    DefaultASTWriterMapping,
    formatter,
    compilerVersion
  )

  const generatedSource = writer.write(sourceUnit)

  logger.debug('Generated source from AST')
  logger.debug('Generated source preview:', generatedSource.slice(0, 500))

  return generatedSource
}
```

### Phase 8: Final Compilation with Instrumentation Metadata

```javascript
/**
 * Final compilation of instrumented source
 */
const compileFinal = async (
  instrumentedSource,
  originalPath,
  options,
  logger
) => {
  const sources = {
    [originalPath]: { content: instrumentedSource },
  }

  logger.debug('Performing final compilation of instrumented source')

  const finalResult = await compileSource({
    sources,
    compilationOutput: options.compilationOutput,
    hardfork: options.hardfork,
    optimizer: options.optimizer,
    viaIR: options.viaIR,
    debug: options.debug,
    metadata: options.metadata,
    remappings: options.remappings,
    libraries: options.libraries,
    language: options.language,
    solcVersion: options.solcVersion,
  })

  return finalResult
}
```

### Phase 9: Create Source Mapping Translation (Scribble Format)

**IMPORTANT: Use Scribble's exact metadata format for compatibility**

Reference: https://docs.scribble.codes/tool/json-output-specification

```typescript
/**
 * Scribble-compatible instrumentation metadata type definitions
 * EXACT format from Scribble specification
 */
interface InstrumentationMetadata {
  /**
   * Maps instrumented source ranges to original source ranges
   * Format: [[instrSourceRange, origSourceRange], ...]
   * Source range format: "startIndex:length:fileIndex"
   */
  instrToOriginalMap: Array<[string, string]>

  /**
   * Source ranges of additional instrumented code that doesn't
   * correspond to original code (pure additions like shadow methods)
   */
  otherInstrumentation: string[]

  /**
   * Information about each injected element (shadow method, etc.)
   */
  propertyMap: PropertyMapEntry[]

  /**
   * List of original source file names
   */
  originalSourceList: string[]

  /**
   * List of instrumented source file names
   */
  instrSourceList: string[]
}

interface PropertyMapEntry {
  /**
   * Unique ID for this property/element
   */
  id: number

  /**
   * Contract name where element was injected
   */
  contract: string

  /**
   * Original filename
   */
  filename: string

  /**
   * Source range of the property/annotation in original
   * (null for shadow methods that don't exist in original)
   */
  propertySource: string | null

  /**
   * Source of the annotation/shadow method definition
   */
  annotationSource: string

  /**
   * Type of target (e.g., "function", "contract")
   */
  target: string

  /**
   * Name of the target element
   */
  targetName: string

  /**
   * Debug event signature if applicable
   */
  debugEventSignature?: string

  /**
   * Human-readable message
   */
  message: string

  /**
   * Source ranges of instrumentation fragments for this property
   */
  instrumentationRanges: string[]

  /**
   * Source ranges of check/assertion code for this property
   */
  checkRanges: string[]
}
```

```javascript
/**
 * Creates Scribble-compatible instrumentation metadata
 *
 * @param {string} originalPath - Original source file path
 * @param {string} originalSource - Original source code
 * @param {string} instrumentedSource - Instrumented source code
 * @param {ShadowElements} injectedElements - Injected shadow elements
 * @param {string} targetContractName - Target contract name
 * @returns {InstrumentationMetadata}
 */
const createInstrumentationMetadata = (
  originalPath,
  originalSource,
  instrumentedSource,
  injectedElements,
  targetContractName
) => {
  const instrToOriginalMap = []
  const otherInstrumentation = []
  const propertyMap = []

  // Find injection points for each element type
  const injectedRanges = findInjectedElementRanges(
    instrumentedSource,
    injectedElements,
    targetContractName
  )

  let propertyId = 0

  // Create property map entries for each injected function
  for (const func of injectedElements.functions) {
    const range = injectedRanges.functions[func.name]
    if (!range) continue

    const sourceRange = formatSourceRange(range.start, range.length, 0)

    // Shadow methods are pure additions - no original source
    otherInstrumentation.push(sourceRange)

    propertyMap.push({
      id: propertyId++,
      contract: targetContractName,
      filename: originalPath,
      propertySource: null,  // No original source for shadow methods
      annotationSource: `shadow method: ${func.name}`,
      target: 'function',
      targetName: func.name,
      message: `Shadow method '${func.name}' injected for testing`,
      instrumentationRanges: [sourceRange],
      checkRanges: [],  // No checks for basic shadow methods
    })
  }

  // Add entries for other element types (events, errors, etc.)
  for (const event of injectedElements.events) {
    const range = injectedRanges.events[event.name]
    if (!range) continue

    const sourceRange = formatSourceRange(range.start, range.length, 0)
    otherInstrumentation.push(sourceRange)

    propertyMap.push({
      id: propertyId++,
      contract: targetContractName,
      filename: originalPath,
      propertySource: null,
      annotationSource: `shadow event: ${event.name}`,
      target: 'event',
      targetName: event.name,
      debugEventSignature: getEventSignature(event),
      message: `Shadow event '${event.name}' injected`,
      instrumentationRanges: [sourceRange],
      checkRanges: [],
    })
  }

  // Map unchanged parts: instrumented → original (1:1 before injection)
  const { unchangedRanges, shiftAmount } = calculateUnchangedRanges(
    originalSource,
    instrumentedSource,
    injectedRanges
  )

  for (const [instrRange, origRange] of unchangedRanges) {
    instrToOriginalMap.push([
      formatSourceRange(instrRange.start, instrRange.length, 0),
      formatSourceRange(origRange.start, origRange.length, 0),
    ])
  }

  return {
    instrToOriginalMap,
    otherInstrumentation,
    propertyMap,
    originalSourceList: [originalPath],
    instrSourceList: [originalPath],  // Same path, different content
  }
}

/**
 * Formats source range in Scribble format: "start:length:fileIndex"
 */
const formatSourceRange = (start, length, fileIndex) => {
  return `${start}:${length}:${fileIndex}`
}

/**
 * Parses source range from "start:length:fileIndex" format
 */
const parseSourceRange = (sourceRange) => {
  const [start, length, fileIndex] = sourceRange.split(':').map(Number)
  return { start, length, fileIndex }
}

/**
 * Finds source ranges of all injected elements in instrumented source
 */
const findInjectedElementRanges = (instrumentedSource, injectedElements, contractName) => {
  const ranges = {
    functions: {},
    events: {},
    errors: {},
    structs: {},
    enums: {},
    stateVariables: {},
    modifiers: {},
  }

  // Use AST source locations from the instrumented compilation
  // Each node has a `src` field with "start:length:fileIndex" format

  for (const func of injectedElements.functions) {
    if (func.src) {
      const { start, length } = parseSourceRange(func.src)
      ranges.functions[func.name] = { start, length }
    }
  }

  for (const event of injectedElements.events) {
    if (event.src) {
      const { start, length } = parseSourceRange(event.src)
      ranges.events[event.name] = { start, length }
    }
  }

  // ... same for other element types

  return ranges
}

/**
 * Calculates ranges that are unchanged between original and instrumented
 */
const calculateUnchangedRanges = (originalSource, instrumentedSource, injectedRanges) => {
  // Simple implementation: assume injection happens at contract body
  // More sophisticated: use diff algorithm

  const unchangedRanges = []
  let originalOffset = 0
  let instrumentedOffset = 0

  // Everything before first injection is 1:1 mapped
  const allInjectedStarts = Object.values(injectedRanges)
    .flatMap(category => Object.values(category))
    .map(range => range.start)
    .sort((a, b) => a - b)

  const firstInjectionStart = allInjectedStarts[0] || instrumentedSource.length

  if (firstInjectionStart > 0) {
    unchangedRanges.push([
      { start: 0, length: firstInjectionStart },
      { start: 0, length: Math.min(firstInjectionStart, originalSource.length) },
    ])
  }

  // Calculate total shift amount (how many chars were added)
  const totalInjectedLength = Object.values(injectedRanges)
    .flatMap(category => Object.values(category))
    .reduce((sum, range) => sum + range.length, 0)

  return {
    unchangedRanges,
    shiftAmount: totalInjectedLength,
  }
}

/**
 * Gets event signature for debug events (Scribble format)
 */
const getEventSignature = (event) => {
  const params = event.vParameters.vParameters
    .map(p => p.typeString)
    .join(',')
  return `${event.name}(${params})`
}
```

### Complete Flow

```javascript
/**
 * Main entry point for shadow compilation
 */
export const compileSourceWithShadow = async (options, logger) => {
  // Phase 1: Validate
  const validated = validateShadowOptions(
    options,
    options.language,
    logger
  )

  // Phase 2: Compile source to determine target
  const sourceResult = await compileSource({
    filePaths: options.filePaths,
    sources: options.sources,
    compilationOutput: ['ast'],
    // ... other options
  })

  const sourceAST = parseAST(sourceResult.output, options.sources)

  // Determine target contract name if not provided
  const targetContractName = validated.injectIntoContractName ??
    determineSingleContract(sourceAST)

  // Phase 3: Create shadow source
  const shadowSource = createShadowSource(
    targetContractName,
    options.shadowMethods,
    validated.shadowLanguage
  )

  // Phase 4: Compile together
  const jointResult = await compileWithShadow(
    validated.injectIntoContractPath,
    await readSource(options),
    options.shadowMethods,
    targetContractName,
    options,
    logger
  )

  // Phase 5: Parse and extract
  const jointAST = parseAST(jointResult.output, {
    ...options.sources,
    '__TevmShadow__.sol': { content: shadowSource },
  })

  const { targetContract, shadowContract } = findContracts(
    jointAST,
    targetContractName
  )

  // Phase 6: Extract shadow elements
  const shadowElements = extractShadowElements(shadowContract, logger)

  // Phase 7: Validate before injection
  validateShadowElements(shadowElements, targetContract, logger)

  // Phase 8: Inject
  const injectedCount = injectShadowElements(
    targetContract,
    shadowElements,
    logger
  )

  // Phase 9: Remove shadow contract
  removeShadowContract(shadowContract, logger)

  // Phase 10: Generate source
  const instrumentedSource = generateSourceFromAST(
    targetContract.vScope,
    jointResult.compilerVersion,
    logger
  )

  // Phase 11: Create instrumentation metadata
  const metadata = createInstrumentationMetadata(
    await readSource(options),
    instrumentedSource,
    shadowElements,
    targetContractName
  )

  // Phase 12: Final compilation
  const finalResult = await compileFinal(
    instrumentedSource,
    validated.injectIntoContractPath,
    options,
    logger
  )

  // Return with metadata
  return {
    ...finalResult,
    instrumentationMetadata: metadata,
  }
}
```

---

## CRITICAL: Node ID Consistency & Reference Integrity

### The ID Question: Do IDs Need Remapping?

**Answer: NO - IDs stay the same because we're MOVING nodes, not COPYING them.**

### Why IDs Don't Change

When we compile target + shadow together:

```javascript
const sources = {
  'Target.sol': { content: targetSource },
  'Shadow.sol': { content: shadowSource }
}

const result = await compileSource({ sources, compilationOutput: ['ast'] })
```

**What happens:**
1. **Single compilation** = **Single ASTContext**
2. All nodes assigned unique IDs within this context
3. Example IDs assigned:
   - `MyContract` (ContractDefinition) → ID `10`
   - `MyContract.balance` (VariableDeclaration) → ID `50`
   - `MyContract.transfer` (FunctionDefinition) → ID `60`
   - `__TevmShadow__` (ContractDefinition) → ID `100`
   - `__TevmShadow__.debugBalance` (FunctionDefinition) → ID `150`
   - Inside `debugBalance`, `Identifier` for `balance` → `referencedDeclaration: 50`

### When We Move Nodes

```javascript
// Extract shadow function
const debugBalance = shadowContract.vFunctions.find(f => f.name === 'debugBalance')

// Move to target (appendChild MOVES, doesn't COPY)
targetContract.appendChild(debugBalance)
```

**What appendChild does:**
1. Removes `debugBalance` from `shadowContract.children`
2. Adds `debugBalance` to `targetContract.children`
3. Updates `debugBalance.parent = targetContract`
4. **Does NOT change any IDs**
5. **Does NOT change any referencedDeclaration values**

**Result:**
- `debugBalance` is now ID `150` (unchanged)
- Its `Identifier` for `balance` still has `referencedDeclaration: 50` (unchanged)
- `MyContract.balance` is still ID `50` (unchanged)
- ✅ **Reference is still valid!**

### Evidence from solc-typed-ast

From `bundler-packages/compiler/node_modules/solc-typed-ast/dist/ast/ast_node.d.ts`:

```typescript
class ASTNodeWithChildren<T extends ASTNode> extends ASTNode {
  appendChild(node: T): T {
    this.ownChildren.push(node);
    node.parent = this;  // ← Only changes parent pointer
    return node;
  }
}
```

**Key insight**: `appendChild` only modifies the tree structure, not node contents or IDs.

### CRITICAL: Must Move ALL Referenced Declarations

**Problem scenario:**

```solidity
contract MyContract {
  uint256 public balance;  // ID 50
}

contract __TevmShadow__ is MyContract {
  struct DebugInfo {      // ID 110 - declared in SHADOW
    uint256 value;
    address user;
  }

  function debugBalance() public view returns (DebugInfo memory) {
    return DebugInfo(balance, msg.sender);  // References ID 110 & ID 50
  }
}
```

If we only move `debugBalance`:
- ❌ `Identifier` references `DebugInfo` with ID `110`
- ❌ ID `110` is in `__TevmShadow__`, not `MyContract`
- ❌ Reference broken!

**Solution: Move ALL referenced declarations**

```javascript
const extractShadowElements = (shadowContract) => {
  return {
    structs: shadowContract.vStructs.filter(s => !isInherited(s, shadowContract)),
    enums: shadowContract.vEnums.filter(e => !isInherited(e, shadowContract)),
    events: shadowContract.vEvents.filter(e => !isInherited(e, shadowContract)),
    errors: shadowContract.vErrors.filter(e => !isInherited(e, shadowContract)),
    stateVariables: shadowContract.vStateVariables.filter(v => !isInherited(v, shadowContract)),
    modifiers: shadowContract.vModifiers.filter(m => !isInherited(m, shadowContract)),
    usingForDirectives: shadowContract.vUsingForDirectives.filter(u => !isInherited(u, shadowContract)),
    functions: shadowContract.vFunctions.filter(f => !isInherited(f, shadowContract)),
  }
}
```

**Key:** `!isInherited` ensures we only extract declarations that were **defined in shadow**, not inherited from target.

### Reference Tracking (Advanced)

For complete safety, track all referenced IDs:

```javascript
/**
 * Finds all referenced declaration IDs in an AST subtree
 */
const findReferencedIds = (node, visited = new Set()) => {
  if (visited.has(node.id)) return visited
  visited.add(node.id)

  // Check if this node references another declaration
  if (node instanceof Identifier && node.referencedDeclaration !== undefined) {
    visited.add(node.referencedDeclaration)
  }

  // Recursively check children
  for (const child of node.children) {
    findReferencedIds(child, visited)
  }

  return visited
}

/**
 * Validates that all references can be resolved after injection
 */
const validateReferences = (shadowElements, targetContract, shadowContract, logger) => {
  const allShadowElementIds = new Set([
    ...shadowElements.structs.map(s => s.id),
    ...shadowElements.enums.map(e => e.id),
    ...shadowElements.events.map(e => e.id),
    ...shadowElements.errors.map(e => e.id),
    ...shadowElements.stateVariables.map(v => v.id),
    ...shadowElements.modifiers.map(m => m.id),
    ...shadowElements.functions.map(f => f.id),
  ])

  const targetElementIds = new Set([
    ...targetContract.vStructs.map(s => s.id),
    ...targetContract.vEnums.map(e => e.id),
    ...targetContract.vEvents.map(e => e.id),
    ...targetContract.vErrors.map(e => e.id),
    ...targetContract.vStateVariables.map(v => v.id),
    ...targetContract.vModifiers.map(m => m.id),
    ...targetContract.vFunctions.map(f => f.id),
  ])

  // Check each shadow function for unresolved references
  for (const func of shadowElements.functions) {
    const referencedIds = findReferencedIds(func)

    for (const refId of referencedIds) {
      const canResolve =
        allShadowElementIds.has(refId) ||  // Being injected
        targetElementIds.has(refId) ||      // Already in target
        refId === func.id                   // Self-reference

      if (!canResolve) {
        const node = shadowContract.context?.locate(refId)
        logger.warn(
          `Function '${func.name}' references declaration ID ${refId}` +
          (node ? ` (${node.type}: ${node.name || 'unnamed'})` : '') +
          ` which won't be available in target contract`
        )
      }
    }
  }
}
```

### Summary: ID Consistency

| Operation | Effect on IDs | Why |
|-----------|---------------|-----|
| `compileSource(sources)` | Assigns unique IDs | Single ASTContext for entire compilation |
| `targetContract.appendChild(shadowFunc)` | **No change** | Moves node, doesn't copy |
| `shadowFunc.id` | **Stays same** | Node identity unchanged |
| `Identifier.referencedDeclaration` | **Stays same** | Value not modified |
| Move ALL shadow declarations | **All IDs valid** | References resolve within target+shadow set |

**No ID remapping needed!**

---

## AST Manipulation Details

### Node Structure Reference

From `solc-typed-ast` type definitions:

```typescript
// ContractDefinition can contain:
class ContractDefinition extends ASTNodeWithChildren<ASTNode> {
  name: string
  kind: ContractKind  // contract | library | interface

  // Getters for typed children
  get vStructs(): readonly StructDefinition[]
  get vEnums(): readonly EnumDefinition[]
  get vEvents(): readonly EventDefinition[]
  get vErrors(): readonly ErrorDefinition[]
  get vStateVariables(): readonly VariableDeclaration[]
  get vFunctions(): readonly FunctionDefinition[]
  get vModifiers(): readonly ModifierDefinition[]
  get vUsingForDirectives(): readonly UsingForDirective[]

  // Inherited from ASTNodeWithChildren
  appendChild(node: ASTNode): ASTNode
  insertBefore(node: ASTNode, ref: ASTNode): ASTNode
  removeChild(node: ASTNode): ASTNode
}

// FunctionDefinition
class FunctionDefinition extends ASTNode {
  kind: FunctionKind  // function | constructor | receive | fallback | freeFunction
  name: string
  visibility: FunctionVisibility  // external | public | internal | private
  stateMutability: FunctionStateMutability  // pure | view | payable | nonpayable
  virtual: boolean
  vModifiers: ModifierInvocation[]
  vBody?: Block  // undefined for interface functions
  vOverrideSpecifier?: OverrideSpecifier
}

// VariableDeclaration (for state variables)
class VariableDeclaration extends ASTNode {
  name: string
  stateVariable: boolean  // true for state variables
  visibility: StateVariableVisibility  // public | internal | private
  mutability: Mutability  // mutable | immutable | constant
}

// Identifier (references to other declarations)
class Identifier extends Expression {
  name: string
  referencedDeclaration: number  // ID of referenced node
  get vReferencedDeclaration(): ASTNode | undefined
}
```

### ASTContext and ID Management

```typescript
class ASTContext {
  id: number  // Context ID
  map: Map<number, ASTNode>  // ID → Node registry

  get lastId(): number  // Highest assigned ID

  register(...nodes: ASTNode[]): void
  unregister(...nodes: ASTNode[]): void
  locate(id: number): ASTNode  // Returns node or throws
  require(id: number): ASTNode  // Alias for locate
}

class ASTNodeFactory {
  context: ASTContext
  private lastId: number

  // Create nodes (auto-assigns IDs)
  makeFunctionDefinition(...args): FunctionDefinition
  makeVariableDeclaration(...args): VariableDeclaration
  // ... all other node types

  // Copy nodes WITH ID remapping
  copy<T extends ASTNode>(node: T, remappings?: IDMap): T
  copyWithMapping<T extends ASTNode>(node: T, remappings?: IDMap): [T, IDMap]
}
```

**Key Insight**:
- IDs are assigned during compilation
- Within single compilation, IDs are consistent
- `ASTNodeFactory.copy()` creates new IDs for copied tree
- But we don't need to copy - we're moving nodes within same AST!

### Block Manipulation for Pre/Post Injection

```typescript
class Block extends StatementWithChildren<Statement> {
  get vStatements(): Array<Statement | StatementWithChildren<ASTNode>>

  // Inherited methods
  appendChild(stmt: Statement): Statement
  insertBefore(stmt: Statement, ref: Statement): Statement
  insertAfter(stmt: Statement, ref: Statement): Statement
  insertAtBeginning(stmt: Statement): Statement
}

class Return extends Statement {
  functionReturnParameters: number
  vExpression?: Expression
}
```

**Example: Inject code before return:**

```javascript
const injectBeforeReturns = (functionDef, preReturnCode, factory) => {
  const body = functionDef.vBody
  if (!body) return  // Interface function

  const returnStatements = body.vStatements.filter(
    stmt => stmt instanceof Return
  )

  for (const returnStmt of returnStatements) {
    const preReturnStatement = factory.makeExpressionStatement(
      // Parse preReturnCode into Expression
      parseExpression(preReturnCode)
    )
    body.insertBefore(preReturnStatement, returnStmt)
  }
}
```

---

## Validation Requirements

### 1. Special Function Validation

```javascript
/**
 * Validates that shadow doesn't inject duplicate special functions
 */
const validateSpecialFunctions = (shadowElements, targetContract, logger) => {
  const { Constructor, Receive, Fallback } = FunctionKind

  for (const func of shadowElements.functions) {
    switch (func.kind) {
      case Constructor:
        if (targetContract.vConstructor) {
          throw new ShadowValidationError(
            'Cannot inject constructor - target already has one',
            {
              meta: {
                code: 'duplicate_special_function',
                functionKind: 'constructor',
                targetContract: targetContract.name,
              },
            }
          )
        }
        break

      case Receive:
        const existingReceive = targetContract.vFunctions.find(
          f => f.kind === Receive
        )
        if (existingReceive) {
          throw new ShadowValidationError(
            'Cannot inject receive - target already has one',
            { meta: { code: 'duplicate_special_function', functionKind: 'receive' } }
          )
        }
        break

      case Fallback:
        const existingFallback = targetContract.vFunctions.find(
          f => f.kind === Fallback
        )
        if (existingFallback) {
          throw new ShadowValidationError(
            'Cannot inject fallback - target already has one',
            { meta: { code: 'duplicate_special_function', functionKind: 'fallback' } }
          )
        }
        break
    }
  }
}
```

### 2. Library Contract Restrictions

```javascript
/**
 * Validates library-specific restrictions
 */
const validateLibraryRestrictions = (shadowElements, targetContract, logger) => {
  if (targetContract.kind !== ContractKind.Library) {
    return  // Not a library, no restrictions
  }

  // Libraries cannot have state variables
  if (shadowElements.stateVariables.length > 0) {
    throw new ShadowValidationError(
      'Cannot inject state variables into library contract',
      {
        meta: {
          code: 'library_state_variables',
          attemptedVariables: shadowElements.stateVariables.map(v => v.name),
        },
      }
    )
  }

  // Libraries cannot have state-modifying functions called directly
  for (const func of shadowElements.functions) {
    if (
      func.stateMutability !== FunctionStateMutability.Pure &&
      func.stateMutability !== FunctionStateMutability.View &&
      (func.visibility === FunctionVisibility.Public ||
        func.visibility === FunctionVisibility.External)
    ) {
      logger.warn(
        `Injecting state-modifying public/external function '${func.name}' into library - ` +
        `this will only work with DELEGATECALL`
      )
    }
  }
}
```

### 3. Modifier Reference Validation

```javascript
/**
 * Validates that modifier references can be resolved
 */
const validateModifierReferences = (shadowElements, targetContract, logger) => {
  for (const func of shadowElements.functions) {
    for (const modifierInvocation of func.vModifiers) {
      // Get referenced modifier
      const modifierId = modifierInvocation.vModifierName.referencedDeclaration

      // Check if modifier exists in target or shadow elements
      const modifierExists =
        targetContract.vModifiers.some(m => m.id === modifierId) ||
        shadowElements.modifiers.some(m => m.id === modifierId)

      if (!modifierExists) {
        throw new ShadowValidationError(
          `Function '${func.name}' references undefined modifier`,
          {
            meta: {
              code: 'undefined_modifier',
              functionName: func.name,
              modifierId,
            },
          }
        )
      }
    }
  }
}
```

### 4. Virtual/Override Validation

```javascript
/**
 * Validates virtual/override consistency with inheritance
 */
const validateVirtualOverride = (shadowElements, targetContract, logger) => {
  for (const func of shadowElements.functions) {
    // Check for override without base function
    if (func.vOverrideSpecifier && !func.virtual) {
      // Should override something in base contracts
      const baseFunctionExists = targetContract.vLinearizedBaseContracts
        .slice(1) // Skip self
        .some(baseContract =>
          baseContract.vFunctions.some(
            f => f.name === func.name && f.virtual
          )
        )

      if (!baseFunctionExists) {
        logger.warn(
          `Function '${func.name}' marked as override but no virtual base function found`
        )
      }
    }

    // Check for name collision without override
    if (!func.vOverrideSpecifier) {
      const collision = targetContract.vFunctions.find(
        f => f.name === func.name
      )

      if (collision) {
        throw new ShadowValidationError(
          `Function '${func.name}' collides with existing function - use override or different name`,
          {
            meta: {
              code: 'function_name_collision',
              functionName: func.name,
            },
          }
        )
      }
    }
  }
}
```

### 5. Complete Validation Function

```javascript
/**
 * Validates all shadow elements before injection
 */
const validateShadowElements = (shadowElements, targetContract, logger) => {
  logger.debug('Validating shadow elements before injection')

  validateSpecialFunctions(shadowElements, targetContract, logger)
  validateLibraryRestrictions(shadowElements, targetContract, logger)
  validateModifierReferences(shadowElements, targetContract, logger)
  validateVirtualOverride(shadowElements, targetContract, logger)

  logger.debug('Shadow elements validation passed')
}
```

---

## Advanced Features

### 1. Pre/Post Code Injection (Wrapper Strategy)

Similar to Scribble's `#if_succeeds` - wrap function to add pre/post conditions.

```javascript
/**
 * Creates wrapper function for pre/post conditions
 * Like Scribble does for #if_succeeds
 */
const createFunctionWrapper = (originalFunc, preCode, postCode, factory) => {
  // 1. Rename original function
  const originalName = originalFunc.name
  originalFunc.name = `_original_${originalFunc.vScope.name}_${originalName}`
  originalFunc.visibility = FunctionVisibility.Private

  // 2. Create wrapper function
  const wrapper = factory.makeFunctionDefinition(
    originalName,
    originalFunc.virtual,
    FunctionVisibility.Public,  // Or original visibility
    originalFunc.stateMutability,
    false,  // isConstructor
    originalFunc.vParameters,
    originalFunc.vReturnParameters,
    originalFunc.vModifiers,
    originalFunc.vOverrideSpecifier,
    createWrapperBody(originalFunc, preCode, postCode, factory),
    originalFunc.documentation
  )

  return wrapper
}

/**
 * Creates wrapper function body
 */
const createWrapperBody = (originalFunc, preCode, postCode, factory) => {
  const statements = []

  // Add pre-condition code
  if (preCode) {
    statements.push(
      factory.makeExpressionStatement(parseExpression(preCode))
    )
  }

  // Store return value if needed
  const hasReturn = originalFunc.vReturnParameters.vParameters.length > 0
  let returnVar

  if (hasReturn && postCode) {
    // Declare variable to store result
    returnVar = factory.makeVariableDeclaration(
      '_result',
      false,
      false,
      DataLocation.Default,
      StateVariableVisibility.Default,
      Mutability.Mutable,
      originalFunc.vReturnParameters.vParameters[0].vType.typeString,
      undefined,
      originalFunc.vReturnParameters.vParameters[0].vType
    )

    statements.push(
      factory.makeVariableDeclarationStatement(
        [returnVar],
        undefined
      )
    )
  }

  // Call original function
  const call = factory.makeFunctionCall(
    // ... create call to _original_Foo_bar(args)
  )

  if (hasReturn && postCode) {
    // Assign to return variable
    statements.push(
      factory.makeExpressionStatement(
        factory.makeAssignment(
          '=',
          factory.makeIdentifierFor(returnVar),
          call
        )
      )
    )
  } else {
    statements.push(factory.makeExpressionStatement(call))
  }

  // Add post-condition code
  if (postCode) {
    // In postCode, can reference _result
    statements.push(
      factory.makeExpressionStatement(parseExpression(postCode))
    )
  }

  // Return
  if (hasReturn) {
    statements.push(
      factory.makeReturn(
        originalFunc.vReturnParameters.id,
        returnVar ? factory.makeIdentifierFor(returnVar) : undefined
      )
    )
  }

  return factory.makeBlock(statements)
}
```

**Usage:**

```javascript
// In shadow methods string:
/// #pre require(msg.sender == owner);
/// #post assert(balance > 0);
function transfer(address to, uint256 amount) public {
  balance -= amount;
}
```

Parse annotations and apply wrapper.

### 2. Conflict Resolution Strategies

```javascript
/**
 * Conflict resolution strategies for duplicate names
 */
const ConflictStrategy = {
  ERROR: 'error',        // Throw error on conflict
  REPLACE: 'replace',    // Replace existing with shadow
  RENAME: 'rename',      // Rename shadow method
  SKIP: 'skip',         // Skip shadow method
}

/**
 * Resolves conflicts based on strategy
 */
const resolveConflicts = (shadowElements, targetContract, strategy, logger) => {
  if (strategy === ConflictStrategy.ERROR) {
    // Already handled by validation
    return shadowElements
  }

  const resolved = { ...shadowElements }

  resolved.functions = shadowElements.functions.map(shadowFunc => {
    const existing = targetContract.vFunctions.find(
      f => f.name === shadowFunc.name
    )

    if (!existing) return shadowFunc

    switch (strategy) {
      case ConflictStrategy.REPLACE:
        // Remove existing, keep shadow
        targetContract.removeChild(existing)
        logger.warn(`Replaced existing function: ${shadowFunc.name}`)
        return shadowFunc

      case ConflictStrategy.RENAME:
        // Rename shadow function
        shadowFunc.name = `${shadowFunc.name}_shadow`
        logger.warn(`Renamed shadow function to: ${shadowFunc.name}`)
        return shadowFunc

      case ConflictStrategy.SKIP:
        // Skip shadow function
        logger.warn(`Skipped duplicate shadow function: ${shadowFunc.name}`)
        return null

      default:
        return shadowFunc
    }
  }).filter(Boolean)

  return resolved
}
```

---

## Edge Cases & Considerations

### 1. Storage Layout for State Variables

**Issue**: Injecting state variables changes storage layout.

**Safe for:**
- ✅ Fresh deployments
- ✅ Testing/simulation
- ✅ Non-upgradeable contracts

**Dangerous for:**
- ❌ Upgradeable contracts (storage layout must be stable)
- ❌ Contracts already deployed (would need migration)

**Solution**: Document limitation, add warning

```javascript
const validateStorageInjection = (shadowElements, options, logger) => {
  if (shadowElements.stateVariables.length > 0) {
    logger.warn(
      'Shadow state variables detected - storage layout will change. ' +
      'This is safe for testing but NOT for upgradeable contracts or migrations.'
    )

    if (options.warnOnStorageChange === 'error') {
      throw new ShadowValidationError(
        'Storage layout change prohibited by configuration',
        { meta: { code: 'storage_layout_change' } }
      )
    }
  }
}
```

### 2. Free Functions (Solidity 0.7.1+)

**Issue**: Free functions exist at file level, not contract level.

```javascript
const validateFreeFunction = (shadowFunc) => {
  if (shadowFunc.kind === FunctionKind.Free) {
    throw new ShadowValidationError(
      'Cannot inject free functions - they must be file-level',
      { meta: { code: 'free_function_injection', functionName: shadowFunc.name } }
    )
  }
}
```

### 3. Multiple Return Paths

**Issue**: Functions with multiple returns need careful handling for post-conditions.

**Solution**: Wrapper strategy handles this correctly by intercepting at call boundary, not individual returns.

### 4. Compiler Version Consistency

```javascript
/**
 * Ensures shadow and source use same compiler version
 */
const validateCompilerVersion = (options, logger) => {
  // If version specified, both must use it
  if (options.solcVersion) {
    logger.debug(`Using specified solc version: ${options.solcVersion}`)
    return
  }

  // Otherwise, extract pragma from both and ensure compatible
  const sourcePragma = extractPragma(options.sources)
  const shadowPragma = extractPragma({ '__TevmShadow__.sol': { content: options.shadowMethods } })

  if (sourcePragma && shadowPragma && !areCompatible(sourcePragma, shadowPragma)) {
    logger.warn(
      'Source and shadow have incompatible pragma versions - ' +
      'using source version for both'
    )
  }
}
```

### 5. AST Nondeterminism

**Evidence**: GitHub issue ethereum/solidity#11907

**Impact**:
- AST IDs may differ between compilations
- Only affects repeated compilations
- Not an issue for our single-compilation approach

**Mitigation**: We compile once, so IDs are stable within that compilation.

---

## Limitations & Workarounds

### Documented Limitations

```javascript
/**
 * LIMITATIONS.md
 *
 * 1. STORAGE LAYOUT
 *    - Shadow state variables change storage layout
 *    - Safe for testing, NOT for upgradeable contracts
 *    - Workaround: Don't inject state variables, or document upgrade path
 *
 * 2. USING FOR DIRECTIVES
 *    - Complex to handle library imports
 *    - Limitation: Shadow cannot use `using X for Y` unless X is already imported
 *    - Workaround: Ensure libraries are imported in target file
 *
 * 3. SOURCE MAPPINGS
 *    - Generated source has different line numbers
 *    - Debuggers show instrumented code, not original
 *    - Workaround: Use instrumentationMetadata to map back
 *
 * 4. DEBUGGING
 *    - Stack traces reference instrumented code
 *    - Coverage reports include shadow methods
 *    - Workaround: Filter shadow methods from coverage using metadata
 *
 * 5. SPECIAL FUNCTIONS
 *    - Cannot inject duplicate constructor/fallback/receive
 *    - Limitation: Must merge logic or use different approach
 *    - Workaround: Document and validate
 *
 * 6. FREE FUNCTIONS
 *    - Cannot inject file-level free functions
 *    - Limitation: Structural (free functions not in contracts)
 *    - Workaround: Convert to contract methods
 */
```

### Instrumentation Metadata Usage

**For Debugging:**

```javascript
const mapInstrumentedToOriginal = (instrumentedLine, metadata) => {
  const mapping = metadata.sourceMapping[instrumentedLine]

  if (mapping === null) {
    return {
      isShadowCode: true,
      originalLine: null,
      message: 'This is injected shadow code (not in original)'
    }
  }

  return {
    isShadowCode: false,
    originalLine: mapping,
  }
}
```

**For Coverage:**

```javascript
const filterShadowFromCoverage = (coverage, metadata) => {
  const filtered = { ...coverage }

  for (const [line, hits] of Object.entries(coverage.lines)) {
    const mapping = mapInstrumentedToOriginal(parseInt(line), metadata)

    if (mapping.isShadowCode) {
      delete filtered.lines[line]
    }
  }

  return filtered
}
```

---

## Source Code Examples

### Complete Usage Example

```javascript
import { compileSourceWithShadow } from './compiler/new/compiler/compileSourceWithShadow.js'

// Example: Adding debug methods to ERC20
const result = await compileSourceWithShadow({
  filePaths: ['./contracts/MyToken.sol'],
  injectIntoContractName: 'MyToken',
  shadowMethods: `
    // Debug helper to view private balance
    function debugBalanceOf(address account) public view returns (uint256) {
      return _balances[account];
    }

    // Debug helper to call internal mint
    function debugMint(address to, uint256 amount) public {
      _mint(to, amount);
    }

    // Add test event
    event DebugTransfer(address indexed from, address indexed to, uint256 amount);

    function debugTransfer(address to, uint256 amount) public {
      emit DebugTransfer(msg.sender, to, amount);
      transfer(to, amount);
    }
  `,
  compilationOutput: ['abi', 'evm.bytecode'],
  solcVersion: '0.8.20',
})

// Access instrumentation metadata
console.log('Injected methods:', result.instrumentationMetadata.injectedElements)

// Use in tests
const { abi, bytecode } = result.output.contracts['./contracts/MyToken.sol'].MyToken
// Deploy and test with debug methods
```

### Example with Pre/Post Conditions

```javascript
const result = await compileSourceWithShadow({
  filePaths: ['./contracts/Vault.sol'],
  injectIntoContractName: 'Vault',
  shadowMethods: `
    /// #pre require(amount > 0, "Amount must be positive");
    /// #post assert(_balances[msg.sender] >= amount, "Balance check failed");
    function withdrawWrapper(uint256 amount) public {
      withdraw(amount);
    }
  `,
  enableWrappers: true,  // Enable pre/post annotation parsing
})
```

---

## Implementation Checklist

- [ ] **Phase 1**: Basic shadow injection (functions only)
  - [ ] Compile source + shadow together
  - [ ] Parse AST
  - [ ] Extract shadow functions
  - [ ] Inject into target
  - [ ] Regenerate source
  - [ ] Final compilation

- [ ] **Phase 2**: Full element support
  - [ ] State variables
  - [ ] Events
  - [ ] Errors
  - [ ] Structs
  - [ ] Enums
  - [ ] Modifiers
  - [ ] Using-for directives

- [ ] **Phase 3**: Validation
  - [ ] Special functions
  - [ ] Library restrictions
  - [ ] Modifier references
  - [ ] Virtual/override
  - [ ] Name conflicts
  - [ ] Storage warnings

- [ ] **Phase 4**: Advanced features
  - [ ] Wrapper strategy (pre/post)
  - [ ] Conflict resolution
  - [ ] Instrumentation metadata
  - [ ] Source mapping translation

- [ ] **Phase 5**: Testing
  - [ ] Unit tests for each phase
  - [ ] Integration tests
  - [ ] Edge case coverage
  - [ ] Real-world contract examples

- [ ] **Phase 6**: Documentation
  - [ ] API documentation
  - [ ] Usage examples
  - [ ] Limitations guide
  - [ ] Migration from old compiler API

---

## Summary

This comprehensive guide covers:

1. ✅ **Correct approach**: Compile target + shadow together with inheritance
2. ✅ **AST manipulation**: Using solc-typed-ast properly
3. ✅ **All validation**: Special functions, libraries, modifiers, etc.
4. ✅ **Advanced features**: Wrappers, conflict resolution
5. ✅ **Edge cases**: Storage, free functions, compiler versions
6. ✅ **Limitations**: Documented with workarounds
7. ✅ **Complete implementation**: Step-by-step with code

### Two Critical Clarifications

#### 1. Node ID Consistency (No Remapping Needed)

**Question**: When moving shadow elements to target, do IDs need remapping?

**Answer**: **NO** - IDs stay identical because:
- Single compilation = single ASTContext
- `appendChild` MOVES nodes, doesn't COPY them
- Node IDs unchanged
- `referencedDeclaration` values unchanged
- References remain valid

**See**: [CRITICAL: Node ID Consistency & Reference Integrity](#critical-node-id-consistency--reference-integrity) section for complete explanation.

**Key requirement**: Must move ALL referenced declarations (structs, events, errors, modifiers, etc.) - not just functions.

#### 2. Instrumentation Metadata (Scribble Format)

**Question**: What format for instrumentation metadata?

**Answer**: Use **Scribble's exact format** for compatibility:

```typescript
interface InstrumentationMetadata {
  instrToOriginalMap: Array<[string, string]>  // [[instrRange, origRange], ...]
  otherInstrumentation: string[]               // Purely added code
  propertyMap: PropertyMapEntry[]              // Info per injected element
  originalSourceList: string[]                 // Original files
  instrSourceList: string[]                    // Instrumented files
}
```

**Source range format**: `"startIndex:length:fileIndex"`

**See**: [Phase 9: Create Source Mapping Translation (Scribble Format)](#phase-9-create-source-mapping-translation-scribble-format) for complete implementation.

**Reference**: https://docs.scribble.codes/tool/json-output-specification

---

### Key Insights

1. **The shadow compilation problem is solved** by compiling together with inheritance in a single compilation, ensuring all node IDs are consistent within the shared ASTContext.

2. **No manual ID remapping required** because `appendChild` moves nodes within the same AST structure.

3. **Scribble compatibility achieved** by using their exact metadata format, enabling tool interoperability.

4. **Reference integrity maintained** by extracting and moving ALL shadow-declared elements (not just functions).
