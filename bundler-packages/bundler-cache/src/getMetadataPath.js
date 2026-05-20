import path from 'node:path'

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
	const cacheRoot = path.resolve(cwd, cacheDir)
	const entryPath = path.resolve(cwd, entryModuleId)
	const relativeEntryPath = path.relative(path.resolve(cwd), entryPath)
	const isOutsideCwd = relativeEntryPath === '..' || relativeEntryPath.startsWith(`..${path.sep}`) || path.isAbsolute(relativeEntryPath)
	const normalizedEntryModuleId =
		isOutsideCwd
			? path.join('__external__', entryPath.replace(/^[A-Za-z]:/, '').split(path.sep).filter(Boolean).join(path.sep))
			: relativeEntryPath

	const dir = path.resolve(cacheRoot, normalizedEntryModuleId)
	const resolvedPath = path.join(dir, 'metadata.json')

	return { dir, path: resolvedPath }
}
