import type { ResolvedConfig } from '@evmts/config'
import type { Logger, ModuleInfo } from '../types'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import type { SolcContractOutput } from './solc'

type Artifacts = Record<string, Pick<SolcContractOutput, 'abi' | 'userdoc'>>
/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
): Promise<{
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
}> => {
	return resolveArtifactsSync(solFile, basedir, logger, config)
}
