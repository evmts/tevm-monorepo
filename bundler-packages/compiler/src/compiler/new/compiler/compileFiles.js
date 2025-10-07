import { createLogger } from '@tevm/logger'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { getSolc } from './internal/getSolc.js'
import { readSourceFiles } from './internal/readSourceFiles.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

/**
 * Compile source files from the filesystem
 *
 * Supports multiple languages:
 * - Solidity (.sol files)
 * - Yul (.yul files)
 * - SolidityAST (.json files)
 *
 * All files in a single compilation must be the same language/extension.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @template {string[]} TFilePaths
 * @param {TFilePaths} filePaths - Array of file paths to compile
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>} [options]
 * @returns {Promise<import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>>}
 * @example
 * // Compile Solidity files
 * const result = await compileFiles([
 *   './contracts/Token.sol',
 *   './contracts/Library.sol'
 * ])
 *
 * @example
 * // Compile AST files
 * const result = await compileFiles([
 *   './ast/Contract.json'
 * ], { language: 'SolidityAST' })
 */
export const compileFiles = async (filePaths, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const sources = await readSourceFiles(filePaths, options?.language, logger)
	const validatedOptions = validateBaseOptions(
		// We can simply aggregate the sources regardless of path as this will be used for validating the solc version for compiling the entire set
		/** @type {import('./internal/validateBaseOptions.js').Source<TLanguage>} */ (Object.values(sources)),
		options ?? {},
		logger,
	)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return compileFilesInternal(sources, solc, validatedOptions, logger)
}

/**
 * Internal compilation function that accepts pre-loaded sources and validated options
 *
 * This function handles mixed source types (string and AST), converting AST to Solidity as needed.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @template {string[]} TFilePaths
 * @param {{[filePath: string]: string | import('./AstInput.js').AstInput}} sources - Sources to compile (mixed types allowed)
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} validatedOptions - Validated compilation options
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {Promise<import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>>}
 */
export const compileFilesInternal = async (sources, solc, validatedOptions, logger) => {
	// Convert all sources to Solidity strings, handling mixed types
	/** @type {{[filePath: string]: string}} */
	const soliditySources = {}

	for (const [filePath, source] of Object.entries(sources)) {
		if (typeof source === 'string') {
			// Already a Solidity/Yul string
			soliditySources[filePath] = source
		} else {
			// It's an AST, convert to Solidity
			soliditySources[filePath] = extractContractsFromAst(
				/** @type {import('./AstInput.js').AstInput} */ (source),
				validatedOptions,
			).source
		}
	}

	logger.debug(`Compiling ${Object.keys(soliditySources).length} files`)
	return /** @type {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>} */ (
		compileContracts(soliditySources, solc, validatedOptions, logger)
	)
}
