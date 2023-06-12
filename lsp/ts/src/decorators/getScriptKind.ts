import { createDecorator } from '../factories'
import { isSolidity } from '../utils'

/**
 * Decorate `LangaugeServerHost.getScriptKind` to return TS type for `.sol` files
 * This lets the ts-server expect `.sol` files to resolve to `.d.ts` files in `resolveModuleNameLiterals`
 */
export const getScriptKindDecorator = createDecorator((createInfo, ts) => {
	return {
		getScriptKind: (fileName) => {
			if (isSolidity(fileName)) {
				return ts.ScriptKind.TS
			}
			if (!createInfo.languageServiceHost.getScriptKind) {
				return ts.ScriptKind.Unknown
			}
			return createInfo.languageServiceHost.getScriptKind(fileName)
		},
	}
})
