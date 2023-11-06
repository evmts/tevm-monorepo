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
	_: typescript.server.PluginCreateInfo,
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
			resolvedFileName: moduleName,
		}
	}

	// to handle the case where the import is coming from a node_module or a different workspace
	// we need to always point @evmts/core to the local version
	if (
		moduleName.startsWith('@evmts/core') &&
		!moduleName.startsWith(process.cwd()) &&
		!containingFile.includes('node_modules')
	) {
		return {
			extension: ts.Extension.Dts,
			isExternalLibraryImport: true,
			resolvedFileName: createRequire(`${process.cwd()}/`).resolve(
				'@evmts/core',
			),
		}
	}
	return undefined
}
