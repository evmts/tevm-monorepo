import { createLogger } from '@tevm/logger'
import { compileSourceInternal } from './compiler/compileSource.js'
import { compileSourcesWithShadowInternal } from './compiler/compileSourcesWithShadow.js'
import { compileSourceWithShadowInternal } from './compiler/compileSourceWithShadow.js'
import { extractContractsFromAstNodes } from './compiler/extractContractsFromAstNodes.js'
import { extractContractsFromSolcOutput } from './compiler/extractContractsFromSolcOutput.js'
import { compileContracts } from './compiler/internal/compileContracts.js'
import { defaults } from './compiler/internal/defaults.js'
import { SolcError } from './compiler/internal/errors.js'
import { getSolc } from './compiler/internal/getSolc.js'
import { mergeOptions } from './compiler/internal/mergeOptions.js'
import { readSourceFiles } from './compiler/internal/readSourceFiles.js'
import { readSourceFilesSync } from './compiler/internal/readSourceFilesSync.js'
import { validateBaseOptions } from './compiler/internal/validateBaseOptions.js'
import { solcSourcesToAstNodes } from './compiler/solcSourcesToAstNodes.js'

// TODO: reexport solc-typed-ast useful types, e.g. ASTNode, SourceUnit, FunctionVisibility, StateVariableVisibility, etc. for ast manipulation

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
	/** @type {string | undefined} */
	let _solcVersion = options?.solc?.semver

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
	 * Ensure the loaded solc matches the requested version. The stateful compiler
	 * lazily reloads solc when callers pass a per-call `solcVersion` override that
	 * differs from the currently-loaded instance.
	 *
	 * @param {string | undefined} requestedVersion
	 * @returns {Promise<import('@tevm/solc').Solc>}
	 */
	const requireSolcLoadedAsync = async (requestedVersion) => {
		if (requestedVersion && requestedVersion !== _solcVersion) {
			logger.debug(`Loading solc ${requestedVersion} (currently loaded: ${_solcVersion ?? 'none'})`)
			_solcInstance = await getSolc(/** @type {any} */ (requestedVersion), logger)
			_solcVersion = requestedVersion
		}
		return requireSolcLoaded()
	}

	/**
	 * Sync variant: assert the loaded solc matches. Throws if a per-call solcVersion
	 * was passed that requires re-loading (callers must use loadSolc() up front).
	 *
	 * @param {string | undefined} requestedVersion
	 * @returns {import('@tevm/solc').Solc}
	 */
	const requireSolcLoadedSync = (requestedVersion) => {
		const solc = requireSolcLoaded()
		if (requestedVersion && _solcVersion && requestedVersion !== _solcVersion) {
			const err = new SolcError(
				`Requested solc version ${requestedVersion} differs from loaded ${_solcVersion}. Call loadSolc(${requestedVersion}) before sync compilation, or use the async equivalent.`,
				{ meta: { code: 'version_mismatch_sync' } },
			)
			logger.error(err.message)
			throw err
		}
		return solc
	}

	return {
		compileSource: (source, compileOptions) => {
			requireSolcLoaded()
			const validatedOptions = validateBaseOptions(source, mergeOptions(options, compileOptions), logger)
			const solc = requireSolcLoadedSync(validatedOptions.solcVersion)
			return compileSourceInternal(solc, source, validatedOptions, logger)
		},

		compileSources: (sources, compileOptions) => {
			requireSolcLoaded()
			const validatedOptions = validateBaseOptions(
				Object.values(sources),
				mergeOptions(options, compileOptions),
				logger,
			)
			const solc = requireSolcLoadedSync(validatedOptions.solcVersion)
			return compileContracts(solc, sources, validatedOptions, logger)
		},

		compileSourceWithShadow: async (source, shadow, compileOptions) => {
			requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const validatedOptions = validateBaseOptions(
				source,
				{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
				logger,
			)
			const solc = await requireSolcLoadedAsync(validatedOptions.solcVersion)
			return compileSourceWithShadowInternal(
				solc,
				source,
				shadow,
				validatedOptions,
				{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
				logger,
			)
		},

		compileSourcesWithShadow: async (sources, shadow, compileOptions) => {
			requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const validatedOptions = validateBaseOptions(
				Object.values(sources),
				{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
				logger,
			)
			const solc = await requireSolcLoadedAsync(validatedOptions.solcVersion)
			return compileSourcesWithShadowInternal(
				solc,
				sources,
				shadow,
				validatedOptions,
				{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
				logger,
			)
		},

		compileFiles: async (files, compileOptions) => {
			requireSolcLoaded()
			const mergedOptions = mergeOptions(options, compileOptions)
			const sources = await readSourceFiles(files, mergedOptions?.language, logger)
			const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
			const solc = await requireSolcLoadedAsync(validatedOptions.solcVersion)
			return /** @type {any} */ (compileContracts(solc, /** @type {any} */ (sources), validatedOptions, logger))
		},

		compileFilesSync: (files, compileOptions) => {
			requireSolcLoaded()
			const mergedOptions = mergeOptions(options, compileOptions)
			const sources = readSourceFilesSync(files, mergedOptions?.language, logger)
			const validatedOptions = validateBaseOptions(Object.values(sources), mergedOptions, logger)
			const solc = requireSolcLoadedSync(validatedOptions.solcVersion)
			return /** @type {any} */ (compileContracts(solc, /** @type {any} */ (sources), validatedOptions, logger))
		},

		compileFilesWithShadow: async (filePaths, shadow, compileOptions) => {
			requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const sources = await readSourceFiles(filePaths, sourceLanguage, logger)
			const validatedOptions = validateBaseOptions(
				/** @type {any} */ (Object.values(sources)),
				{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
				logger,
			)
			const solc = await requireSolcLoadedAsync(validatedOptions.solcVersion)
			return /** @type {any} */ (
				compileSourcesWithShadowInternal(
					solc,
					/** @type {any} */ (sources),
					shadow,
					validatedOptions,
					{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
					logger,
				)
			)
		},

		compileFilesWithShadowSync: (filePaths, shadow, compileOptions) => {
			requireSolcLoaded()
			const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
				compileOptions ?? {}
			const sources = readSourceFilesSync(filePaths, sourceLanguage, logger)
			const validatedOptions = validateBaseOptions(
				/** @type {any} */ (Object.values(sources)),
				{ ...mergeOptions(options, baseOptions), language: sourceLanguage },
				logger,
			)
			const solc = requireSolcLoadedSync(validatedOptions.solcVersion)
			return /** @type {any} */ (
				compileSourcesWithShadowInternal(
					solc,
					/** @type {any} */ (sources),
					shadow,
					validatedOptions,
					{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
					logger,
				)
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
			const resolved = version ?? defaults.solcVersion
			_solcInstance = await getSolc(resolved, logger)
			_solcVersion = resolved
		},

		clearCache: async () => {
			// TODO: implement cache clearing
		},
	}
}
