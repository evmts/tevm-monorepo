/**
 * Resolves the path for a cached artifact file based on the Solidity module path.
 *
 * This function calculates where cached files for a specific Solidity module should
 * be stored in the cache directory. It normalizes the module path relative to the
 * current working directory and appends the appropriate filename based on the item type.
 *
 * @param {string} entryModuleId - Path to the Solidity file (absolute path)
 * @param {import('./types.js').CachedItem} item - Type of cached item ('dts', 'artifactsJson', or 'mjs')
 * @param {string} cwd - Current working directory
 * @param {string} cacheDir - Cache directory (relative to cwd)
 * @returns {{dir: string, path: string}} Object containing the directory and full path
 *   - dir: Directory where the cached file should be stored
 *   - path: Full path to the cached file including filename
 *
 * @example
 * ```javascript
 * import { getArtifactsPath } from '@tevm/bundler-cache'
 *
 * // Get path for cached TypeScript declarations
 * const { dir, path } = getArtifactsPath(
 *   '/projects/my-dapp/contracts/Token.sol',  // Solidity file path
 *   'dts',                                   // TypeScript declarations
 *   '/projects/my-dapp',                     // Current working directory
 *   '.tevm'                                  // Cache directory
 * )
 *
 * console.log(dir)   // '/projects/my-dapp/.tevm/contracts/Token.sol'
 * console.log(path)  // '/projects/my-dapp/.tevm/contracts/Token.sol/contract.d.ts'
 * ```
 *
 * @internal
 */
export const getArtifactsPath = (entryModuleId, item, cwd, cacheDir) => {
	// Select the appropriate filename based on the item type
	const fileName = {
		dts: 'contract.d.ts', // TypeScript declaration file
		artifactsJson: 'artifacts.json', // Solidity compilation artifacts
		mjs: 'contract.mjs', // ES module JavaScript file
	}[item]

	// Normalize the module path relative to current working directory
	let normalizedEntryModuleId = entryModuleId.replace(cwd, '')
	if (normalizedEntryModuleId.startsWith('/')) {
		normalizedEntryModuleId = normalizedEntryModuleId.slice(1)
	}

	// TODO: Fix path handling for Windows
	// Create the cache directory path and full file path
	const dir = [cwd, cacheDir, normalizedEntryModuleId].join('/')
	const path = [dir, fileName].join('/')

	return { dir, path }
}
