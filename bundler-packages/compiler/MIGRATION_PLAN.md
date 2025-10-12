# Compiler API Migration Plan

Integration plan for missing features from old API → new `createCompiler` API.

## Status Legend
- ✅ **INTEGRATED** - Already done (logger, solc instance)
- 🟢 **TRIVIAL** - Simple exposure of internal data
- 🟡 **MODERATE** - Requires minor refactoring
- 🔴 **COMPLEX** - Significant architecture changes needed
- ⚪ **WONTFIX** - Intentionally different, no action needed

---

## 1. Custom Logger ✅ INTEGRATED

**Status:** Already implemented in latest changes

**Implementation:**
```typescript
// CreateCompilerOptions.ts
export interface CreateCompilerOptions {
  logger?: Logger  // ← Added
  // ...
}

// createCompiler.js
const logger = options?.logger ?? createLogger({
  name: '@tevm/compiler',
  level: options?.loggingLevel ?? defaults.loggingLevel
})
```

**Result:** Consumers can now provide custom logger instances with full control over log routing and formatting.

---

## 2. External Solc Instance ✅ INTEGRATED

**Status:** Already implemented in latest changes

**Implementation:**
```typescript
// CreateCompilerOptions.ts
export interface CreateCompilerOptions {
  solc?: Solc  // ← Added
  // ...
}

// createCompiler.js
let _solcInstance = options?.solc  // ← Initialize from options
```

**Result:** Consumers can provide pre-loaded solc instances for reuse across compilers.

---

## 3. Boolean Compilation Flags ⚪ WONTFIX

**Old API:**
```typescript
resolveArtifacts(file, basedir, logger, config, includeAst, includeBytecode, fao, solc)
```

**New API:**
```typescript
compiler.compileSource(source, {
  compilationOutput: ['ast', 'abi', 'evm.bytecode', 'evm.deployedBytecode']
})
```

**Rationale:**
- Array-based approach is more flexible and expressive
- Supports granular output selection (e.g., `evm.deployedBytecode.sourceMap`)
- Aligns with solc's native output selection format
- Small convenience helpers can be added as utilities if needed:
  ```typescript
  const withBytecode = (outputs: CompilationOutputOption[]) =>
    [...outputs, 'evm.bytecode', 'evm.deployedBytecode']
  ```

**Decision:** Keep array-based approach, document migration pattern.

---

## 4. Artifacts Return Format ⚪ WONTFIX

**Old API:**
```typescript
type ResolvedArtifacts = {
  artifacts: Record<string, { contractName, abi, userdoc, evm }>
}
```

**New API:**
```typescript
type CompileSourceResult = {
  compilationResult: {
    ast: SolcAst
    id: number
    contract: { [name: string]: CompiledSourceContractOutput }
  }
}
```

**Rationale:**
- New structure separates AST metadata from contract artifacts
- Provides source file IDs for cross-referencing
- More aligned with solc's native output structure
- Richer type safety with conditional types based on `compilationOutput`

**Decision:** Keep new structure, provide migration guide with examples.

---

## 5. Raw `solcInput` Object 🟢 TRIVIAL

**What's Missing:**
```typescript
// Old API returned this
type ResolvedArtifacts = {
  solcInput?: SolcInputDescription
}
```

**Where It Exists:**
File: `bundler-packages/compiler/src/compiler/new/compiler/internal/compileContracts.js:38-44`

```javascript
const solcInput = {
  language: options.language,
  sources: Object.fromEntries(
    Object.entries(sources).map(([sourcePath, sourceCode]) =>
      [sourcePath, { content: sourceCode }]
    )
  ),
  settings,
}
```

**Integration Plan:**

### Step 1: Update Result Types
```typescript
// CompileBaseResult.ts
export interface CompileBaseResult {
  errors?: SolcErrorEntry[] | undefined
  solcInput?: SolcInputDescription | undefined  // ← ADD
  solcOutput?: SolcOutput | undefined            // ← ADD
}
```

### Step 2: Return from `compileContracts`
```javascript
// internal/compileContracts.js
export const compileContracts = (sources, solc, options, logger) => {
  const solcInput = { /* ... */ }
  const solcOutput = solcCompile(solc, solcInput)

  return {
    compilationResult: { /* ... */ },
    errors: solcOutput.errors,
    solcInput,   // ← ADD
    solcOutput,  // ← ADD
  }
}
```

