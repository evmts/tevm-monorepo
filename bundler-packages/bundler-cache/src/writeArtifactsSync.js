import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * Synchronously writes Solidity compilation artifacts to the cache.
 *
 * This is the synchronous version of writeArtifacts, used primarily in TypeScript compiler plugins
 * and other contexts where async operations can't be used. It stores the same two files:
 *
 * 1. artifacts.json - Contains the full compilation results (ABI, bytecode, ASTs, etc.)
 * 2. metadata.json - Contains cache validation information (version and file timestamps)
 *
 * @param {string} cwd - Current working directory
 * @param {string} cacheDir - Cache directory (relative to cwd)
 * @param {string} entryModuleId - Path to the Solidity file
 * @param {import('@tevm/compiler').ResolvedArtifacts} resolvedArtifacts - Compilation results to cache
 * @param {import('./types.js').FileAccessObject} fs - File system interface for writing files
 * @returns {string} Path where artifacts were written
 * @throws {Error} If directory creation or file writing fails
 *
 * @example
 * ```javascript
 * import { writeArtifactsSync } from '@tevm/bundler-cache'
 * import * as fs from 'node:fs'
 *
 * // Create file access object
 * const fileAccess = {
 *   writeFileSync: fs.writeFileSync,
 *   existsSync: fs.existsSync,
 *   mkdirSync: fs.mkdirSync,
 *   statSync: fs.statSync,
 *   // ...other required methods
 * }
 *
 * // Write compilation artifacts to cache synchronously
 * const artifactsPath = writeArtifactsSync(
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
export const writeArtifactsSync = (cwd, cacheDir, entryModuleId, resolvedArtifacts, fs) => {
	// Get paths for artifacts and metadata files
	const { dir, path } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Create cache directory if it doesn't exist
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	// Write artifacts.json with the full compilation results
	fs.writeFileSync(path, JSON.stringify(resolvedArtifacts, null, 2))

	// Write metadata.json with cache validation information
	fs.writeFileSync(
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
	)

	return path
}
