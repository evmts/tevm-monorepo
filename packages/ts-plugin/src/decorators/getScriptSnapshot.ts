import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
import { getArtifactPathSync } from '../utils/getArtifactPathSync'
import { existsSync, readFileSync } from 'fs'
import { globSync } from 'glob'
import { join, resolve } from 'path'

/**
 * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts#LL15C1-L32C2
 */

const defaultIncludes = ['*.json']
const defaultExcludes = [
  'Common.sol/**',
  'Components.sol/**',
  'Script.sol/**',
  'StdAssertions.sol/**',
  'StdError.sol/**',
  'StdCheats.sol/**',
  'StdMath.sol/**',
  'StdJson.sol/**',
  'StdStorage.sol/**',
  'StdUtils.sol/**',
  'Vm.sol/**',
  'console.sol/**',
  'console2.sol/**',
  'test.sol/**',
  '**.s.sol/*.json',
  '**.t.sol/*.json',
]
/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
 * TODO replace with plugin-internal for code reuse
 */
export const getScriptSnapshotDecorator = createDecorator(
  ({ languageServiceHost, project }, ts, logger, config) => {
    // return getArtifactPathSync(
    //  include[0],
    //         project.getCurrentDirectory(),
    //       config
    //   )
    const getAbiSync = (contractName?: string) => {
      if (!contractName) {
        logger.error(`no contract with name ${contractName} found`)
        return
      }

      const artifactPath = getArtifactPathSync(
        contractName,
        project.getCurrentDirectory(),
        config,
        logger,
      )[0] as string | undefined

      logger.info(`artifactPath: ${artifactPath}`)

      if (!artifactPath) {
        return '[]'
      }
      // TODO error catch
      // TODO zod
      const abi = readFileSync(artifactPath, 'utf8')

      logger.info(abi)

      return abi
    }

    return {
      getScriptSnapshot: (fileName) => {
        if (isSolidity(fileName) && existsSync(fileName)) {
          return ts.ScriptSnapshot.fromString(
            `
              const abi = ${getAbiSync(fileName.split('/').at(-1))} as const
              export const fileName = ${JSON.stringify(fileName)} as const
              export const PureQuery: {
                abi: typeof abi
              } as const
              `,
          )
        }
        return languageServiceHost.getScriptSnapshot(fileName)
      },
    }
  },
)
