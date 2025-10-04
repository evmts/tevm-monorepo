import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createLogger } from '@tevm/logger'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { FileReadError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateFiles } from './internal/validateFiles.js'

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
	const validatedPaths = validateFiles(filePaths, options?.language, logger)
	logger.debug(`Preparing to compile ${validatedPaths.length} files`)

	/** @type {{[filePath: string]: string | object}} */
	const sources = {}
	for (const filePath of validatedPaths) {
		const absolutePath = resolve(filePath)
		logger.debug(`Reading file: ${absolutePath}`)

		/** @type {string} */
		let content
		try {
			content = await readFile(absolutePath, 'utf-8')
		} catch (error) {
			const err = new FileReadError(`Failed to read file ${filePath}`, {
				cause: error,
				meta: {
					code: 'read_failed',
					filePath,
					absolutePath,
				},
			})
			logger.error(err.message)
			throw err
		}

		if (options?.language === 'SolidityAST') {
			try {
				sources[filePath] = JSON.parse(content)
			} catch (error) {
				const err = new FileReadError(`Failed to parse JSON file ${filePath}`, {
					cause: error,
					meta: { code: 'json_parse_failed', filePath, absolutePath },
				})
				logger.error(err.message)
				throw err
			}
		}
	}

	const validatedOptions = validateBaseOptions(
		// We can simply aggregate the sources regardless of path as this will be used for validating the solc version for compiling the entire set
		/** @type {import('./internal/validateBaseOptions.js').Source<TLanguage>} */ (Object.values(sources)),
		options ?? {},
		logger,
	)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	if (validatedOptions.language === 'SolidityAST') {
		logger.debug(`Compiling ${filePaths.length} AST files`)
		const soliditySources = Object.fromEntries(
			Object.entries(sources).map(([filePath, ast]) => [
				filePath,
				extractContractsFromAst(/** @type {import('./AstInput.js').AstInput} */ (ast), validatedOptions),
			]),
		)

		return /** @type {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>} */ (
			compileContracts(soliditySources, solc, validatedOptions, logger)
		)
	}

	logger.debug(`Compiling ${filePaths.length} files`)
	return /** @type {import('./CompileFilesResult.js').CompileFilesResult<TCompilationOutput, TFilePaths>} */ (
		compileContracts(/** @type {{[filePath: string]: string}} */ (sources), solc, validatedOptions, logger)
	)
}
