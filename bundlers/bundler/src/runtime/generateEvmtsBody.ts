import type { Artifacts } from '../solc/resolveArtifactsSync'
import { generateDtsBody } from './generateEvmtsBodyDts'
import type { ResolvedConfig } from '@evmts/config'

type ModuleType = 'cjs' | 'mjs' | 'ts' | 'dts'

export const generateEvmtsBody = (
	artifacts: Artifacts,
	config: ResolvedConfig,
	moduleType: ModuleType,
): string => {
	if (moduleType === 'dts') {
		return generateDtsBody(artifacts, config)
	}
	return Object.entries(artifacts)
		.flatMap(([contractName, { abi, userdoc = {} }]) => {
			const contract = JSON.stringify({
				name: contractName,
				abi,
				addresses:
					config.localContracts.contracts?.find(
						(contractConfig) => contractConfig.name === contractName,
					)?.addresses ?? {},
			})

			const natspec = Object.entries(userdoc.methods ?? {}).map(
				([method, { notice }]) => ` * @property ${method} ${notice}`,
			)
			if (userdoc.notice) {
				natspec.unshift(` * ${userdoc.notice}`)
			}
			if (natspec.length) {
				natspec.unshift('/**')
				natspec.push(' */')
			}
			if (moduleType === 'cjs') {
				return [
					`const _${contractName} = ${contract}`,
					...natspec,
					`module.exports.${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			if (moduleType === 'ts') {
				return [
					`const _${contractName} = ${contract} as const`,
					...natspec,
					`export const ${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			return [
				`const _${contractName} = ${contract}`,
				...natspec,
				`export const ${contractName} = evmtsContractFactory(_${contractName})`,
			]
		})
		.join('\n')
}
