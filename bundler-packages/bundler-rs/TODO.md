# TODO: Bundler-RS Implementation Plan

## Project Overview

The bundler-rs package aims to replace two existing JavaScript packages (compiler and base-bundler) with a more efficient Rust implementation. It will leverage the existing Rust packages (resolutions-rs, solc-rs, and runtime-rs) to provide a complete bundling solution for Solidity contracts.

## Key Improvements

1. **Simplified API**: Pass solc options explicitly rather than using specific flags like `accessList` or `includeAst`
2. **Unified Package**: Combine compiler and base-bundler functionality into a single package
3. **Performance**: Leverage Rust's performance advantages and concurrency features
4. **Direct Integration**: Access Rust implementations directly rather than through JS bridges
5. **Async-Only API**: Use only async methods for a simpler, more maintainable codebase

## Implementation Steps

### 1. Core Types and Structs (1-2 days)

- [ ] Define `Bundler` struct that will be the main entry point
- [ ] Create comprehensive options types for:
  - [ ] `BundlerOptions` - Main configuration options
  - [ ] `SolcOptions` - Compiler-specific options
  - [ ] `RuntimeOptions` - Code generation options
- [ ] Create result types for returned data
- [ ] Define error types with detailed context

### 2. Module Resolution Integration (1-2 days)

- [ ] Integrate with resolutions-rs for import resolution
- [ ] Implement module factory integration for building module graphs
- [ ] Add support for remappings and library paths
- [ ] Implement asynchronous resolution path for module resolution
- [ ] Add caching layer for module resolution

### 3. Compilation Pipeline (2-3 days)

- [ ] Integrate with solc-rs for contract compilation
- [ ] Create `compileArtifacts` method to compile Solidity files
- [ ] Implement AST extraction (optional)
- [ ] Implement bytecode extraction (optional)
- [ ] Add support for solc version selection
- [ ] Support for compiler optimization settings

### 4. Code Generation (2-3 days)

- [ ] Integrate with runtime-rs for generating JavaScript/TypeScript
- [ ] Support multiple output formats:
  - [ ] TypeScript (.ts)
  - [ ] CommonJS (.cjs)
  - [ ] ES Modules (.mjs)
  - [ ] TypeScript declarations (.d.ts)
- [ ] Generate code based on module format
- [ ] Support for contract package customization

### 5. Bundler API Implementation (2-3 days)

- [ ] Implement top-level NAPI bindings for bundler access from JavaScript
- [ ] Create bundler factory function
- [ ] Implement core resolution methods (async only):
  - [ ] `resolveTsModule`
  - [ ] `resolveEsmModule`
  - [ ] `resolveCjsModule`
  - [ ] `resolveDts`

### 6. Caching System (1-2 days)

- [ ] Design efficient caching strategy
- [ ] Use hashing for content-based caching
- [ ] Implement file system cache
- [ ] Add in-memory cache for repeated operations
- [ ] Support cache invalidation

### 7. JavaScript Integration (1-2 days)

- [ ] Refine NAPI bindings
- [ ] Implement JavaScript shims for compatibility
- [ ] Ensure TypeScript typings are complete and accurate
- [ ] Support for browser and Node.js environments

### 8. Testing (2-3 days)

- [ ] Write unit tests for each component
- [ ] Create integration tests matching the JavaScript implementation
- [ ] Test against real-world Solidity files
- [ ] Performance benchmarks vs. JavaScript implementation
- [ ] Cross-platform testing (Linux, macOS, Windows)

### 9. Documentation and Examples (1-2 days)

- [ ] Document the API comprehensively
- [ ] Create example code
- [ ] Add migration guide from compiler/base-bundler
- [ ] Document performance considerations

## Implementation Details

### Bundler Struct

```rust
pub struct Bundler {
    // Configuration
    config: BundlerConfig,
    
    // Dependencies
    solc: Solc,
    file_access: FileAccess,
    cache: Option<Cache>,
    logger: Logger,
    
    // Contract package name for imports in generated code
    contract_package: String,
}

impl Bundler {
    // Core async methods only
    pub async fn resolve_ts_module(&self, file_path: &str, base_dir: &str, solc_options: SolcOptions) -> Result<BundleResult>;
    pub async fn resolve_esm_module(&self, file_path: &str, base_dir: &str, solc_options: SolcOptions) -> Result<BundleResult>;
    pub async fn resolve_cjs_module(&self, file_path: &str, base_dir: &str, solc_options: SolcOptions) -> Result<BundleResult>;
    pub async fn resolve_dts(&self, file_path: &str, base_dir: &str, solc_options: SolcOptions) -> Result<BundleResult>;
    
    // Core functionality
    pub async fn compile_artifacts(&self, file_path: &str, base_dir: &str, solc_options: SolcOptions) -> Result<CompileResult>;
}
```

