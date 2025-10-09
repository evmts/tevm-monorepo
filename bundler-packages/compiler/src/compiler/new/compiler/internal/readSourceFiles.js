import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FileReadError } from './errors.js'
import { validateFiles } from './validateFiles.js'

/**
 * Read and parse source files from the filesystem
 *
 * @param {string[]} filePaths - Array of file paths to read
 * @param {import('@tevm/solc').SolcLanguage | undefined} language - Language to determine parsing strategy
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {Promise<{[filePath: string]: string | object}>} Sources keyed by file path
 */
export const readSourceFiles = async (filePaths, language, logger) => {
	const validatedPaths = validateFiles(filePaths, language, logger)
	logger.debug(`Preparing to read ${validatedPaths.length} files`)

	/** @type {{[filePath: string]: string | import('@tevm/solc').SolcAst}} */
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

		if (language === 'SolidityAST') {
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
		} else {
			sources[filePath] = content
		}
	}

	return sources
}
