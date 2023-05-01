import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
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
    /**
     * Gets artifacts path
     * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
     */
    const getArtifactPaths = (include = defaultIncludes) => {
      const artifactsDirectory = join(
        project.getCurrentDirectory(),
        config.project,
        config.out,
      )
      return globSync([...include.map((x) => `${artifactsDirectory}/**/${x}`)])
    }

    const getAbi = (contractName?: string) => {
      const artifactPath = getArtifactPaths(
        contractName ? [`${contractName}/*.json`] : undefined,
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
              const abi = ${getAbi(fileName.split('/').at(-1))} as const
              export const fileName = ${JSON.stringify(fileName)} as const
              export const contractName = ${JSON.stringify(
                fileName.split('/').at(-1),
              )}'))} as const
              export const artifactPath = ${JSON.stringify(
                getArtifactPaths([`${fileName.split('/').at(-1)}/*.json`])[0],
              )} as const
              export const artifactsDirectory = ${JSON.stringify(
                join(config.project, config.out),
              )} as const
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
