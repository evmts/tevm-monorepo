import { SolidityResolver } from '../types'
import { Logger } from '../types'
import { getEtherscanLinks } from '../utils'
import { ModuleInfo, moduleFactory } from './moduleFactory'
import { ResolvedConfig } from '@evmts/config'
import { readFileSync } from 'fs'
import * as resolve from 'resolve'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

// Compile the Solidity contract and return its ABI and bytecode
function compileContractSync(
	filePath: string,
	basedir: string,
	config: ResolvedConfig,
): solc.CompiledContract | undefined {
	const source: string = readFileSync(
		resolve.sync(filePath, {
			basedir,
		}),
		'utf8',
	)

	const entryModule = moduleFactory(
		filePath,
		source,
		config.remappings,
		config.libs,
	)

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

	const warnings = output?.errors?.filter(
		({ type }: { type: 'Warning' | 'Error' }) => type === 'Warning',
	)
	const isErrors = output?.errors?.length > warnings?.length

	if (isErrors) {
		console.error('Compilation errors:', output?.errors)
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		console.warn('Compilation warnings:', output?.errors)
	}

	return output.contracts[entryModule.id]
}

// Remove writeFileSync and readFileSync, instead, keep artifacts in memory
const resolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
):
	| Record<string, { contractName: string; abi: any; bytecode: string }>
	| undefined => {
	// Compile the contract
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const contracts = compileContractSync(solFile, basedir, config)

	if (!contracts) {
		logger.error(`Compilation failed for ${solFile}`)
		throw new Error('Compilation failed')
	}

	return Object.fromEntries(
		Object.entries(contracts).map(([contractName, contract]) => {
			// Keep artifacts in memory
			const abi = (contract as any).abi
			const bytecode = (contract as any).evm.bytecode.object

			return [contractName, { contractName, abi, bytecode }]
		}),
	)
}

const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
): Promise<
	| Record<string, { contractName: string; abi: any; bytecode: string }>
	| undefined
> => {
	return resolveArtifactsSync(solFile, basedir, logger, config)
}

// type Address = `0x${string}`
// type AddressMap = Record<string, Address>

// Refactor all methods in the solcModules object to use the revised resolveArtifactsSync function.
// TODO add address resolution
export const solcModules: SolidityResolver = (
	config,
	logger /*, addresses: AddressMap*/,
) => {
	return {
		name: solcModules.name,
		config,
		resolveDts: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `import type { EVMtsContract } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi }]) => {
						const contract = {
							name: contractName,
							abi,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								) ?? {},
						}
						const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
						return [
							`const _abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const`,
							`const _chainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const`,
							'/**',
							` * ${contractName} EVMtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan-${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EVMtsContract<${contract.name}, typeof _chainAddressMap${contractName}, typeof _abi${contractName}>`,
						].filter(Boolean)
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveDtsSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `import type { EVMtsContract } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi }]) => {
						const contract = {
							name: contractName,
							abi,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						}
						const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
						return [
							`const _abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const`,
							`const _chainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const`,
							'/**',
							` * ${contractName} EVMtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan ${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EVMtsContract<${contract.name}, typeof _chainAddressMap${contractName}, typeof _abi${contractName}>`,
						].filter(Boolean)
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveTsModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = [
					`import { evmtsContractFactory } from '@evmts/core'`,
				].join('\n')
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract} as const`,
							`export const ${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveTsModule: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = [
					`import { evmtsContractFactory } from '@evmts/core'`,
				].join('\n')
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract} as const`,
							`export const ${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveCjsModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `const { evmtsContractFactory } = require('@evmts/core')`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract}`,
							`module.exports.${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveCjsModule: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `const { evmtsContractFactory } = require('@evmts/core')`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract}`,
							`module.exports.${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},

		resolveEsmModuleSync: (module, basedir) => {
			const artifacts = resolveArtifactsSync(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `import { evmtsContractFactory } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract}`,
							`export const ${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
		resolveEsmModule: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `import { evmtsContractFactory } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi, bytecode }]) => {
						const contract = JSON.stringify({
							name: contractName,
							abi,
							bytecode,
							addresses:
								config.deployments?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						})
						return [
							`const _${contractName} = ${contract}`,
							`export const ${contractName} = evmtsContractFactory(_${contractName})`,
						]
					})
					.join('\n')
				return [evmtsImports, evmtsBody].join('\n')
			}
			return ''
		},
	}
}
