import { createLogger } from '@tevm/logger'
import { compileFilesInternal } from './compiler/compileFiles.js'
import { compileFilesWithShadowInternal } from './compiler/compileFilesWithShadow.js'
import { compileSourceInternal } from './compiler/compileSource.js'
import { compileSourceWithShadowInternal } from './compiler/compileSourceWithShadow.js'
import { extractContractsFromAstNodes } from './compiler/extractContractsFromAstNodes.js'
import { extractContractsFromSolcOutput } from './compiler/extractContractsFromSolcOutput.js'
import { defaults } from './compiler/internal/defaults.js'
import { SolcError } from './compiler/internal/errors.js'
import { getSolc } from './compiler/internal/getSolc.js'
import { mergeOptions } from './compiler/internal/mergeOptions.js'
import { readSourceFiles } from './compiler/internal/readSourceFiles.js'
import { readSourceFilesSync } from './compiler/internal/readSourceFilesSync.js'
import { validateBaseOptions } from './compiler/internal/validateBaseOptions.js'
import { solcSourcesToAstNodes } from './compiler/solcSourcesToAstNodes.js'

// TODO: reexport solc-typed-ast useful types, e.g. ASTNode, SourceUnit, FunctionVisibility, StateVariableVisibility, etc. for ast manipulation
// TODO: we likely need a compileSources and compileSourcesWithShadow to use mapped sources (e.g. from a whatsabi output)

// TODO: return missing fields + contract (from @tevm/contract) in output

// TODO: bundler;
// from what I understand anything we do with the compiler here the bundler can do and provide a typed API locally
// i.e. using imported contract(s) as source, and writing direct solidity as shadow code, which is exactly the purpose of the "sol``" API

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
	const logger =
		options?.logger ?? createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	let _solcInstance = options?.solc

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

	return {
		compileSource: (source, compileOptions) => {
			const solc = requireSolcLoaded()
			const validatedOptions = validateBaseOptions(source, mergeOptions(options, compileOptions), logger)
			return compileSourceInternal(solc, source, validatedOptions, logger)
		},

		compileSourceWithShadow: (source, shadow, compileOptions) => {
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
		},

		compileFiles: async (files, compileOptions) => {
			const solc = requireSolcLoaded()
			const mergedOptions = mergeOptions(options, compileOptions)
			const sources = await readSourceFiles(files, mergedOptions?.language, logger)
			const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
			return compileFilesInternal(solc, /** @type {any} */ (sources), validatedOptions, logger)
		},

		compileFilesSync: (files, compileOptions) => {
			const solc = requireSolcLoaded()
			const mergedOptions = mergeOptions(options, compileOptions)
			const sources = readSourceFilesSync(files, mergedOptions?.language, logger)
			const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
			return compileFilesInternal(solc, sources, validatedOptions, logger)
		},

		compileFilesWithShadow: async (filePaths, shadow, compileOptions) => {
			const solc = requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const sources = await readSourceFiles(filePaths, sourceLanguage, logger)
			const validatedOptions = validateBaseOptions(
				/** @type {any} */ (Object.values(sources)),
				{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
				logger,
			)
			return compileFilesWithShadowInternal(
				solc,
				/** @type {any} */ (sources),
				shadow,
				validatedOptions,
				{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
				logger,
			)
		},

		compileFilesWithShadowSync: (filePaths, shadow, compileOptions) => {
			const solc = requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const sources = readSourceFilesSync(filePaths, sourceLanguage, logger)
			const validatedOptions = validateBaseOptions(
				/** @type {any} */ (Object.values(sources)),
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
		},

		extractContractsFromSolcOutput: (solcOutput, compileOptions) => {
			return extractContractsFromSolcOutput(solcOutput, mergeOptions(options, compileOptions))
		},

		extractContractsFromAstNodes: (sourceUnits, compileOptions) => {
			return extractContractsFromAstNodes(sourceUnits, {
				...compileOptions,
				...mergeOptions(options, compileOptions),
				language: 'SolidityAST',
			})
		},

		solcSourcesToAstNodes: (sources) => {
			return solcSourcesToAstNodes(sources, logger)
		},

		fetchVerifiedSource: async (_address, _whatsabiOptions) => {
			// TODO: implement whatsabi integration
		},

		loadSolc: async (version) => {
			_solcInstance = await getSolc(version ?? defaults.solcVersion, logger)
		},

		clearCache: async () => {
			// TODO: implement cache clearing
		},
	}
}
