import type { Logger, ModuleInfo } from '../types'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import type {
	SolcContractOutput,
	SolcInputDescription,
	SolcOutput,
} from './solc'
import type { ResolvedConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node'

type Artifacts = Record<string, Pick<SolcContractOutput, 'abi' | 'userdoc'>>
/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
	includeAst: boolean,
): Promise<{
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}> => {
	return resolveArtifactsSync(solFile, basedir, logger, config, includeAst)
}
