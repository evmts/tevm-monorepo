import { succeed } from 'effect/Effect'

/**
 * @param {string} source
 * @param {number} offset
 */
const isInBlockComment = (source, offset) =>
	source.lastIndexOf('/*', offset) > source.lastIndexOf('*/', offset)

/**
 * Updates all the import paths that match the importedIds
 * @param {string} code Source code to update
 * @param {ReadonlyArray<import("../types.js").ResolvedImport>} resolvedImports Import to update
 * @returns {import("effect/Effect").Effect<string, never, never>} the source code formatted with the imprt replaced
 */
export const updateImportPaths = (code, resolvedImports) => {
	const solidityImportRegex = /(^\s*import\b\s+[^'"]*['"])([^'"]*)(['"]\s*)/gm
	return succeed(
		code.replaceAll(solidityImportRegex, (match, p1, p2, p3, offset) => {
			if (isInBlockComment(code, offset)) {
				return match
			}
			const resolvedImport = resolvedImports.find(({ original }) => original === p2)
			if (resolvedImport) {
				return `${p1}${resolvedImport.updated}${p3}`
			}
			return match
		}),
	)
}

/**
 * Updates a specific import path in source code
 * @param {string} source - Source code to update
 * @param {string} oldPath - The original import path to replace
 * @param {string} newPath - The new import path
 * @returns {string} - Updated source code
 */
export const updateImportPath = (source, oldPath, newPath) => {
	const solidityImportRegex = /(^\s*import\b\s+[^'"]*['"])([^'"]*)(['"]\s*)/gm
	return source.replaceAll(solidityImportRegex, (match, p1, p2, p3, offset) => {
		if (isInBlockComment(source, offset)) {
			return match
		}
		if (p2 === oldPath) {
			return `${p1}${newPath}${p3}`
		}
		return match
	})
}
