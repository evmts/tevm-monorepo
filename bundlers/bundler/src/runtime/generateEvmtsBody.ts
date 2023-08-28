import { generateDtsBody } from './generateEvmtsBodyDts'
import type { ResolvedConfig } from '@evmts/config'

type Artifacts = Record<
	string,
	{
		abi: any
	}
>

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
		.flatMap(([contractName, { abi }]) => {
			const contract = JSON.stringify({
				name: contractName,
				abi,
				addresses:
					config.localContracts.contracts?.find(
						(contractConfig) => contractConfig.name === contractName,
					)?.addresses ?? {},
			})

			if (moduleType === 'cjs') {
				return [
					`const _${contractName} = ${contract}`,
					`module.exports.${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			if (moduleType === 'ts') {
				return [
					`const _${contractName} = ${contract} as const`,
					`export const ${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			return [
				`const _${contractName} = ${contract}`,
				`export const ${contractName} = evmtsContractFactory(_${contractName})`,
			]
		})
		.join('\n')
}
