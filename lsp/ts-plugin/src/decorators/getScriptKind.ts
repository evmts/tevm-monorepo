import { createHostDecorator } from '../factories/index.js'
import { isRelativeSolidity, isSolidity } from '../utils/index.js'

/**
 * Decorate `LangaugeServerHost.getScriptKind` to return TS type for `.sol` files
 * This lets the ts-server expect `.sol` files to resolve to `.d.ts` files in `resolveModuleNameLiterals`
 */
export const getScriptKindDecorator = createHostDecorator((createInfo, ts, logger, config) => {
	return {
		getScriptKind: (filePath) => {
			// Extract the base filename without query parameters
			const fileName = filePath.includes('.sol') ? filePath.split('?')[0] : filePath

			// TODO we should check if it is using ts baseUrl or paths in future
			if (isRelativeSolidity(fileName)) {
				return ts.ScriptKind.TS
			}
			if (isSolidity(fileName)) {
				return ts.ScriptKind.External
			}
			if (!createInfo.languageServiceHost.getScriptKind) {
				return ts.ScriptKind.Unknown
			}
			return createInfo.languageServiceHost.getScriptKind(filePath)
		},
	}
})