### Step 3: Update JSDocs
Add to all compile function documentation:
```javascript
/**
 * @returns {CompileSourceResult} Result containing:
 *   - compilationResult: Processed contracts and ASTs
 *   - errors: Compilation errors/warnings
 *   - solcInput: Raw input sent to solc compiler
 *   - solcOutput: Raw output received from solc compiler
 */
```

**Files to Modify:**
- `src/compiler/new/compiler/CompileBaseResult.ts`
- `src/compiler/new/compiler/internal/compileContracts.js`
- All compile function JSDocs

**Benefits:**
- Full transparency into compilation process
- Enable debugging and reproduction
- Support for advanced workflows (AST manipulation, etc.)
- ~10 lines of code changes

---

## 6. Raw `solcOutput` Object 🟢 TRIVIAL

**Status:** Same as #5 - both can be added together

**Integration Plan:** See #5 above - `solcInput` and `solcOutput` are returned together.

---

## 7. FileAccessObject Interface 🟡 MODERATE

**What's Missing:**
```typescript
type FileAccessObject = {
  readFile: (path: string, encoding: BufferEncoding) => Promise<string>
  readFileSync: (path: string, encoding: BufferEncoding) => string
  existsSync: (path: string) => boolean
  exists: (path: string) => Promise<boolean>
}
```

**Current Implementation:**
Hardcoded to `node:fs`:
- `readSourceFiles.js:28` → `await readFile(absolutePath, 'utf-8')`
- `readSourceFilesSync.js:28` → `readFileSync(absolutePath, 'utf-8')`

**Use Cases:**
1. Virtual file systems (in-memory, testing)
2. Custom resolution (remote URLs, databases)
3. Mocking for unit tests
4. Sandboxed environments
5. Browser compatibility (with polyfills)

**Integration Plan:**

### Option A: Compile from Pre-loaded Sources (RECOMMENDED)
**Status:** Already supported! 🎉

Current API already accepts source strings directly:
```typescript
// Compile string source (no file system needed)
compiler.compileSource('contract Foo {}', options)

// Compile multiple sources with custom paths
const sources = {
  'contracts/Foo.sol': 'contract Foo {}',
  'contracts/Bar.sol': 'contract Bar { Foo f; }',
}
// Convert to files array manually or use compileSource repeatedly
```

**Guidance for Migration:**
```typescript
// OLD: Custom FileAccessObject
const fao = createVirtualFs({ 'Foo.sol': 'contract Foo {}' })
await resolveArtifacts('Foo.sol', __dirname, logger, config, true, true, fao, solc)

// NEW: Load source yourself, compile directly
const source = await myCustomFs.readFile('Foo.sol')
await compiler.compileSource(source, { compilationOutput: ['ast', 'abi', 'evm.bytecode'] })
```

### Option B: Add FileAccessObject Support (IF NEEDED)

Only pursue if Option A doesn't cover use cases.

#### Step 1: Add to CreateCompilerOptions
```typescript
// CreateCompilerOptions.ts
export interface CreateCompilerOptions {
  fileAccessObject?: FileAccessObject
  // ...
}
```

#### Step 2: Update readSourceFiles
```javascript
// internal/readSourceFiles.js
export const readSourceFiles = async (filePaths, language, logger, fao) => {
  const readFn = fao?.readFile ?? readFile  // Use custom or default

  for (const filePath of validatedPaths) {
    try {
      content = await readFn(filePath, 'utf-8')
    } catch (error) { /* ... */ }
  }
}
```

#### Step 3: Thread through call chain
- `createCompiler.js` → pass `options.fileAccessObject` to internal functions
- `compileFiles.js` → accept and pass FAO to `readSourceFiles`
- `compileFilesSync.js` → accept and pass FAO to `readSourceFilesSync`

**Files to Modify:**
- `src/compiler/new/CreateCompilerOptions.ts`
- `src/compiler/new/compiler/internal/readSourceFiles.js`
- `src/compiler/new/compiler/internal/readSourceFilesSync.js`
- `src/compiler/new/compiler/compileFiles.js`
- `src/compiler/new/createCompiler.js`

**Recommendation:** Start with Option A (document the pattern). Only implement Option B if user feedback indicates it's needed.

---

