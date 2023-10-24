import { invariant } from '../utils/invariant.js'
import { resolveImportPath } from './resolveImportPath.js'
import { resolveImports } from './resolveImports.js'

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
 * @param {import("../types.js").FileAccessObject} fao
 * @returns {import("../types.js").ModuleInfo}
 */
export const moduleFactorySync = (
	absolutePath,
	rawCode,
	remappings,
	libs,
	fao,
) => {
	const stack = [{ absolutePath, rawCode }]
	const modules = /** @type {Map<string, import("../types.js").ModuleInfo>} */ (
		new Map()
	)

	while (stack.length) {
		const nextItem = stack.pop()
		invariant(nextItem, 'Module should exist')
		const { absolutePath, rawCode } = nextItem

		if (modules.has(absolutePath)) continue

		const importedIds = resolveImports(absolutePath, rawCode).map((paths) =>
			resolveImportPath(absolutePath, paths, remappings, libs),
		)

		const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm
		const code = importedIds.reduce((code, importedId) => {
			const depImportAbsolutePath = resolveImportPath(
				absolutePath,
				importedId,
				remappings,
				libs,
			)
			return code.replace(importRegEx, (match, p1, p2, p3) => {
				const resolvedPath = resolveImportPath(
					absolutePath,
					p2,
					remappings,
					libs,
				)
				if (resolvedPath === importedId) {
					return `${p1}${depImportAbsolutePath}${p3}`
				} else {
					return match
				}
			})
		}, rawCode)

		modules.set(absolutePath, {
			id: absolutePath,
			rawCode,
			code,
			importedIds,
			resolutions: [],
		})

		importedIds.forEach((importedId) => {
			const depImportAbsolutePath = resolveImportPath(
				absolutePath,
				importedId,
				remappings,
				libs,
			)
			const depRawCode = fao.readFileSync(depImportAbsolutePath, 'utf8')

			stack.push({ absolutePath: depImportAbsolutePath, rawCode: depRawCode })
		})
	}

	for (const [_, m] of modules.entries()) {
		const { importedIds } = m
		m.resolutions = []
		importedIds.forEach((importedId) => {
			const resolution = modules.get(importedId)
			invariant(resolution, `resolution for ${importedId} not found`)
			m.resolutions.push(resolution)
		})
	}

	return /** @type import("../types.js").ModuleInfo */ (
		modules.get(absolutePath)
	)
}
