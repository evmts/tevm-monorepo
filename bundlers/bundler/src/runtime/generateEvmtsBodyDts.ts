import type { Artifacts } from '../solc/resolveArtifactsSync'
import { getEtherscanLinks } from '../utils'
import type { ResolvedConfig } from '@evmts/config'

export const generateDtsBody = (
	artifacts: Artifacts,
	config: ResolvedConfig,
) => {
	return Object.entries(artifacts)
		.flatMap(([contractName, { abi, userdoc = {} }]) => {
			const contract = {
				name: contractName,
				abi,
				addresses:
					config.localContracts.contracts?.find(
						(contractConfig) => contractConfig.name === contractName,
					)?.addresses ?? {},
			}
			const etherscanLinks = getEtherscanLinks(contract.addresses ?? {})
			const natspec = Object.entries(userdoc.methods ?? {}).map(
				([method, { notice }]) => ` * @property ${method} ${notice}`,
			)
			if (userdoc.notice) {
				natspec.unshift(` * @notice ${userdoc.notice}`)
			}
			return [
				`const _abi${contractName} = ${JSON.stringify(contract.abi)} as const;`,
				`const _chainAddressMap${contractName} = ${JSON.stringify(
					contract.addresses ?? {},
				)} as const;`,
				`const _name${contractName} = ${JSON.stringify(
					contractName,
				)} as const;`,
				'/**',
				` * ${contractName} EvmtsContract`,
				...natspec,
				...etherscanLinks.map(
					([chainId, etherscanLink]) =>
						` * @etherscan-${chainId} ${etherscanLink}`,
				),
				' */',
				`export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _chainAddressMap${contractName}, typeof _abi${contractName}>;`,
			].filter(Boolean)
		})
		.join('\n')
}
