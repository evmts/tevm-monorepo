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
      getScriptSnapshot: (fileName) => {
        const solFile = fileName.split('/').at(-1)
        if (!solFile) {
          throw new Error('no solFile found')
        }
        const defaultDts = ts.ScriptSnapshot.fromString(`
        export {}
        `)
        if (isSolidity(fileName) && existsSync(fileName)) {
          if (!solFile) {
            logger.error(`no .sol file with name ${solFile} found`)
            return defaultDts
          }

          const artifactPaths = getArtifactPathSync(
            solFile,
            project.getCurrentDirectory(),
            config,
            logger,
          )

          if (!artifactPaths.length) {
            logger.error(`no artifactPaths found for ${solFile}`)
            return defaultDts
          }
          const contractJsons = artifactPaths.map((artifactPath) => {
            const contractName = artifactPath
              .split('/')
              .at(-1)
              ?.replace('.json', '')
            return {
              contractName,
              json: readFileSync(artifactPath, 'utf-8'),
            }
          })
          return ts.ScriptSnapshot.fromString(
            contractJsons
              .flatMap((contract) => [
                `const _${contract.contractName} = ${contract.json} as const`,
                `export declare const ${contract.contractName}: typeof _${contract.contractName}`,
              ])
              .join('\n'),
          )
        }
        return languageServiceHost.getScriptSnapshot(fileName)
      },
    }
  },
)
