import { getArtifactsPath } from './getArtifactsPath.js'
import { readArtifacts } from './readArtifacts.js'
import { readArtifactsSync } from './readArtifactsSync.js'
import { writeArtifacts } from './writeArtifacts.js'
import { writeArtifactsSync } from './writeArtifactsSync.js'

/**
 * Creates a cache object for reading and writing Solidity compilation artifacts
 * and generated code files.
 *
 * The cache system helps improve build performance by storing compiled Solidity artifacts
 * and generated TypeScript/JavaScript files on disk, avoiding unnecessary recompilation
 * when source files haven't changed.
 *
 * This cache is used by various Tevm bundler plugins to provide consistent and efficient
 * caching across different build systems.
 *
 * @param {string} cacheDir - Directory where cache files will be stored (relative to cwd)
 * @param {import('./types.js').FileAccessObject} fs - File system interface for reading/writing
 * @param {string} cwd - Current working directory, used as base for resolving paths
 * @returns {import('./types.js').Cache} Cache object with methods for reading and writing
 *
 * @example
 * ```javascript
 * import { createCache } from '@tevm/bundler-cache'
 * import { bundler } from '@tevm/base-bundler'
 * import * as fs from 'node:fs'
 * import * as fsPromises from 'node:fs/promises'
 *
 * // Create a file access object
 * const fileAccess = {
 *   readFile: fsPromises.readFile,
 *   readFileSync: fs.readFileSync,
 *   writeFile: fsPromises.writeFile,
 *   writeFileSync: fs.writeFileSync,
 *   exists: async (path) => fs.existsSync(path),
 *   existsSync: fs.existsSync,
 *   statSync: fs.statSync,
 *   stat: fsPromises.stat,
 *   mkdirSync: fs.mkdirSync,
 *   mkdir: fsPromises.mkdir
 * }
 *
 * // Create the cache
 * const cache = createCache('.tevm', fileAccess, process.cwd())
 *
 * // Later, use with the bundler
 * const myBundler = bundler(
 *   tevmConfig,
 *   console,
 *   fileAccess,
 *   solcCompiler,
 *   cache // Pass the cache instance
 * )
 * ```
 */
export const createCache = (cacheDir, fs, cwd) => {
	return {
		/**
		 * Synchronously writes compiled Solidity artifacts to the cache
		 * @param {string} entryModuleId - Path to the Solidity file being cached
		 * @param {import('@tevm/compiler').ResolvedArtifacts} compiledContracts - Compilation result
		 * @returns {string} Path where artifacts were written
		 */
		writeArtifactsSync: (entryModuleId, compiledContracts) => {
			return writeArtifactsSync(cwd, cacheDir, entryModuleId, compiledContracts, fs)
		},

		/**
		 * Asynchronously writes compiled Solidity artifacts to the cache
		 * @param {string} entryModuleId - Path to the Solidity file being cached
		 * @param {import('@tevm/compiler').ResolvedArtifacts} compiledContracts - Compilation result
		 * @returns {Promise<string>} Path where artifacts were written
		 */
		writeArtifacts: async (entryModuleId, compiledContracts) => {
			return writeArtifacts(cwd, cacheDir, entryModuleId, compiledContracts, fs)
		},

		/**
		 * Synchronously reads compiled Solidity artifacts from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {import('@tevm/compiler').ResolvedArtifacts|undefined} Cached artifacts if found
		 */
		readArtifactsSync: (entryModuleId) => {
			return readArtifactsSync(cacheDir, fs, cwd, entryModuleId)
		},

		/**
		 * Asynchronously reads compiled Solidity artifacts from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {Promise<import('@tevm/compiler').ResolvedArtifacts|undefined>} Cached artifacts if found
		 */
		readArtifacts: async (entryModuleId) => {
			return readArtifacts(cacheDir, fs, cwd, entryModuleId)
		},

		/**
		 * Synchronously writes TypeScript declaration (.d.ts) file to the cache
		 *
		 * Note: TypeScript declarations are primarily cached for debugging and
		 * to support TypeScript compiler plugins.
		 *
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @param {string} dtsFile - Content of the TypeScript declaration file
		 * @returns {string} Path where the file was written
		 */
		writeDtsSync: (entryModuleId, dtsFile) => {
			const { path: dtsPath, dir: dtsDir } = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			fs.mkdirSync(dtsDir, { recursive: true })
			fs.writeFileSync(dtsPath, dtsFile)
			return dtsPath
		},

		/**
		 * Asynchronously writes TypeScript declaration (.d.ts) file to the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @param {string} dtsFile - Content of the TypeScript declaration file
		 * @returns {Promise<string>} Path where the file was written
		 */
		writeDts: async (entryModuleId, dtsFile) => {
			const { path: dtsPath, dir: dtsDir } = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			await fs.mkdir(dtsDir, { recursive: true })
			await fs.writeFile(dtsPath, dtsFile)
			return dtsPath
		},

		/**
		 * Synchronously reads TypeScript declaration file from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {string|undefined} Content of the declaration file if found
		 */
		readDtsSync: (entryModuleId) => {
			const { path: dtsPath } = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			if (!fs.existsSync(dtsPath)) {
				return undefined
			}
			return fs.readFileSync(dtsPath, 'utf8')
		},

		/**
		 * Asynchronously reads TypeScript declaration file from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {Promise<string|undefined>} Content of the declaration file if found
		 */
		readDts: async (entryModuleId) => {
			const { path: dtsPath } = getArtifactsPath(entryModuleId, 'dts', cwd, cacheDir)
			if (!(await fs.exists(dtsPath))) {
				return undefined
			}
			return fs.readFile(dtsPath, 'utf8')
		},

		/**
		 * Synchronously writes ES module (.mjs) file to the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @param {string} mjsFile - Content of the ES module file
		 * @returns {string} Path where the file was written
		 */
		writeMjsSync: (entryModuleId, mjsFile) => {
			const { path: mjsPath, dir: mjsDir } = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			fs.mkdirSync(mjsDir, { recursive: true })
			fs.writeFileSync(mjsPath, mjsFile)
			return mjsPath
		},

		/**
		 * Asynchronously writes ES module (.mjs) file to the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @param {string} mjsFile - Content of the ES module file
		 * @returns {Promise<string>} Path where the file was written
		 */
		writeMjs: async (entryModuleId, mjsFile) => {
			const { path: mjsPath, dir: mjsDir } = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			await fs.mkdir(mjsDir, { recursive: true })
			await fs.writeFile(mjsPath, mjsFile)
			return mjsPath
		},

		/**
		 * Synchronously reads ES module file from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {string|undefined} Content of the ES module file if found
		 */
		readMjsSync: (entryModuleId) => {
			const { path: mjsPath } = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			if (!fs.existsSync(mjsPath)) {
				return undefined
			}
			return fs.readFileSync(mjsPath, 'utf8')
		},

		/**
		 * Asynchronously reads ES module file from the cache
		 * @param {string} entryModuleId - Path to the Solidity file
		 * @returns {Promise<string|undefined>} Content of the ES module file if found
		 */
		readMjs: async (entryModuleId) => {
			const { path: mjsPath } = getArtifactsPath(entryModuleId, 'mjs', cwd, cacheDir)
			if (!(await fs.exists(mjsPath))) {
				return undefined
			}
			return fs.readFile(mjsPath, 'utf8')
		},
	}
}
