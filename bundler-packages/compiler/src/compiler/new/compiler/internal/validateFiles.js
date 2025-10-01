import { FileValidationError } from './errors.js'

/**
 * Validate file paths and ensure they match the language requirements
 *
 * @param {string[]} filePaths - Array of file paths to validate
 * @param {import('@tevm/solc').SolcLanguage} [language] - Optional language to validate against
 * @param {import('../../types.js').Logger} [logger] - The logger
 * @returns {string[]} The validated file paths
 * @throws {FileValidationError} If file paths are invalid
 * @throws {MixedFileExtensionsError} If files have different extensions
 * @throws {InvalidExtensionForLanguageError} If extensions don't match the language
 */
export const validateFiles = (filePaths, language, logger = console) => {
	if (!Array.isArray(filePaths)) {
		const err = new FileValidationError('File paths must be an array', {
			meta: { code: 'invalid_array', filePaths },
		})
		logger.error(err.message)
		throw err
	}

	if (filePaths.length === 0) {
		const err = new FileValidationError('At least one file path must be provided', {
			meta: { code: 'empty_array', filePaths },
		})
		logger.error(err.message)
		throw err
	}

	for (const filePath of filePaths) {
		if (typeof filePath !== 'string' || filePath.trim() === '') {
			const err = new FileValidationError(`Invalid file path: ${filePath}`, {
				meta: {
					code: 'invalid_path',
					filePaths,
					invalidPath: filePath,
				},
			})
			logger.error(err.message)
			throw err
		}
	}

	// TODO: decide if we do want to validate extensions and be so restrictive or just let it go (it will fail during compilation/parsing)
	const extensions = [
		...new Set(
			filePaths.map((path) => {
				const lastDot = path.lastIndexOf('.')
				return lastDot === -1 ? '' : path.slice(lastDot)
			}),
		),
	]

	// We can only compile one language at a time
	if (extensions.length > 1) {
		const err = new FileValidationError(`All files must have the same extension. Found: ${extensions.join(', ')}`, {
			meta: {
				code: 'mixed_extensions',
				filePaths,
				extensions,
			},
		})
		logger.error(err.message)
		throw err
	}

	const extension = extensions[0]
	if (!extension) {
		const err = new FileValidationError('All files must have an extension', {
			meta: { code: 'no_extension', filePaths },
		})
		logger.error(err.message)
		throw err
	}

	// If language is explicitly provided, validate extension matches
	if (language) {
		const expectedExtension = language === 'SolidityAST' ? '.json' : language === 'Yul' ? '.yul' : '.sol'
		if (expectedExtension !== extension) {
			const err = new FileValidationError(
				`Files with extension '${extension}' cannot be compiled as '${language}'. Expected: ${expectedExtension}`,
				{
					meta: {
						code: 'extension_mismatch',
						language,
						extension,
						expectedExtension,
					},
				},
			)
			logger.error(err.message)
			throw err
		}

		logger.debug(`Validated ${filePaths.length} files with extension '${extension}' for language '${language}'`)
	} else {
		if (extension !== '.sol' && extension !== '.yul' && extension !== '.json') {
			const err = new FileValidationError(`Unsupported file extension '${extension}'. Supported: .sol, .yul, .json`, {
				meta: {
					code: 'unsupported_extension',
					filePaths,
					invalidPath: /** @type {string} */ (filePaths[0]),
				},
			})
			logger.error(err.message)
			throw err
		}
		logger.debug(
			`Validated ${filePaths.length} files with extension '${extension}'; language will be set to ${extension === '.json' ? 'SolidityAST' : extension === '.yul' ? 'Yul' : 'Solidity'}`,
		)
	}

	return filePaths
}
