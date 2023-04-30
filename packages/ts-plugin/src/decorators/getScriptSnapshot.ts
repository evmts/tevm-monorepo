import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
import { existsSync } from 'fs'

/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 */
export const getScriptSnapshotDecorator = createDecorator(
  ({ languageServiceHost }) => {
    return {
      getScriptSnapshot: (fileName) => {
        if (isSolidity(fileName) && existsSync(fileName)) {
          console.log('TODO', fileName)
        }
        return languageServiceHost.getScriptSnapshot(fileName)
      },
    }
  },
)
