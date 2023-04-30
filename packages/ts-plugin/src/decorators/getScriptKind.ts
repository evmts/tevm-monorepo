import { createProxy } from '../factories'
import { isSolidity } from '../utils/isSolidity'
import { Decorator } from './Decorator'

/**
 * Decorates the server host with `getScriptKind` proxy to return typescript for `.sol` files.
 */
export const getScriptKindDecorator: Decorator = (createInfo, ts) => {
  return createProxy(createInfo.languageServiceHost, {
    getScriptKind: (fileName) => {
      if (!createInfo.languageServiceHost.getScriptKind) {
        return ts.ScriptKind.Unknown
      }
      if (isSolidity(fileName)) {
        return ts.ScriptKind.TS
      }
      return createInfo.languageServiceHost.getScriptKind(fileName)
    },
  })
}
