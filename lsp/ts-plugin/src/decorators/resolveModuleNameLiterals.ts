import { createHostDecorator } from '../factories/index.js'
import { solidityModuleResolver } from '../utils/index.js'
import { invariant } from '../utils/invariant.js'

const getMatchingRemapping = (
	remappings: Readonly<Record<string, string>>,
	moduleName: string,
): [string, string] | undefined => {
	return Object.entries(remappings)
		.filter(([from]) => moduleName.startsWith(from))
		.sort(([a], [b]) => b.length - a.length)[0]
}

/**
 * Decorate `LangaugeServerHost.resolveModuleNameLiterals` to return config object to resolve `.sol` files
 * This tells the ts-server to resolve `.sol` files to `.d.ts` files with `getScriptSnapshot`
 */
export const resolveModuleNameLiteralsDecorator = createHostDecorator((createInfo, ts, logger, config) => {
	return {
		resolveModuleNameLiterals: (moduleNames, containingFile, ...rest) => {
			const resolvedModules = createInfo.languageServiceHost.resolveModuleNameLiterals?.(
				moduleNames,
				containingFile,
				...rest,
			)

			return moduleNames.map(({ text: moduleName }, index) => {
				let remappedName = moduleName
				const remapping = getMatchingRemapping(config.remappings, moduleName)
				if (remapping) {
					const [from, to] = remapping
					remappedName = moduleName.replace(from, to)
				}
				invariant(resolvedModules, 'Expected "resolvedModules" to be defined.')
				try {
					const resolvedModule = solidityModuleResolver(remappedName, ts, createInfo, containingFile, {
						isRemapped: remapping !== undefined,
						projectRoot: createInfo.project.getCurrentDirectory?.(),
					})
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
})
