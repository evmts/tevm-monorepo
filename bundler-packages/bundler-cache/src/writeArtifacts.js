import { cacheHash } from './cacheHash.js'
import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * @param {string} path
 * @param {string} content
 * @param {import('./types.js').FileAccessObject} fs
 */
const writeFileAtomically = async (path, content, fs) => {
	if (typeof fs.rename !== 'function') {
		await fs.writeFile(path, content)
		return
	}
	const tmpPath = `${path}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`
	await fs.writeFile(tmpPath, content)
	await fs.rename(tmpPath, path)
}

/**
 * @param {import('@tevm/compiler').ResolvedArtifacts} resolvedArtifacts
 * @param {import('./types.js').FileAccessObject} fs
 */
const getSourceMetadata = (resolvedArtifacts, fs) => {
	return Object.fromEntries(
		Object.entries(resolvedArtifacts.solcInput?.sources || {}).map(([sourcePath, source]) => {
			const stat = fs.statSync(sourcePath)
			const content = typeof source?.content === 'string' ? source.content : undefined
			return [
				sourcePath,
				{
					mtimeMs: stat.mtimeMs,
					size: stat.size,
					...(content === undefined ? {} : { contentHash: cacheHash(content) }),
				},
			]
		}),
	)
}

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
 * @param {string} [compileFingerprint] - Fingerprint of compiler/config inputs
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
export const writeArtifacts = async (cwd, cacheDir, entryModuleId, resolvedArtifacts, fs, compileFingerprint) => {
	// Get paths for artifacts and metadata files
	const { dir, path } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Create cache directory if it doesn't exist
	if (!(await fs.exists(dir))) {
		await fs.mkdir(dir, { recursive: true })
	}

	const artifactsContent = JSON.stringify(resolvedArtifacts, null, 2)
	const metadataContent = JSON.stringify(
		{
			// Current cache version for compatibility checks
			version,
			compileFingerprint,
			artifactsHash: cacheHash(artifactsContent),

			// File metadata for dependency tracking
			files: getSourceMetadata(resolvedArtifacts, fs),
		},
		null,
		2,
	)

	await writeFileAtomically(path, artifactsContent, fs)
	await writeFileAtomically(metadataPath, metadataContent, fs)

	return path
}
