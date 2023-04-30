import { isSolidity } from '../utils/isSolidity'
import { Decorator } from './Decorator'
import { createProxy } from '../factories'

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