### Config Types

```rust
pub struct BundlerConfig {
    // Solidity compiler configuration
    pub remappings: Vec<(String, String)>,
    pub libs: Vec<String>,
    pub solc_path: Option<PathBuf>,
    pub solc_version: Option<String>,
    
    // Caching configuration
    pub cache_dir: Option<PathBuf>,
    pub use_cache: bool,
    
    // Debug options
    pub debug: bool,
}

pub struct SolcOptions {
    // Core options
    pub optimize: bool,
    pub optimizer_runs: Option<u32>,
    pub evm_version: Option<String>,
    
    // Output selection
    pub include_ast: bool,
    pub include_bytecode: bool,
    pub include_source_map: bool,
    pub include_user_docs: bool,
    pub include_dev_docs: bool,
    
    // Advanced options
    pub metadata_settings: Option<MetadataSettings>,
    pub libraries: Option<HashMap<String, HashMap<String, String>>>,
}

pub struct RuntimeOptions {
    pub module_type: ModuleType,
    pub contract_package: ContractPackage,
}

pub enum ModuleType {
    Ts,
    Cjs,
    Mjs,
    Dts,
}

pub enum ContractPackage {
    TevmContract,         // '@tevm/contract'
    TevmContractScoped,   // 'tevm/contract'
}
```

### Result Types

```rust
pub struct BundleResult {
    // Generated code
    pub code: String,
    pub source_map: Option<String>,
    
    // Module info
    pub modules: HashMap<String, String>,
    
    // Solc info
    pub solc_input: SolcInputDescription,
    pub solc_output: SolcOutput,
    
    // Optional AST info
    pub asts: Option<HashMap<String, Value>>,
}

pub struct CompileResult {
    // Module info
    pub modules: HashMap<String, ModuleInfo>,
    
    // Solc info
    pub solc_input: SolcInputDescription,
    pub solc_output: SolcOutput,
    
    // Contract artifacts
    pub artifacts: HashMap<String, ContractArtifact>,
    
    // Optional ASTs
    pub asts: Option<HashMap<String, Value>>,
}
```

### NAPI Bindings

```rust
#[napi]
pub struct JsBundler {
    inner: Arc<Bundler>,
}

#[napi]
impl JsBundler {
    #[napi]
    pub async fn resolve_ts_module(
        &self,
        file_path: String,
        base_dir: String,
        js_solc_options: JsSolcOptions,
    ) -> napi::Result<JsBundleResult> {
        // Convert JS options to Rust options
        let solc_options = SolcOptions::from(js_solc_options);
        
        // Call the inner method
        let result = self.inner.resolve_ts_module(&file_path, &base_dir, solc_options)
            .await
            .map_err(|e| napi::Error::from_reason(e.to_string()))?;
        
        // Convert result back to JS type
        Ok(JsBundleResult::from(result))
    }
    
    // Similar implementations for other methods...
}
```

## Potential Challenges

1. **Compatibility**: Ensuring the Rust implementation matches the JavaScript behavior exactly
2. **Error Handling**: Providing detailed and helpful error messages across language boundaries
3. **Testing**: Creating comprehensive tests that verify behavior across platforms
4. **Performance**: Balancing memory usage with execution speed
5. **Configuration**: Handling complex configuration options correctly

## Performance Considerations

1. **Caching**: Implement efficient caching to avoid redundant compilation
2. **Concurrency**: Use Tokio for async operations where appropriate
3. **Memory Management**: Minimize copying of large strings or byte arrays
4. **I/O Efficiency**: Batch file system operations where possible
5. **JS Binding Overhead**: Minimize crossing the language boundary

## Next Steps

1. Begin with core types and structs
2. Implement the compilation pipeline
3. Add module resolution and code generation
4. Create a complete JS API surface
5. Add comprehensive testing