import type { ModuleInfo } from '../types'
import { resolveImportPath } from './resolveImportPath'
import { resolveImports } from './resolveImports'
import { readFileSync } from 'fs'

export const moduleFactory = (
	absolutePath: string,
	rawCode: string,
	remappings: Record<string, string>,
	libs: string[],
): ModuleInfo => {
	const importedIds = resolveImports(absolutePath, rawCode).map((paths) =>
		resolveImportPath(absolutePath, paths, remappings, libs),
	)
	const resolutions = importedIds.map((importedId) => {
		const depImportAbsolutePath = resolveImportPath(
			absolutePath,
			importedId,
			remappings,
			libs,
		)
		const depRawCode = readFileSync(depImportAbsolutePath, 'utf8')
		return moduleFactory(depImportAbsolutePath, depRawCode, remappings, libs)
	})
	const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm
	const code = importedIds.reduce((code, importedId) => {
		const depImportAbsolutePath = resolveImportPath(
			absolutePath,
			importedId,
			remappings,
			libs,
		)
		return code.replace(importRegEx, (match, p1, p2, p3) => {
			const resolvedPath = resolveImportPath(absolutePath, p2, remappings, libs)
			if (resolvedPath === importedId) {
				return `${p1}${depImportAbsolutePath}${p3}`
			} else {
				return match
			}
		})
	}, rawCode)

	const out = {
		id: absolutePath,
		rawCode,
		code,
		importedIds,
		resolutions,
	}

	return out
}
