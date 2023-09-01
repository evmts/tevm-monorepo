import type { Logger, ModuleInfo } from '../types'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import type { SolcContractOutput } from './solc'
import type { ResolvedConfig } from '@evmts/config'

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
}> => {
	return resolveArtifactsSync(solFile, basedir, logger, config, includeAst)
}
