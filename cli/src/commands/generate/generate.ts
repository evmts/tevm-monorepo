import { handleEtherscan } from './handleEtherscan'
import { generateRuntimeSync } from '@evmts/bundler'
import type { ResolvedConfig } from '@evmts/config'
import { mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'

export const generate = async (
	config: ResolvedConfig,
	logger: Pick<typeof console, 'log' | 'info' | 'error' | 'warn'>,
) => {
	const outPath = path.join(process.cwd(), config.externalContracts.out)
	// TODO types are  struggle atm
	const contracts = await handleEtherscan(config as any, logger)
	Object.values(contracts).forEach((contract) => {
		// this is a bit of a hack to handle only internal contract addresses being read atm
		const modifiedConfig = {
			...config,
			localContracts: {
				...config.localContracts,
				contracts: [
					...config.localContracts.contracts,
					{
						name: contract.name,
						addresses: contract.addresses as any,
					},
				],
			},
		}
		const dts = generateRuntimeSync(
			{
				[contract.name]: {
					abi: contract.abi,
					userdoc: {
						kind: 'user',
						version: 1,
					},
				},
			},
			modifiedConfig,
			'dts',
			logger,
		)
		const mjs = generateRuntimeSync(
			{
				[contract.name]: {
					abi: contract.abi,
					userdoc: {
						kind: 'user',
						version: 1,
					},
				},
			},
			modifiedConfig,
			'mjs',
			logger,
		)

		// write files
		mkdirSync(outPath, { recursive: true })
		const dtsPath = path.join(outPath, `${contract.name}.sol.d.ts`)
		if (contract.source) {
			const solPath = path.join(outPath, `${contract.name}.sol`)
			writeFileSync(solPath, contract.source)
			logger.log(`wrote source code at ${solPath}`)
		}
		writeFileSync(dtsPath, dts)
		logger.log(`wrote types at ${dtsPath}`)
		const mjsPath = path.join(outPath, `${contract.name}.sol.mjs`)
		writeFileSync(mjsPath, mjs)
		logger.log(`wrote JavaScript at ${mjsPath}`)
	})
	logger.log(
		`Installed ${config.externalContracts.contracts.length} contracts to ${outPath} successfully`,
	)
}
