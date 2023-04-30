import { createProxy } from '../factories/proxy'
import { isSolidity } from '../utils/isSolidity'
import { Decorator } from './Decorator'
import { existsSync } from 'fs'

/**
 * This appears to return a .d.ts file for a .sol file
 * @see https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/index.ts#LL128C2-L141C7
 */
export const getScriptSnapshotDecorator: Decorator = ({
  languageServiceHost,
}) =>
  createProxy(languageServiceHost, {
    getScriptSnapshot: (fileName) => {
      if (isSolidity(fileName) && existsSync(fileName)) {
        console.log('TODO', fileName)
      }
      return languageServiceHost.getScriptSnapshot(fileName)
    },
  })
