import { createDecorator } from '../factories'
import { solidityModuleResolver } from '../utils'

/**
 * Decorate `LangaugeServerHost.resolveModuleNameLiterals` to return config object to resolve `.sol` files
 * This tells the ts-server to resolve `.sol` files to `.d.ts` files with `getScriptSnapshot`
 */
export const resolveModuleNameLiteralsDecorator = createDecorator(
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
					if (!resolvedModules) {
						throw new Error('Expected "resolvedModules" to be defined.')
					}
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
					} catch (e) {
						logger.error(e as string)
						return resolvedModules[index]
					}
					return resolvedModules[index]
				})
			},
		}
	},
)
