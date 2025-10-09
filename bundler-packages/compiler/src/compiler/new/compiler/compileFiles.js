import { createLogger } from '@tevm/logger'
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
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
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
		Object.values(sources),
		options,
		logger,
	)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return /** @type {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>} */ (
		compileContracts(
			solc,
			/** @type {{[filePath: string]: TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string}} */ (
				sources
			),
			validatedOptions,
			logger,
		)
	)
}
