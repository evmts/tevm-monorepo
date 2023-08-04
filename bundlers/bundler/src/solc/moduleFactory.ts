import type { ModuleInfo } from '../types'
import { invariant } from '../utils/invariant'
import { resolveImportPath } from './resolveImportPath'
import { resolveImports } from './resolveImports'
import { readFileSync } from 'fs'
export const moduleFactory = (
	absolutePath: string,
	rawCode: string,
	remappings: Record<string, string>,
	libs: string[],
): ModuleInfo => {
	const stack = [{ absolutePath, rawCode }]
	const modules = new Map<string, ModuleInfo>()

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
			const depRawCode = readFileSync(depImportAbsolutePath, 'utf8')

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

	return modules.get(absolutePath) as ModuleInfo
}
