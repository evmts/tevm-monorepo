import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
import { existsSync } from 'fs'

/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 */
export const getScriptSnapshotDecorator = createDecorator(
  ({ languageServiceHost }, ts) => {
    return {
      getScriptSnapshot: (fileName) => {
        if (isSolidity(fileName) && existsSync(fileName)) {
          // Currently hardcoded
          return ts.ScriptSnapshot.fromString(
            `
              const abi = [
    {
      "inputs": [],
      "name": "IS_SCRIPT",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num1",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "num2",
          "type": "uint256"
        }
      ],
      "name": "run",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
              ]
              export let PureQuery: {
                abi: typeof abi
              }
              `,
          )
        }
        return languageServiceHost.getScriptSnapshot(fileName)
      },
    }
  },
)
