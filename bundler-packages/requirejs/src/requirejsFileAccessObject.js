import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'

/**
 * An adapter around the Node.js fs API that implements the FileAccessObject interface
 * required by @tevm/base-bundler.
 *
 * This object provides a complete implementation of the FileAccessObject interface using
 * standard Node.js file system functions, which is used by Tevm bundlers to read and write
 * files during the Solidity compilation process.
 *
 * @type {import("@tevm/base-bundler").FileAccessObject}
 *
 * @example
 * ```javascript
 * import { requirejsFileAccessObject } from '@tevm/requirejs'
 * import { bundler } from '@tevm/base-bundler'
 *
 * // Use in Tevm bundler
 * const tevmBundler = bundler(
 *   config,
 *   console,
 *   requirejsFileAccessObject, // Pass the file access object
 *   solcCompiler,
 *   cacheInstance
 * )
 *
 * // Or use directly
 * const fileExists = await requirejsFileAccessObject.exists('./contracts/Token.sol')
 * if (fileExists) {
 *   const content = await requirejsFileAccessObject.readFile('./contracts/Token.sol', 'utf8')
 *   console.log(content)
 * }
 * ```
 *
 * @see {@link https://nodejs.org/api/fs.html | Node.js File System Documentation}
 */
export const requirejsFileAccessObject = {
	/**
	 * Synchronously checks if a file exists
	 * @param {string} path - Path to the file
	 * @returns {boolean} - True if the file exists, false otherwise
	 */
	existsSync,

	/**
	 * Asynchronously checks if a file exists
	 * @param {string} filePath - Path to the file
	 * @returns {Promise<boolean>} - Promise resolving to true if the file exists, false otherwise
	 */
	exists: async (filePath) => {
		try {
			await stat(filePath)
			return true
		} catch {
			return false
		}
	},

	/**
	 * Asynchronously reads a file as text
	 * @param {string} filePath - Path to the file
	 * @param {BufferEncoding} encoding - Encoding to use
	 * @returns {Promise<string>} - Promise resolving to the file contents
	 */
	readFile: async (filePath, encoding) => {
		const buffer = await readFile(filePath)
		return buffer.toString(encoding)
	},

	/**
	 * Synchronously reads a file as text
	 * @param {string} path - Path to the file
	 * @param {BufferEncoding} encoding - Encoding to use
	 * @returns {string} - File contents
	 */
	readFileSync,

	/**
	 * Synchronously writes data to a file
	 * @param {string} filePath - Path to the file
	 * @param {string} data - Data to write
	 * @returns {void}
	 */
	writeFileSync: (filePath, data) => {
		const fs = require('node:fs')
		fs.writeFileSync(filePath, data, 'utf8')
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
