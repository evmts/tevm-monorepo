import { cacheHash } from './cacheHash.js'
import { getArtifactsPath } from './getArtifactsPath.js'
import { getMetadataPath } from './getMetadataPath.js'
import { version } from './version.js'

/**
 * @param {string} path
 * @param {string} content
 * @param {import('./types.js').FileAccessObject} fs
 */
const writeFileAtomically = (path, content, fs) => {
	if (typeof fs.renameSync !== 'function') {
		fs.writeFileSync(path, content)
		return
	}
	const tmpPath = `${path}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`
	fs.writeFileSync(tmpPath, content)
	fs.renameSync(tmpPath, path)
}

/**
 * @param {import('@tevm/compiler').ResolvedArtifacts} resolvedArtifacts
 * @param {import('./types.js').FileAccessObject} fs
 */
const getSourceMetadata = (resolvedArtifacts, fs) => {
	return Object.fromEntries(
		Object.entries(resolvedArtifacts.solcInput?.sources || {}).map(([sourcePath, source]) => {
			const stat = fs.statSync(sourcePath)
			const content = 'content' in source && typeof source.content === 'string' ? source.content : undefined
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
 * @param {string} [compileFingerprint] - Fingerprint of compiler/config inputs
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
export const writeArtifactsSync = (cwd, cacheDir, entryModuleId, resolvedArtifacts, fs, compileFingerprint) => {
	// Get paths for artifacts and metadata files
	const { dir, path } = getArtifactsPath(entryModuleId, 'artifactsJson', cwd, cacheDir)
	const { path: metadataPath } = getMetadataPath(entryModuleId, cwd, cacheDir)

	// Create cache directory if it doesn't exist
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
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

	writeFileAtomically(path, artifactsContent, fs)
	writeFileAtomically(metadataPath, metadataContent, fs)

	return path
}
