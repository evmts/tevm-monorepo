import { createLogger } from '@tevm/logger'
import { compileFilesInternal } from './compiler/compileFiles.js'
import { compileFilesWithShadowInternal } from './compiler/compileFilesWithShadow.js'
import { compileSourceInternal } from './compiler/compileSource.js'
import { compileSourceWithShadowInternal } from './compiler/compileSourceWithShadow.js'
import { extractContractsFromAst } from './compiler/extractContractsFromAst.js'
import { extractContractsFromSolcOutput } from './compiler/extractContractsFromSolcOutput.js'
import { defaults } from './compiler/internal/defaults.js'
import { SolcError } from './compiler/internal/errors.js'
import { getSolc } from './compiler/internal/getSolc.js'
import { mergeOptions } from './compiler/internal/mergeOptions.js'
import { readSourceFiles } from './compiler/internal/readSourceFiles.js'
import { readSourceFilesSync } from './compiler/internal/readSourceFilesSync.js'
import { validateBaseOptions } from './compiler/internal/validateBaseOptions.js'

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
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	/** @type {import('@tevm/solc').Solc | undefined} */
	let _solcInstance

	/**
	 * @returns {import('@tevm/solc').Solc}
	 */
	const requireSolcLoaded = () => {
		if (_solcInstance) return _solcInstance

		const err = new SolcError('No version of solc loaded, call loadSolc before any compilation', {
			meta: { code: 'not_loaded' },
		})
		logger.error(err.message)
		throw err
	}

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
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'solcVersion'>} compileOptions - Options for this compilation (merged with factory defaults)
	 * @returns {import('./compiler/CompileSourceResult.js').CompileSourceResult<TCompilationOutput>}
	 */
	const compileSourceFn = (source, compileOptions) => {
		const solc = requireSolcLoaded()
		const validatedOptions = validateBaseOptions(source, mergeOptions(options, compileOptions), logger)
		// TODO: we can just compile the ast directly
		const soliditySourceCode =
			validatedOptions.language === 'SolidityAST'
				? extractContractsFromAst(/** @type {import('./compiler/AstInput.js').AstInput} */ (source), validatedOptions)
						.source
				: /** @type {string} */ (source)
		return compileSourceInternal(solc, soliditySourceCode, validatedOptions, logger)
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
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'language' | 'solcVersion'> & import('./compiler/CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TLanguage>} [compileOptions]
	 * @returns {import('./compiler/CompileSourceResult.js').CompileSourceResult<TCompilationOutput>}
	 */
	const compileSourceWithShadowFn = (source, shadow, compileOptions) => {
		const solc = requireSolcLoaded()
		const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
			compileOptions ?? {}
		const validatedOptions = validateBaseOptions(
			source,
			{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
			logger,
		)
		return compileSourceWithShadowInternal(
			solc,
			source,
			shadow,
			validatedOptions,
			{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
			logger,
		)
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
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'solcVersion'>} compileOptions - Compilation options
	 * @returns {Promise<import('./compiler/CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TSourcePaths>>}
	 */
	const compileFilesFn = async (files, compileOptions) => {
		const solc = requireSolcLoaded()
		const mergedOptions = mergeOptions(options, compileOptions)
		const sources = await readSourceFiles(files, mergedOptions?.language, logger)
		const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
		return compileFilesInternal(solc, sources, validatedOptions, logger)
	}

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
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @template {string[]} TSourcePaths
	 * @param {TSourcePaths} files - Array of file paths to compile
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'solcVersion'>} compileOptions - Compilation options
	 * @returns {import('./compiler/CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TSourcePaths>}
	 */
	const compileFilesSyncFn = (files, compileOptions) => {
		const solc = requireSolcLoaded()
		const mergedOptions = mergeOptions(options, compileOptions)
		const sources = readSourceFilesSync(files, mergedOptions?.language, logger)
		const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
		return compileFilesInternal(solc, sources, validatedOptions, logger)
	}

	/**
	 * Compiles multiple source files from the filesystem with shadow code injection.
	 *
	 * Similar to compileFilesWithShadow but with shadow code injection into a target contract.
	 * You MUST specify injectIntoContractPath to identify which file contains the target contract.
	 *
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @template {string[]} TFilePaths
	 * @param {TFilePaths} filePaths - Array of file paths to compile
	 * @param {string} shadow - Shadow code to inject
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'solcVersion'> & import('./compiler/CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TLanguage>} compileOptions - Compilation and injection options
	 * @returns {Promise<import('./compiler/CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>>}
	 */
	const compileFilesWithShadowFn = async (filePaths, shadow, compileOptions) => {
		const solc = requireSolcLoaded()
		const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
			compileOptions ?? {}
		const sources = await readSourceFiles(filePaths, sourceLanguage, logger)
		const validatedOptions = validateBaseOptions(
			/** @type {import('./compiler/internal/validateBaseOptions.js').Source<TLanguage>} */ (Object.values(sources)),
			{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
			logger,
		)
		return compileFilesWithShadowInternal(
			solc,
			sources,
			shadow,
			validatedOptions,
			{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
			logger,
		)
	}

	/**
	 * Compiles multiple source files from the filesystem with shadow code injection (sync).
	 *
	 * Similar to compileFilesWithShadow but with shadow code injection into a target contract.
	 * You MUST specify injectIntoContractPath to identify which file contains the target contract.
	 *
	 * @template {import('@tevm/solc').SolcLanguage} TLanguage
	 * @template {import('./compiler/CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
	 * @template {string[]} TFilePaths
	 * @param {TFilePaths} filePaths - Array of file paths to compile
	 * @param {string} shadow - Shadow code to inject
	 * @param {Omit<import('./compiler/CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'solcVersion'> & import('./compiler/CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TLanguage>} compileOptions - Compilation and injection options
	 * @returns {import('./compiler/CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>}
	 */
	const compileFilesWithShadowSyncFn = (filePaths, shadow, compileOptions) => {
		const solc = requireSolcLoaded()
		const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
			compileOptions ?? {}
		const sources = readSourceFilesSync(filePaths, sourceLanguage, logger)
		const validatedOptions = validateBaseOptions(
			/** @type {import('./compiler/internal/validateBaseOptions.js').Source<TLanguage>} */ (Object.values(sources)),
			{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
			logger,
		)
		return compileFilesWithShadowInternal(
			solc,
			sources,
			shadow,
			validatedOptions,
			{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
			logger,
		)
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
		return extractContractsFromSolcOutput(solcOutput, mergeOptions(options, compileOptions))
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
		const validatedOptions = validateBaseOptions(
			ast,
			{
				...mergeOptions(options, compileOptions),
				language: 'SolidityAST',
			},
			logger,
		)
		const { source } = extractContractsFromAst(ast, { ...validatedOptions, withSourceMap: false })
		return source
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
	 * @param {import('@tevm/utils').Address} _address - On-chain contract address
	 * @param {import('./whatsabi/WhatsabiBaseOptions.js').WhatsabiBaseOptions} _whatsabiOptions - Chain config and API keys
	 * @returns {Promise<void>}
	 */
	const fetchVerifiedContractFn = async (_address, _whatsabiOptions) => {
		// TODO: implement whatsabi integration
	}

	/**
	 * Loads a specific solc compiler version into the cache (or latest if no version is provided).
	 *
	 * Solc binaries are only downloaded when using this function, which should be done
	 * before any compilation. Only `extractContractsFromSolcOutput` and `extractContractsFromAst`
	 * can be used without solc.
	 *
	 * @param {keyof import('@tevm/solc').Releases} [version] - Solc version to load (e.g., '0.8.17')
	 * @returns {Promise<void>}
	 */
	const loadSolcFn = async (version) => {
		_solcInstance = await getSolc(version ?? defaults.solcVersion, logger)
	}

	/**
	 * Clears the compiled contracts cache.
	 *
	 * @returns {Promise<void>}
	 */
	const clearCacheFn = async () => {
		// TODO: implement cache clearing
	}

	return {
		compileSource: compileSourceFn,
		compileSourceWithShadow: compileSourceWithShadowFn,
		compileFiles: compileFilesFn,
		compileFilesSync: compileFilesSyncFn,
		compileFilesWithShadow: compileFilesWithShadowFn,
		compileFilesWithShadowSync: compileFilesWithShadowSyncFn,
		extractContractsFromSolcOutput: extractContractsFromSolcOutputFn,
		extractContractsFromAst: extractContractsFromAstFn,
		fetchVerifiedContract: fetchVerifiedContractFn,
		loadSolc: loadSolcFn,
		clearCache: clearCacheFn,
	}
}
