import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
// @ts-expect-error
import defaultSolc from 'solc'

/**
 * Default file access object implementation using Node.js file system APIs.
 *
 * This object provides a unified interface for file system operations that works
 * consistently across different build tools. It implements the FileAccessObject
 * interface required by the Tevm bundler system, providing both synchronous and
 * asynchronous file operations.
 *
 * The file access object is used for:
 * - Reading Solidity source files
 * - Writing compiled artifacts to the cache
 * - Checking if files exist
 * - Creating directories for cache storage
 * - Getting file metadata (stats)
 *
 * @type {import("@tevm/base-bundler").FileAccessObject}
 *
 * @example
 * ```javascript
 * import { fao } from '@tevm/unplugin'
 * import { bundler } from '@tevm/base-bundler'
 *
 * // Use the file access object with the bundler
 * const tevmBundler = bundler(
 *   config,
 *   console,
 *   fao,   // Pass the file access object
 *   solc,
 *   cache
 * )
 * ```
 *
 * @internal This is primarily used internally by the unplugin implementation
 */
export const fao = {
	/**
	 * Synchronously checks if a file exists
	 * @param {string} path - Path to the file
	 * @returns {boolean} - True if the file exists, false otherwise
	 */
	existsSync,

	/**
	 * Asynchronously reads a file as text
	 * @param {string} path - Path to the file
	 * @param {BufferEncoding} encoding - File encoding
	 * @returns {Promise<string>} - Promise resolving to file contents
	 */
	readFile,

	/**
	 * Synchronously reads a file as text
	 * @param {string} path - Path to the file
	 * @param {BufferEncoding} encoding - File encoding
	 * @returns {string} - File contents
	 */
	readFileSync,

	/**
	 * Synchronously writes data to a file
	 * @param {string} path - Path to the file
	 * @param {string} data - Data to write
	 * @returns {void}
	 */
	writeFileSync,

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
	 * @returns {string|undefined} - Path to created directory
	 */
	mkdirSync,

	/**
	 * Asynchronously writes data to a file
	 * @param {string} path - Path to the file
	 * @param {string} data - Data to write
	 * @returns {Promise<void>} - Promise that resolves when write is complete
	 */
	writeFile,

	/**
	 * Asynchronously creates a directory
	 * @param {string} path - Path to create
	 * @param {import('fs').MakeDirectoryOptions} [options] - Options
	 * @returns {Promise<string|undefined>} - Promise resolving to created directory path
	 */
	mkdir,

	/**
	 * Asynchronously checks if a file exists
	 * @param {string} path - Path to the file
	 * @returns {Promise<boolean>} - Promise resolving to true if file exists, false otherwise
	 */
	exists: async (path) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}
