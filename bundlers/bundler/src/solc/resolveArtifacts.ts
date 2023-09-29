import type { FileAccessObject, Logger, ModuleInfo } from '../types'
import { compileContract } from './compileContracts'
import type {
	SolcContractOutput,
	SolcInputDescription,
	SolcOutput,
} from './solc'
import type { ResolvedCompilerConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node'

type Artifacts = Record<string, Pick<SolcContractOutput, 'abi' | 'userdoc'>>
/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedCompilerConfig,
	includeAst: boolean,
	fao: FileAccessObject,
): Promise<{
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}> => {
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const { artifacts, modules, asts, solcInput, solcOutput } =
		await compileContract(solFile, basedir, config, includeAst, fao, logger)

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
		asts,
		solcInput,
		solcOutput,
	}
}
