import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * Asynchronously reads Solidity compilation artifacts from the cache.
 *
 * This function checks if valid cached artifacts exist for the specified Solidity file
 * and returns them if they're up-to-date. It performs several validation steps:
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
 * @returns {Promise<import('@tevm/compiler').ResolvedArtifacts | undefined>}
 *   The cached artifacts if found and valid, undefined otherwise
 * @throws {Error} If the cached artifacts exist but cannot be parsed as valid JSON
 *
 * @example
 * ```javascript
 * import { readArtifacts } from '@tevm/bundler-cache'
 * import * as fs from 'node:fs'
 * import * as fsPromises from 'node:fs/promises'
 *
 * // Create file access object
 * const fileAccess = {
 *   readFile: fsPromises.readFile,
 *   exists: async (path) => fs.existsSync(path),
 *   stat: fsPromises.stat,
 *   // ...other required methods
 * }
 *
 * // Read artifacts from cache
 * const artifacts = await readArtifacts(
 *   '.tevm',                           // Cache directory
 *   fileAccess,                        // File access object
 *   process.cwd(),                     // Current working directory
 *   './contracts/Token.sol'            // Solidity file path
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
export const readArtifacts = async (cacheDir, fs, cwd, entryModuleId) => {
	// Get paths to artifacts and metadata files
	const { path: artifactsPath } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Check if both required files exist
	if (!(await fs.exists(artifactsPath)) || !(await fs.exists(metadataPath))) {
		return undefined
	}

	// Parse metadata file
	const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'))

	// Check if cache is still valid by:
	// 1. Comparing cache version
	// 2. Checking if any source files have been modified
	const didContentChange =
		version !== metadata.version ||
		(
			await Promise.all(
				Object.entries(metadata.files).map(async ([sourcePath, timestamp]) => {
					const didChange = timestamp !== (await fs.stat(sourcePath)).mtimeMs
					return didChange
				}),
			)
		).some((didChange) => didChange)

	// If any validation fails, return undefined (cache miss)
	if (didContentChange) {
		return undefined
	}

	// Read and parse artifacts file
	const content = await fs.readFile(artifactsPath, 'utf8')

	try {
		return JSON.parse(content)
	} catch (_e) {
		throw new Error(`Cache miss for ${entryModuleId} because it isn't valid json`)
	}
}
