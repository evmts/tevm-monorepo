import { formatPath } from './formatPath.js'
import { isImportLocal } from './isImportLocal.js'
import * as path from 'path'
import resolve from 'resolve'

/**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 * @param {string} absolutePath absolute path to the contract
 * @param {Record<string, string>} remappings remappings from the config
 * @param {ReadonlyArray<string>} libs libs from the config
 * @returns {string} absolute path to the imported file
 */
export const resolveImportPath = (
	absolutePath,
	importPath,
	remappings,
	libs,
) => {
	// Foundry remappings
	for (const [key, value] of Object.entries(remappings)) {
		if (importPath.startsWith(key)) {
			return formatPath(path.resolve(importPath.replace(key, value)))
		}
	}
	// Local import "./LocalContract.sol"
	if (isImportLocal(importPath)) {
		return formatPath(path.resolve(path.dirname(absolutePath), importPath))
	} /*else if (project !== undefined && project !== null) {*/
	// try resolving with node resolution
	try {
		return resolve.sync(importPath, {
			basedir: path.dirname(absolutePath),
			paths: libs,
		})
	} catch (e) {
		console.error(
			`Could not resolve import ${importPath} from ${absolutePath}`,
			e,
		)
		return importPath
	}
}
