import { formatPath } from '../utils/formatPath.js'
import { isImportLocal } from '../utils/isImportLocal.js'
import * as path from 'path'

/**
 * @param {string} absolutePath
 * @param {string} code
 * @returns {ReadonlyArray<string>}
 */
export const resolveImports = (absolutePath, code) => {
	const imports = /** @type Array<string> */ ([])
	const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm
	let foundImport = importRegEx.exec(code)
	while (foundImport != null) {
		const importPath = foundImport[1]
		if (!importPath) {
			throw new Error('expected import path to exist')
		}
		if (isImportLocal(importPath)) {
			const importFullPath = formatPath(
				path.resolve(path.dirname(absolutePath), importPath),
			)
			imports.push(importFullPath)
		} else {
			imports.push(importPath)
		}
		foundImport = importRegEx.exec(code)
	}
	return imports
}
