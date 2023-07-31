import type { Logger, ModuleInfo } from '../types'
import { resolveArtifactsSync } from './resolveArtifactsSync'
import type { ResolvedConfig } from '@evmts/config'

/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export const resolveArtifacts = async (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedConfig,
): Promise<{
	artifacts: Record<
		string,
		{ contractName: string; abi: any; bytecode: string }
	>
	modules: Record<'string', ModuleInfo>
}> => {
	return resolveArtifactsSync(solFile, basedir, logger, config)
}
