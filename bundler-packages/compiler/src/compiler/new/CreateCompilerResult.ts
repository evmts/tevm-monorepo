import type { Releases, SolcAst, SolcLanguage, SolcOutput, SolcSourceEntry } from '@tevm/solc'
import type { Address } from '@tevm/utils'
import type { ASTNode, SourceUnit } from 'solc-typed-ast'
import type { CompilationOutputOption } from './compiler/CompilationOutputOption.js'
import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { CompileFilesResult } from './compiler/CompileFilesResult.js'
import type { CompileSourceResult } from './compiler/CompileSourceResult.js'
import type { CompileSourceWithShadowOptions } from './compiler/CompileSourceWithShadowOptions.js'
import type { WhatsabiBaseOptions } from './whatsabi/WhatsabiBaseOptions.js'

export interface CreateCompilerResult {
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
	 * @param source - Source code string or AST object
	 * @param options - Options for this compilation (merged with factory defaults)
	 * @returns Compilation result with contracts, errors, and solc output
	 */
	compileSource: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		source: TLanguage extends 'SolidityAST' ? SolcAst : string,
		options?: CompileBaseOptions<TLanguage, TCompilationOutput> | undefined,
	) => CompileSourceResult<TCompilationOutput>

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
	 * @param source - Source code or AST to augment
	 * @param shadow - Shadow code to inject (Solidity or Yul)
	 * @param options - Compilation and injection options
	 * @returns Compilation result with augmented contracts
	 */
	compileSourceWithShadow: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		source: TLanguage extends 'SolidityAST' ? SolcAst : string,
		shadow: string,
		options?:
			| (CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>)
			| undefined,
	) => CompileSourceResult<TCompilationOutput>

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
	 * @param files - Array of file paths to compile
	 * @param options - Compilation options
	 * @returns Promise resolving to compilation results keyed by file path
	 */
	compileFiles: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		options?: CompileBaseOptions<TLanguage, TCompilationOutput> | undefined,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	/**
	 * Compiles multiple source files from the filesystem (sync).
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
	 * @param files - Array of file paths to compile
	 * @param options - Compilation options
	 * @returns Compilation results keyed by file path
	 */
	compileFilesSync: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		options?: CompileBaseOptions<TLanguage, TCompilationOutput> | undefined,
	) => CompileFilesResult<TCompilationOutput, TSourcePaths>

	/**
	 * Compiles multiple source files from the filesystem with shadow code injection.
	 *
	 * Similar to {@link compileFiles} but with shadow code injection into a target contract.
	 * You MUST specify injectIntoContractPath to identify which file contains the target contract.
	 *
	 * @param files - Array of file paths to compile
	 * @param shadow - Shadow code to inject
	 * @param options - Compilation and injection options
	 * @returns Promise resolving to compilation results with injected shadow code
	 */
	compileFilesWithShadow: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		shadow: string,
		options?:
			| (CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>)
			| undefined,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	/**
	 * Compiles multiple source files from the filesystem with shadow code injection (sync).
	 *
	 * Similar to {@link compileFiles} but with shadow code injection into a target contract.
	 * You MUST specify injectIntoContractPath to identify which file contains the target contract.
	 *
	 * @param files - Array of file paths to compile
	 * @param shadow - Shadow code to inject
	 * @param options - Compilation and injection options
	 * @returns Compilation results with injected shadow code
	 */
	compileFilesWithShadowSync: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		shadow: string,
		options?:
			| (CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>)
			| undefined,
	) => CompileFilesResult<TCompilationOutput, TSourcePaths>

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
	 * @param solcOutput - Complete solc compilation output
	 * @param options - Options controlling source generation
	 * @returns Map of file paths to regenerated source code
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
	extractContractsFromSolcOutput: (
		solcOutput: SolcOutput,
		options?: CompileBaseOptions | undefined,
	) => { [sourcePath: string]: string }

	/**
	 * Convert SourceUnit AST nodes to Solidity source code
	 *
	 * @param sourceUnits - Array of source units (from solcSourcesToAstNodes)
	 * @param options - Configuration options
	 * @returns Object containing sources mapping and optional source maps
	 * @example
	 * import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
	 * import { solcSourcesToAstNodes } from './internal/solcSourcesToAstNodes.js'
	 * import { createLogger } from '@tevm/logger'
	 *
	 * const logger = createLogger({ name: '@tevm/compiler' })
	 * const sourceUnits = solcSourcesToAstNodes(solcOutput.sources, logger)
	 *
	 * // Manipulate the AST source units...
	 *
	 * // Without source maps
	 * const { sources } = extractContractsFromAstNodes(sourceUnits, {
	 *   solcVersion: '0.8.20'
	 * })
	 *
	 * // With source maps
	 * const { sources, sourceMaps } = extractContractsFromAstNodes(sourceUnits, {
	 *   solcVersion: '0.8.20',
	 *   withSourceMap: true
	 * })
	 */
	extractContractsFromAstNodes: <TWithSourceMap extends boolean = false>(
		sourceUnits: SourceUnit[],
		options?: (CompileBaseOptions & { withSourceMap?: TWithSourceMap }) | undefined,
	) => {
		sources: { [sourcePath: string]: string }
		sourceMaps: TWithSourceMap extends true ? { [sourcePath: string]: Map<ASTNode, [number, number]> } : undefined
	}

	/**
	 * Parse sources object from SolcOutput['sources'] into typed AST SourceUnit nodes
	 *
	 * @param sources - The sources object from SolcOutput.sources
	 * @returns Array of all source units from compilation
	 * @example
	 * import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'
	 *
	 * const sources = solcOutput.sources
	 * const sourceUnits = solcSourcesToAstNodes(sources)
	 * // Returns array of all SourceUnits with cross-references intact
	 */
	solcSourcesToAstNodes: (sources: { [sourceFile: string]: SolcSourceEntry }) => SourceUnit[]

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
	 * @param address - On-chain contract address
	 * @param options - Chain config and API keys
	 */
	fetchVerifiedSource: (address: Address, options: WhatsabiBaseOptions) => Promise<void>

	/**
	 * Loads a specific solc compiler version into the cache (or latest if no version is provided).
	 *
	 * Solc binaries are only downloaded when using this function, which should be done
	 * before any compilation. Only `extractContractsFromSolcOutput` and `extractContractsFromAst`
	 * can be used without solc.
	 *
	 * @param version - Solc version to load (e.g., '0.8.17'). Defaults to latest if not provided.
	 */
	loadSolc: (version?: keyof Releases) => Promise<void>

	/**
	 * Clears the compiled contracts cache.
	 *
	 * Removes all cached solc binaries from disk. Use when:
	 * - Updating to newer compiler versions
	 * - Freeing disk space
	 * - Troubleshooting corrupted downloads
	 * - Running tests that need clean state
	 *
	 * Compilers will be re-downloaded on next use.
	 */
	clearCache: () => Promise<void>
}
