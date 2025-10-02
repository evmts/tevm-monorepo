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
 * @param {string[]} filePaths - Array of file paths to compile
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions} [options]
 * @returns {Promise<import('./CompileFilesResult.js').CompileFilesResult>}
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

	/** @type {{[filePath: string]: string}} */
	const sourcesContent = {}
	for (const filePath of validatedPaths) {
		const absolutePath = resolve(filePath)
		logger.debug(`Reading file: ${absolutePath}`)

		try {
			const content = await readFile(absolutePath, 'utf-8')
			sourcesContent[filePath] = content
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
	}

	// We can roughly concatenate as the only usage of the source is for static analysis of the pragma statements
	// AST input doesn't undergo any validation as the AST reader will do it appropriately
	const validationSource = Object.values(sourcesContent).join('\n')
	const validatedOptions = validateBaseOptions(validationSource, options ?? {}, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	if (validatedOptions.language === 'SolidityAST') {
		logger.debug(`Compiling ${filePaths.length} AST files`)
		// The way we map the output here might be confusing, as we don't map the original AST file path to the output. Rationale is:
		// 1. In the other case (passing Solidity or Yul files), we can map source file -> ast and contract outputs
		// 2. An AST on the other hand can contain multiple contracts _from multiple files_
		// 3. Meaning that each AST file could output source code for multiple original files, which is why mapping an AST source file
		// to a set of contracts from different files does not make sense. Whereas mapping the original source files to the compilation output is more useful,
		// as it will correctly map code and compilation output to original source file locations
		/** @type {{[filePath: string]: string}} */
		const generatedSources = Object.values(sourcesContent).reduce((acc, ast) => {
			return { ...acc, ...extractContractsFromAst(ast, validatedOptions) }
		}, {})

		return compileContracts(generatedSources, solc, validatedOptions, logger)
	}

	logger.debug(`Compiling ${filePaths.length} files`)
	return compileContracts(sourcesContent, solc, validatedOptions, logger)
}
