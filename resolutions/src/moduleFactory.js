import { resolveImports } from './resolveImports.js'
import { invariant } from './utils/invariant.js'
import { safeFao } from './utils/safeFao.js'
import { updateImportPaths } from './utils/updateImportPath.js'
import { gen } from 'effect/Effect'

/**
 * @typedef {import("./resolveImports.js").ResolveImportsError | import("./utils/safeFao.js").ReadFileError | import("./utils/resolveImportPath.js").CouldNotResolveImportError} ModuleFactoryError
 */

/**
 * Creates a module from the given module information.
 * This includes resolving all imports and creating a dependency graph.
 *
 * Currently it modifies the source code in place which causes the ast to not match the source code.
 * This complexity leaks to the typescript lsp which has to account for this
 * Ideally we refactor this to not need to modify source code in place
 * Doing this hurts our ability to control the import graph and make it use node resolution though
 * See foundry that is alergic to using npm
 * Doing it this way for now is easier but for sure a leaky abstraction
 * @param {string} absolutePath
 * @param {string} rawCode
 * @param {Record<string, string>} remappings
 * @param {ReadonlyArray<string>} libs
 * @param {import("./types.js").FileAccessObject} fao
 * @param {boolean} sync Whether to run this synchronously or not
 * @returns {import("effect/Effect").Effect<never, ModuleFactoryError, Map<string, import("./types.js").ModuleInfo>>}
 * @example
 * ```ts
 * const pathToSolidity = path.join(__dirname, '../Contract.sol')
 * const rawCode = fs.readFileSync(pathToSolidity, 'utf8'),
 *
 * const modules = runPromise(
 *   moduleFactory(
 *     pathToSolidity,
 *     rawCode,
 *     {
 *       "remapping": "remapping/src"
 *     },
 *     ["lib/path"],
 *     {
 *       readFileSync,
 *       readFile,
 *       existsSync,
 *     },
 *     false
 *   )
 * )
 * console.log(modules.get(pathToSolidity)) // { id: '/path/to/Contract.sol', rawCode: '...', importedIds: ['/path/to/Imported.sol'], code: '...' }
 * ```
 */
export const moduleFactory = (
	absolutePath,
	rawCode,
	remappings,
	libs,
	fao,
	sync,
) => {
	return gen(function* (_) {
		const readFile = sync ? safeFao(fao).readFileSync : safeFao(fao).readFile
		const stack = [{ absolutePath, rawCode }]
		const modules =
			/** @type{Map<string, import("./types.js").ModuleInfo>} */
			(new Map())
		while (stack.length) {
			const nextItem = stack.pop()
			invariant(nextItem, 'Module should exist')
			const { absolutePath, rawCode } = nextItem

			if (modules.has(absolutePath)) continue

			const resolvedImports = yield* _(
				resolveImports(absolutePath, rawCode, remappings, libs, sync),
			)

			modules.set(absolutePath, {
				id: absolutePath,
				rawCode,
				importedIds: resolvedImports.map(({ absolute }) => absolute),
				code: yield* _(updateImportPaths(rawCode, resolvedImports)),
			})

			for (const resolvedImport of resolvedImports) {
				const depRawCode = yield* _(readFile(resolvedImport.absolute, 'utf8'))
				stack.push({
					absolutePath: resolvedImport.absolute,
					rawCode: depRawCode,
				})
			}
		}
		return modules
	})
}
