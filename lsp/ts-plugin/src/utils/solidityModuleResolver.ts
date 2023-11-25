import { isRelativeSolidity } from './isRelativeSolidity.js'
import { isSolidity } from './isSolidity.js'
import { createRequire } from 'module'
import path from 'path'
import type typescript from 'typescript/lib/tsserverlibrary.js'

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
	}
	if (isSolidity(moduleName)) {
		return {
			extension: ts.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: createRequire(path.dirname(containingFile)).resolve(
				moduleName,
			),
		}
	}

	// to handle the case where the import is coming from a node_module or a different workspace
	// we need to always point @evmts/core to the local version
	if (moduleName.startsWith('@evmts/core')) {
		const result = ts.resolveModuleName(
			moduleName,
			containingFile,
			createInfo.project.getCompilerOptions(),
			createInfo.project,
		)

		if (result.resolvedModule) {
			return {
				extension: ts.Extension.Dts,
				isExternalLibraryImport: true,
				resolvedFileName: result.resolvedModule.resolvedFileName,
			}
		} else {
			console.error(
				'Could not resolve module. Is evmts/core installed?',
				moduleName,
				result,
			)
			return undefined
		}
	}
	return undefined
}
