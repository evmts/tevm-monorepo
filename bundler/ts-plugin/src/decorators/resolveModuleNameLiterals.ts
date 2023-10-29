import { createHostDecorator } from '../factories/index.js'
import { solidityModuleResolver } from '../utils/index.js'
import { invariant } from '../utils/invariant.js'

/**
 * Decorate `LangaugeServerHost.resolveModuleNameLiterals` to return config object to resolve `.sol` files
 * This tells the ts-server to resolve `.sol` files to `.d.ts` files with `getScriptSnapshot`
 */
export const resolveModuleNameLiteralsDecorator = createHostDecorator(
	(createInfo, ts, logger) => {
		return {
			resolveModuleNameLiterals: (moduleNames, containingFile, ...rest) => {
				const resolvedModules =
					createInfo.languageServiceHost.resolveModuleNameLiterals?.(
						moduleNames,
						containingFile,
						...rest,
					)

				return moduleNames.map(({ text: moduleName }, index) => {
					invariant(
						resolvedModules,
						'Expected "resolvedModules" to be defined.',
					)
					try {
						const resolvedModule = solidityModuleResolver(
							moduleName,
							ts,
							createInfo,
							containingFile,
						)
						if (resolvedModule) {
							return { resolvedModule }
						}
						return resolvedModules[index]
					} catch (e) {
						logger.error(e as string)
						return resolvedModules[index]
					}
				})
			},
		}
	},
)
