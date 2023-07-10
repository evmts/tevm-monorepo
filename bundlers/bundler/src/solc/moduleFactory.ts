import { readFileSync } from 'fs'
import * as path from 'path'
import * as resolve from 'resolve'

/**
 * Copied from rollup (kinda)
 * @see https://rollupjs.org/plugin-development/#this-getmoduleinfo
 */
export interface ModuleInfo {
	id: string // the id of the module, for convenience
	rawCode: string | null // the source code of the module, `null` if external or not yet available
	code: string | null // the code after transformed to correctly resolve remappings and node_module imports
	importedIds: string[] // the module ids statically imported by this module
	resolutions: ModuleInfo[] // how statically imported ids were resolved, for use with this.load
}

const formatPath = (contractPath: string) => {
	return contractPath.replace(/\\/g, '/')
}

function isImportLocal(importPath: string) {
	return importPath.startsWith('.')
}

type Remappings = Record<string, string>

/**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 */
function resolveImportPath(
	absolutePath: string,
	importPath: string,
	remappings: Remappings,
	libs: string[],
) {
	// Foundry remappings
	for (const [key, value] of Object.entries(remappings)) {
		if (importPath.startsWith(key)) {
			return formatPath(path.resolve(importPath.replace(key, value)))
		}
	}
	// Local import "./LocalContract.sol"
	if (isImportLocal(importPath)) {
		return formatPath(path.resolve(path.dirname(absolutePath), importPath))
	} /*else if (project !== undefined && project !== null) {*/
	// try resolving with node resolution
	try {
		return resolve.sync(importPath, {
			basedir: path.dirname(absolutePath),
			paths: libs,
		})
	} catch (e) {
		console.error(
			`Could not resolve import ${importPath} from ${absolutePath}`,
			e,
		)
		return importPath
	}
}

function resolveImports(absolutePath: string, code: string): string[] {
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

export const moduleFactory = (
	absolutePath: string,
	rawCode: string,
	remappings: Remappings,
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
