import path from 'node:path'
import { cacheHash } from './cacheHash.js'

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

	const resolvedCwd = path.resolve(cwd)
	const cacheRoot = path.isAbsolute(cacheDir)
		? path.join(path.resolve(cacheDir), '__projects__', cacheHash(resolvedCwd).slice(0, 16))
		: path.resolve(cwd, cacheDir)
	const entryPath = path.resolve(cwd, entryModuleId)
	const relativeEntryPath = path.relative(resolvedCwd, entryPath)
	const isOutsideCwd = relativeEntryPath === '..' || relativeEntryPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeEntryPath)
	const normalizedEntryModuleId =
		isOutsideCwd
			? path.join('__external__', entryPath.replace(/^[A-Za-z]:/, '').split(path.sep).filter(Boolean).join(path.sep))
			: relativeEntryPath

	const dir = path.resolve(cacheRoot, normalizedEntryModuleId)
	const resolvedPath = path.join(dir, fileName)

	return { dir, path: resolvedPath }
}
