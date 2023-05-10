import { FoundryPlugin } from '../types/FoundryPlugin'
import { resolveArtifactPathsSync } from './resolveArtifactPaths'
import { readFileSync } from 'fs'

export const foundryPlugin: FoundryPlugin = (config, logger) => {
  return {
    name: foundryPlugin.name,
    config,
    resolveArtifactPathsSync: (module) => {
      return resolveArtifactPathsSync(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
    },
    resolveDts: (module) => {
      return resolveArtifactPathsSync(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
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
        .join('\n')
    },
    resolveJson: (module: string) => {
      return Object.entries(
        resolveArtifactPathsSync(
          module,
          config.project ?? '.',
          { out: config.out },
          logger,
        ).map((artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = readFileSync(artifactPath, 'utf-8')
          return [contractName, contractJson]
        }),
      ).join('\n')
    },
    resolveTsModule: (module: string) => {},
    resolveCjsModule: (module: string) => {},
    resolveEsmModule: (module: string) => {},
  }
}
