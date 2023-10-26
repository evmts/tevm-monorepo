import { die, fail, succeed } from 'effect/Effect'
import { formatPath } from './utils/formatPath.js'
import { isImportLocal } from './utils/isImportLocal.js'
import * as path from 'path'

class ImportDoesNotExistError extends Error {
	/**
	 * @type {'ImportDoesNotExistError'}
	 */
	_tag = 'ImportDoesNotExistError'
	/**
	 * @type {'ImportDoesNotExistError'}
	 * @override
	 */
	name = 'ImportDoesNotExistError'
	constructor() {
		super(`Import does not exist`)
	}
}

/**
 * @typedef {ImportDoesNotExistError} ResolveImportsError
 */

const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm

/**
 * @param {string} absolutePath
 * @param {string} code
 * @returns {import("effect/Effect").Effect<never, ResolveImportsError, ReadonlyArray<string>>}
 */
export const resolveImports = (absolutePath, code) => {
	if (typeof absolutePath !== 'string') {
		return die(`Type ${typeof absolutePath} is not of type string`)
	}
	if (typeof code !== 'string') {
		return die(`Type ${typeof code} is not of type string`)
	}
	const imports = /** @type Array<string> */ ([])
	let foundImport = importRegEx.exec(code)
	while (foundImport != null) {
		const importPath = foundImport[1]
		if (!importPath) {
			return fail(new ImportDoesNotExistError())
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
	return succeed(imports)
}
