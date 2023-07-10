import { isRelativeSolidity } from './isRelativeSolidity'
import { isSolidity } from './isSolidity'
import { existsSync } from 'fs'
import path from 'path'
import type typescript from 'typescript/lib/tsserverlibrary'

/**
 * Resolves a Solidity module to a file path and Dts extension.
 */
export const solidityModuleResolver = (
	moduleName: string,
	ts: typeof typescript,
	createInfo: typescript.server.PluginCreateInfo,
	containingFile: string,
): typescript.ResolvedModuleFull | undefined => {
	if (isRelativeSolidity(moduleName)) {
		return {
			extension: ts.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: path.resolve(path.dirname(containingFile), moduleName),
		}
	} else if (
		isSolidity(moduleName) &&
		createInfo.languageServiceHost
			.getResolvedModuleWithFailedLookupLocationsFromCache
	) {
		/**
		 * This section is for solidity modules that are not relative.
		 * Currently not implemented.
		 */
		const TODO = true
		if (TODO) {
			throw new Error('Not implemented')
		}

		// TODO: Move this section to a separate file and add basic tests.
		// Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
		const failedModule =
			createInfo.languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache(
				moduleName,
				containingFile,
			)
		const baseUrl = createInfo.project.getCompilerOptions().baseUrl
		const match = '/index.ts'

		// An array of paths TypeScript searched for the module. All include .ts, .tsx, .d.ts, or .json extensions.
		// NOTE: TypeScript doesn't expose this in their interfaces, which is why the type is unknown.
		// https://github.com/microsoft/TypeScript/issues/28770
		const failedLocations: readonly string[] = (
			failedModule as unknown as {
				failedLookupLocations: readonly string[]
			}
		).failedLookupLocations
		// Filter to only one extension type, and remove that extension. This leaves us with the actual file name.
		// Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
		const normalizedLocations = failedLocations.reduce<string[]>(
			(locations, location) => {
				if (
					(baseUrl ? location.includes(baseUrl) : true) &&
					location.endsWith(match)
				) {
					return [...locations, location.replace(match, '')]
				}
				return locations
			},
			[],
		)

		// Find the imported CSS module, if it exists.
		const cssModulePath = normalizedLocations.find((location) =>
			existsSync(location),
		)

		if (cssModulePath) {
			return {
				extension: ts.Extension.Dts,
				isExternalLibraryImport: false,
				resolvedFileName: path.resolve(cssModulePath),
			}
		}
	}
}
