/**
 * @module @tevm/inline-sol
 * @description Inline Solidity template literal tag for Tevm
 */

import { fileURLToPath } from 'node:url'
import * as compilerModule from '@tevm/compiler'

let inlineCounter = 0

/**
 * Template literal tag for inline Solidity code
 * Compiles the Solidity code inline and returns the contract
 *
 * @example
 * ```ts
 * import { sol } from 'tevm'
 *
 * // Define contract inline
 * const Counter = sol`
 *   pragma solidity ^0.8.19;
 *
 *   contract Counter {
 *     uint256 private count = 0;
 *
 *     function increment() public {
 *       count += 1;
 *     }
 *
 *     function count() public view returns (uint256) {
 *       return count;
 *     }
 *   }
 * `
 *
 * // Use with client.deployContract, client.readContract, etc.
 * const client = createMemoryClient()
 * const deployed = await client.deployContract(Counter)
 * ```
 *
 * @param {TemplateStringsArray} strings - The template literal strings
 * @param {...any} values - The template literal values
 * @returns {import('@tevm/contract').Contract<any,any,any,any>} The compiled contract
 */
export const sol = (strings, ...values) => {
	const source = strings.reduce((result, string, i) => {
		return result + string + (values[i] ?? '')
	}, '')

	// Get caller file info to create unique filename
	const error = new Error()
	const stack = error.stack || ''
	const callerLine = stack.split('\n')[2] || ''
	const match = callerLine.match(/at (.+) \((.+):(\d+):(\d+)\)/) || []

	// Extract file path from stack trace
	const callerFile = match[2] || 'unknown'
	const normalizedPath = callerFile.startsWith('file://') ? fileURLToPath(callerFile) : callerFile

	// Create a unique filename for this inline contract
	// Format: originalFileName_inlineIndex.sol
	const index = inlineCounter++
	const baseName = normalizedPath.split('/').pop() || 'inline'
	const solFileName = `${baseName}_${index}.sol`

	// Default compiler config
	/** @type {import('@tevm/config').ResolvedCompilerConfig} */
	const config = {
		remappings: {},
		libs: [],
		debug: false,
		jsonAsConst: [],
		foundryProject: false,
		cacheDir: `${process.cwd()}/.tevm`,
	}

	try {
		// Create a simple in-memory file system
		/** @type {import('@tevm/compiler').FileAccessObject} */
		const fakeFs = {
			/**
			 * @param {string} file - File path
			 * @param {BufferEncoding} encoding - File encoding
			 * @returns {string}
			 */
			readFileSync: (file, encoding) => {
				if (file === solFileName) return source
				throw new Error(`File not found: ${file}`)
			},
			/**
			 * @param {string} file - File path
			 * @param {BufferEncoding} encoding - File encoding
			 * @returns {Promise<string>}
			 */
			readFile: (file, encoding) => {
				if (file === solFileName) return Promise.resolve(source)
				return Promise.reject(new Error(`File not found: ${file}`))
			},
			/**
			 * @param {string} file - File path
			 * @returns {boolean}
			 */
			existsSync: (file) => file === solFileName,
			/**
			 * @param {string} file - File path
			 * @returns {Promise<boolean>}
			 */
			exists: (file) => Promise.resolve(file === solFileName),
		}

		// Since this is running in user code context, we use the sync API
		// We deliberately use a temporary file that doesn't need to be written to disk
		const result = compilerModule.compiler.compileContractSync(
			solFileName, // filePath
			process.cwd(), // basedir
			/** @type {any} */ (config), // config
			false, // includeAst
			true, // includeBytecode
			fakeFs, // fao
			console, // logger
			undefined, // solc - use default
		)

		return result.contract
	} catch (error) {
		console.error('Error compiling inline Solidity:', error)
		throw error
	}
}
