import { createLogger } from '@tevm/logger'
import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { AstParseError, CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { instrumentAst } from './internal/instrumentAst.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

/**
 * Compile multiple sources with shadow code injected into one target source
 *
 * This function allows merging shadow contract code into one of the sources before compilation.
 * All sources are compiled together, and the shadow code is injected into the specified target contract.
 *
 * Steps:
 * 1. Compile/extract ASTs for all sources
 * 2. Identify target source and contract (via injectIntoContractPath and injectIntoContractName)
 * 3. Find injection point (last child node of target contract)
 * 4. Inject shadow code based on merge strategy:
 *    - Safe mode: inject at original source location
 *    - Replace mode: instrument AST (mark functions virtual) → inject at instrumented location
 * 5. Compile all sources together (target source contains shadow code)
 *
 * @template {import('@tevm/solc').SolcLanguage} TSourceLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {Record<string, TSourceLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string>} sources - Mapping of source paths to source code/AST
 * @param {string} shadow - The shadow code to merge into the target contract
 * @param {Omit<import('./CompileBaseOptions.js').CompileBaseOptions<TSourceLanguage, TCompilationOutput>, 'language'> & import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TSourceLanguage>} [options]
 * @returns {Promise<import('./CompileSourcesResult.js').CompileSourcesResult<TCompilationOutput>>}
 *
 * @example
 * import { compileSourcesWithShadow } from '@tevm/compiler'
 *
 * const result = await compileSourcesWithShadow(
 *   {
 *     'contracts/Main.sol': 'contract Main { uint256 private value; }',
 *     'contracts/Helper.sol': 'library Helper { function add(uint a, uint b) internal pure returns (uint) { return a + b; } }'
 *   },
 *   'function getValue() external view returns (uint256) { return value; }',
 *   {
 *     sourceLanguage: 'Solidity',
 *     shadowLanguage: 'Solidity',
 *     injectIntoContractPath: 'contracts/Main.sol',
 *     injectIntoContractName: 'Main',
 *     shadowMergeStrategy: 'safe'
 *   }
 * )
 *
 * const mainAbi = result.compilationResult['contracts/Main.sol'].contract['Main'].abi
 * const helperAbi = result.compilationResult['contracts/Helper.sol'].contract['Helper'].abi
 */
export const compileSourcesWithShadow = async (sources, shadow, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
		options ?? {}
	const validatedOptions = validateBaseOptions(
		Object.values(sources),
		{ ...baseOptions, language: sourceLanguage },
		logger,
	)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return compileSourcesWithShadowInternal(
		solc,
		sources,
		shadow,
		validatedOptions,
		{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
		logger,
	)
}

/**
 * Internal compilation function for multiple sources with shadow code injection
 *
 * This function handles the core shadow injection logic for multiple sources.
 * Used by compileSourcesWithShadow, compileSourceWithShadowInternal, and compileFilesWithShadowInternal.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {Record<string, TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string>} sources - Mapping of source paths to source code/AST
 * @param {string} shadow - The shadow code to inject
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} validatedOptions - Validated compilation options
 * @param {Pick<import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions, 'shadowLanguage' | 'injectIntoContractPath' | 'injectIntoContractName'>} shadowOptions - Shadow-specific options
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {import('./CompileSourcesResult.js').CompileSourcesResult<TCompilationOutput>}
 */
export const compileSourcesWithShadowInternal = (solc, sources, shadow, validatedOptions, shadowOptions, logger) => {
	// Get ASTs for all sources (compile if needed)
	let astSources =
		validatedOptions.language === 'SolidityAST'
			? /** @type {Record<string, import('@tevm/solc').SolcAst>} */ (sources)
			: undefined

	if (!astSources) {
		const { compilationResult } = compileContracts(
			solc,
			sources,
			{ ...validatedOptions, compilationOutput: ['ast'], throwOnCompilationError: true },
			logger,
		)
		astSources = Object.fromEntries(
			Object.entries(compilationResult).map(([sourcePath, result]) => {
				if (!result.ast) {
					const err = new CompilerOutputError(`AST not found for source: ${sourcePath}`, {
						meta: { code: 'missing_source_output' },
					})
					logger.error(err.message)
					throw err
				}
				return [sourcePath, result.ast]
			}),
		)
	}

	const astSourceNodes = solcSourcesToAstNodes(
		Object.fromEntries(Object.entries(astSources).map(([sourcePath, ast]) => [sourcePath, { ast, id: ast.id }])),
		logger,
	)
	const validatedShadowOptions = validateShadowOptions(astSourceNodes, shadowOptions, validatedOptions.language, logger)
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
				: { sources: /** @type {Record<string, string>} */ (sources) }
		// TODO: this is super ugly, we should handle that more consistently upper level
		const targetSourceKey =
			validatedOptions.language === 'SolidityAST'
				? validatedShadowOptions.injectIntoContractPath
				: (Object.entries(astSources).find(
						([_, ast]) =>
							astSourceNodes.find((n) => n.id === ast.id)?.absolutePath ===
							validatedShadowOptions.injectIntoContractPath,
					)?.[0] ?? validatedShadowOptions.injectIntoContractPath)

		const targetSourceCode = /** @type {string} */ (soliditySources[targetSourceKey])

		// Here the contract is unmodified so we can inject into the original source locations
		const lastChildNodeEnd = lastChildNode.sourceInfo.offset + lastChildNode.sourceInfo.length
		const shadowedSolidityTarget = `${targetSourceCode.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${targetSourceCode.slice(lastChildNodeEnd)}`

		logger.debug(`Compiling sources with shadow code injected in safe mode`)
		return compileContracts(
			solc,
			{ ...soliditySources, [targetSourceKey]: shadowedSolidityTarget },
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
		const err = new CompilerOutputError('Source output for target source not found', {
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
	return compileContracts(
		solc,
		{ ...soliditySources, [validatedShadowOptions.injectIntoContractPath]: shadowedSolidityTarget },
		{ ...validatedOptions, language: 'Solidity' },
		logger,
	)
}
