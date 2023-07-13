import { ResolvedConfig } from '@evmts/config'
// #!/usr/bin/env node
import { etherscan } from '@wagmi/cli/plugins'
import { writeFileSync } from 'fs'
import * as path from 'path'

export const handleEtherscan = async ({
	externalContracts,
}: ResolvedConfig) => {
	const outPath = path.join(process.cwd(), externalContracts.out)

	const contractsGroupedByChain: Record<
		number,
		typeof externalContracts.contracts
	> = {}

	for (const contract of externalContracts.contracts) {
		for (const [chainId, address] of Object.entries(contract.addresses)) {
			const id = Number.parseInt(chainId)
			contractsGroupedByChain[id] = contractsGroupedByChain[id] ?? []
			contractsGroupedByChain[id]?.push({
				...contract,
				addresses: { [id as 1]: address },
			} as any)
		}
	}

	let result:
		| [
				{
					plugins?: string
					preprends?: string
					imports?: string
					content?: string
				},
		  ]
		| [] = []

	for (const [chainId, contracts] of Object.entries(contractsGroupedByChain)) {
		const apiKey = externalContracts.apiKeys.etherscan[Number(chainId)]
		if (!apiKey) {
			throw new Error(
				`No etherscan api key for chainId ${chainId} in etherscan plugin at externalContracts.apiKeys.etherscan.${chainId}. Please configure an apiKey`,
			)
		}
		const params = {
			apiKey,
			contracts,
			chainId: Number.parseInt(chainId) as 1,
		}
		const instance = etherscan(params)
		if (!instance.run || !instance.validate) {
			throw new Error('etherscan instance has no run or validate method')
		}
		await instance.validate()
		result = [
			await instance.run({
				contracts: [],
				isTypeScript: true,

				outputs:
					result?.map((r: object) => ({
						plugin: 'etherscan' as any,
						prepend: '',
						imports: '',
						content: '',
						...((r as object) ?? {}),
					})) ?? [],
			}),
		]
	}

	const [finalResult] = result
	if (!finalResult) {
		throw new Error('No result from etherscan plugin')
	}

	const code = [
		finalResult.preprends ?? '',
		finalResult.imports ?? '',
		finalResult.content ?? '',
	].join('\n')

	writeFileSync(outPath, code)
}
