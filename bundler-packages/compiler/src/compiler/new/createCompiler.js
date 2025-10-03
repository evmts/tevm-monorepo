import { compileFiles } from './compiler/compileFiles.js'
import { compileSource } from './compiler/compileSource.js'
import { compileSourceWithShadow } from './compiler/compileSourceWithShadow.js'
import { extractContractsFromAst } from './compiler/extractContractsFromAst.js'
import { extractContractsFromSolcOutput } from './compiler/extractContractsFromSolcOutput.js'

/**
 * Creates a stateful compiler instance with pre-configured defaults.
 *
 * The compiler instance provides a unified API for:
 * - Compiling Solidity/Yul source code and ASTs
 * - Shadow compilation for instrumentation and testing
 * - Fetching the compilation output of verified on-chain contracts
 * - Managing solc and caching
 *
 * Options passed to the factory become defaults for all operations, but can be
 * overridden on a per-compilation basis. This allows for flexible configuration:
 * set common options once (hardfork, optimizer, output selection) while customizing
 * individual compilations as needed.
 *
 * @param {import('./CreateCompilerOptions.js').CreateCompilerOptions} [options] - Default options for all compiler operations
 * @returns {import('./CreateCompilerResult.js').CreateCompilerResult} Stateful compiler instance
 *
 * @example
 * const compiler = createCompiler({
 *   solcVersion: '0.8.17',
 *   optimizer: { enabled: true, runs: 200 },
 *   loggingLevel: 'info'
 * })
 *
 * // Use defaults
 * await compiler.compileSource('contract Foo {}')
 *
 * // Override for specific compilation
 * await compiler.compileSource('contract Bar {}', {
 *   solcVersion: '0.8.20', // Different version for this file
 *   optimizer: { enabled: false }
 * })
 */
