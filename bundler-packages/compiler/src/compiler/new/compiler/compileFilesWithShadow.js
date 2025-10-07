import { createLogger } from '@tevm/logger'
import { compileFilesInternal } from './compileFiles.js'
import { compileSourceWithShadow } from './compileSourceWithShadow.js'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { AstParseError, CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { instrumentAst } from './internal/instrumentAst.js'
import { readSourceFiles } from './internal/readSourceFiles.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'

/**
 * Compile source files from the filesystem with injected shadow code
 *
 * This function allows merging shadow contract code into one of the source files before compilation.
 * All files are compiled together, and the shadow code is injected into the specified target contract.
 *
 * Supports multiple languages:
 * - Solidity (.sol files)
 * - Yul (.yul files)
 * - SolidityAST (.json files)
 *
 * All files in a single compilation must be the same language/extension.
 *
 * Note: Unlike {@link compileSourceWithShadow}, you MUST provide injectIntoContractPath since we're dealing
 * with multiple files. If there are multiple contracts in that file, you must also provide injectIntoContractName.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @template {string[]} TFilePaths
 * @param {TFilePaths} filePaths - Array of file paths to compile
 * @param {string} shadow - The shadow code to merge into the target contract
 * @param {Omit<import('./CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>, 'language'> & import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} [options]
 * @returns {Promise<import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>>}
 * @example
 * // Compile multiple Solidity files with shadow code
 * const result = await compileFilesWithShadow(
 *   ['./contracts/Token.sol', './contracts/Library.sol'],
 *   'function getValue() external view returns (uint256) { return value; }',
 *   {
 *     sourceLanguage: 'Solidity',
 *     shadowLanguage: 'Solidity',
 *     injectIntoContractPath: './contracts/Token.sol',
 *     injectIntoContractName: 'Token'
 *   }
 * )
 */
export const compileFilesWithShadow = async (filePaths, shadow, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
		options ?? {}

	const sources = await readSourceFiles(filePaths, sourceLanguage, logger)
	const validatedOptions = validateBaseOptions(
		Object.values(sources),
		{ ...baseOptions, language: sourceLanguage },
		logger,
	)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

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
 * Internal compilation function for files with shadow code injection
 *
 * This function handles the core shadow injection logic for multiple files, accepting pre-validated options.
 * Used by both compileFilesWithShadow and potentially by compiler instances.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @template {string[]} TFilePaths
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {{[filePath: string]: string | import('./AstInput.js').AstInput}} sources - Pre-loaded sources
 * @param {string} shadow - The shadow code to inject
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} validatedOptions - Validated compilation options
 * @param {Pick<import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions, 'shadowLanguage' | 'injectIntoContractPath' | 'injectIntoContractName'>} shadowOptions - Shadow-specific options
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>}
 */
export const compileFilesWithShadowInternal = (solc, sources, shadow, validatedOptions, shadowOptions, logger) => {
	// Get ASTs for all sources (compile if needed)
	let astSources =
		validatedOptions.language === 'SolidityAST'
			? /** @type {{[filePath: string]: import('./AstInput.js').AstInput}} */ (sources)
			: undefined
	if (!astSources) {
		const { compilationResult } = compileContracts(
			/** @type {{[filePath: string]: string}} */ (sources),
			solc,
			{ ...validatedOptions, compilationOutput: ['ast'], throwOnCompilationError: true },
			logger,
		)
		astSources = Object.fromEntries(
			Object.entries(compilationResult).map(([filePath, result]) => {
				if (!result.ast) {
					const err = new CompilerOutputError(`Target file AST not found for ${filePath}`, {
						meta: { code: 'missing_source_output' },
					})
					logger.error(err.message)
					throw err
				}
				return [filePath, /** @type {import('@tevm/solc').SolcAst} */ (result.ast)]
			}),
		)
	}

	// Validate shadow options and determine target contract
	const validatedShadowOptions = validateShadowOptions(
		Object.values(astSources),
		shadowOptions,
		validatedOptions.language,
		true, // validate path since we have multiple files
		logger,
	)
	const targetAstSourceNode = /** @type {import('solc-typed-ast').SourceUnit} */ (
		validatedShadowOptions.astSourceNodes.find(
			(node) => node.absolutePath === validatedShadowOptions.injectIntoContractPath,
		)
	)

	// Get the target contract's last child node to know where to inject the shadow code
	const lastChildNode = targetAstSourceNode.vContracts.find(
		(contract) => contract.name === validatedShadowOptions.injectIntoContractName,
	)?.lastChild
	if (!lastChildNode) {
		const err = new AstParseError('Target contract does not contain any children', {
			meta: { code: 'invalid_source_ast' },
		})
		logger.error(err.message)
		throw err
	}

	// Get the original source code for the target file
	const targetSourceCode =
		validatedOptions.language === 'SolidityAST'
			? extractContractsFromAst(targetAstSourceNode, validatedOptions).source
			: /** @type {string} */ (sources[validatedShadowOptions.injectIntoContractPath])

	// Inject shadow code based on merge strategy
	/** @type {string} */
	let shadowedTargetSource
	if (validatedShadowOptions.shadowMergeStrategy === 'safe') {
		// Safe mode: inject directly at the original source location
		const lastChildNodeEnd = lastChildNode.sourceInfo.offset + lastChildNode.sourceInfo.length
		shadowedTargetSource = `${targetSourceCode.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${targetSourceCode.slice(lastChildNodeEnd)}`
	} else {
		// shadowMergeStrategy = 'replace'
		// Replace mode: instrument the AST to make functions overrideable by shadow methods
		const instrumentedTargetAst = instrumentAst(
			targetAstSourceNode,
			{
				markFunctionsAsVirtual: true,
				contractFilter: validatedShadowOptions.injectIntoContractName,
			},
			logger,
		)

		const { source: instrumentedSoliditySource, sourceMap: instrumentedMap } = extractContractsFromAst(
			instrumentedTargetAst,
			{ ...validatedOptions, withSourceMap: true },
		)

		// Look up the lastChild node in the instrumented map to get its new location
		const instrumentedLocation = instrumentedMap.get(lastChildNode)
		if (!instrumentedLocation) {
			const err = new AstParseError('Failed to locate injection point in instrumented code', {
				meta: { code: 'invalid_instrumented_ast' },
			})
			logger.error(err.message)
			throw err
		}

		// Inject shadow code at the correct location in the instrumented source
		const lastChildNodeEnd = instrumentedLocation[0] + instrumentedLocation[1]
		shadowedTargetSource = `${instrumentedSoliditySource.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${instrumentedSoliditySource.slice(lastChildNodeEnd)}`
	}

	logger.debug(`Compiling ${Object.keys(sources).length} files with shadow code injected`)
	return compileFilesInternal(
		solc,
		{ ...sources, [validatedShadowOptions.injectIntoContractPath]: shadowedTargetSource },
		validatedOptions,
		logger,
	)
}
