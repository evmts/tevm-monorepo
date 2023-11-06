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
 */

/**
 * Returns a the import resolutions for the given code
 * @param {string} absolutePath
 * @param {string} code
 * @param {Record<string, string>} remappings
 * @param {ReadonlyArray<string>} libs
 * @param {boolean} sync
 * @returns {import("effect/Effect").Effect<never, ResolveImportsError, ReadonlyArray<import("./types.js").ResolvedImport>>}
 * @example
 * ```ts
 * const pathToSolidity = path.join(__dirname, '../Contract.sol')
 * const code = fs.readFileSync(pathToSolidity, 'utf8'),
 * const remappings = {}
 * const lib = []
 *
 * const imports = runPromise(
 *   resolveImports(
 *     pathToSolidity,
 *     code,
 *     remappings,
 *     libs,
 *     false
 *   )
 * )
 * console.log(imports) // [{ updated: '/path/to/Contract.sol', absolute: '/path/to/Contract.sol', original: '../Contract.sol' }]
 * ```
 */
export const resolveImports = (
	absolutePath,
	code,
	remappings,
	libs,
	sync = false,
) => {
	const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm

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
		/** @type Array<import("effect/Effect").Effect<never, import("./utils/resolveImportPath.js").CouldNotResolveImportError, import("./types.js").ResolvedImport>> */ ([])
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
