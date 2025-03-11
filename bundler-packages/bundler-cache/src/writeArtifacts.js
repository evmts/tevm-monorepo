import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * Asynchronously writes Solidity compilation artifacts to the cache.
 *
 * This function stores two files in the cache:
 * 1. artifacts.json - Contains the full compilation results (ABI, bytecode, ASTs, etc.)
 * 2. metadata.json - Contains cache validation information including:
 *    - The cache version
 *    - File modification timestamps for all source files
 *
 * The metadata file is used during cache reads to determine if the cache is still valid
 * or if the source files have changed and need to be recompiled.
 *
 * @param {string} cwd - Current working directory
 * @param {string} cacheDir - Cache directory (relative to cwd)
 * @param {string} entryModuleId - Path to the Solidity file
 * @param {import('@tevm/compiler').ResolvedArtifacts} resolvedArtifacts - Compilation results to cache
 * @param {import('./types.js').FileAccessObject} fs - File system interface for writing files
 * @returns {Promise<string>} Path where artifacts were written
 * @throws {Error} If directory creation or file writing fails
 *
 * @example
 * ```javascript
 * import { writeArtifacts } from '@tevm/bundler-cache'
 * import * as fs from 'node:fs'
 * import * as fsPromises from 'node:fs/promises'
 *
 * // Create file access object
 * const fileAccess = {
 *   writeFile: fsPromises.writeFile,
 *   exists: async (path) => fs.existsSync(path),
 *   mkdir: fsPromises.mkdir,
 *   statSync: fs.statSync,
 *   // ...other required methods
 * }
 *
 * // Write compilation artifacts to cache
 * const artifactsPath = await writeArtifacts(
 *   process.cwd(),                  // Current working directory
 *   '.tevm',                        // Cache directory
 *   './contracts/Token.sol',        // Solidity file path
 *   compilationResults,             // Results from solc compiler
 *   fileAccess                      // File access object
 * )
 *
 * console.log(`Artifacts cached at: ${artifactsPath}`)
 * ```
 *
 * @internal
 */
export const writeArtifacts = async (cwd, cacheDir, entryModuleId, resolvedArtifacts, fs) => {
	// Get paths for artifacts and metadata files
	const { dir, path } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Create cache directory if it doesn't exist
	if (!(await fs.exists(dir))) {
		await fs.mkdir(dir, { recursive: true })
	}

	// Write both files in parallel for better performance
	await Promise.all([
		// Write artifacts.json with the full compilation results
		fs.writeFile(path, JSON.stringify(resolvedArtifacts, null, 2)),

		// Write metadata.json with cache validation information
		fs.writeFile(
			metadataPath,
			JSON.stringify(
				{
					// Current cache version for compatibility checks
					version,

					// File modification timestamps for dependency tracking
					files: Object.fromEntries(
						Object.keys(resolvedArtifacts.solcInput.sources).map((sourcePath) => {
							// For efficiency, only store the last modified timestamp of each file
							return [sourcePath, fs.statSync(sourcePath).mtimeMs]
						}),
					),
				},
				null,
				2,
			),
		),
	])

	return path
}
