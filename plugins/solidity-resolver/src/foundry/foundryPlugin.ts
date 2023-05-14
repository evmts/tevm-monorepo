import { FoundryResolver } from '../types'
import { Logger } from '../types'
import { FoundryToml } from '../types/FoundryToml'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { glob, globSync } from 'glob'
import { basename, join } from 'path'

const resolveArtifactPathsSync = (
  solFile: string,
  projectDir: string,
  { out = 'artifacts' }: FoundryToml,
  logger: Logger,
): string[] => {
  const fileName = basename(solFile)
  const artifactsDirectory = join(projectDir, out)
  const files = globSync([`${artifactsDirectory}/**/${fileName}/*.json`])

  if (files.length === 0) {
    logger.error(`No files found for ${solFile} in ${projectDir}`)
    throw new Error('No files found')
  }

  return files
}

export const resolveArtifactPaths = async (
  solFile: string,
  projectDir: string,
  { out = 'artifacts' }: FoundryToml,
  logger: Logger,
): Promise<string[]> => {
  const fileName = basename(solFile)
  const artifactsDirectory = join(projectDir, out)
  const files = await glob([`${artifactsDirectory}/**/${fileName}/*.json`])

  if (files.length === 0) {
    logger.error(`No files found for ${solFile} in ${projectDir}`)
    throw new Error('No files found')
  }

  return files
}

export const foundryModules: FoundryResolver = (config, logger) => {
  return {
    name: foundryModules.name,
    config,
    resolveArtifactPaths: async (module) => {
      return new Set(
        await resolveArtifactPaths(
          module,
          config.project ?? '.',
          { out: config.out },
          logger,
        ),
      )
    },
    resolveArtifactPathsSync: (module) => {
      return new Set(
        resolveArtifactPathsSync(
          module,
          config.project ?? '.',
          { out: config.out },
          logger,
        ),
      )
    },
    resolveDts: async (module) => {
      const artifactPaths = await resolveArtifactPaths(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
      const exports = await Promise.all(
        artifactPaths.map(async (artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = await readFile(artifactPath, 'utf-8')
          return [
            `const _${contractName} = ${contractJson} as const`,
            `export declare const ${contractName}: typeof _${contractName}`,
          ]
        }),
      )
      return exports.flat().join('\n')
    },
    resolveDtsSync: (module) => {
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
    resolveJson: async (module) => {
      const artifactPaths = await resolveArtifactPaths(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
      const entries = await Promise.all(
        artifactPaths.map(async (artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = await readFile(artifactPath, 'utf-8')
          return [contractName, contractJson]
        }),
      )
      return Object.fromEntries(entries)
    },
    resolveJsonSync: (module) => {
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
    resolveTsModule: async (module) => {
      const artifactPaths = await resolveArtifactPaths(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
      const exports = await Promise.all(
        artifactPaths.map(async (artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = await readFile(artifactPath, 'utf-8')
          return `export const ${contractName} = ${contractJson} as const`
        }),
      )
      return exports.join('\n')
    },
    resolveTsModuleSync: (module) => {
      return resolveArtifactPathsSync(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
        .map((artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = readFileSync(artifactPath, 'utf-8')
          return `export const ${contractName} = ${contractJson} as const`
        })
        .join('\n')
    },
    resolveCjsModule: async (module) => {
      const artifactPaths = await resolveArtifactPaths(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
      const exports = await Promise.all(
        artifactPaths.map(async (artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = await readFile(artifactPath, 'utf-8')
          return `module.exports.${contractName} = ${contractJson}`
        }),
      )
      return exports.join('\n')
    },
    resolveCjsModuleSync: (module) => {
      return resolveArtifactPathsSync(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
        .map((artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = readFileSync(artifactPath, 'utf-8')
          return `module.exports.${contractName} = ${contractJson}`
        })
        .join('\n')
    },
    resolveEsmModule: async (module) => {
      const artifactPaths = await resolveArtifactPaths(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
      const exports = await Promise.all(
        artifactPaths.map(async (artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = await readFile(artifactPath, 'utf-8')
          return `export const _${contractName} = ${contractJson}`
        }),
      )
      return exports.join('\n')
    },
    resolveEsmModuleSync: (module) => {
      return resolveArtifactPathsSync(
        module,
        config.project ?? '.',
        { out: config.out },
        logger,
      )
        .map((artifactPath) => {
          const contractName = artifactPath
            .split('/')
            .at(-1)
            ?.replace('.json', '')
          const contractJson = readFileSync(artifactPath, 'utf-8')
          return `export const _${contractName} = ${contractJson}`
        })
        .join('\n')
    },
  }
}
