import { SolidityResolver } from '../types'
import { Logger } from '../types'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { glob, globSync } from 'glob'
import { basename } from 'path'

const resolveArtifactPathsSync = (
	solFile: string,
	out = 'artifacts',
	logger: Logger = console,
): string[] => {
	const fileName = basename(solFile)
	const files = globSync([`${out}/**/${fileName}/*.json`])

	if (files.length === 0) {
		logger.error(`No files found for ${solFile} in ${out}`)
		throw new Error('No files found')
	}

	return files
}

export const resolveArtifactPaths = async (
	solFile: string,
	out = 'artifacts',
	logger: Logger = console,
): Promise<string[]> => {
	const fileName = basename(solFile)
	const files = await glob([`${out}/**/${fileName}/*.json`])

	if (files.length === 0) {
		logger.error(`No files found for ${solFile} in ${out}`)
		throw new Error('No files found')
	}

	return files
}

export const foundryModules: SolidityResolver = (config, logger) => {
	return {
		name: foundryModules.name,
		config,
		resolveDts: async (module) => {
			const artifactPaths = await resolveArtifactPaths(
				module,
				config.out,
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
						`import { EVMtsContract } from '@evmts/bundler'`,
						`const _${contractName} = ${contractJson}.abi as const`,
						`export declare const ${contractName}: EVMtsContract<typeof _${contractName}>`,
					].join('\n')
				}),
			)
			return exports.flat().join('\n')
		},
		resolveDtsSync: (module) => {
			return resolveArtifactPathsSync(module, config.out, logger)
				.flatMap((artifactPath) => {
					const contractName = artifactPath
						.split('/')
						.at(-1)
						?.replace('.json', '')
					const contractJson = readFileSync(artifactPath, 'utf-8')
					return [
						`import { EVMtsContract } from '@evmts/bundler'`,
						`const _${contractName} = ${contractJson}.abi as const`,
						`export declare const ${contractName}: EVMtsContract<typeof _${contractName}>`,
					].join('\n')
				})
				.join('\n')
		},
		resolveTsModule: async (module) => {
			const artifactPaths = await resolveArtifactPaths(
				module,
				config.out,
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
			return resolveArtifactPathsSync(module, config.out, logger)
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
				config.out,
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
			return resolveArtifactPathsSync(module, config.out, logger)
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
				config.out,
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
			return resolveArtifactPathsSync(module, config.out, logger)
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
