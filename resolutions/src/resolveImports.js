import { resolveImportPath } from './utils/resolveImportPath.js'
import { all, die, fail, map } from 'effect/Effect'

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
		super('Import does not exist')
	}
}

/**
 * @typedef {ImportDoesNotExistError | import("./utils/resolveImportPath.js").CouldNotResolveImportError} ResolveImportsError
 * @typedef {{original: string, absolute: string, updated: string}} ResolvedImport
 */

const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm

/**
 * @param {string} absolutePath
 * @param {string} code
 * @param {Record<string, string>} remappings
 * @param {ReadonlyArray<string>} libs
 * @param {boolean} sync
 * @returns {import("effect/Effect").Effect<never, ResolveImportsError, ReadonlyArray<ResolvedImport>>}
 */
export const resolveImports = (
	absolutePath,
	code,
	remappings,
	libs,
	sync = false,
) => {
	if (typeof absolutePath !== 'string') {
		return die(`Type ${typeof absolutePath} is not of type string`)
	}
	if (typeof code !== 'string') {
		return die(`Type ${typeof code} is not of type string`)
	}
	if (typeof sync !== 'boolean') {
		return die(`Type ${typeof sync} is not of type boolean`)
	}
	const imports =
		/** @type Array<import("effect/Effect").Effect<never, import("./utils/resolveImportPath.js").CouldNotResolveImportError, ResolvedImport>> */ ([])
	let foundImport = importRegEx.exec(code)
	while (foundImport != null) {
		const importPath = foundImport[1]
		if (!importPath) {
			return fail(new ImportDoesNotExistError())
		}
		imports.push(
			resolveImportPath(absolutePath, importPath, remappings, libs, sync).pipe(
				map((absolute) => ({
					updated: absolute,
					absolute,
					original: importPath,
				})),
			),
		)
		foundImport = importRegEx.exec(code)
	}
	return all(imports)
}
