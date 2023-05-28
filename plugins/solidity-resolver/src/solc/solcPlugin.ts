import { resolve as resolvePath, basename } from 'path';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { readFile } from 'fs/promises'
// @ts-ignore 
import solc from 'solc';
import { FoundryResolver } from '../types';
import { Logger } from '../types';
import { FoundryToml } from '../types/FoundryToml';

// Compile the Solidity contract and return its ABI and bytecode
function compileContract(filePath: string, contractName: string): solc.CompiledContract | undefined {
  const source: string = readFileSync(filePath, 'utf8');

  const input: solc.InputDescription = {
    language: 'Solidity',
    sources: {
      [contractName]: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          [contractName]: ['abi', 'evm.bytecode']
        }
      }
    }
  };

  const output: solc.OutputDescription = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    console.error('Compilation errors:', output.errors);
    return;
  }

  return output.contracts[contractName][contractName];
}

const resolveArtifactPathsSync = (solFile: string, projectDir: string, { out = 'artifacts' }: FoundryToml, logger: Logger): string[] => {
  // Compile the contract
  const contractName = basename(solFile, '.sol');
  const contract = compileContract(solFile, contractName);

  if (!contract) {
    logger.error(`Compilation failed for ${solFile}`);
    throw new Error('Compilation failed');
  }

  // Write the artifacts to files
  const artifactsDirectory = resolvePath(projectDir, out);
  mkdirSync(artifactsDirectory, { recursive: true });
  writeFileSync(resolvePath(artifactsDirectory, `${contractName}.abi.json`), JSON.stringify(contract.abi));
  writeFileSync(resolvePath(artifactsDirectory, `${contractName}.bytecode.txt`), contract.evm.bytecode.object);

  return [resolvePath(artifactsDirectory, `${contractName}.abi.json`), resolvePath(artifactsDirectory, `${contractName}.bytecode.txt`)];
}

const resolveArtifactPaths = async (solFile: string, projectDir: string, { out = 'artifacts' }: FoundryToml, logger: Logger): Promise<string[]> => {
  return resolveArtifactPathsSync(solFile, projectDir, { out }, logger);
}

// The rest of your foundryModules object remains mostly the same.
export const solcModules: FoundryResolver = (config, logger) => {
  return {
    name: solcModules.name,
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
