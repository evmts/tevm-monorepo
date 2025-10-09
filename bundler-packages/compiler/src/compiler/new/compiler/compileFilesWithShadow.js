import { createLogger } from '@tevm/logger'
import { compileSourcesWithShadowInternal } from './compileSourcesWithShadow.js'
import { defaults } from './internal/defaults.js'
import { getSolc } from './internal/getSolc.js'
import { readSourceFiles } from './internal/readSourceFiles.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

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

	return /** @type {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>} */ (
		compileSourcesWithShadowInternal(
			solc,
			/** @type {{[filePath: string]: string | import('@tevm/solc').SolcAst}} */ (sources),
			shadow,
			validatedOptions,
			{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
			logger,
		)
	)
}
