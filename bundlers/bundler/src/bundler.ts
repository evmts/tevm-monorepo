import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { Bundler } from './types'
import { getEtherscanLinks } from './utils'

export const bundler: Bundler = (config, logger) => {
	return {
		name: bundler.name,
		config,
		resolveDts: async (module, basedir) => {
			const artifacts = await resolveArtifacts(module, basedir, logger, config)
			if (artifacts) {
				const evmtsImports = `import type { EvmtsContract } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi }]) => {
						const contract = {
							name: contractName,
							abi,
							addresses:
								config.localContracts.contracts?.find(
									(contractConfig) => contractConfig.name === contractName,
								) ?? {},
						}
						const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
						return [
							`type _Abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const;`,
							`type _ChainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const;`,
							`type _Name${contractName} = ${JSON.stringify(contractName)};`,
							'/**',
							` * ${contractName} EvmtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan-${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EvmtsContract<_Name${contractName}, _ChainAddressMap${contractName}, _Abi${contractName}>;`,
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
				const evmtsImports = `import type { EvmtsContract } from '@evmts/core'`
				const evmtsBody = Object.entries(artifacts)
					.flatMap(([contractName, { abi }]) => {
						const contract = {
							name: contractName,
							abi,
							addresses:
								config.localContracts.contracts?.find(
									(contractConfig) => contractConfig.name === contractName,
								)?.addresses ?? {},
						}
						const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
						return [
							`export type _Abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const;`,
							`export type _ChainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const;`,
							`export type _Name${contractName} = ${JSON.stringify(
								contractName,
							)};`,
							'/**',
							` * ${contractName} EvmtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan-${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EvmtsContract<_Name${contractName}, _ChainAddressMap${contractName}, _Abi${contractName}>;`,
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
								config.localContracts.contracts?.find(
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
								config.localContracts.contracts?.find(
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
								config.localContracts.contracts?.find(
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
								config.localContracts.contracts?.find(
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
								config.localContracts.contracts?.find(
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
								config.localContracts.contracts?.find(
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
