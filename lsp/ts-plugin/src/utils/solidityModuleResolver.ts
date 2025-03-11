import { createRequire } from 'node:module'
import path from 'node:path'
import type typescript from 'typescript/lib/tsserverlibrary.js'
import { isRelativeSolidity } from './isRelativeSolidity.js'
import { isSolidity } from './isSolidity.js'

/**
 * Resolves a Solidity module name to its filesystem location and TypeScript type information.
 *
 * This utility handles three different import scenarios:
 * 1. Relative Solidity imports (like './Contract.sol')
 * 2. Package Solidity imports (like 'package/Contract.sol')
 * 3. Special case for '@tevm/contract' imports which need special resolution
 *
 * When Solidity files are imported, they're treated as TypeScript declaration files (.d.ts)
 * to provide type checking and IDE support for the contracts.
 *
 * @param moduleName - The module name to resolve (e.g., './Contract.sol')
 * @param ts - TypeScript library instance
 * @param createInfo - Plugin creation information from TypeScript
 * @param containingFile - Path to the file containing the import
 * @returns A resolved module with filename and extension information, or undefined if not resolvable
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
			resolvedFileName: createRequire(path.dirname(containingFile)).resolve(moduleName),
		}
	}

	// to handle the case where the import is coming from a node_module or a different workspace
	// we need to always point @tevm/contract to the local version
	if (moduleName.startsWith('@tevm/contract')) {
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
		}
		console.error('Could not resolve module. Is tevm/core installed?', moduleName, result)
		return undefined
	}
	return undefined
}