export const createCompiler = (options) => {
	/**
	 * Compiles Solidity source code or a parsed AST into contracts.
	 *
	 * Accepts either:
	 * - Raw Solidity/Yul source code as a string
	 * - Parsed AST object when language is 'SolidityAST'
	 *
	 * Options merge strategy: per-call options override factory defaults.
	 *
	 * Testing options:
	 * - `exposeInternalFunctions`: Changes visibility of internal/private functions to public
	 * - `exposeInternalVariables`: Changes visibility of internal/private state variables to public
	 *
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @param {TLanguage extends 'SolidityAST' ? import('./compiler/AstInput.js').AstInput : string} source - Source code string or AST object
	 * @param {import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>} compileOptions - Options for this compilation (merged with factory defaults)
	 * @returns {Promise<import('./compiler/CompileSourceResult.js').CompileSourceResult<TCompilationOutput>>}
	 */
	const compileSourceFn = async (source, compileOptions) => {
		// TODO: merge options with factory defaults
		// TODO: call compileSource
	}

	/**
	 * Compiles source with shadow code injection for instrumentation or testing.
	 *
	 * Shadow compilation workflow:
	 * 1. Source is compiled to identify target contracts
	 * 2. Shadow code (Solidity/Yul) is parsed and validated
	 * 3. Shadow methods/modifiers are injected into the target contract
	 * 4. Combined source is compiled and returned
	 *
	 * When source is AST, you must specify injectIntoContractPath and injectIntoContractName
	 * if the AST contains multiple contracts. For single-contract sources, these are optional.
	 *
	 * Merge strategies for handling name conflicts:
	 * - `safe` (default): Throws compilation error if shadow method name conflicts with existing method
	 * - `replace`: Shadow method overrides existing method (source functions marked virtual, shadow as override)
	 *
	 * Note: if a function is intended to override an existing one, it should be marked as override
	 *
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @param {TLanguage extends 'SolidityAST' ? import('./compiler/AstInput.js').AstInput : string} source - Source code or AST to augment
	 * @param {string} shadow - Shadow code to inject (Solidity or Yul)
	 * @param {import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput> & import('./compiler/CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TLanguage>} compileOptions - Compilation and injection options
	 * @returns {Promise<import('./compiler/CompileSourceResult.js').CompileSourceResult<TCompilationOutput>>}
	 */
	const compileSourceWithShadowFn = async (source, shadow, compileOptions) => {
		// TODO: merge options with factory defaults
		// TODO: call compileSourceWithShadow
	}

	/**
	 * Compiles multiple source files from the filesystem.
	 *
	 * All files in a single compilation must use the same language/extension:
	 * - .sol files (Solidity)
	 * - .yul files (Yul)
	 * - .json files (SolidityAST)
	 *
	 * Returns a map keyed by original file paths, allowing you to correlate
	 * compilation results back to source files.
	 *
	 * Testing options:
	 * - `exposeInternalFunctions`: Changes visibility of internal/private functions to public
	 * - `exposeInternalVariables`: Changes visibility of internal/private state variables to public
	 *
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @template {string[]} TSourcePaths
	 * @param {TSourcePaths} files - Array of file paths to compile
	 * @param {import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>} compileOptions - Compilation options
	 * @returns {Promise<import('./compiler/CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TSourcePaths>>}
	 */
	const compileFilesFn = async (files, compileOptions) => {
		// TODO: merge options with factory defaults
		// TODO: call compileFiles
	}

	/**
	 * Extracts Solidity source code from solc compiler output.
	 *
	 * Uses solc-typed-ast's ASTWriter to regenerate source from the compiled AST.
	 * This enables AST manipulation workflows:
	 * 1. Compile source to get AST
	 * 2. Modify AST programmatically
	 * 3. Compile the instrumented AST
	 *
	 * Returns a map of source paths to regenerated Solidity code.
	 *
	 * @param {import('@tevm/solc').SolcOutput} solcOutput - Complete solc compilation output
	 * @param {import('./compiler/CompileBaseOptions.js').CompileBaseOptions} compileOptions - Options controlling source generation
	 * @returns {{ [sourcePath: string]: string }} Map of file paths to regenerated source code
	 *
	 * @example
	 * import { ASTReader } from 'solc-typed-ast'
	 *
	 * // 1. Compile to get AST
	 * const result = await compiler.compileSource('contract Foo { uint x; }', { language: 'Solidity', compilationOutput: ['ast'] })
	 *
	 * // 2. Parse and manipulate AST
	 * const reader = new ASTReader()
	 * const sourceUnits = reader.read(result.solcOutput)
	 * const someContract = sourceUnits[0].vContracts.find(contract => contract.name === 'SomeContract')
	 * // ... manipulate the SourceUnit
	 *
	 * // 3. Compile the manipulated AST directly
	 * const instrumentedResult = await compiler.compileSource(sourceUnits[0], { language: 'SolidityAST', compilationOutput: ['evm.bytecode'] })
	 */
	const extractContractsFromSolcOutputFn = (solcOutput, compileOptions) => {
		// TODO: merge options with factory defaults
		// TODO: call extractContractsFromSolcOutput
	}

	/**
	 * Extracts Solidity source code from a single parsed AST.
	 *
	 * Simplified version of extractContractsFromSolcOutput for single-AST workflows.
	 * Converts an AST object (SourceUnit) back to compilable Solidity source code.
	 *
	 * The AST must be a valid SourceUnit node (nodeType: "SourceUnit").
	 *
	 * @param {import('./compiler/AstInput.js').AstInput} ast - Parsed AST to convert
	 * @param {import('./compiler/CompileBaseOptions.js').CompileBaseOptions} compileOptions - Options controlling source generation
	 * @returns {string} Regenerated Solidity source code
	 */
	const extractContractsFromAstFn = (ast, compileOptions) => {
		// TODO: merge options with factory defaults
		// TODO: call extractContractsFromAst
	}

	/**
	 * Fetches verified source code for a deployed contract from block explorers.
	 *
	 * Uses whatsabi to:
	 * 1. Query block explorers (Blockscout, Etherscan, Sourcify) for verified source
	 * 2. Retrieve the source code and solc compilation output
	 * 3. Return in the same format as compileSource for consistency
	 *
	 * Requires API keys for block explorers to be configured in options.
	 *
	 * @param {import('@tevm/utils').Address} address - On-chain contract address
	 * @param {import('./whatsabi/WhatsabiBaseOptions.js').WhatsabiBaseOptions} whatsabiOptions - Chain config and API keys
	 * @returns {Promise<import('./whatsabi/FetchVerifiedContractResult.js').FetchVerifiedContractResult>}
	 */
	const fetchVerifiedContractFn = async (address, whatsabiOptions) => {
		// TODO: merge options with factory defaults
		// TODO: implement whatsabi integration
	}

	/**
	 * Pre-loads a specific solc compiler version into the cache.
	 *
	 * Solc binaries are downloaded on-demand by default, which can cause delays
	 * during the first compilation. Use this to:
	 * - Warm up the cache at application startup
	 * - Download multiple versions in parallel
	 * - Fail fast if a version is unavailable
	 *
	 * The downloaded compiler is cached for all subsequent compilations.
	 *
	 * @param {keyof import('@tevm/solc').Releases | keyof import('@tevm/solc').Releases[]} version - Solc version to load (e.g., '0.8.17')
	 * @returns {Promise<import('./CreateCompilerResult.js').CreateCompilerResult>} This compiler instance for chaining
	 */
	const loadSolcVersionFn = async (version) => {
		// TODO: implement solc version loading
		return compiler
	}

	/**
	 * Clears the downloaded solc compiler cache.
	 *
	 * Removes all cached solc binaries from disk. Use when:
	 * - Updating to newer compiler versions
	 * - Freeing disk space
	 * - Troubleshooting corrupted downloads
	 * - Running tests that need clean state
	 *
	 * Compilers will be re-downloaded on next use.
	 *
	 * @returns {Promise<import('./CreateCompilerResult.js').CreateCompilerResult>} This compiler instance for chaining
	 */
	const clearCacheFn = async () => {
		// TODO: implement cache clearing
		return compiler
	}

	const compiler = {
		compileSource: compileSourceFn,
		compileSourceWithShadow: compileSourceWithShadowFn,
		compileFiles: compileFilesFn,
		extractContractsFromSolcOutput: extractContractsFromSolcOutputFn,
		extractContractsFromAst: extractContractsFromAstFn,
		fetchVerifiedContract: fetchVerifiedContractFn,
		loadSolcVersion: loadSolcVersionFn,
		clearCache: clearCacheFn,
	}

	return compiler
}