## 8. Module Dependency Graph 🔴 COMPLEX

**What's Missing:**
```typescript
type ResolvedArtifacts = {
  modules: Record<string, ModuleInfo>
}

type ModuleInfo = {
  id: string
  code: string
  importedIds: string[]
}
```

**Where It Was Built:**
Old API used `@tevm/resolutions` package:
- `compileContracts.js:32-45` → `moduleFactory(filePath, code, remappings, libs, fao, false)`
- `compileContracts.js:54-66` → Recursive dependency traversal

**New API Approach:**
Currently relies on solc's internal import resolution via `remappings` setting.

**Why This Is Complex:**

1. **Architecture Difference:**
   - Old: Pre-resolve all imports → build dependency graph → compile
   - New: Pass sources + remappings → solc resolves internally

2. **Missing Integration:**
   - `@tevm/resolutions` not imported in new compiler
   - Would need to integrate `moduleFactory` before compilation
   - Requires file system access (ties into #7)

3. **Performance Implications:**
   - Adding module resolution = extra traversal pass
   - May duplicate work solc already does
   - Need to ensure version compatibility

**Integration Plan:**

### Phase 1: Assess Real Need
**Question:** Do consumers actually use the module graph? Check:
- Downstream package usage of `modules` field
- GitHub issues/discussions requesting this
- Plugin/bundler dependencies on module info

### Phase 2: If Needed, Expose Post-Compilation
Instead of pre-resolving, extract from solc output:

```typescript
// After compilation, parse imports from solcOutput
export const extractModuleGraph = (solcOutput: SolcOutput): ModuleGraph => {
  const modules: Record<string, ModuleInfo> = {}

  for (const [sourcePath, sourceOutput] of Object.entries(solcOutput.sources)) {
    // Parse AST to extract import statements
    const imports = extractImportsFromAst(sourceOutput.ast)

    modules[sourcePath] = {
      id: sourcePath,
      code: sourceOutput.ast, // or regenerate via ASTWriter
      importedIds: imports.map(i => i.absolutePath),
    }
  }

  return { modules }
}
```

### Phase 3: If Pre-Resolution Required
Integrate `@tevm/resolutions`:

```javascript
// internal/resolveModules.js
import { moduleFactory } from '@tevm/resolutions'

export const resolveModules = async (entryPoint, options, fao, logger) => {
  const moduleMap = await runPromise(
    moduleFactory(
      entryPoint,
      await fao.readFile(entryPoint, 'utf8'),
      options.remappings,
      options.libs,
      fao,
      false,
    )
  )

  return buildModuleGraph(moduleMap)
}
```

Then thread through compilation flow.

**Recommendation:**
1. Survey actual usage first
2. If needed, try Phase 2 (extract from solc output) first
3. Only implement Phase 3 if pre-resolution is truly required

**Estimated Effort:**
- Phase 1: 1 hour (research)
- Phase 2: 4-8 hours (implementation + tests)
- Phase 3: 16-24 hours (integration + testing)

---

## 9. `basedir` Parameter 🟡 MODERATE

**What's Missing:**
```typescript
resolveArtifacts(
  solFile: string,
  basedir: string,  // ← Base directory for resolving imports
  // ...
)
```

**Current Implementation:**
Uses `resolve()` from `node:path` which resolves relative to current working directory:
- `readSourceFiles.js:22` → `const absolutePath = resolve(filePath)`

**Use Cases:**
1. Compiling from non-CWD contexts
2. Multi-root workspaces
3. Monorepo scenarios
4. Dynamic build systems

**Integration Plan:**

### Step 1: Add to CompileBaseOptions
```typescript
// CompileBaseOptions.ts
export interface CompileBaseOptions {
  basedir?: string | undefined
  // ...
}
```

### Step 2: Update Path Resolution
```javascript
// internal/readSourceFiles.js
export const readSourceFiles = async (filePaths, language, logger, basedir) => {
  for (const filePath of validatedPaths) {
    // Use basedir if provided
    const absolutePath = basedir
      ? resolve(basedir, filePath)
      : resolve(filePath)

    // ... rest of function
  }
}
```

### Step 3: Thread Through API
```typescript
// CreateCompilerResult.ts
interface CreateCompilerResult {
  compileFiles: (files: string[], options: CompileBaseOptions) => Promise<CompileFilesResult>
  // options.basedir will be used for resolution
}
```

### Step 4: Update Documentation
```typescript
/**
 * @param options.basedir - Base directory for resolving relative file paths.
 *   Defaults to process.cwd(). Useful for compiling from non-CWD contexts.
 * @example
 * // Compile from specific directory
 * compiler.compileFiles(['contracts/Foo.sol'], {
 *   basedir: '/path/to/project'
 * })
 */
```

**Files to Modify:**
- `src/compiler/new/compiler/CompileBaseOptions.ts`
- `src/compiler/new/compiler/internal/readSourceFiles.js`
- `src/compiler/new/compiler/internal/readSourceFilesSync.js`

**Benefits:**
- Better support for complex project structures
- More predictable path resolution
- Easier testing with fixtures

**Estimated Effort:** 2-4 hours

---

## 10. Foundry Project Configuration 🔴 COMPLEX

**What's Missing:**
```typescript
type ResolvedCompilerConfig = {
  foundryProject: boolean | string  // Path to forge executable
  libs: readonly string[]           // Import directories
  remappings: Record<string, string>
}
```

**Current Status:**
- ✅ `remappings` supported in `CompileBaseOptions`
- ❌ `foundryProject` not supported
- ❌ `libs` not supported

**Why This Is Complex:**

1. **External Dependency:**
   - Requires `@tevm/config` package
   - Must execute `forge config` or parse `foundry.toml`
   - Platform-specific (needs forge binary)

2. **Scope Creep:**
   - `@tevm/config` is separate package for configuration management
   - Compiler should focus on compilation, not project config
   - Mixing concerns reduces modularity

3. **Module Resolution:**
   - `libs` directories used by `@tevm/resolutions` for import resolution
   - New API doesn't use `@tevm/resolutions` (relies on solc's internal resolution)
   - Would need to convert `libs` to `remappings` for solc

