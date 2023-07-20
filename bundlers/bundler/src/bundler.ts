import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { Bundler } from './types'
import { getEtherscanLinks } from './utils'
import { checkSolcVersion } from './utils/checkSolcVersion'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

export const bundler: Bundler = (config, logger) => {
	checkSolcVersion(config, logger, solc.version)
	return {
		name: bundler.name,
		config,
		/**
		 * @warning detected this is broke and since it's unused it's not fixed yet
		 * Open an issue if you need this
		 */
		resolveDts: async (module, basedir) => {
			const { artifacts, modules } = await resolveArtifacts(
				module,
				basedir,
				logger,
				config,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
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
						console.log(config.localContracts.contracts)
						const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
						return [
							`const _abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const;`,
							`const _chainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const;`,
							`const name${contractName} = ${JSON.stringify(
								contractName,
							)} as const;`,
							'/**',
							` * ${contractName} EvmtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan-${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _chainAddressMap${contractName}, typeof _abi${contractName}>;`,
						].filter(Boolean)
					})
					.join('\n')
				return { code: [evmtsImports, evmtsBody].join('\n'), modules }
			}
			return { code: '', modules }
		},
		// TODO this isn't very good typescripting
		// a const in an ambient context should not be an object
		// this is not causing issues but is a bit of a hack
		// and when we generate.d.ts files it will cause red underlines
		// in folks editors
		resolveDtsSync: (module, basedir) => {
			const { artifacts, modules } = resolveArtifactsSync(
				module,
				basedir,
				logger,
				config,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
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
							`const _abi${contractName} = ${JSON.stringify(
								contract.abi,
							)} as const;`,
							`const _chainAddressMap${contractName} = ${JSON.stringify(
								contract.addresses ?? {},
							)} as const;`,
							`const _name${contractName} = ${JSON.stringify(
								contractName,
							)} as const;`,
							'/**',
							` * ${contractName} EvmtsContract`,
							...etherscanLinks.map(
								([chainId, etherscanLink]) =>
									` * @etherscan-${chainId} ${etherscanLink}`,
							),
							' */',
							`export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _chainAddressMap${contractName}, typeof _abi${contractName}>;`,
						].filter(Boolean)
					})
					.join('\n')
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveTsModuleSync: (module, basedir) => {
			const { artifacts, modules } = resolveArtifactsSync(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveTsModule: async (module, basedir) => {
			const { artifacts, modules } = await resolveArtifacts(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveCjsModuleSync: (module, basedir) => {
			const { modules, artifacts } = resolveArtifactsSync(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveCjsModule: async (module, basedir) => {
			const { modules, artifacts } = await resolveArtifacts(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},

		resolveEsmModuleSync: (module, basedir) => {
			const { artifacts, modules } = resolveArtifactsSync(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveEsmModule: async (module, basedir) => {
			const { modules, artifacts } = await resolveArtifacts(
				module,
				basedir,
				logger,
				config,
			)
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
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
	}
}
