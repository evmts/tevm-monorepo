import { createLogger } from '@tevm/logger'
import { compileFilesInternal } from './compileFiles.js'
import { compileSourceWithShadow } from './compileSourceWithShadow.js'
import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { AstParseError, CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { instrumentAst } from './internal/instrumentAst.js'
import { readSourceFiles } from './internal/readSourceFiles.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

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
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
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
 * @see {@link compileSourceWithShadow}
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
		/** @type {{[filePath: string]: string | import('@tevm/solc').SolcAst}} */ (sources),
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
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @template {string[]} TFilePaths
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {{[filePath: string]: TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string}} sources - Pre-loaded sources
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
			? /** @type {{[filePath: string]: import('@tevm/solc').SolcAst}} */ (sources)
			: undefined

	if (!astSources) {
		const { compilationResult } = compileContracts(
			solc,
			sources,
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
				return [filePath, result.ast]
			}),
		)
	}

	const astSourceNodes = solcSourcesToAstNodes(
		Object.fromEntries(Object.entries(astSources).map(([filePath, ast]) => [filePath, { ast, id: ast.id }])),
		logger,
	)
	const validatedShadowOptions = validateShadowOptions(
		astSourceNodes,
		shadowOptions,
		validatedOptions.language,
		true, // validate path since we have multiple files
		logger,
	)
	const targetAstSourceNode = /** @type {import('solc-typed-ast').SourceUnit} */ (
		astSourceNodes.find((node) => node.absolutePath === validatedShadowOptions.injectIntoContractPath)
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

	// Inject shadow code based on merge strategy
	if (validatedShadowOptions.shadowMergeStrategy === 'safe') {
		// We need to extract Solidity code from all sources to compile back together after injecting the shadow code
		const { sources: soliditySources } =
			validatedOptions.language === 'SolidityAST'
				? extractContractsFromAstNodes(astSourceNodes, validatedOptions)
				: { sources: /** @type {{[filePath: string]: string}} */ (sources) }
		// Get the original source code for the target file
		const targetSourceCode = /** @type {string} */ (soliditySources[validatedShadowOptions.injectIntoContractPath])

		// Here the contract is unmodified so we can inject into the original source locations
		const lastChildNodeEnd = lastChildNode.sourceInfo.offset + lastChildNode.sourceInfo.length
		const shadowedSolidityTarget = `${targetSourceCode.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${targetSourceCode.slice(lastChildNodeEnd)}`

		logger.debug(`Compiling source with shadow code injected in safe mode`)
		return compileFilesInternal(
			solc,
			{ ...soliditySources, [validatedShadowOptions.injectIntoContractPath]: shadowedSolidityTarget },
			{ ...validatedOptions, language: 'Solidity' },
			logger,
		)
	}

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

	// Extract Solidity from source nodes with the target node replaced with its instrumented AST
	const { sources: soliditySources, sourceMaps } = extractContractsFromAstNodes(
		[...astSourceNodes.filter((node) => node.absolutePath !== targetAstSourceNode.absolutePath), instrumentedTargetAst],
		{
			...validatedOptions,
			withSourceMap: true,
		},
	)
	const instrumentedSolidityTarget = /** @type {string} */ (
		soliditySources[validatedShadowOptions.injectIntoContractPath]
	)
	const instrumentedMap = sourceMaps[validatedShadowOptions.injectIntoContractPath]
	if (!instrumentedSolidityTarget || !instrumentedMap) {
		const err = new CompilerOutputError('Source output for target file not found', {
			meta: { code: 'missing_source_output' },
		})
		logger.error(err.message)
		throw err
	}

	// Look up the lastChild node in the instrumented map to get its new location
	const instrumentedLocation = instrumentedMap.get(lastChildNode)
	if (!instrumentedLocation) {
		const err = new AstParseError('Failed to locate injection point in instrumented code', {
			meta: { code: 'invalid_instrumented_ast' },
		})
		logger.error(err.message)
		throw err
	}

	// Now we can safely inject shadow code at the correct location
	const lastChildNodeEnd = instrumentedLocation[0] + instrumentedLocation[1]
	const shadowedSolidityTarget = `${instrumentedSolidityTarget.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${instrumentedSolidityTarget.slice(lastChildNodeEnd)}`
	return compileFilesInternal(
		solc,
		{ ...soliditySources, [validatedShadowOptions.injectIntoContractPath]: shadowedSolidityTarget },
		{ ...validatedOptions, language: 'Solidity' },
		logger,
	)
}
