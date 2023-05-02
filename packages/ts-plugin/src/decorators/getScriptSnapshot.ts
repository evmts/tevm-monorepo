import { createDecorator } from '../factories'
import { isSolidity } from '../utils'
import { getArtifactPathSync } from '../utils/getArtifactPathSync'
import { existsSync, readFileSync } from 'fs'

/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
 * TODO replace with plugin-internal for code reuse
 */
export const getScriptSnapshotDecorator = createDecorator(
  ({ languageServiceHost, project }, ts, logger, config) => {
    return {
      getScriptSnapshot: (filePath) => {
        if (!isSolidity(filePath) || !existsSync(filePath)) {
          return languageServiceHost.getScriptSnapshot(filePath)
        }

        const fileName = filePath.split('/').at(-1) as string

        const artifactPaths = getArtifactPathSync(
          fileName,
          project.getCurrentDirectory(),
          config,
          logger,
        )

        return ts.ScriptSnapshot.fromString(
          artifactPaths
            .flatMap((artifactPath) => {
              const contractName = artifactPath
                .split('/')
                .at(-1)
                ?.replace('.json', '')
              const contractJson = readFileSync(artifactPath, 'utf-8')
              return [
                `const _${contractName} = ${contractJson} as const`,
                `export declare const ${contractName}: typeof _${contractName}`,
              ]
            })
            .join('\n'),
        )
      },
    }
  },
)
