import type { Logger, ModuleInfo } from '../types'
import { compileContractSync } from './compileContracts'
import type { SolcContractOutput } from './solc'
import type { ResolvedConfig } from '@evmts/config'

export type Artifacts = Record<
	string,
	Pick<SolcContractOutput, 'abi' | 'userdoc'>
>

export const resolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
	includeAst: boolean
): {
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
} => {
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const { artifacts, modules } = compileContractSync(
		solFile,
		basedir,
		config.compiler,
		includeAst,
	)

	if (!artifacts) {
		logger.error(`Compilation failed for ${solFile}`)
		throw new Error('Compilation failed')
	}

	return {
		artifacts: Object.fromEntries(
			Object.entries(artifacts).map(([contractName, contract]) => {
				return [
					contractName,
					{ contractName, abi: contract.abi, userdoc: contract.userdoc },
				]
			}),
		),
		modules,
	}
}
