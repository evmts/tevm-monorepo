import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * Synchronously reads Solidity compilation artifacts from the cache.
 *
 * This is the synchronous version of readArtifacts, used primarily in TypeScript compiler plugins
 * and other contexts where async operations can't be used. It performs the same validation steps:
 *
 * 1. Checks if both artifacts.json and metadata.json files exist
 * 2. Verifies if the cache version matches the current version
 * 3. Checks if any source files have been modified since the cache was created
 * 4. Reads and parses the artifacts JSON file
 *
 * @param {string} cacheDir - Cache directory (relative to cwd)
 * @param {import('./types.js').FileAccessObject} fs - File system interface for reading files
 * @param {string} cwd - Current working directory
 * @param {string} entryModuleId - Path to the Solidity file
 * @returns {import('@tevm/compiler').ResolvedArtifacts | undefined}
 *   The cached artifacts if found and valid, undefined otherwise
 * @throws {Error} If the cached artifacts exist but cannot be parsed as valid JSON
 *
 * @example
 * ```javascript
 * import { readArtifactsSync } from '@tevm/bundler-cache'
 * import * as fs from 'node:fs'
 *
 * // Create file access object
 * const fileAccess = {
 *   readFileSync: fs.readFileSync,
 *   existsSync: fs.existsSync,
 *   statSync: fs.statSync,
 *   // ...other required methods
 * }
 *
 * // Read artifacts from cache synchronously
 * const artifacts = readArtifactsSync(
 *   '.tevm',                          // Cache directory
 *   fileAccess,                       // File access object
 *   process.cwd(),                    // Current working directory
 *   './contracts/Token.sol'           // Solidity file path
 * )
 *
 * if (artifacts) {
 *   console.log('Found valid cached artifacts')
 * } else {
 *   console.log('No valid cache found, need to recompile')
 * }
 * ```
 *
 * @internal
 */
export const readArtifactsSync = (cacheDir, fs, cwd, entryModuleId) => {
	// Get paths to artifacts and metadata files
	const { path: artifactsPath } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Check if both required files exist
	if (!fs.existsSync(artifactsPath) || !fs.existsSync(metadataPath)) {
		return undefined
	}

	// Parse metadata file
	const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

	// Check if cache is still valid by:
	// 1. Comparing cache version
	// 2. Checking if any source files have been modified
	const didContentChange =
		metadata.version !== version ||
		Object.entries(metadata.files).some(([sourcePath, timestamp]) => {
			return timestamp !== fs.statSync(sourcePath).mtimeMs
		})

	// If any validation fails, return undefined (cache miss)
	if (didContentChange) {
		return undefined
	}

	// Read and parse artifacts file
	const content = fs.readFileSync(artifactsPath, 'utf8')

	try {
		return JSON.parse(content)
	} catch (_e) {
		throw new Error(`Cache miss for ${entryModuleId} because it isn't valid json`)
	}
}
