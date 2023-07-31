import { formatPath } from '../utils/formatPath'
import { isImportLocal } from '../utils/isImportLocal'
import * as path from 'path'
import * as resolve from 'resolve'

/**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 */
export const resolveImportPath = (
	absolutePath: string,
	importPath: string,
	remappings: Record<string, string>,
	libs: string[],
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
