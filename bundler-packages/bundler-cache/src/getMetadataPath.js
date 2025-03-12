/**
 * Resolves the path for the metadata file associated with a Solidity module.
 *
 * The metadata file contains information about the Solidity file and its dependencies,
 * including file modification timestamps which are used for cache invalidation.
 *
 * @param {string} entryModuleId - Path to the Solidity file (absolute path)
 * @param {string} cwd - Current working directory
 * @param {string} cacheDir - Cache directory (relative to cwd)
 * @returns {{dir: string, path: string}} Object containing the directory and full path
 *   - dir: Directory where the metadata file should be stored
 *   - path: Full path to the metadata.json file
 *
 * @example
 * ```javascript
 * import { getMetadataPath } from '@tevm/bundler-cache'
 *
 * // Get path for metadata file
 * const { dir, path } = getMetadataPath(
 *   '/projects/my-dapp/contracts/Token.sol',  // Solidity file path
 *   '/projects/my-dapp',                     // Current working directory
 *   '.tevm'                                  // Cache directory
 * )
 *
 * console.log(dir)   // '/projects/my-dapp/.tevm/contracts/Token.sol'
 * console.log(path)  // '/projects/my-dapp/.tevm/contracts/Token.sol/metadata.json'
 * ```
 *
 * @internal
 */
export const getMetadataPath = (entryModuleId, cwd, cacheDir) => {
	// Normalize the module path relative to current working directory
	let normalizedEntryModuleId = entryModuleId.replace(cwd, '')
	if (normalizedEntryModuleId.startsWith('/')) {
		normalizedEntryModuleId = normalizedEntryModuleId.slice(1)
	}

	// TODO: Fix path handling for Windows
	// Create the cache directory path and full file path for metadata
	const dir = [cwd, cacheDir, normalizedEntryModuleId].join('/')
	const path = [dir, 'metadata.json'].join('/')

	return { dir, path }
}