**Integration Plan:**

### Option A: Document External Configuration (RECOMMENDED)

Keep compiler focused, handle config externally:

```typescript
// User's code - load config separately
import { loadConfig } from '@tevm/config'
import { createCompiler } from '@tevm/compiler'

const config = await loadConfig('./tevm.config.js')

// Apply foundry settings to compiler
const compiler = createCompiler({
  remappings: config.remappings,
  // libs are converted to remappings by @tevm/config
})
```

**Benefits:**
- Separation of concerns
- Compiler stays focused and testable
- Config package handles platform-specific logic
- Users can use any config source (Foundry, Hardhat, custom)

### Option B: Add Foundry Integration (IF REALLY NEEDED)

Only if strong user demand.

#### Step 1: Add Config Loading Utility
```typescript
// src/compiler/new/foundry/loadFoundryConfig.ts
import { loadFoundryConfig as loadConfig } from '@tevm/config'

export const loadFoundryConfig = async (projectPath: string) => {
  const config = await loadConfig(projectPath)

  // Convert libs to remappings for solc
  const libRemappings = config.libs.map(lib =>
    // e.g., "lib/" maps to each lib directory
    `lib/${basename(lib)}/=${lib}/`
  )

  return {
    remappings: [...config.remappings, ...libRemappings],
  }
}
```

#### Step 2: Add Helper to CreateCompilerOptions
```typescript
// CreateCompilerOptions.ts
import { loadFoundryConfig } from './foundry/loadFoundryConfig.js'

export interface CreateCompilerOptions {
  // Option 1: Automatic loading
  foundryProject?: boolean | string

  // Option 2: Pre-loaded config
  foundryConfig?: { remappings: string[] }
}

// Factory helper
export const createCompilerFromFoundry = async (
  foundryPath: string,
  options?: Omit<CreateCompilerOptions, 'foundryProject'>
) => {
  const foundryConfig = await loadFoundryConfig(foundryPath)

  return createCompiler({
    ...options,
    remappings: foundryConfig.remappings,
  })
}
```

#### Step 3: Usage
```typescript
// Simple helper approach
const compiler = await createCompilerFromFoundry('./foundry.toml')

// Or with explicit config
const foundryConfig = await loadFoundryConfig('./foundry.toml')
const compiler = createCompiler({
  remappings: foundryConfig.remappings,
})
```

**Files to Create:**
- `src/compiler/new/foundry/loadFoundryConfig.ts`
- `src/compiler/new/foundry/index.ts`

