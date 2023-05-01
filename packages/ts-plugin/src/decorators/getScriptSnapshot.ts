import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
import { existsSync, readFileSync } from 'fs'
import { globbySync } from 'globby'
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
  ({ languageServiceHost }, ts, logger, config) => {
    /**
     * Gets artifacts path
     * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
     */
    const getArtifactPaths = (include = defaultIncludes) => {
      const project = resolve(process.cwd(), config.project)
      const artifactsDirectory = join(project, config.out)
      return globbySync([
        ...include.map((x) => `${artifactsDirectory}/**/${x}`),
        ...defaultExcludes.map((x) => `!${artifactsDirectory}/**/${x}`),
      ])
    }

    const getAbi = (contractName?: string) => {
      const artifactPath = getArtifactPaths(
        contractName ? [`${contractName}/*.json`] : undefined,
      )[0] as string | undefined
      if (!artifactPath) {
        return []
      }
      // TODO error catch
      // TODO zod
      return readFileSync(artifactPath, 'utf8')
    }
    return {
      getScriptSnapshot: (fileName) => {
        if (isSolidity(fileName) && existsSync(fileName)) {
          return ts.ScriptSnapshot.fromString(
            `
              const abi = ${getAbi()}
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
