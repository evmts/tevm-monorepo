import { formatPath } from '../utils/formatPath'
import { isImportLocal } from '../utils/isImportLocal'
import * as path from 'path'

export const resolveImports = (
	absolutePath: string,
	code: string,
): string[] => {
	const imports: string[] = []
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