**Files to Modify:**
- `src/compiler/new/CreateCompilerOptions.ts` (add helper)
- `src/compiler/new/index.ts` (export helper)

**Recommendation:**
- Start with Option A (document pattern, keep separation)
- Add `createCompilerFromFoundry` helper if users request it
- Keep core compiler independent of config system

**Estimated Effort:**
- Option A: 0 hours (documentation only)
- Option B: 8-12 hours (helper + tests + docs)

---

## Implementation Priority

### High Priority (Do First) 🟢
1. ✅ **Custom Logger** - Already done
2. ✅ **External Solc** - Already done
3. 🟢 **solcInput/solcOutput** (#5, #6) - 2 hours, high value for debugging

### Medium Priority (Do If Needed) 🟡
4. 🟡 **basedir Parameter** (#9) - 4 hours, useful for complex projects
5. 🟡 **FileAccessObject** (#7) - 4 hours, evaluate Option A first

### Low Priority (Evaluate First) 🔴
6. 🔴 **Module Dependency Graph** (#8) - 8-24 hours, research usage first
7. 🔴 **Foundry Integration** (#10) - 0-12 hours, document pattern first

### No Action Needed ⚪
8. ⚪ **Boolean Flags** (#3) - Document migration
9. ⚪ **Artifacts Format** (#4) - Document migration

---

## Quick Wins (Next 2 Hours)

### Task 1: Expose solcInput/solcOutput (30 min)
```bash
# Files to edit:
# 1. CompileBaseResult.ts - add fields
# 2. internal/compileContracts.js - return values
# 3. Run tests
```

### Task 2: Add basedir Support (60 min)
```bash
# Files to edit:
# 1. CompileBaseOptions.ts - add field
# 2. internal/readSourceFiles.js - use in resolve()
# 3. internal/readSourceFilesSync.js - use in resolve()
# 4. Run tests
```

### Task 3: Documentation (30 min)
```bash
# Create migration guide with:
# - Side-by-side API comparison
# - Common patterns translation
# - When to use which approach
```

---

## Migration Guide Template

For each breaking change, provide:

```markdown
### Old Pattern
// What users currently do
const artifacts = await resolveArtifacts(...)

### New Pattern
// How to achieve the same result
const compiler = createCompiler(...)
const result = await compiler.compileSource(...)

### Why Changed
- [Benefit 1]
- [Benefit 2]

### Migration Checklist
- [ ] Step 1
- [ ] Step 2
```

---

## Testing Strategy

For each integration:

1. **Unit Tests**
   - Test new options/parameters
   - Test default behavior unchanged
   - Test edge cases

2. **Integration Tests**
   - Compile real Solidity projects
   - Verify output matches old API (where applicable)
   - Test with various configurations

3. **Backwards Compatibility**
   - Ensure existing tests still pass
   - Test that defaults work without new options
   - Verify TypeScript types are backwards compatible

---

## Open Questions

1. **Module Graph Usage:**
   - Who uses the `modules` field from old API?
   - What are they using it for?
   - Can we solve their use case differently?

2. **FileAccessObject:**
   - Is `compileSource(string)` sufficient?
   - Do users need file-system-level interception?
   - Browser use cases?

3. **Foundry Integration:**
   - How many users use `foundryProject: true`?
   - Do they care about internal implementation?
   - Is external config loading acceptable?

**Action:** Survey users/codebase before implementing complex features.

---

## Summary

| Feature | Status | Effort | Priority | Next Step |
|---------|--------|--------|----------|-----------|
| Logger | ✅ Done | 0h | - | - |
| Solc Instance | ✅ Done | 0h | - | - |
| Boolean Flags | ⚪ WONTFIX | 0h | - | Document |
| Artifacts Format | ⚪ WONTFIX | 0h | - | Document |
| solcInput/Output | 🟢 Trivial | 2h | High | Implement |
| basedir | 🟡 Moderate | 4h | Medium | Implement |
| FileAccessObject | 🟡 Moderate | 4h | Medium | Evaluate |
| Module Graph | 🔴 Complex | 8-24h | Low | Research |
| Foundry Config | 🔴 Complex | 8-12h | Low | Document |

**Total Estimated Effort:** 26-46 hours (but prioritize 2-6 hours of high-value work first)
