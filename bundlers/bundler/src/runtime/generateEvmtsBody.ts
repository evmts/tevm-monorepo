import { ResolvedConfig } from '@evmts/config'

type Artifacts = Record<
	string,
	{
		abi: any
		bytecode: string
	}
>

type ModuleType = 'cjs' | 'mjs' | 'ts'

export const generateEvmtsBody = (
	artifacts: Artifacts,
	contractFactory: string,
	config: ResolvedConfig,
	moduleType: ModuleType,
) => {
	return Object.entries(artifacts)
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

			if (moduleType === 'cjs') {
				return [
					`const _${contractName} = ${contract}`,
					`module.exports.${contractName} = ${contractFactory}(_${contractName})`,
				]
			}

			if (moduleType === 'ts') {
				return [
					`const _${contractName} = ${contract} as const`,
					`export const ${contractName} = ${contractFactory}(_${contractName})`,
				]
			}

			return [
				`const _${contractName} = ${contract}`,
				`export const ${contractName} = ${contractFactory}(_${contractName})`,
			]
		})
		.join('\n')
}
