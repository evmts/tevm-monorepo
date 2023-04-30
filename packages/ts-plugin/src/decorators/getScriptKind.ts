import { createProxy } from '../factories'
import { isSolidity } from '../utils/isSolidity'
import { createDecorator } from './createDecorator'

/**
 * Decorates the server host with `getScriptKind` proxy to return typescript for `.sol` files.
 */
export const getScriptKindDecorator = createDecorator((createInfo, ts) => {
  return {
    getScriptKind: (fileName) => {
      if (!createInfo.languageServiceHost.getScriptKind) {
        return ts.ScriptKind.Unknown
      }
      if (isSolidity(fileName)) {
        return ts.ScriptKind.TS
      }
      return createInfo.languageServiceHost.getScriptKind(fileName)
    },
  }
})
