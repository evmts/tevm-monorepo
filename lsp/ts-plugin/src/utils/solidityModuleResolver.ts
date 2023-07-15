import { isRelativeSolidity } from './isRelativeSolidity'
import { isSolidity } from './isSolidity'
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
		return {
			extension: ts.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: moduleName,
		}
	}
}
