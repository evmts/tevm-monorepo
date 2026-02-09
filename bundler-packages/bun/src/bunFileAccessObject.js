import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { file } from './bunFile.js'

/**
 * An adapter around the Bun file API that implements the FileAccessObject interface
 * required by @tevm/base-bundler.
 *
 * This object combines Node.js file system functions with Bun's optimized file API
 * to provide a complete implementation of the FileAccessObject interface, which is
 * used by Tevm bundlers to read and write files during the Solidity compilation process.
 *
 * @type {import("@tevm/base-bundler").FileAccessObject}
 *
 * @example
 * ```javascript
 * import { bunFileAccesObject } from '@tevm/bun'
 * import { bundler } from '@tevm/base-bundler'
 *
 * // Use in Tevm bundler
 * const tevmBundler = bundler(
 *   config,
 *   console,
 *   bunFileAccesObject, // Pass the file access object
 *   solcCompiler,
 *   cacheInstance
 * )
 *
 * // Or use directly
 * const fileExists = await bunFileAccesObject.exists('./contracts/Token.sol')
 * if (fileExists) {
 *   const content = await bunFileAccesObject.readFile('./contracts/Token.sol', 'utf8')
 *   console.log(content)
 * }
 * ```
 *
 * @see {@link https://bun.sh/docs/api/file-io | Bun File I/O Documentation}
 */
export const bunFileAccesObject = {
	/**
	 * Synchronously checks if a file exists
	 * @param {string} path - Path to the file
	 * @returns {boolean} - True if the file exists, false otherwise
	 */
	existsSync,

	/**
	 * Asynchronously checks if a file exists using Bun's optimized file API
	 * @param {string} filePath - Path to the file
	 * @returns {Promise<boolean>} - Promise resolving to true if the file exists, false otherwise
	 */
	exists: (filePath) => {
		const bunFile = file(filePath)
		return bunFile.exists()
	},

	/**
	 * Asynchronously reads a file as text using Bun's optimized file API
	 * @param {string} filePath - Path to the file
	 * @param {BufferEncoding} _encoding - Encoding (ignored, Bun defaults to utf8)
	 * @returns {Promise<string>} - Promise resolving to the file contents
	 */
	readFile: (filePath, _encoding) => {
		const bunFile = file(filePath)
		return bunFile.text()
	},

	/**
	 * Synchronously reads a file as text
	 * @param {string} path - Path to the file
	 * @param {BufferEncoding} encoding - Encoding to use
	 * @returns {string} - File contents
	 */
	readFileSync,

	/**
	 * Synchronously writes data to a file using Bun's optimized file API
	 * @param {string} filePath - Path to the file
	 * @param {string} data - Data to write
	 * @returns {number} - Non 0 if successful
	 */
	writeFileSync: (filePath, data) => {
		const bunFile = file(filePath)
		return /** @type {number} */ (bunFile.writer().write(data))
	},

	/**
	 * Synchronously gets file stats
	 * @param {string} path - Path to the file
	 * @returns {import('fs').Stats} - File stats
	 */
	statSync,

	/**
	 * Asynchronously gets file stats
	 * @param {string} path - Path to the file
	 * @returns {Promise<import('fs').Stats>} - Promise resolving to file stats
	 */
	stat,

	/**
	 * Synchronously creates a directory
	 * @param {string} path - Path to create
	 * @param {import('fs').MakeDirectoryOptions} [options] - Options
	 * @returns {string|undefined} - The first directory path created, or undefined
	 */
	mkdirSync,

	/**
	 * Asynchronously creates a directory
	 * @param {string} path - Path to create
	 * @param {import('fs').MakeDirectoryOptions} [options] - Options
	 * @returns {Promise<string|undefined>} - Promise resolving to the first directory path created, or undefined
	 */
	mkdir,

	/**
	 * Asynchronously writes data to a file
	 * @param {string} path - Path to the file
	 * @param {string|NodeJS.ArrayBufferView} data - Data to write
	 * @param {import('fs').WriteFileOptions} [options] - Options
	 * @returns {Promise<void>} - Promise resolving when write is complete
	 */
	writeFile,
}
