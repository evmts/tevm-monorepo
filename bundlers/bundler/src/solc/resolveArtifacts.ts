import { Logger } from '../types'
import { compileContractSync } from './compileContracts'
import { ResolvedConfig } from '@evmts/config'

export const resolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
):
	| Record<string, { contractName: string; abi: any; bytecode: string }>
	| undefined => {
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const contracts = compileContractSync(solFile, basedir, config.compiler)

	if (!contracts) {
		logger.error(`Compilation failed for ${solFile}`)
		throw new Error('Compilation failed')
	}

	return Object.fromEntries(
		Object.entries(contracts).map(([contractName, contract]) => {
			const abi = (contract as any).abi
			const bytecode = (contract as any).evm.bytecode.object
			return [contractName, { contractName, abi, bytecode }]
		}),
	)
}

export const resolveArtifacts = async (
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
