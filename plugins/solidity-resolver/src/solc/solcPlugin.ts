import { FoundryResolver } from '../types'
import { Logger } from '../types'
// TODO get remappings
// import { FoundryToml } from '../types/FoundryToml'
import { ModuleInfo, moduleFactory } from './moduleFactory'
import { readFileSync } from 'fs'
import { basename } from 'path'
import * as resolve from 'resolve'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

// Compile the Solidity contract and return its ABI and bytecode
function compileContractSync(
	filePath: string,
	basedir: string,
	contractName: string,
): solc.CompiledContract | undefined {
	const source: string = readFileSync(
		resolve.sync(filePath, {
			basedir,
		}),
		'utf8',
	)

	const entryModule = moduleFactory(filePath, source)

	const getAllModulesRecursively = (
		m = entryModule,
		modules: Record<string, ModuleInfo> = {},
	) => {
		modules[m.id] = m
		for (const dep of m.resolutions) {
			getAllModulesRecursively(dep, modules)
		}
		return modules
	}
	const allModules = getAllModulesRecursively()

	const sources = Object.fromEntries(
		Object.entries(allModules).map(([id, module]) => {
			return [id, { content: module.code }]
		}),
	)

	const input: solc.InputDescription = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
		},
	}

	const output: solc.OutputDescription = JSON.parse(
		solc.compile(JSON.stringify(input)),
	)

	const warnings = output.errors.filter(
		({ type }: { type: 'Warning' | 'Error' }) => type === 'Warning',
	)
	const isErrors = output.errors.length > warnings.length

	if (isErrors) {
		console.error('Compilation errors:', output.errors)
		throw new Error('Compilation failed')
	}
	if (warnings.length) {
		console.warn('Compilation warnings:', output.errors)
	}

	return output.contracts[entryModule.id][contractName]
}

// Remove writeFileSync and readFileSync, instead, keep artifacts in memory
const resolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
): { contractName: string; abi: any; bytecode: string } | undefined => {
	// Compile the contract
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const contractName = solFile.endsWith('.s.sol')
		? basename(solFile, '.s.sol')
		: basename(solFile, '.sol')
	const contract = compileContractSync(solFile, basedir, contractName)

	if (!contract) {
		logger.error(`Compilation failed for ${solFile}`)
		throw new Error('Compilation failed')
	}

	// Keep artifacts in memory
	const abi = JSON.stringify(contract.abi)
	const bytecode = contract.evm.bytecode.object

	return { contractName, abi, bytecode }
}

const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
): Promise<
	{ contractName: string; abi: any; bytecode: string } | undefined
> => {
	return resolveArtifactsSync(solFile, basedir, logger)
}

// Refactor all methods in the solcModules object to use the revised resolveArtifactsSync function.
export const solcModules: FoundryResolver = (config, logger) => {
	return {
		name: solcModules.name,
		config,
		resolveDts: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return [
					`const _${contractName} = ${abi} as const`,
					`export declare const ${contractName}: typeof _${contractName}`,
				].join('\n')
			}
			return ''
		},
		resolveDtsSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return [
					`const _${contractName} = ${abi} as const`,
					`export declare const ${contractName}: typeof _${contractName}`,
				].join('\n')
			}
			return ''
		},

		resolveJsonSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi, bytecode } = artifacts
				return JSON.stringify({
					[contractName]: { abi: abi, bytecode: bytecode },
				})
			}
			return ''
		},
		resolveJson: async (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi, bytecode } = artifacts
				return JSON.stringify({
					[contractName]: { abi: abi, bytecode: bytecode },
				})
			}
			return ''
		},

		resolveTsModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `export const ${contractName} = ${abi} as const`
			}
			return ''
		},

		resolveTsModule: async (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `export const ${contractName} = ${abi} as const`
			}
			return ''
		},
		resolveCjsModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `module.exports.${contractName} = ${abi}`
			}
			return ''
		},
		resolveCjsModule: async (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `module.exports.${contractName} = ${abi}`
			}
			return ''
		},

		resolveEsmModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `export const ${contractName} = ${abi}`
			}
			return ''
		},
		resolveEsmModule: async (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger)
			if (artifacts) {
				const { contractName, abi } = artifacts
				return `export const ${contractName} = ${abi}`
			}
			return ''
		},
	}
}
