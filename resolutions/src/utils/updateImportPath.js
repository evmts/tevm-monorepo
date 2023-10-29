import { solidityImportRegex } from './solidityImportRegex.js'
import { succeed } from 'effect/Effect'

/**
 * Updates all the import paths that match the importedIds
 * @param {string} code Source code to update
 * @param {ReadonlyArray<import("../resolveImports.js").ResolvedImport>} resolvedImports Import to update
 * @returns {import("effect/Effect").Effect<never, never, string>} the source code formatted with the imprt replaced
 */
export const updateImportPaths = (code, resolvedImports) => {
	return succeed(
		code.replaceAll(solidityImportRegex, (match, p1, p2, p3) => {
			const resolvedImport = resolvedImports.find(
				({ original }) => original === p2,
			)
			console.log(p2, resolvedImport)
			if (resolvedImport) {
				return `${p1}${resolvedImport.updated}${p3}`
			} else {
				return match
			}
		}),
	)
}
